import {Actions, action} from './../../base/Actions';

export class FooActions extends Actions {

  @action
  newTest(value: number): any {
    // three possible returns: pure value, Observable or throw Error
    // return Observable.of(result, result + 2);
    // throw new Error('DESTRUCTION');
    // return result;
    return value + 7;
  }
}
