import { Injectable } from '@angular/core';
import { Reducer } from 'src/app/utils/reducer-store/reducer';
import { LogoStoreState } from '../logo.store.state';

@Injectable()
export class LogoRightReducer implements Reducer<LogoStoreState, string[]>{
  reduce(state: LogoStoreState, args: string[]): LogoStoreState{
    const angle: string = args[0];
    const angleNum: number = parseFloat(angle);
    return {
      ...state,
      turtleDirection: state.turtleDirection+angleNum
    }
  }
}
