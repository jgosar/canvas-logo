import {Injectable} from '@angular/core';
import {positiveMod} from 'src/app/helpers/math.helpers';
import type {Reducer} from 'src/app/utils/reducer-store/reducer';
import type {LogoStoreState} from '../logo.store.state';

@Injectable()
export class LogoRightReducer implements Reducer<LogoStoreState, string[]> {
    reduce(state: LogoStoreState, args: string[]): LogoStoreState {
        const angle: string = args[0];
        const angleNum: number = parseFloat(angle);
        return {
            ...state,
            turtleDirection: positiveMod(state.turtleDirection + angleNum, 360),
        };
    }
}
