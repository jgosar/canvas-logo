import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LogoEngine } from "src/app/services/logo-engine-legacy/logo-engine-legacy";
import { Line } from "src/app/types/geometry/line";

@Component({
  selector: 'cl-canvas-logo',
  templateUrl: './canvas-logo.component.html',
  styleUrls: ['./canvas-logo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasLogoComponent{
  lines: Line[] = [];

  output: string = 'Hello logo!';
  currentCommand: string = '';

  private logoEngine: LogoEngine;

  constructor() {
    this.logoEngine = new LogoEngine();

    this.logoEngine.output.subscribe(text => this.printOutput(text, 'bold'));
  }

  public executeCommand(){
    this.logoEngine.executeCommand(this.currentCommand);
    this.currentCommand = '';
    this.lines = [...this.logoEngine.lines];
  }

  public historyPrev(){

  }

  public historyNext(){
    
  }

  private printOutput(text: string, style: null | 'red' | 'bold' = null) {
    this.output += text;//TODO!
  }
}
