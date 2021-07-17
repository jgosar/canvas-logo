import {LogoStoreState} from '../logo.store.state';
import {LogoRightReducer} from './logo-right.reducer';

describe('LogoRightReducer', () => {
    let reducer: LogoRightReducer;

    beforeEach(() => {
        reducer = new LogoRightReducer();
    });

    it('should correctly turn right', () => {
        const state = reducer.reduce(
            {
                ...new LogoStoreState(),
                turtleDirection: 75,
            },
            ['10']
        );

        expect(state.turtleDirection).toEqual(85);
    });

    it('should correctly turn left', () => {
        const state = reducer.reduce(
            {
                ...new LogoStoreState(),
                turtleDirection: 75,
            },
            ['-10']
        );

        expect(state.turtleDirection).toEqual(65);
    });

    it('should correctly turn right to over 360°', () => {
        const state = reducer.reduce(
            {
                ...new LogoStoreState(),
                turtleDirection: 75,
            },
            ['300']
        );

        expect(state.turtleDirection).toEqual(15);
    });

    it('should correctly turn left to under 0°', () => {
        const state = reducer.reduce(
            {
                ...new LogoStoreState(),
                turtleDirection: 75,
            },
            ['-200']
        );

        expect(state.turtleDirection).toEqual(235);
    });
});
