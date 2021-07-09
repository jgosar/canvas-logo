import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasLogoComponent } from './components/canvas-logo/canvas-logo.component';
import { ZoomableCanvasComponent } from './components/zoomable-canvas/zoomable-canvas.component';
import { LogoStore } from './services/logo/logo.store';
import { ExecuteCommandReducer } from './services/logo/reducers/execute-command.reducer';
import { LogoForwardReducer } from './services/logo/reducers/logo-forward.reducer';
import { LogoRightReducer } from './services/logo/reducers/logo-right.reducer';
import { RegisterLogoCommandReducer } from './services/logo/reducers/register-logo-command.reducer';
import { RegisterNativeCommandReducer } from './services/logo/reducers/register-native-command.reducer';

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
  providers: [LogoStore, LogoForwardReducer, RegisterNativeCommandReducer, ExecuteCommandReducer, LogoRightReducer, RegisterLogoCommandReducer],
  bootstrap: [AppComponent]
})
export class AppModule { }
