import {List, Map} from 'immutable';
import {RootStore} from './RootStore';

export function logStateChange(rootStore: RootStore, oldState: Map<string, any>, newState: Map<string, any>,
                               path: List<string>, actionName: string, reducerType: string): Map<string, any> {
  if (rootStore.logEvents) {
    // make the logging async and use the best function to minimize performance impact of logging
    let delayFn: Function = window.requestAnimationFrame || window.setImmediate || window.setTimeout;

    delayFn(() => {
      console.groupCollapsed(`Action: ${actionName}->${reducerType}, Path: ${path.join('/')}`);
      console.log('%c old state', `color: #9E9E9E; font-weight: bold`, oldState.toJS());
      console.log('%c new state', `color: #4CAF50; font-weight: bold`, newState.toJS());
      console.groupEnd();
    });
  }

  return newState;
}



export function timestampMiddleware(rootStore: RootStore, oldState: Map<string, any>, newState: Map<string, any>,
                              path: List<string>, actionName: string, reducerType: string): Map<string, any> {
  return newState.update('updatedAt', () => Date.now());
}
