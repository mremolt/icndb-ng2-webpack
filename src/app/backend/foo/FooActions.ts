import {Observable} from 'rxjs';
import {Actions, action} from './../../base/Actions';


export class FooActions extends Actions {

  @action
  newTest(value: number): any {
    let result: any = value + 7;

    // three possible returns: pure value, Observable or throw Error
    // return Observable.of(result, result + 2);
    // throw new Error('DESTRUCTION');
    // return result;

    return Observable.of(result);
  }
}
