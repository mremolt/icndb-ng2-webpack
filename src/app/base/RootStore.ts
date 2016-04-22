import {BehaviorSubject} from 'rxjs';
import {Map} from 'immutable';

export class RootStore extends BehaviorSubject<Map<string, any>> {

  constructor(initialState: Map<string, any> = Map({})) {
    super(initialState);
  }

}
