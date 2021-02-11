import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasLogoComponent } from './components/canvas-logo/canvas-logo.component';
import { ZoomableCanvasComponent } from './components/zoomable-canvas/zoomable-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    ZoomableCanvasComponent,
    CanvasLogoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
