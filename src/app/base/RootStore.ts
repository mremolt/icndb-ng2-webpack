import {BehaviorSubject} from 'rxjs';
import {Map, List, fromJS} from 'immutable';

import {Store, IStore} from './Store';
import {Actions, IActions} from './Actions';


export class RootStore extends BehaviorSubject<Map<string, any>> {

  private stores: Map<any, any> = Map().asMutable();
  private actions: Map<any, any> = Map().asMutable();

  constructor(initialState: Map<string, any> = Map({})) {
    super(initialState);
  }

  get state(): Map<string, any> {
    return this.getValue();
  }

  register(path: Array<string> | List<string>, storeClass: IStore, actionsClass: IActions): void {
    path = List.isList(path) ? path : fromJS(path);

    let keyPath: string = path.join('/');
    let actions: Actions = new actionsClass(this);
    let store: Store = new storeClass(this, path, actions);

    this.stores.set(keyPath, store);
    this.actions.set(keyPath, actions);
    this.setState(path, store.initialState());
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
    this.next(currentState.setIn(path, newState));
    let keyPath: string = path.join('/');

    if (emit) {
      this.stores
        .filter((store: Store, key: string): boolean => keyPath.startsWith(key))
        .forEach(store => store.emit());
    }
  }

  reduceState(path: List<string>, reducer: Function, actionName: string, reducerType: string, value?: any): void {
    let oldState: any = this.getState(path).toJS();
    this.setState(path, reducer(this.getState(path), value));

    // minimize performance impact of logging
    window.requestAnimationFrame(() => {
      console.groupCollapsed(`Action: ${actionName}->${reducerType}, Path: ${path.join('/')}`);
      console.log('%c old state', `color: #9E9E9E; font-weight: bold`, oldState);
      console.log('%c new state', `color: #4CAF50; font-weight: bold`, this.getState(path).toJS());
      console.groupEnd();
    });
  }

}
