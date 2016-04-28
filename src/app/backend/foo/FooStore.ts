import {Map} from 'immutable';
import {Observable} from 'rxjs';

import {getStateObservable} from './../../base/RootStore';
import {Store} from './../../base/Store';


export class FooStore extends Store {
  value: Observable<string|number>;
  loading: Observable<string|number>;

  init(): void {
    this.value = getStateObservable(this, 'test');
    this.loading = getStateObservable(this, 'loading');

    this.register(this.actions, 'newTest',
      this.onTestStart, this.onTestNext);
  }

  initialState(): any {
    return Map({ test: 0 });
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
