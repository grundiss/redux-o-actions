import { combineReducers as reduxCombineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

export const withNiceActions = store => next => action => {
  let newAction = {};

  if(action[Action.IS_NICE_ACTION]) {
    newAction = {
      type: action.type,
      payload: action.payload,
      instance: action
    };
  } else {
    newAction = action;
  }

  return next(newAction);
};

export class Action {
  static IS_NICE_ACTION = Symbol();

  constructor(o) {
    this[Action.IS_NICE_ACTION] = Action.IS_NICE_ACTION;

    this.type = this.constructor;
    this.instance = this;
    this.payload = this.create(o);
  }

  create(o) {
    return o;
  }
}

export const NamedAction = name => class NamedAction extends Action {
  static toString = () => name;
};

export class AsyncAction extends Action {
  constructor(o) {
    super(o);

    return (dispatch, getState) => {
      this.dispatch(dispatch, getState);
    };
  }

  dispatch(dispatch, getState) {
    throw new Error('not implemented!');
  }
}

export const withSideEffect = fn => class WithSideEffect extends AsyncAction {
  dispatch(dispatch, getState) {
    dispatch(this);

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