import {Injectable} from '@angular/core';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';
import type {ExecuteCommandReducer} from './execute-command.reducer';

@Injectable()
export class LogoRepeatReducer implements Reducer<LogoStoreState, string[]> {
    constructor(private executeCommandReducer: ExecuteCommandReducer) {}

    reduce(state: LogoStoreState, args: string[]): LogoStoreState {
        let newState: LogoStoreState = {...state};

        const repeats: string = args[0];
        const command: string = args[1];
        const repeatsNum: number = parseFloat(repeats);
        for (let i: number = 0; i < repeatsNum; i++) {
            newState = this.executeCommandReducer.reduce(newState, command);
        }
        return newState;
    }
}
