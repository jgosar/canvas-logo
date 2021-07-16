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

function runTest(reducer: LogoForwardReducer, direction: number, distance: number, startingPosition: Point, expectedEndingPosition: Point){
  runTest2(reducer, direction, distance, startingPosition, expectedEndingPosition, true);
  runTest2(reducer, direction, distance, startingPosition, expectedEndingPosition, false);
}

function runTest2(reducer: LogoForwardReducer, direction: number, distance: number, startingPosition: Point, expectedEndingPosition: Point, penDown: boolean){
  const state = reducer.reduce(
    {
      ...new LogoStoreState(),
      penDown,
      turtleDirection: direction,
      turtlePosition: startingPosition
    },
    [`${distance}`]
  );

  expect(roundPoint(state.turtlePosition)).toEqual(expectedEndingPosition);

  if(penDown){
      expect(roundLines(state.lines)).toEqual([{start: startingPosition, end: expectedEndingPosition}]);
  } else{
      expect(state.lines).toEqual([]);
  }
}

describe('LogoForwardReducer', () => {
  let reducer: LogoForwardReducer;
  
  beforeEach(() => {
        reducer = new LogoForwardReducer();
    });

    it('should correctly go up', () => {
        runTest(reducer, 0, 100, {w:20,h:20}, {w:20,h:-80});
    });

    it('should correctly go right', () => {
        runTest(reducer, 90, 100, {w:20,h:20}, {w:120,h:20});
    });

    it('should correctly go down', () => {
        runTest(reducer, 180, 100, {w:20,h:20}, {w:20,h:120});
    });

    it('should correctly go left', () => {
        runTest(reducer, 270, 100, {w:20,h:20}, {w:-80,h:20});
    });

    it('should correctly go diagonally', () => {
        runTest(reducer, 45, 100, {w:-100,h:30}, {w:-29,h:-41});
    });
});
