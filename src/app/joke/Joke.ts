import {Component, Input} from 'angular2/core';
import {Map} from 'immutable';
import {BaseComponent} from './../base/BaseComponent';

@Component({
  selector: 'joke',
  template: require('./Joke.tpl.html')
})
export class Joke extends BaseComponent {
  @Input() joke: Map<string, any>;
}
