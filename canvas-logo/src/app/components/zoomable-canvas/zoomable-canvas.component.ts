import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, OnChanges, Input, HostListener, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Line } from 'src/app/types/geometry/line';
import { Point } from 'src/app/types/geometry/point';
import { RenderingCoordinates } from 'src/app/types/geometry/render-coordinates';
import { ZOOM_STEP_MULTIPLIER } from './zoomable-canvas.component.config';

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
  private renderOffset: RenderingCoordinates|undefined;
  private mouseDownPoint: Point|undefined;
  
  private ngUnsubscribe$: Subject<void> = new Subject();
  private viewportResized$: Subject<RenderingCoordinates> = new Subject<RenderingCoordinates>();

  ngOnInit(): void {
    this.viewportResized$.pipe(
      distinctUntilChanged((size1,size2)=>size1.x===size2.x && size1.y===size2.y),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(this.resizeAndRedraw.bind(this));
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

    this.viewportResized$.next(this.getViewportSize());
  }

  public resizeAndRedraw(viewportSize: RenderingCoordinates): void {
    console.log('height: '+viewportSize.y);
    const focus: Point = this.getFocus();

    this.canvas.nativeElement.width = viewportSize.x;
    this.canvas.nativeElement.height = viewportSize.y;

    this.setFocus(focus);
    
    this.draw();
  }

  public mouseMove(event: MouseEvent) {
    if (this.mouseDownPoint) {
      const mouseCoords: RenderingCoordinates = this.getEventCoordinates(event);
      this.recalculateOffset(this.mouseDownPoint, mouseCoords);
      this.draw();
    }
  }

  public mouseDown(event: MouseEvent) {
    const mouseCoords: RenderingCoordinates = this.getEventCoordinates(event);
    this.mouseDownPoint = this.coordinatesToPoint(mouseCoords);
  }

  public mouseUp(e: MouseEvent) {
    this.mouseDownPoint = undefined;
  }

  public onScroll(event: WheelEvent) {
    event.preventDefault();
    const mouseCoords: RenderingCoordinates = this.getEventCoordinates(event);

    const wheelDelta: number = event.deltaY !== undefined ? event.deltaY / -100 : event.detail / -3;

    const mousePoint: Point = this.coordinatesToPoint(mouseCoords);
    this.zoomLevel += wheelDelta;
    this.recalculateOffset(mousePoint, mouseCoords);

    this.draw();

    return false;
  }

  private draw() {
    const context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if(!context || !this.renderOffset){
      return;
    }

    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.lines.forEach(line=>{
      const start: RenderingCoordinates = this.pointToCoordinates(line.start);
      const end: RenderingCoordinates = this.pointToCoordinates(line.end);

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = '#000';
      context.stroke();
    });
  }

  private setFocus(focus: Point){
    this.recalculateOffset(focus, this.getCanvasCentre());
  }

  private getFocus(): Point{
    if(!this.renderOffset){
      return {w: 0, h: 0};
    }
    return this.coordinatesToPoint(this.getCanvasCentre());
  }

  private getCanvasCentre(): RenderingCoordinates{
    return {
      x: this.canvas.nativeElement.width / 2,
      y: this.canvas.nativeElement.height / 2
    };
  }

  private getViewportSize(): RenderingCoordinates{
    return {
      x: this.canvasContainer.nativeElement.clientWidth,
      y: this.canvasContainer.nativeElement.clientHeight,
    };
  }

  private pointToCoordinates(point: Point): RenderingCoordinates {
    // Get coordinates from known point and renderOffset
    // A=B+C*D
    const zoomMultiplier: number = this.getZoomMultiplier();
    return {
      x: this.renderOffset!.x + point.w * zoomMultiplier,
      y: this.renderOffset!.y + point.h * zoomMultiplier
    }
  }

  private coordinatesToPoint(coordinates: RenderingCoordinates): Point {
    // Get point from known coordinates and renderOffset
    // C=(A-B)/D
    const zoomMultiplier: number = this.getZoomMultiplier();
    return {
      w: (coordinates.x - this.renderOffset!.x) / zoomMultiplier,
      h: (coordinates.y - this.renderOffset!.y) / zoomMultiplier,
    }
  }

  private recalculateOffset(point: Point, coordinates: RenderingCoordinates){
    // get renderOffset from known point and coordinates
    // B=A-C*D
    const zoomMultiplier: number = this.getZoomMultiplier();
    this.renderOffset = {
      x: coordinates.x - point.w * zoomMultiplier,
      y: coordinates.y - point.h * zoomMultiplier
    };
  }

  private getZoomMultiplier(): number{
    return Math.pow(ZOOM_STEP_MULTIPLIER, this.zoomLevel);
  }

  private getEventCoordinates(event: MouseEvent | WheelEvent): RenderingCoordinates {
    // @ts-ignore
    return { x: event.layerX, y: event.layerY };
  }
}
