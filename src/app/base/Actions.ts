import {RootStore} from './RootStore';
import {List} from 'immutable';
import {Observable, Subscription} from 'rxjs';


export function action(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {

  let fn: Function = descriptor.value;

  descriptor.value = function(...args: Array<any>): Subscription {
    let reducers: Array<any> = this.reducers.newTest || [];
    let obs: Observable<any>;

    // start
    reducers.forEach(reducer => {
      this.rootStore.reduceState(reducer.path, reducer.startReducer, key, 'start');
    });

    try {
      obs = fn.apply(this, args);
      if (!(obs instanceof Observable)) {
        obs = Observable.of(obs);
      }
    } catch (error) {
      obs = Observable.throw(error);
    }

    // next, error, complete
    return obs.subscribe(
      (data: any) => {
        reducers.forEach(reducer => {
          this.rootStore.reduceState(reducer.path, reducer.nextReducer, key, 'next', data);
        });
      },
      (error: any) => {
        reducers.forEach(reducer => {
          this.rootStore.reduceState(reducer.path, reducer.errorReducer, key, 'error', error);
        });
      },
      () => {
        reducers.forEach(reducer => {
          this.rootStore.reduceState(reducer.path, reducer.completeReducer, key, 'complete');
        });
      }
    );
  };

  return descriptor;
}

export interface IActions {
  new(rootStore: RootStore): Actions;
}

export class Actions {

  private reducers: any = {};

  constructor(private rootStore: RootStore) {}


  register(actionName: string, path: Array<string> | List<string>, startReducer: Function,
           nextReducer: Function, completeReducer: Function, errorReducer: Function): void {
    if (!this.reducers[actionName]) {
      this.reducers[actionName] = [];
    }

    this.reducers[actionName].push({
      startReducer,
      nextReducer,
      completeReducer,
      errorReducer,
      path
    });
  }
}
