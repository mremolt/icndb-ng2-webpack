/// <reference path="../typings/browser.d.ts" />
import 'core-js/shim';
import {Subscription} from 'rxjs';

import {RootStore} from './app/base/RootStore';
import {FooActions} from './app/backend/foo/FooActions';
import {FooStore} from './app/backend/foo/FooStore';


let store: RootStore = new RootStore();
// window['rootStore'] = store;
let samplePath: Array<string> = ['foo', '42'];

store.register(samplePath, FooStore, FooActions);
// let s1: FooStore = store.getStore(samplePath);
let a1: FooActions = store.getActions(samplePath);

store.register(['foo', '42', 'bar', 'baz'], FooStore, FooActions);
store.register(['foo', '44', 'bar', 'baz'], FooStore, FooActions);

let subscription: Subscription = a1.newTest(12);
// a bit too late ;)
setTimeout(() => {
  subscription.unsubscribe();
}, 1001);
