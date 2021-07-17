import { Injectable } from '@angular/core';
import { degToRad } from 'src/app/helpers/math.helpers';
import { Line } from 'src/app/types/geometry/line';
import { Point } from 'src/app/types/geometry/point';
import { Reducer } from 'src/app/utils/reducer-store/reducer';
import { LogoStoreState } from '../logo.store.state';

@Injectable()
export class LogoForwardReducer implements Reducer<LogoStoreState, string[]> {
  reduce(state: LogoStoreState, args: string[]): LogoStoreState {
    const distance: string = args[0];
    const distanceNum: number = parseFloat(distance);
    const distanceW = Math.sin(degToRad(state.turtleDirection)) * distanceNum;
    const distanceH = -Math.cos(degToRad(state.turtleDirection)) * distanceNum;

    const newTurtlePosition: Point = {
      w: state.turtlePosition.w + distanceW,
      h: state.turtlePosition.h + distanceH,
    };
    const newLines: Line[] = [];

    if (state.penDown) {
      const newLine: Line = {
        start: state.turtlePosition,
        end: newTurtlePosition,
      };
      newLines.push(newLine);
    }

    return {
      ...state,
      turtlePosition: newTurtlePosition,
      lines: [...state.lines, ...newLines],
    };
  }
}
