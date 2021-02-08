import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, Input } from '@angular/core';
import * as $ from 'jquery';
import { multiplyVector, subtractPoints, subtractVectorFromPoint } from 'src/app/helpers/geometry.helpers';
import { Line } from 'src/app/types/geometry/line';
import { Point } from 'src/app/types/geometry/point';
import { Vector } from 'src/app/types/geometry/vector';

@Component({
  selector: 'cl-zoomable-canvas',
  templateUrl: './zoomable-canvas.component.html',
  styleUrls: ['./zoomable-canvas.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomableCanvasComponent implements OnInit, OnChanges {
  @Input()
  lines: Line[] = [];

  @ViewChild('myCanvas', { static: true })
  myCanvas!: ElementRef;

  id: string = Math.random().toString(36).substring(2, 15);

  private zoomLevel: number = 0;
  private center: Point = { w: 400, h: 300 };
  private isMouseDown: boolean = false;
  private mouse2Center: Vector = { dw: 0, dh: 0};
  private zoomFactor: number = 1.2;

  ngOnInit(): void {
    setTimeout(() => {
      this.resizeAndRedraw();
    }, 0);

    $(window).resize(() => {
      this.resizeAndRedraw();
    });
  }

  ngOnChanges(): void {
    this.draw();
  }

  public resizeAndRedraw(): void {
    const container = $('#' + this.id + 'Container');
    $('#' + this.id).attr('width', container.width()||null);
    $('#' + this.id).attr('height', container.height()||null);

    this.center = {
      w: this.myCanvas.nativeElement.width / 2,
      h: this.myCanvas.nativeElement.height / 2
    };
    
    this.draw();
  }

  public mouseMove(event: MouseEvent) {
    const mousePoint: Point = this.getEventPoint(event);

    if (this.isMouseDown) {
      this.center = subtractVectorFromPoint(mousePoint, this.mouse2Center);
      this.draw();
    }
  }

  public mouseDown(event: MouseEvent) {
    const mousePoint: Point = this.getEventPoint(event);

    this.mouse2Center = subtractPoints(mousePoint, this.center);

    this.isMouseDown = true;
  }

  public mouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  public onSelectStart(): boolean {
    return false;
  }

  public onScroll(event: WheelEvent) {
    event.preventDefault();
    const mousePoint: Point = this.getEventPoint(event);

    const wheelDelta: number = event.deltaY !== undefined ? event.deltaY / -100 : event.detail / -3;
    this.zoomLevel += wheelDelta;

    this.mouse2Center = subtractPoints(mousePoint, this.center);
    this.center = subtractVectorFromPoint(mousePoint, multiplyVector(this.mouse2Center, Math.pow(this.zoomFactor, wheelDelta)));

    this.draw();

    return false;
  }

  private draw() {
    const context = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if(!context){
      return;
    }

    context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);

    this.lines.forEach(line=>{
      const startPoint: Point = this.zoomPoint(line.start);
      const endPoint: Point = this.zoomPoint(line.end);

      context.beginPath();
      context.moveTo(startPoint.w, startPoint.h);
      context.lineTo(endPoint.w, endPoint.h);
      context.strokeStyle = '#000';
      context.stroke();
    });
  }

  private zoomPoint(point: Point): Point {
    const zoomMultiplier = Math.pow(this.zoomFactor, this.zoomLevel);
    return {
      w: this.center.w + point.w * zoomMultiplier,
      h: this.center.h + point.h * zoomMultiplier
    }
  }

  private getEventPoint(event: MouseEvent | WheelEvent): Point {
    // @ts-ignore
    return { w: event.layerX, h: event.layerY };
  }
}
