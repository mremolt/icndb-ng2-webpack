import {Component, ChangeDetectorRef} from 'angular2/core';
import {Observable} from 'rxjs';

import {RootStore} from './base/RootStore';
import {logStateChangePostMiddleware} from './base/middleware';
import {timestampPostMiddleware} from './base/middleware';
// import {logActionPreMiddleware} from './base/middleware';

import {FooStore} from './backend/foo/FooStore';
import {FooActions} from './backend/foo/FooActions';

@Component({
    selector: 'app',
    template: `
      <h1>The Number App</h1>
      <p>The Number: {{ value | async }}</p>
      <button (click)="updateNumber()">click me</button>
    `,
    providers: [RootStore]
})
export class App {
  fooStore: FooStore;
  fooActions: FooActions;
  value: Observable<number | string>;

  constructor(private rootStore: RootStore, private cd: ChangeDetectorRef) {
    rootStore.logEvents = true;
    // TODO: buggy, fix it
    // this.rootStore.addPreMiddleware(logActionPreMiddleware);
    this.rootStore.addPostMiddleware(timestampPostMiddleware);
    this.rootStore.addPostMiddleware(logStateChangePostMiddleware);
  }

  ngOnInit(): void {
    let numberPath: Array<string> = ['the', 'number'];
    this.rootStore.register(numberPath, FooStore, FooActions);
    this.fooStore = this.rootStore.getStore(numberPath);
    this.fooActions = this.rootStore.getActions(numberPath);
    this.value = this.fooStore.value;
  }

  ngAfterViewInit(): void {
    // TODO: Remove workaround, change Store to BehaviorSubject to allow initial state for async pipe
    this.fooStore.emit();
  }

  updateNumber(): void {
    this.fooActions.newTest(parseInt(String(Math.random() * 100)));
  }

}
