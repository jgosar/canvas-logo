import { Injectable } from "@angular/core";
import { isDefined } from "src/app/helpers/common.helpers";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";
import { LogoCodeBlock2 } from "../types/logo-code-block-2";
import { NativeCodeBlock2 } from "../types/native-code-block-2";

@Injectable()
export class ExecuteCommandReducer implements Reducer<LogoStoreState, string[]>{
  reduce(state: LogoStoreState, params: string[]): LogoStoreState {
    const codeBlock: NativeCodeBlock2|LogoCodeBlock2 = state.codeBlocks[params[0]]

    if(isDefined(codeBlock['reducer'])){
      return (<NativeCodeBlock2>codeBlock).reducer.reduce(state, params.slice(1))
    } else{
      // TODO: execute LogoCodeBlock2
    }

    return state;
  }
}
