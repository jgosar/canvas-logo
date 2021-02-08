import { Component } from '@angular/core';
import { Line } from './types/geometry/line';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
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
}
