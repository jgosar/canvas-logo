import {Injectable} from '@angular/core';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';

@Injectable()
export class LogoPenUpReducer implements Reducer<LogoStoreState, string[]> {
    reduce(state: LogoStoreState, args: string[]): LogoStoreState {
        return {
            ...state,
            penDown: false,
        };
    }
}
