import {BehaviorSubject, Observable} from 'rxjs';
import {Map, List, fromJS} from 'immutable';
import * as transit from 'transit-immutable-js';

import {Store, IStore} from './Store';
import {Actions, IActions} from './Actions';

export interface IRegisterInstance {
  store: Store;
  actions: Actions;
};

export interface IPreMiddleware {
  (action: Function, className: string, actionName: string, context: Actions, args: Array<any>): Function;
}

export interface IPostMiddleware {
  (rootStore: RootStore, oldState: Map<string, any>, newState: Map<string, any>, path: List<string>, actionName: string,
    reducerType: string): Map<string, any>;
}

export function getStateObservable(store: Store, path: List<string> | string): Observable<any> {
  return store.state.map(() => {
    return store.getState(path);
  });
}

export class RootStore extends BehaviorSubject<Map<string, any>> {

  public logEvents: boolean = false;
  private stores: Map<any, any> = Map().asMutable();
  private actions: Map<any, any> = Map().asMutable();
  private preMiddlewares: Array<Function> = [];
  private postMiddlewares: Array<Function> = [];

  constructor(initialState: Map<string, any> = Map({})) {
    super(initialState);
  }

  get state(): Map<string, any> {
    return this.getValue();
  }

  register(path: Array<string> | List<string>, storeClass: IStore, actionsClass: IActions): IRegisterInstance {
    path = List.isList(path) ? path : fromJS(path);

    let keyPath: string = path.join('/');
    let actions: Actions = new actionsClass(this);
    let store: Store = new storeClass(this, path, actions);

    this.stores.set(keyPath, store);
    this.actions.set(keyPath, actions);
    this.setState(path, store.initialState());

    return {
      store,
      actions
    };
  }

  getStore(path: Array<string> | List<string>): any {
    return this.stores.get(path.join('/'));
  }

  getActions(path: Array<string> | List<string>): any {
    return this.actions.get(path.join('/'));
  }

  getState(path: List<string> = List([])): Map<string, any> {
    return this.state.getIn(path);
  }

  setState(path: Array<string> | List<string>, newState: Map<string, any>, emit: boolean = true): void {
    if (!newState) {
      throw new Error('newState not set! Please ALWAYS return a state object from reducer!');
    }

    let currentState: any = this.getValue();
    let keyPath: string = path.join('/');

    this.next(currentState.setIn(path, newState));

    if (emit) {
      this.stores
        .filter((store: Store, key: string): boolean => keyPath.startsWith(key))
        .forEach(store => store.emit());
    }
  }

  reduceState(path: List<string>, reducer: Function, actionName: string, reducerType: string, value?: any): void {
    let oldState: any = this.getState(path);
    let newState: any = reducer(this.getState(path), value);

    newState = this.postMiddlewares.reduce((state, middleware) => {
      return middleware(this, oldState, state, path, actionName, reducerType);
    }, newState);

    this.setState(path, newState);
  }

  addPreMiddleware(middleware: IPreMiddleware): void {
    this.preMiddlewares.push(middleware);
  }

  addPostMiddleware(middleware: IPostMiddleware): void {
    this.postMiddlewares.push(middleware);
  }

  dumpState(): void {
    let state: string = transit.toJSON(this.getValue());
    localStorage.setItem('rootStore', state);
  }

  loadState(): void {
    let state: any = transit.fromJSON(localStorage.getItem('rootStore'));
    this.next(state);
    this.stores.forEach(store => store.emit());
  }
}
