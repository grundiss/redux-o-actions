import { combineReducers as reduxCombineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

export const withNiceActions = ({ dispatch, getState }) => next => action => {
  if(action[Action.IS_NICE_ACTION] === Action.IS_NICE_ACTION) {
    const result = next({
      type: action.type,
      payload: action.payload,
      instance: action
    });

    if(action[AsyncAction.IS_NICE_ASYNC_ACTION] === AsyncAction.IS_NICE_ASYNC_ACTION) {
      action.dispatch(dispatch, getState);
    }

    return result;
  } else {
    return next(action);
  }
};

export class Action {
  static IS_NICE_ACTION = Symbol();

  constructor(o) {
    this.type = this.constructor;
    this.instance = this;
    this.payload = this.create(o);

    this[Action.IS_NICE_ACTION] = Action.IS_NICE_ACTION;
  }

  create(o) {
    return o;
  }
}

export const NamedAction = name => class NamedAction extends Action {
  static toString = () => name;
};

export class AsyncAction extends Action {
  static IS_NICE_ASYNC_ACTION = Symbol();

  constructor(o) {
    super(o);

    this[AsyncAction.IS_NICE_ASYNC_ACTION] = AsyncAction.IS_NICE_ASYNC_ACTION;
  }

  dispatch(dispatch, getState) {
    throw new Error('not implemented!');
  }
}

export const withSideEffect = fn => class WithSideEffect extends AsyncAction {
  dispatch(dispatch, getState) {
    fn(dispatch, getState);
  }
};

export const createReducer = (defaultValue, methodToRun, fallback = state => state) =>
  (state = defaultValue, action) => {
    if(
      action.instance &&
      action.instance[Action.IS_NICE_ACTION] === Action.IS_NICE_ACTION &&
      typeof action.instance[methodToRun] === 'function'
    ) {
      return action.instance[methodToRun](state);
    } else return fallback(state);
  };

export class ReducerSymbol {
  constructor(defaultValue, fallBackReducer = state => state) {
    this.defaultValue = defaultValue;
    this.fallBackReducer = fallBackReducer;
    this.__symbol = Symbol();
  }

  asReducer() {
    return createReducer(this.defaultValue, this.__symbol, this.fallBackReducer);
  }

  [Symbol.toPrimitive]() {
    return this.__symbol;
  }
}

export const combineReducers = (o, rootReducer = state => state) => reduceReducers(
  reduxCombineReducers(Object.entries(o).reduce(
    (accumulated, [name, reducerSymbol]) => ({
      ...accumulated,
      [name]: typeof reducerSymbol === 'function' ? reducerSymbol : reducerSymbol.asReducer()
    }),
    {}
  )),
  rootReducer
);
