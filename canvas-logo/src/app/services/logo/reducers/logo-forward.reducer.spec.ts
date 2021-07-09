import { Point } from "src/app/types/geometry/point";
import { LogoStoreState } from "../logo.store.state";
import { LogoForwardReducer } from "./logo-forward.reducer";

function roundPoint(point: Point): Point{
  return {w: Math.round(point.w+1)-1,h:Math.round(point.h+1)-1};
}

describe('LogoForwardReducer', () => {
  let reducer: LogoForwardReducer;
  
  beforeEach(() => {
        reducer = new LogoForwardReducer();
    });

    it('should correctly go up', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              turtleDirection: 0,
              turtlePosition: {w:20,h:20}
            },
            ['100']
        );

        expect(roundPoint(state.turtlePosition)).toEqual({w:20,h:-80});
    });

    it('should correctly go right', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              turtleDirection: 90,
              turtlePosition: {w:20,h:20}
            },
            ['100']
        );

        expect(roundPoint(state.turtlePosition)).toEqual({w:120,h:20});
    });

    it('should correctly go down', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              turtleDirection: 180,
              turtlePosition: {w:20,h:20}
            },
            ['100']
        );

        expect(roundPoint(state.turtlePosition)).toEqual({w:20,h:120});
    });

    it('should correctly go left', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              turtleDirection: 270,
              turtlePosition: {w:20,h:20}
            },
            ['100']
        );

        expect(roundPoint(state.turtlePosition)).toEqual({w:-80,h:20});
    });

    it('should correctly go diagonally', () => {
        const state = reducer.reduce(
            {
              ...new LogoStoreState(),
              turtleDirection: 45,
              turtlePosition: {w:-100,h:30}
            },
            ['100']
        );

        expect(roundPoint(state.turtlePosition)).toEqual({w:-29,h:-41});
    });
});
