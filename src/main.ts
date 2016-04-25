/// <reference path="../typings/browser.d.ts" />
import 'core-js/shim';
import {Map, List, fromJS} from 'immutable';

import {Observable} from 'rxjs';

import {RootStore} from './app/base/RootStore';
import {Store} from './app/base/Store';


class FooStore extends Store {

  init(): void {
    this.actions.register('newTest', this.onNewTest);
  }

  initialState(): any {
    return Map({
      test: 'value'
    });
  }

  onNewTest(currentState: Map<string, any>, value: number): Map<string, any> {
    return currentState.set('test', value * 2);
  }
}

class FooActions {

  private path: List<string>;
  private reducers: any = {};

  constructor(private rootStore: RootStore, path: Array<string> | List<string>) {
    this.path = List.isList(path) ? path : fromJS(path);
  }

  register(actionName: string, reducer: Function): void {
    if (!this.reducers[actionName]) {
      this.reducers[actionName] = [];
    }
    this.reducers[actionName].push(reducer);
  }

  newTest(value: any): void {
    let result: any = value + 7;
    let obs: Observable<any> = Observable.of(result);
    let reducers: Array<Function> = this.reducers.newTest || [];

    obs.subscribe((data: any) => {
      reducers.forEach(reducerFn => {
        this.rootStore.reduceState(this.path, reducerFn, result);
      });
    });
  }
}



let store: RootStore = new RootStore();
window['rootStore'] = store;

store.register(['foo', '42'], FooStore, FooActions);
let s1: FooStore = store.getStore(['foo', '42']);
let a1: FooActions = store.getActions(['foo', '42']);

s1.subscribe((value) => {
  console.log('new State on s1', value.toJS());
});

store.register(['foo', '42', 'bar', 'baz'], FooStore, FooActions);
store.register(['foo', '44', 'bar', 'baz'], FooStore, FooActions);

a1.newTest(12);

// store.reduceState(List(['foo', '42']), s1.onNewTest, 33);


console.log(store.getValue().toJS(), s1.getState().toJS());
