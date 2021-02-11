import { LogoEngine } from "../logo-engine-legacy";

export abstract class CodeBlock {
  public numArgs: number;
  public native: boolean;

  public abstract execute(args: string[], logoEngine: LogoEngine): void;

  constructor(numArgs: number, native: boolean) {
    this.numArgs = numArgs;
    this.native = native;
  }
}

export class LogoCodeBlock extends CodeBlock {
  public text: string;

  public execute(args: string[], logoEngine: LogoEngine) {
    let commandText: string = this.text;
    args.forEach((arg, argIndex) => {
      // V telesu funkcije zamenjamo substringe @ARG#@ z vrednostjo argumenta #
      commandText = commandText.split('@ARG' + argIndex + '@').join(arg);
    });
    logoEngine.executeCommand(commandText);
  }

  constructor(text: string, numArgs: number) {
    super(numArgs, false);
    this.text = text;
  }
}

export class NativeCodeBlock extends CodeBlock {
  public func: ((args: string[]) => void);

  public execute(args: string[], logoEngine: LogoEngine) {
    this.func.bind(logoEngine)(args);
  }

  constructor(func: ((args: string[]) => void), numArgs: number) {
    super(numArgs, true);
    this.func = func;
  }
}

export class Variable {
  public native: boolean;
  constructor(native: boolean) {
    this.native = native;
  }
}

export class LogoVariable extends Variable {
  public value: number;

  constructor(value: number) {
    super(false);
    this.value = value;
  }
}

export class NativeVariable extends Variable {
  public getter: (() => number);

  constructor(getter: (() => number)) {
    super(true);
    this.getter = getter;
  }
}
