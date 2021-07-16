import { LogoStoreState } from "../logo.store.state";
import { LogoPenUpReducer } from "./logo-pen-up.reducer";

describe('LogoPenUpReducer', () => {
  let reducer: LogoPenUpReducer;
  
  beforeEach(() => {
        reducer = new LogoPenUpReducer();
    });

    it('should correctly lift pen up', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              penDown: true
            },[]
        );

        expect(state.penDown).toBeFalse();
    });

    it('should keep pen up if it\'s already up', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              penDown: false
            },[]
        );

        expect(state.penDown).toBeFalse();
    });
});
