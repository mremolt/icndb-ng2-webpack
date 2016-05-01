import {Joke} from './../joke/Joke';
import {Component, Input} from 'angular2/core';
import {BaseComponent} from './../base/BaseComponent';
import {RootStore} from './../base/RootStore';
import {JokesActions} from './../backend/jokes/JokesActions';
import {JokesStore} from './../backend/jokes/JokesStore';

@Component({
  selector: 'jokes-list',
  template: require('./JokesList.tpl.html'),
  directives: [Joke]
})
export class JokesList extends BaseComponent {

  @Input('number-of-jokes') numberOfJokes: number;

  path: Array<string> = ['jokes', 'list'];
  jokesStore: JokesStore;
  jokesActions: JokesActions;
  loading: boolean = false;

  constructor(private rootStore: RootStore) {
    super();
  }

  ngOnInit(): void {
    this.rootStore.register(this.path, JokesStore, JokesActions);
    this.jokesActions = this.rootStore.getActions(this.path);
    this.jokesStore = this.rootStore.getStore(this.path);
    this.setState();
  }

  ngAfterViewInit(): void {
    this.bindChange([
      this.jokesStore,
      this.jokesStore.loading,
      this.jokesStore.jokes
    ], this.setState);
  }

  loadJokes(): void {
    this.jokesActions.fetch(this.numberOfJokes);
  }

  setState(): void {
    this.loading = this.jokesStore.getState('loading');

    if ( (this.jokesStore.getState('jokes').size === 0) && (!this.loading) ) {
      this.loadJokes();
    }
  }

  updateNumberOfJokes(num: number): void {
    this.numberOfJokes = num;
  }

}
