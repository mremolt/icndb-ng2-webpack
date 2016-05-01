import {Response} from 'angular2/http';
import {Observable} from 'rxjs';
import {Actions, action} from './../../base/Actions';
import {http} from './../../utils/http';

export class JokesActions extends Actions {

  @action
  fetch(num: number = 5): Observable<any> {
    return http()
      .get(`http://api.icndb.com/jokes/random/${num}`)
      .map((response: Response) => {
        let body: any = response.json();
        return body.value || [];
      });
  }


}
