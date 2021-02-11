import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
