import {Map} from 'immutable';
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

  onTestStart(currentState: Map<string, any>): Map<string, any> {
    console.log('onTestStart');
    return currentState.set('loading', true);
  }

  onTestNext(currentState: Map<string, any>, value: any): Map<string, any> {
    console.log('onTestNext');
    return currentState
      .set('test', value * 2);
  }

  onTestComplete(currentState: Map<string, any>): Map<string, any> {
    console.log('onTestComplete');
    return currentState
      .set('loading', false);
  }

  onTestError(currentState: Map<string, any>, error: Error): Map<string, any> {
    console.error('ARGH!!!!!!', error);
    return currentState;
  }
}
