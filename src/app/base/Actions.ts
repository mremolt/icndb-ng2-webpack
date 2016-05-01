import {IReducerFunction} from './Store';
import {RootStore} from './RootStore';
import {List, fromJS} from 'immutable';
import {Observable, Subscription} from 'rxjs';


export function action(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  let actionFn: Function = descriptor.value;

  descriptor.value = function(...args: Array<any>): Subscription {
    let reducers: Array<any> = this.reducers[key] || [];
    let obs: Observable<any>;

    // preMiddlewares
    let fn: Function = this.rootStore.preMiddlewares.reduce((currentActionFn, middleware) => {
      return middleware(currentActionFn, target.constructor.name, key, this, ...args);
    }, actionFn);

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
          this.rootStore.reduceState(reducer.path, reducer.nextReducer, key, 'next', fromJS(data));
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

  register(actionName: string, path: Array<string> | List<string>, startReducer: IReducerFunction,
           nextReducer: IReducerFunction, completeReducer?: IReducerFunction, errorReducer?: IReducerFunction): void {
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
