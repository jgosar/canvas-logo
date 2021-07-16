import { isDefined } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";

export interface RegisterNativeCommandPayload{
  commandName: string;
  commandReducer: Reducer<LogoStoreState, string[]>;
  numArgs?: number;
  terminatedByEnd?: true;
  skipArgsEvaluation?: true;
}

@Injectable()
export class RegisterNativeCommandReducer implements Reducer<LogoStoreState, RegisterNativeCommandPayload>{
  reduce(state: LogoStoreState, payload: RegisterNativeCommandPayload): LogoStoreState{
    if(isDefined(payload.numArgs)===isDefined(payload.terminatedByEnd)){
      throw new Error('One of either "numArgs" or "terminatedByEnd" must be defined!');
    }

    return {
      ...state,
      codeBlocks: {
        ...state.codeBlocks,
        [payload.commandName]: {
          reducer: payload.commandReducer,
          numArgs: payload.numArgs,
          terminatedByEnd: payload.terminatedByEnd,
        }
      }
    };
  }
}