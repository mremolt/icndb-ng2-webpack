import {RootStore} from './RootStore';
import {Map, List, fromJS} from 'immutable';
import {BehaviorSubject, Observable} from 'rxjs';

export interface IStore {
  new(rootStore: RootStore, path: Array<string> | List<string>, actions?: any): Store;
}

export interface IReducerFunction {
  (currentState: Map<string, any>, data: any): Map<string, any>;
}

export class Store extends BehaviorSubject<Map<string, any>> {

  private path: List<string>;

  constructor(private rootStore: RootStore, path: Array<string> | List<string>, public actions?: any) {
    super(Map({}));
    this.path = List.isList(path) ? path : fromJS(path);
    this.init();
  }

  get state(): Observable<Map<string, any>> {
    return this;
  }

  initialState(): Map<string, any> {
    return Map({});
  }

  init(): void {
    // overwrite in subclass
  }

  emit(): void {
    this.next(this.getState());
  }

  getState(path: Array<string> | List<string> | string = List([])): any {
    let newPath: List<string>;
    if (typeof path === 'string') {
      newPath = List([path]);
    } else {
      newPath = fromJS(path);
    }
    return this.rootStore.state.getIn(this.path.concat(newPath));
  }

  register(actions: any, actionName: string, startReducer: IReducerFunction, nextReducer: IReducerFunction,
           completeReducer?: IReducerFunction, errorReducer?: IReducerFunction): void {
    actions.register(actionName, this.path, startReducer, nextReducer, completeReducer, errorReducer);
  }
}
