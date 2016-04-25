/// <reference path="../typings/browser.d.ts" />
import 'core-js/shim';
import {Subscription} from 'rxjs';

import {RootStore} from './app/base/RootStore';
import {FooActions} from './app/backend/foo/FooActions';
import {FooStore} from './app/backend/foo/FooStore';


let rootStore: RootStore = new RootStore();
// log all state changes
rootStore.logEvents = true;
// window['rootStore'] = rootStore;

let samplePath: Array<string> = ['foo', '42'];

rootStore.register(samplePath, FooStore, FooActions);
let s1: FooStore = rootStore.getStore(samplePath);
let a1: FooActions = rootStore.getActions(samplePath);

// see FooStore#loading for explanation
s1.loading.subscribe((value) => {
  console.log('loading', value);
});

// directly fetch the new store and action instances
let { store: s2, actions: a2 }: any = rootStore.register(['foo', '44', 'bar', 'baz'], FooStore, FooActions);

s2.loading.subscribe((value) => {
  console.log('loading s2', value);
});

a2.newTest(7);


// canceling an action
let subscription: Subscription = a1.newTest(12);
// a bit too late ;)
setTimeout(() => {
  subscription.unsubscribe();
}, 1001); // lower this number a bit and you can cancel the newTest action before the next and complete callbacks
