import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasLogoComponent } from './components/canvas-logo/canvas-logo.component';
import { ZoomableCanvasComponent } from './components/zoomable-canvas/zoomable-canvas.component';
import { LogoStore } from './services/logo/logo.store';
import { LogoForwardReducer } from './services/logo/reducers/logo-forward.reducer';

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
  providers: [LogoStore, LogoForwardReducer],
  bootstrap: [AppComponent]
})
export class AppModule { }
