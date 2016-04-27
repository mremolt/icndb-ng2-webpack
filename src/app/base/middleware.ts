import {Actions} from './Actions';
import {List, Map} from 'immutable';
import {RootStore} from './RootStore';

// make the logging async and use the best function to minimize performance impact of logging
let delayFn: Function = window.requestAnimationFrame || window.setImmediate || window.setTimeout;


export function logActionPreMiddleware(actionFn: Function, className: string, actionName: string,
                                       context: Actions, ...args: Array<any>): Function {
  let result: any = actionFn.apply(context, args);
  delayFn(() => {
    console.groupCollapsed(`Action ${className}->${actionName} called`);
    console.log('args', ...args);
    console.log('result', result);
    console.groupEnd();
  });

  return function(): any {
    return result;
  };
}

export function logStateChangePostMiddleware(rootStore: RootStore, oldState: Map<string, any>, newState: Map<string, any>,
                                             path: List<string>, actionName: string, reducerType: string): Map<string, any> {
  if (rootStore.logEvents) {
    delayFn(() => {
      console.groupCollapsed(`Action: ${actionName}->${reducerType}, Path: ${path.join('/')}`);
      console.log('%c old state', `color: #9E9E9E; font-weight: bold`, oldState.toJS());
      console.log('%c new state', `color: #4CAF50; font-weight: bold`, newState.toJS());
      console.groupEnd();
    });
  }

  return newState;
}

export function timestampPostMiddleware(rootStore: RootStore, oldState: Map<string, any>, newState: Map<string, any>,
                                        path: List<string>, actionName: string, reducerType: string): Map<string, any> {
  return newState.update('updatedAt', () => Date.now());
}
