import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CanvasLogoComponent} from './components/canvas-logo/canvas-logo.component';
import {ZoomableCanvasComponent} from './components/zoomable-canvas/zoomable-canvas.component';
import {LogoStore} from './services/logo/logo.store';
import {ExecuteCommandReducer} from './services/logo/reducers/execute-command.reducer';
import {LogoForwardReducer} from './services/logo/reducers/logo-forward.reducer';
import {LogoMakeReducer} from './services/logo/reducers/logo-make.reducer';
import {LogoPenDownReducer} from './services/logo/reducers/logo-pen-down.reducer';
import {LogoPenUpReducer} from './services/logo/reducers/logo-pen-up.reducer';
import {LogoRepeatReducer} from './services/logo/reducers/logo-repeat.reducer';
import {LogoRightReducer} from './services/logo/reducers/logo-right.reducer';
import {LogoToReducer} from './services/logo/reducers/logo-to.reducer';
import {ModifyHistoryPointerReducer} from './services/logo/reducers/modify-history-pointer.reducer';
import {RegisterCommandReducer} from './services/logo/reducers/register-command.reducer';

@NgModule({
    declarations: [AppComponent, ZoomableCanvasComponent, CanvasLogoComponent],
    imports: [BrowserModule, FormsModule],
    providers: [
        LogoStore,
        LogoForwardReducer,
        RegisterCommandReducer,
        ExecuteCommandReducer,
        LogoRightReducer,
        LogoRepeatReducer,
        LogoPenUpReducer,
        LogoPenDownReducer,
        LogoToReducer,
        LogoMakeReducer,
        ModifyHistoryPointerReducer,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
