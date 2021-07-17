import { Injectable } from "@angular/core";
import { isDefined } from "src/app/helpers/common.helpers";
import { replaceAll } from "src/app/helpers/string.helpers";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";
import { LogoVariable2 } from "../types/logo-variable-2";
import { CodeBlock2 } from "../types/code-block-2";
import { NativeVariable2 } from "../types/native-variable-2";
import { evaluateArgument } from "src/app/helpers/logo-variable.helpers";

@Injectable()
export class ExecuteCommandReducer implements Reducer<LogoStoreState, string>{
  reduce(state: LogoStoreState, command: string): LogoStoreState{
    let newState: LogoStoreState = {...state};

    const commandTokens: string[] = this.tokenizeCommand(command);
    let index = 0;

    while (index < commandTokens.length) {
      const commandName: string = commandTokens[index];
      const codeBlock: CodeBlock2 = state.codeBlocks[commandName];

      if (!isDefined(codeBlock)) {
        throw new Error('Function ' + commandName + ' does not exist!');
      }

      const commandArgs: string[] = this.parseCommandArgs(codeBlock, commandTokens, index);
      newState = this.executeCommand(newState, codeBlock, commandArgs);

      index+=1+commandArgs.length; // parsed command name + number of args
      if(isDefined(codeBlock.terminatedBy)){
        index++; // also parsed terminating word, such as END
      }
    }
    return newState;
  }

  private executeCommand(state: LogoStoreState, codeBlock: CodeBlock2, commandArgs: string[]) {
    if(!isDefined(codeBlock.skipArgsEvaluation)){
      commandArgs = commandArgs.map(arg => evaluateArgument(state, arg));
    }

    if (isDefined(codeBlock.reducer)) {
      return codeBlock.reducer.reduce(state, commandArgs);
    } else {
      return this.reduce(state, this.formatCommandTextWithArgs(
        codeBlock.commandText,
        commandArgs
      ));
    }
  }

  private parseCommandArgs(codeBlock: CodeBlock2, commandTokens: string[], index: number): string[] {
      const commandName: string = commandTokens[index];
      let lastArgIndex: number;

    if (isDefined(codeBlock.terminatedBy)) {
      lastArgIndex = commandTokens.findIndex(x => x === codeBlock.terminatedBy);

      if (lastArgIndex == -1) {
        throw new Error(`Call of function ${commandName}, must end with ${codeBlock.terminatedBy}`);
      }
    } else {
      lastArgIndex = index + 1 + codeBlock.numArgs;
      if (commandTokens.length < lastArgIndex) {
        throw new Error(`Too few arguments for function ${commandName}`);
      }
    }
    return commandTokens.slice(index + 1, lastArgIndex);
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
  
  private tokenizeCommand(command: string): string[] {
    command = this.beautifyCommand(command);
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
        }
        if (bracketLevel < 0) {
          throw new Error('More closing than opening brackets! position ' + i);
        }
      }
    }

    if (bracketLevel !== 0) {
      throw new Error('Closing bracket missing!');
    }

    return result['main'].split(' ').map(token=>token.startsWith('@PRN')?result[token]:token);;
  }
}
