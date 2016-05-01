import {Subscription, Observable} from 'rxjs';

export class BaseComponent {

  subscriptions: Array<Subscription> = [];

  ngOnDestroy(): void {
    this.cleanup();
  }

  bindChange(observables: Array<Observable<any>> | Observable<any>, callback: Function): void {
    let allObservables: Array<any> = Array.isArray(observables) ? observables : [observables];

    let masterObservable: Observable<any> = Observable
      .merge(...allObservables)
      .debounceTime(1); // prevent multiple firing of callbacks

    this.subscriptions.push(masterObservable.subscribe(callback.bind(this)));
  }

  cleanup(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe);
  }
}
