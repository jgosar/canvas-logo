import { CodeBlock, NativeCodeBlock, LogoCodeBlock, NativeVariable, Variable, LogoVariable } from './types/logo-legacy-types';
import { EventEmitter } from '@angular/core';
import { Line } from 'src/app/types/geometry/line';

export class LogoEngine {
  public lines: Line[] = [];
  public output: EventEmitter<string> = new EventEmitter();

  private turtlePosition: number[] = [0, 0];
  private turtleDirection = 0;
  private penDown = true;
  private nextPrnId = 0;

  private codeBlocks: { [s: string]: CodeBlock; } = {
    FD: new NativeCodeBlock(this.logo_forward, 1),
    FORWARD: new LogoCodeBlock('FD @ARG0@', 1),
    RT: new NativeCodeBlock(this.logo_right, 1),
    RIGHT: new LogoCodeBlock('RT @ARG0@', 1),
    LT: new LogoCodeBlock('RT -@ARG0@', 1),
    LEFT: new LogoCodeBlock('LT @ARG0@', 1),
    REPEAT: new NativeCodeBlock(this.logo_repeat, 2),
    PU: new NativeCodeBlock(this.logo_penup, 0),
    PENUP: new LogoCodeBlock('PU', 0),
    PD: new NativeCodeBlock(this.logo_pendown, 0),
    PENDOWN: new LogoCodeBlock('PD', 0),
    HOME: new NativeCodeBlock(this.logo_home, 0),
    CG: new NativeCodeBlock(this.logo_clear_graphics, 0),
    BK: new LogoCodeBlock('RT 180 FD @ARG0@ RT 180', 1),
    BACK: new LogoCodeBlock('BK @ARG0@', 1),
    // new NativeCodeBlock('TO', 'logo_to_end', 'END'),
    MAKE: new NativeCodeBlock(this.logo_make, 2),
    SHOW: new NativeCodeBlock(this.logo_show, 1),
    SETX: new NativeCodeBlock(this.logo_setx, 1),
    SETY: new NativeCodeBlock(this.logo_sety, 1),
    RANDOM: new LogoCodeBlock('MAKE RNDTMP \'RANDOM01 MUL RNDTMP @ARG0@', 1),
    IF: new NativeCodeBlock(this.logo_if, 4),
    // moje izmišljene funkcije
    ADD: new NativeCodeBlock(this.logo_add, 2),
    MUL: new NativeCodeBlock(this.logo_mul, 2)
  };

  private variables: { [s: string]: Variable; } = {
    XCOR: new NativeVariable(this.logo_get_xcor),
    YCOR: new NativeVariable(this.logo_get_ycor),
    DIR: new NativeVariable(this.logo_get_dir),
    RANDOM01: new NativeVariable(this.logo_get_random01)
  };

  public executeCommand(command: string) {
    command = this.beautifyCommand(command);

    command = this.handleBrackets(command);

    const splitCommand: string[] = command.split(' ');
    let index = 0;

    while (index < splitCommand.length) {
      const commandName: string = splitCommand[index].toUpperCase();

      if (commandName === 'TO') {
        const endIndex: number = splitCommand.findIndex(x => x === 'END');

        if (endIndex == -1) {
          throw new Error('Definicija funkcije, ki se začne s "TO", se mora končati z "END"');
        }

        const commandDefinition: string[] = splitCommand.slice(index + 1, endIndex); // Začetni TO in končni END odrežemo
        this.validateTOCommand(commandDefinition);

        this.executeTOCommand(commandDefinition);
        index = endIndex + 1;
      } else {
        const codeBlock: CodeBlock = this.codeBlocks[commandName];

        if (codeBlock === undefined) {
          throw new Error('Funkcija \'' + splitCommand[index].toUpperCase() + '\' ne obstaja!');
        }
        // preveri dolžino
        const lastArgIndex = index + 1 + codeBlock.numArgs;
        if (splitCommand.length < lastArgIndex) {
          throw new Error('Premalo argumentov za funkcijo ' + commandName);
        }

        const commandArgs: string[] = splitCommand.slice(index + 1, lastArgIndex);
        const functionArgs: string[] = commandArgs.map(x => this.evaluateArgument(x));

        codeBlock.execute(functionArgs, this);

        index += codeBlock.numArgs + 1;
      }
    }
  }

  private evaluateArgument(arg: string): string {
    let result: string;
    if (arg.startsWith('\'')) {
      const variable = this.getVariable(arg.substring(1));
      if (variable === undefined) {
        throw new Error('Spremenljivka ' + arg.substring(1) + ' ne obstaja!');
      } else {
        result = variable.toString();
      }
    } else {
      result = arg;
    }
    return result;
  }

  private evaluateCondition(arg1: string, oper: string, arg2: string): boolean {
    const val1: number = parseFloat(this.evaluateArgument(arg1));
    const val2: number = parseFloat(this.evaluateArgument(arg2));

    if (oper = '<') return val1 < val2;
    else if (oper = '=') return val1 == val2;
    else if (oper = '>') return val1 > val2;
    else if (oper = '<=') return val1 <= val2;
    else if (oper = '>=') return val1 >= val2;
    else throw new Error('Pogojni operator ' + oper + ' ne obstaja!');
  }

  private getNextPrnId() {
    return this.nextPrnId++;
  }

  private beautifyCommand(command: string): string {
    command = command.toUpperCase();
    command = command.replace(/\s\s+/g, ' '); // Odstrani whitespace
    command = command.trim();

    return command;
  }

  private handleBrackets(command: string): string {
    let nivo = 0;
    let oklStart = -1;
    let funDef = false;
    for (let i = 0; i < command.length; i++) {
      if (command.substring(i, i + 3).toUpperCase() === 'TO ') {
        funDef = true;
      } else if (command.substring(i, i + 4).toUpperCase() === ' END') {
        funDef = false;
      }

      if (command[i] === '[') {
        if (nivo === 0) {
          oklStart = i;
        }

        nivo++;
      } else if (command[i] === ']') {
        nivo--;

        if (nivo === 0 && !funDef) {
          // ustvari nov codeBlock iz substringa (oklStart, i)
          const prnString = command.substring(oklStart, i + 1).trim();
          const prnId = '@PRN' + this.getNextPrnId();
          this.addCodeBlock(prnId, prnString.substring(1, prnString.length - 1), 0);
          // replacaj celo vsebino oklepajev z imenom codeBlocka
          command = command.replace(prnString, prnId);
          console.log('Zamenjal izraz v oklepaju ' + prnString + ' z ' + prnId);
          // command je zdaj krajši, tako da je treba zmanjšat spremenljivko i
          i -= prnString.length;
        }
        if (nivo < 0) {
          throw new Error('Več zaklepajev kot oklepajev! pozicija ' + i);
        }
      }
    }

    if (nivo !== 0) {
      throw new Error('Manjka zaklepaj!');
    }

    return command;
  }

  // Input je definicija funkcije, razdeljena v besede, brez začetnega TO in končnega END
  private validateTOCommand(commandDefinition: string[]) {
    if (commandDefinition.length === 0) { // TODO: handlaj še druge rezervirane besede, ki ne morejo biti imena procedur
      throw new Error('"END" ne more biti ime procedure');
    }

    if (commandDefinition.indexOf('TO') !== -1) {
      throw new Error('Ni možno gnezdit TO statementov!');
    }
  }

  // Input je definicija funkcije, razdeljena v besede, brez začetnega TO in končnega END
  private executeTOCommand(commandDefinition: string[]) {
    const name: string = commandDefinition[0].toUpperCase(); // Prva beseda je ime funkcije

    commandDefinition = commandDefinition.slice(1);
    const bodyStart: number = commandDefinition.findIndex(x => !x.startsWith(':')); // Začetek bodya funkcije je prva beseda ki se ne začne z :
    const argNames: string[] = commandDefinition.slice(0, bodyStart);
    const numArgs: number = argNames.length;
    let commandBodyWords: string[] = commandDefinition.slice(bodyStart);
    commandBodyWords = commandBodyWords.map(x => {
      // Imena argumentov v bodyu funkcije zamenjaj z njihovimi indeksi
      if (x.startsWith(':')) {
        const argumentIndex: number = argNames.findIndex(argName => x === argName);
        if (argumentIndex === -1) {
          throw new Error('Argument ' + x + ' ni naveden v definiciji funkcije!');
        }
        x = x.replace(argNames[argumentIndex], '@ARG' + argumentIndex + '@');
      }
      return x;
    });
    const commandBody = commandBodyWords.join(' ');

    this.addCodeBlock(name, commandBody, numArgs);
  }

  private degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  private addCodeBlock(name: string, text: string, numArgs: number) {
    const codeBlock = new LogoCodeBlock(text, numArgs);

    this.codeBlocks[name] = codeBlock;
  }

  private setVariable(varName: string, value: number) {
    varName = varName.toUpperCase();
    let variable: Variable | undefined = this.variables[varName];
    if (variable === undefined) {
      variable = new LogoVariable(value);
      this.variables[varName] = variable;
    } else {
      if (variable.native) {
        throw new Error('Spremenljivki ' + varName + ' ni mogoče nastavljati vrednosti!');
      }
      (variable as LogoVariable).value = value;
    }
  }

  private getVariable(varName: string): number {
    varName = varName.toUpperCase();
    const variable: Variable | undefined = this.variables[varName];
    if (variable === undefined) {
      throw new Error('Spremenljivka ' + varName + ' ne obstaja!');
    } else if (variable.native) {
      return (variable as NativeVariable).getter.bind(this)();
    } else {
      return (variable as LogoVariable).value;
    }
  }

  private logo_forward(args: string[]) {
    const distance: string = args[0];
    const distanceNum: number = parseFloat(distance);
    const distanceX = Math.sin(this.degToRad(this.turtleDirection)) * distanceNum;
    const distanceY = -Math.cos(this.degToRad(this.turtleDirection)) * distanceNum;

    if (this.penDown) {
      const newLine: Line = {
        start: {
          w: this.turtlePosition[0],
          h: this.turtlePosition[1]
        },
        end: {
          w: this.turtlePosition[0] + distanceX,
          h: this.turtlePosition[1] + distanceY
        }
      }
      this.lines.push(newLine);
    }

    this.turtlePosition = new Array(this.turtlePosition[0] + distanceX, this.turtlePosition[1] + distanceY);
  }

  private logo_right(args: string[]) {
    const angle: string = args[0];
    const angleNum: number = parseFloat(angle);
    this.turtleDirection += angleNum;
  }

  private logo_repeat(args: string[]) {
    const repeats: string = args[0];
    const text: string = args[1];
    const repeatsNum: number = parseFloat(repeats);
    for (let i: number = 0; i < repeatsNum; i++) {
      this.executeCommand(text);
    }
  }

  private logo_if(args: string[]) {
    const arg1: string = args[0];
    const oper: string = args[1];
    const arg2: string = args[2];
    const then: string = args[3];
    const conditionTrue: boolean = this.evaluateCondition(arg1, oper, arg2);
    if (conditionTrue) {
      this.executeCommand(then);
    }
  }

  private logo_penup(args: string[]) {
    this.penDown = false;
  }

  private logo_pendown(args: string[]) {
    this.penDown = true;
  }

  private logo_home(args: string[]) {
    this.turtlePosition = new Array(0, 0);
    this.turtleDirection = 0;
  }

  private logo_clear_graphics(args: string[]) {
    this.lines = [];
    this.logo_home([]);
  }

  private logo_make(args: string[]) {
    const varName: string = args[0];
    const varValue: number = parseFloat(args[1]);
    this.setVariable(varName, varValue);
  }

  private logo_show(args: string[]) {
    const varName: string = args[0];
    this.output.emit(varName + '=' + this.getVariable(varName).toFixed(10));
  }

  private logo_add(args: string[]) {
    const varName: string = args[0];
    const value: string = args[1];
    this.setVariable(varName, this.getVariable(varName) as number + parseFloat(value));
  }

  private logo_mul(args: string[]) {
    const varName: string = args[0];
    const value: string = args[1];
    this.setVariable(varName, this.getVariable(varName) as number * parseFloat(value));
  }

  private logo_setx(args: string[]) {
    const newX: string = args[0];
    this.turtlePosition[0] = parseFloat(newX);
  }

  private logo_sety(args: string[]) {
    const newY: string = args[0];
    this.turtlePosition[1] = parseFloat(newY);
  }

  private logo_get_xcor(): number {
    return this.turtlePosition[0];
  }

  private logo_get_ycor(): number {
    return this.turtlePosition[1];
  }

  private logo_get_dir(): number {
    return this.turtleDirection;
  }

  private logo_get_random01(): number {
    return Math.random();
  }
}
