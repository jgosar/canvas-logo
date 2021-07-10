import { Injectable } from "@angular/core";
import { isDefined } from "src/app/helpers/common.helpers";
import { replaceAll } from "src/app/helpers/string.helpers";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";
import { LogoCodeBlock2 } from "../types/logo-code-block-2";
import { LogoVariable2 } from "../types/logo-variable-2";
import { NativeCodeBlock2 } from "../types/native-code-block-2";
import { NativeVariable2 } from "../types/native-variable-2";
import { RegisterLogoCommandReducer } from "./register-logo-command.reducer";

@Injectable()
export class ExecuteCommandReducer implements Reducer<LogoStoreState, string>{
  constructor(private registerLogoCommandReducer: RegisterLogoCommandReducer){
  }

  reduce(state: LogoStoreState, command: string): LogoStoreState{
    let newState: LogoStoreState = {...state};
    const beautifiedCommand: string = this.beautifyCommand(command);

    const splitCommands: {[key: string]: string} = this.splitCommandByBrackets(beautifiedCommand);

    const commandTokens: string[] = splitCommands['main'].split(' ').map(token=>token.startsWith('@PRN')?splitCommands[token]:token);
    let index = 0;

    while (index < commandTokens.length) {
      const commandName: string = commandTokens[index];

      if (commandName === 'TO') {
        const endIndex: number = commandTokens.findIndex(x => x === 'END');

        if (endIndex == -1) {
          throw new Error('Definition of function starting with "TO", must end with "END"');
        }

        const commandDefinition: string[] = commandTokens.slice(index + 1, endIndex); // Cut off starting TO and final END
        this.validateTOCommand(commandDefinition);

        newState = this.executeTOCommand(newState, commandDefinition);
        index = endIndex + 1;
      } else {
        const codeBlock: NativeCodeBlock2|LogoCodeBlock2 = state.codeBlocks[commandName];

        if (codeBlock === undefined) {
          throw new Error('Function ' + commandName + ' does not exist!');
        }
        // Check if there are enough args
        const lastArgIndex = index + 1 + codeBlock.numArgs;
        if (commandTokens.length < lastArgIndex) {
          throw new Error('Too few arguments for function ' + commandName);
        }

        const commandArgs: string[] = commandTokens.slice(index + 1, lastArgIndex);
        const argValues: string[] = commandArgs.map(arg => this.evaluateArgument(newState, arg));

        if(this.isNativeCodeBlock(codeBlock)){
          newState = (<NativeCodeBlock2>codeBlock).reducer.reduce(newState, commandArgs)
        } else{
          const commandTextWithArgs: string = this.formatCommandTextWithArgs(
            (<LogoCodeBlock2>codeBlock).commandText,
            commandArgs,
          );
          newState = this.reduce(newState, commandTextWithArgs);
        }

        index += codeBlock.numArgs + 1;
      }
    }
    return newState;
  }

  private evaluateArgument(state: LogoStoreState, argument: string): string {
    if (argument.startsWith('\'')) {
      return this.getVariableValue(state, argument.substring(1)).toString();
    } else {
      return argument;
    }
  }

  private getVariableValue(state: LogoStoreState, variableName: string): number {
    variableName = variableName.toUpperCase();
    const variable: LogoVariable2 | NativeVariable2 | undefined = state.variables[variableName];
    if (variable === undefined) {
      throw new Error('Variable ' + variableName + ' does not exist!');
    } else if (this.isNativeVariable(variable)) {
      return (<NativeVariable2>variable).valueGetter(state);
    } else {
      return (<LogoVariable2>variable).value;
    }
  }

  private isNativeCodeBlock(codeBlock: NativeCodeBlock2 | LogoCodeBlock2) {
    return isDefined(codeBlock['reducer']);
  }

  private isNativeVariable(variable: NativeVariable2 | LogoVariable2) {
    return isDefined(variable['valueGetter']);
  }

  private formatCommandTextWithArgs(commandText: string, args: string[]): string{
    return args.reduce(
      (commandText, arg, argIndex)=>replaceAll(commandText, `@ARG${argIndex}@`, arg),
      commandText
    );
  }

  private beautifyCommand(command: string): string {
    return command.toUpperCase().replace(/\s\s+/g, ' ').trim();
  }
  
  private splitCommandByBrackets(command: string): {[key: string]: string} {
    const result: {[key: string]: string} = {main: command};

    let subCommandCount: number = 0;
    let bracketLevel: number = 0;
    let bracketStartIndex: number = -1;
    let isFunctionDefinition: boolean = false;
    for (let i = 0; i < command.length; i++) {
      if (command.substring(i, i + 3).toUpperCase() === 'TO ') {
        isFunctionDefinition = true;
      } else if (command.substring(i, i + 4).toUpperCase() === ' END') {
        isFunctionDefinition = false;
      }

      if (command[i] === '[') {
        if (bracketLevel === 0) {
          bracketStartIndex = i;
        }

        bracketLevel++;
      } else if (command[i] === ']') {
        bracketLevel--;

        if (bracketLevel === 0 && !isFunctionDefinition) {
          // Create a new command from the bracketed substring
          const prnString = command.substring(bracketStartIndex, i + 1).trim();
          const prnId = '@PRN' + subCommandCount;
          subCommandCount++;

          result[prnId] = prnString.substring(1, prnString.length - 1);
          result['main']=replaceAll(result['main'],prnString, prnId);
          console.log('Replaced bracketed expression' + prnString + ' with ' + prnId);
        }
        if (bracketLevel < 0) {
          throw new Error('More closing than opening brackets! position ' + i);
        }
      }
    }

    if (bracketLevel !== 0) {
      throw new Error('Closing bracket missing!');
    }

    return result;
  }
  

  // Input is a function definition, split into words without starting TO and final END
  private validateTOCommand(commandDefinition: string[]) {
    if (commandDefinition.length === 0) { // TODO: handle other reserved words
      throw new Error('"END" cannot be a function name!');
    }

    if (commandDefinition.indexOf('TO') !== -1) {
      throw new Error('"TO" statements cannot be nested!');
    }
  }

  // Input is a function definition, split into words without starting TO and final END
  private executeTOCommand(state: LogoStoreState, commandDefinition: string[]): LogoStoreState {
    const commandName: string = commandDefinition[0].toUpperCase(); // The first word is a function name

    commandDefinition = commandDefinition.slice(1);
    const bodyStart: number = commandDefinition.findIndex(x => !x.startsWith(':')); // Start of the function body is the first word that does not start with :
    const argNames: string[] = commandDefinition.slice(0, bodyStart);
    const numArgs: number = argNames.length;
    let commandBodyWords: string[] = commandDefinition.slice(bodyStart);
    commandBodyWords = commandBodyWords.map(x => {
      // Replace argument names in the function body with their indexes
      if (x.startsWith(':')) {
        const argumentIndex: number = argNames.findIndex(argName => x === argName);
        if (argumentIndex === -1) {
          throw new Error('Argument ' + x + ' is not a part of the function definition!');
        }
        return x.replace(argNames[argumentIndex], '@ARG' + argumentIndex + '@');
      }
      return x;
    });
    const commandBody = commandBodyWords.join(' ');
    
    return this.registerLogoCommandReducer.reduce(state, {commandName, commandBody, numArgs});
  }
}
