import {JokesList} from './jokesList/JokesList';
import {setHttp} from './utils/http';
import {Component, ChangeDetectorRef} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Observable} from 'rxjs';

import {RootStore} from './base/RootStore';
import {logStateChangePostMiddleware} from './base/middleware';
import {timestampPostMiddleware} from './base/middleware';
import {logActionPreMiddleware} from './base/middleware';

import {FooStore} from './backend/foo/FooStore';
import {FooActions} from './backend/foo/FooActions';

@Component({
    selector: 'app',
    template: `
      <h1>The Number App</h1>
      <p>The Number: {{ value | async }}</p>
      <button (click)="updateNumber()">click me</button>

      <jokes-list number-of-jokes="10"></jokes-list>
    `,
    providers: [
      RootStore,
      Http,
      HTTP_PROVIDERS
    ],
    directives: [
      JokesList
    ]
})
export class App {
  fooStore: FooStore;
  fooActions: FooActions;
  value: Observable<number | string>;

  constructor(private rootStore: RootStore, private cd: ChangeDetectorRef, private http: Http) {
    rootStore.logEvents = true;

    this.rootStore.addPreMiddleware(logActionPreMiddleware);
    this.rootStore.addPostMiddleware(timestampPostMiddleware);
    this.rootStore.addPostMiddleware(logStateChangePostMiddleware);

    // angular service setup
    setHttp(http);
  }

  ngOnInit(): void {
    let numberPath: Array<string> = ['the', 'number'];
    this.rootStore.register(numberPath, FooStore, FooActions);
    this.fooStore = this.rootStore.getStore(numberPath);
    this.fooActions = this.rootStore.getActions(numberPath);
    this.value = this.fooStore.theValue;
  }

  updateNumber(): void {
    this.fooActions.newTest(parseInt(String(Math.random() * 100)));
  }

}
