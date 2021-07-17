import { Injectable } from '@angular/core';
import { evaluateArgument } from 'src/app/helpers/logo-variable.helpers';
import { Reducer } from 'src/app/utils/reducer-store/reducer';
import { LogoStoreState } from '../logo.store.state';

@Injectable()
export class LogoMakeReducer implements Reducer<LogoStoreState, string[]>{
  reduce(state: LogoStoreState, args: string[]): LogoStoreState{
    console.log(args);
    const variableValue: number = parseFloat(evaluateArgument(state, args[1]));
    return {
      ...state,
      variables: {
        ...state.variables,
        [args[0]]:  {value: variableValue}
      }
    }
  }
}
