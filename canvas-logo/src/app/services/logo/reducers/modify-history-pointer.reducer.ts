import {Injectable} from '@angular/core';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';

@Injectable()
export class ModifyHistoryPointerReducer implements Reducer<LogoStoreState, number> {
    reduce(state: LogoStoreState, change: number): LogoStoreState {
        const newHistoryPointer: number = state.historyPointer + change;
        if (newHistoryPointer < 0 || newHistoryPointer > state.history.length) {
            return state;
        }

        return {
            ...state,
            historyPointer: newHistoryPointer,
        };
    }
}
