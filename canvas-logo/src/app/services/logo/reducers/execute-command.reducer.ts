import { Injectable } from "@angular/core";
import { isDefined } from "src/app/helpers/common.helpers";
import { replaceAll } from "src/app/helpers/string.helpers";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";
import { LogoCodeBlock2 } from "../types/logo-code-block-2";
import { NativeCodeBlock2 } from "../types/native-code-block-2";

@Injectable()
export class ExecuteCommandReducer implements Reducer<LogoStoreState, string[]>{
  reduce(state: LogoStoreState, args: string[]): LogoStoreState {
    const codeBlock: NativeCodeBlock2|LogoCodeBlock2 = state.codeBlocks[args[0]]

    if(this.isNativeCodeBlock(codeBlock)){
      return (<NativeCodeBlock2>codeBlock).reducer.reduce(state, args.slice(1))
    } else{
      const commandTextWithArgs: string = this.formatCommandTextWithArgs(
        (<LogoCodeBlock2>codeBlock).commandText,
        args.slice(1),
      );

      return this.reduce(state, commandTextWithArgs.split(' '));
    }
  }

  private isNativeCodeBlock(codeBlock: NativeCodeBlock2 | LogoCodeBlock2) {
    return isDefined(codeBlock['reducer']);
  }

  private formatCommandTextWithArgs(commandText: string, args: string[]): string{
    return args.reduce(
      (commandText, arg, argIndex)=>replaceAll(commandText, '@ARG' + argIndex + '@', arg),
      commandText
    );
  }
}
