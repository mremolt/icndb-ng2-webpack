/// <reference path="../typings/browser.d.ts" />

import 'core-js/shim';
import {Map} from 'immutable';
import {RootStore} from './app/base/RootStore';

let store: RootStore = new RootStore();

store.next(Map({
  foo: 43
}));

console.log(store.getValue());
