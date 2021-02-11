import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Line } from "src/app/types/geometry/line";

@Component({
  selector: 'cl-canvas-logo',
  templateUrl: './canvas-logo.component.html',
  styleUrls: ['./canvas-logo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasLogoComponent{
  testLines: Line[] = [
    {
      start: {
        w:0,
        h:0,
      },
      end: {
        w:0,
        h:-100,
      },
    },
    {
      start: {
        w:0,
        h:-100,
      },
      end: {
        w:100,
        h:100,
      },
    },
  ];

  output: string = 'Hello logo!';

  public executeCommand(){

  }

  public historyPrev(){

  }

  public historyNext(){
    
  }
}
