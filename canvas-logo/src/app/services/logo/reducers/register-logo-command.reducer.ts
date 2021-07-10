import { Injectable } from "@angular/core";
import { Reducer } from "src/app/utils/reducer-store/reducer";
import { LogoStoreState } from "../logo.store.state";

export interface RegisterLogoCommandPayload{
  commandName: string;
  commandBody: string;
  numArgs: number;
}

@Injectable()
export class RegisterLogoCommandReducer implements Reducer<LogoStoreState, RegisterLogoCommandPayload>{
  reduce(state: LogoStoreState, payload: RegisterLogoCommandPayload): LogoStoreState{
    return {
      ...state,
      codeBlocks: {
        ...state.codeBlocks,
        [payload.commandName]: {
          commandText: payload.commandBody,
          numArgs: payload.numArgs
        }
      }
    };
  }
}
