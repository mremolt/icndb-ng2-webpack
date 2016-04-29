import {Component, Input} from 'angular2/core';
import {autobind} from 'core-decorators';
import {BaseComponent} from './../base/BaseComponent';
import {RootStore} from './../base/RootStore';
import {JokesActions} from './../backend/jokes/JokesActions';
import {JokesStore} from './../backend/jokes/JokesStore';

@Component({
  selector: 'jokes-list',
  template: require('./JokesList.tpl.html')
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

    this.bindChange(this.jokesStore.loading, this.setState);
  }

  loadJokes(): void {
    this.jokesActions.fetch(this.numberOfJokes);
  }

  setState(): void {
    this.loading = this.jokesStore.getState('loading');
  }

}
