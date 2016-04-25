import {Map} from 'immutable';
import {Observable} from 'rxjs';

import {getStateObservable} from './../../base/RootStore';
import {Store} from './../../base/Store';


export class FooStore extends Store {

  init(): void {
    this.register(this.actions, 'newTest',
      this.onTestStart, this.onTestNext, this.onTestComplete, this.onTestError);
  }

  initialState(): any {
    return Map({
      test: 'value'
    });
  }

  // an attribute getter as obervable, works really well with angular2 "async" pipe
  get loading(): Observable<boolean> {
    return getStateObservable(this, 'loading');
  }

  get value(): Observable<string|number> {
    return getStateObservable(this, 'test');
  }

  onTestStart(currentState: Map<string, any>): Map<string, any> {
    return currentState.set('loading', true);
  }

  onTestNext(currentState: Map<string, any>, value: any): Map<string, any> {
    return currentState
      .set('test', value * 2);
  }

  onTestComplete(currentState: Map<string, any>): Map<string, any> {
    return currentState
      .set('loading', false);
  }

  onTestError(currentState: Map<string, any>, error: Error): Map<string, any> {
    console.error('ARGH!!!!!!', error);
    return currentState;
  }
}
