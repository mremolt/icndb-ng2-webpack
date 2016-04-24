import {RootStore} from './RootStore';
import {Map, List, fromJS} from 'immutable';
import {Subject} from 'rxjs';

export interface IStore {
  new(rootStore: RootStore, path: Array<string> | List<string>, actions?: any): Store;
}

export class Store extends Subject<Map<string, any>> {

  private path: List<string>;

  constructor(private rootStore: RootStore, path: Array<string> | List<string>, public actions?: any) {
    super();
    this.path = List.isList(path) ? path : fromJS(path);
    this.init();
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

  getState(path: Array<string> | List<string> = List([])): any {
    path = List.isList(path) ? path : fromJS(path);
    return this.rootStore.state.getIn(this.path.concat(path));
  }
}
