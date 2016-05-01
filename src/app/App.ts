import {JokesList} from './jokesList/JokesList';
import {setHttp} from './utils/http';
import {Component, ChangeDetectorRef} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

import {RootStore} from './base/RootStore';
import {logStateChangePostMiddleware} from './base/middleware';
import {timestampPostMiddleware} from './base/middleware';
import {logActionPreMiddleware} from './base/middleware';

@Component({
    selector: 'app',
    template: `
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
  constructor(private rootStore: RootStore, private cd: ChangeDetectorRef, private http: Http) {
    rootStore.logEvents = true;

    this.rootStore.addPreMiddleware(logActionPreMiddleware);
    this.rootStore.addPostMiddleware(timestampPostMiddleware);
    this.rootStore.addPostMiddleware(logStateChangePostMiddleware);

    // angular service setup
    setHttp(http);
  }

}
