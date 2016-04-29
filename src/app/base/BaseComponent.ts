import {Subscription, Observable} from 'rxjs';

export class BaseComponent {

  subscriptions: Array<Subscription> = [];

  ngOnDestroy(): void {
    this.cleanup();
  }

  bindChange(observables: Array<Observable<any>> | Observable<any>, callback: Function): void {
    let allObservables: Array<any> = Array.isArray(observables) ? observables : [observables];

    allObservables.forEach(observable => {
      this.subscriptions.push(observable.subscribe(callback.bind(this)));
    });
  }

  cleanup(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe);
  }
}
