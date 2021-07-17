import type {LogoStoreState} from '../logo.store.state';

export interface LogoVariable {
    value?: number;
    valueGetter?: (state: LogoStoreState) => number;
}
