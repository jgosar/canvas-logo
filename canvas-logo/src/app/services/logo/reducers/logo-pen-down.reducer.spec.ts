import { LogoStoreState } from '../logo.store.state';
import { LogoPenDownReducer } from './logo-pen-down.reducer';

describe('LogoPenDownReducer', () => {
  let reducer: LogoPenDownReducer;

  beforeEach(() => {
    reducer = new LogoPenDownReducer();
  });

  it('should correctly put pen down', () => {
    const state = reducer.reduce(
      {
        ...new LogoStoreState(),
        penDown: false,
      },
      []
    );

    expect(state.penDown).toBeTrue();
  });

  it("should keep pen down if it's already up", () => {
    const state = reducer.reduce(
      {
        ...new LogoStoreState(),
        penDown: true,
      },
      []
    );

    expect(state.penDown).toBeTrue();
  });
});
