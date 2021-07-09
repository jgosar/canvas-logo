import { Line } from "src/app/types/geometry/line";
import { Point } from "src/app/types/geometry/point";
import { LogoStoreState } from "../logo.store.state";
import { LogoForwardReducer } from "./logo-forward.reducer";

function roundPoint(point: Point): Point{
  return {w: Math.round(point.w+1)-1,h:Math.round(point.h+1)-1};
}

function roundLines(lines: Line[]): Line[]{
  return lines.map(line=>({start: roundPoint(line.start), end: roundPoint(line.end)}));
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
        expect(roundLines(state.lines)).toEqual([{start: {w:20,h:20}, end: {w:20,h:-80}}]);
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
        expect(roundLines(state.lines)).toEqual([{start: {w:20,h:20}, end: {w:120,h:20}}]);
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
        expect(roundLines(state.lines)).toEqual([{start: {w:20,h:20}, end: {w:20,h:120}}]);
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
        expect(roundLines(state.lines)).toEqual([{start: {w:20,h:20}, end: {w:-80,h:20}}]);
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
        expect(roundLines(state.lines)).toEqual([{start: {w:-100,h:30}, end: {w:-29,h:-41}}]);
    });
});
