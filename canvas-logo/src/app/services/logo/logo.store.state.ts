import { Line } from "src/app/types/geometry/line";
import { Point } from "src/app/types/geometry/point";
import { LogoCodeBlock2 } from "./types/logo-code-block-2";
import { NativeCodeBlock2 } from "./types/native-code-block-2";

export class LogoStoreState{
  lines: Line[] = [];
  turtlePosition: Point = {w:0,h:0};
  turtleDirection: number = 0;
  penDown: boolean = true;
  codeBlocks: { [s: string]: NativeCodeBlock2|LogoCodeBlock2; } = {};
}
