import { Injectable } from '@angular/core';
import { Reducer } from 'src/app/utils/reducer-store/reducer';
import { LogoStoreState } from '../logo.store.state';

@Injectable()
export class LogoPenDownReducer implements Reducer<LogoStoreState, string[]>{
  reduce(state: LogoStoreState, args: string[]): LogoStoreState{
    return {
      ...state,
      penDown: true
    }
  }
}
