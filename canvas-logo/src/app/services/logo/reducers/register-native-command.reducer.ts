import { Injectable } from "@angular/core";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";

export interface RegisterNativeCommandPayload{
  commandName: string;
  commandReducer: Reducer<LogoStoreState, string[]>;
  numArgs: number;
}

@Injectable()
export class RegisterNativeCommandReducer implements Reducer<LogoStoreState, RegisterNativeCommandPayload>{
  reduce(state: LogoStoreState, payload: RegisterNativeCommandPayload): LogoStoreState{
    return {
      ...state,
      codeBlocks: {
        ...state.codeBlocks,
        [payload.commandName]: {
          reducer: payload.commandReducer,
          numArgs: payload.numArgs
        }
      }
    };
  }
}