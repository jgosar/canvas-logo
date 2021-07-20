import type {OnDestroy, OnInit} from '@angular/core';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {distinctUntilChanged, map, takeUntil, tap} from 'rxjs/operators';
import {LogoStore} from 'src/app/services/logo/logo.store';
import type {Line} from 'src/app/types/geometry/line';

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

    constructor(public store: LogoStore) {}

    ngOnInit(): void {
        this.subscribeToStateUpdates();
    }

    ngOnDestroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }

    executeCommand() {
        this.store.executeCommand(this.currentCommand);
        this.currentCommand = '';
    }

    printOutput(text: string, style: null | 'red' | 'bold' = null) {
        this.output += text; // TODO!
    }

    private subscribeToStateUpdates() {
        this.createCommandTextUpdater$().pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }

    private createCommandTextUpdater$(): Observable<string> {
        return this.store.state$.pipe(
            map(state => (state.historyPointer < state.history.length ? state.history[state.historyPointer] : '')),
            distinctUntilChanged(),
            tap(commandText => (this.currentCommand = commandText))
        );
    }
}
