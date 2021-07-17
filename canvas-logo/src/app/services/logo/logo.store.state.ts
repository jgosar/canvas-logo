import { Line } from 'src/app/types/geometry/line';
import { Point } from 'src/app/types/geometry/point';
import { LogoVariable } from './types/logo-variable';
import { CodeBlock } from './types/code-block';

export class LogoStoreState {
  lines: Line[] = [];
  turtlePosition: Point = { w: 0, h: 0 };
  turtleDirection: number = 0;
  penDown: boolean = true;
  codeBlocks: { [s: string]: CodeBlock } = {};
  variables: { [s: string]: LogoVariable } = {};
}
