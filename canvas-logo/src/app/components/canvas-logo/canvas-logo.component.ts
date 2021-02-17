import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LogoEngine } from "src/app/services/logo-engine-legacy/logo-engine-legacy";
import { LogoStore } from "src/app/services/logo/logo.store";
import { Line } from "src/app/types/geometry/line";

@Component({
  selector: 'cl-canvas-logo',
  templateUrl: './canvas-logo.component.html',
  styleUrls: ['./canvas-logo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasLogoComponent implements OnInit, OnDestroy {
  lines: Line[] = [];

  output: string = 'Hello logo!';
  currentCommand: string = '';
  
  private ngUnsubscribe$: Subject<void> = new Subject();

  //private logoEngine: LogoEngine;

  constructor(public store: LogoStore) {
    //this.logoEngine = new LogoEngine();

    //this.logoEngine.output.subscribe(text => this.printOutput(text, 'bold'));
  }

  ngOnInit(): void {
    /*this.store.state$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(state=>{
          this.lines = state.lines;
      });*/
  }

  ngOnDestroy() {
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
  }

  executeCommand(){
    //this.logoEngine.executeCommand(this.currentCommand);
    this.store.executeCommand(this.currentCommand);
    this.currentCommand = '';
    //this.lines = [...this.logoEngine.lines];
  }

  historyPrev(){

  }

  historyNext(){
    
  }

  printOutput(text: string, style: null | 'red' | 'bold' = null) {
    this.output += text;//TODO!
  }
}
