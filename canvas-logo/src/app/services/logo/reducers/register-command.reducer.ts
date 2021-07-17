import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Reducer } from 'src/app/utils/reducer-store/reducer';
import { LogoStoreState } from '../logo.store.state';

export interface RegisterCommandPayload {
  commandName: string;
  commandReducer?: Reducer<LogoStoreState, string[]>;
  commandText?: string;
  numArgs?: number;
  terminatedBy?: string;
  skipArgsEvaluation?: true;
}

@Injectable()
export class RegisterCommandReducer implements Reducer<LogoStoreState, RegisterCommandPayload> {
  reduce(state: LogoStoreState, payload: RegisterCommandPayload): LogoStoreState {
    if (isDefined(payload.numArgs) === isDefined(payload.terminatedBy)) {
      throw new Error('One of either "numArgs" or "terminatedBy" must be defined!');
    }
    if (isDefined(payload.commandReducer) === isDefined(payload.commandText)) {
      throw new Error('One of either "commandReducer" or "commandText" must be defined!');
    }

    return {
      ...state,
      codeBlocks: {
        ...state.codeBlocks,
        [payload.commandName]: {
          reducer: payload.commandReducer,
          commandText: payload.commandText,
          numArgs: payload.numArgs,
          terminatedBy: payload.terminatedBy,
          skipArgsEvaluation: payload.skipArgsEvaluation,
        },
      },
    };
  }
}
