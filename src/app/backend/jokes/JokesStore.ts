import {Observable} from 'rxjs';
import {List, Map, fromJS} from 'immutable';
import {getStateObservable} from './../../base/RootStore';
import {Store} from './../../base/Store';

export class JokesStore extends Store {

  loading: Observable<boolean>;
  jokes: Observable<List<Map<string, any>>>;

  init(): void {
    this.loading = getStateObservable(this, 'loading');
    this.jokes = getStateObservable(this, 'jokes');

    this.register(this.actions, 'fetch', this.onFetchStart, this.onFetchNext);
  }

  initialState(): Map<string, any> {
    return fromJS({
      error: null,
      loading: false,
      jokes: []
    });
  }

  onFetchStart(currentState: Map<string, any>): Map<string, any> {
    return currentState.set('loading', true);
  }

  onFetchNext(currentState: Map<string, any>, jokes: List<any>): Map<string, any> {
    return currentState.withMutations(state => {
      state
        .set('loading', false)
        .set('jokes', fromJS(jokes));
    });
  }

}
