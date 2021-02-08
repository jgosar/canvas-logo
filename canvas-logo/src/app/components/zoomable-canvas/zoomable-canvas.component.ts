import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, Input, HostListener, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
export class ZoomableCanvasComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input()
  lines: Line[] = [];

  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef;

  private zoomLevel: number = 0;
  private center: Point = { w: 400, h: 300 };
  private isMouseDown: boolean = false;
  private mouse2Center: Vector = { dw: 0, dh: 0};
  private zoomFactor: number = 1.2;
  
  private ngUnsubscribe$: Subject<void> = new Subject();
  private viewportResized$: Subject<Point> = new Subject<Point>();

  ngOnInit(): void {
    this.viewportResized$.pipe(
      debounceTime(400),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe((viewportSize) => {
      this.resizeAndRedraw(viewportSize);
    });
    this.onResize();
  }

  ngOnChanges(): void {
    this.draw();
  }

  ngAfterViewChecked(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const viewportSize: Point = {
      w: this.canvasContainer.nativeElement.clientWidth,
      h: this.canvasContainer.nativeElement.clientHeight,
    };
    this.viewportResized$.next(viewportSize);
  }

  public resizeAndRedraw(viewportSize: Point): void {
    this.canvas.nativeElement.width = viewportSize.w;
    this.canvas.nativeElement.height = viewportSize.h;

    this.center = {
      w: this.canvas.nativeElement.width / 2,
      h: this.canvas.nativeElement.height / 2
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
    const context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if(!context){
      return;
    }

    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

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
