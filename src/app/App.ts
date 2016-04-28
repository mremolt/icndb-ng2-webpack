import {FooStore} from './backend/foo/FooStore';
import {FooActions} from './backend/foo/FooActions';
import {RootStore} from './base/RootStore';
import {Component} from 'angular2/core';
import {Observable} from 'rxjs';

@Component({
    selector: 'app',
    template: `
      <h1>My First Angular 2 App</h1>
      <p>The Number: {{ value | async }}</p>
    `,
    providers: [RootStore]
})
export class App {

  fooStore: FooStore;
  fooActions: FooActions;
  value: Observable<string | number>;

  constructor(private rootStore: RootStore) {
    let numberPath: Array<string> = ['the', 'number'];
    rootStore.register(numberPath, FooStore, FooActions);

    this.fooStore = this.rootStore.getStore(numberPath);
    this.fooActions = this.rootStore.getActions(numberPath);
    this.value = this.fooStore.value;
    window['fooActions'] = this.fooActions;
    window['rootStore'] = this.rootStore;

    this.fooActions.newTest(12);
  }

}
