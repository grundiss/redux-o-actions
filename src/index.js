import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

export const withOActions = ({ dispatch, getState }) => next => action => {
  if(action[Action.IS_O_ACTION] === Action.IS_O_ACTION) {
    const result = next({
      type: action.type,
      payload: action.payload,
      instance: action
    });

    if(typeof action.dispatch === 'function') {
      action.dispatch(dispatch, getState);
    }

    return result;
  } else {
    return next(action);
  }
};

export class Action {
  static IS_O_ACTION = Symbol();

  constructor(o) {
    this.type = this.constructor;
    this.instance = this;
    this.payload = this.create(o);

    this[Action.IS_O_ACTION] = Action.IS_O_ACTION;
  }

  create(o) {
    return o;
  }
}

const createReducer = (defaultValue, methodToRun, fallback = state => state) =>
  (state = defaultValue, action) => {
    if(
      action.instance &&
      action.instance[Action.IS_O_ACTION] === Action.IS_O_ACTION &&
      typeof action.instance[methodToRun] === 'function'
    ) {
      return action.instance[methodToRun](state);
    } else return fallback(state, action);
  };

export class ReducerSymbol {
  static _counter = 1;
  static createUniqMethodName = () => {
    return `_REDUCE_${ReducerSymbol._counter++}_${+new Date()}`;
  };

  constructor(defaultValue, fallBackReducer = state => state) {
    this.defaultValue = defaultValue;
    this.fallBackReducer = fallBackReducer;
    this.__symbol = ReducerSymbol.createUniqMethodName();
  }

  asReducer() {
    return createReducer(this.defaultValue, this.__symbol, this.fallBackReducer);
  }

  toString() {
    return this.__symbol;
  }
}

export const combineReducerSymbols = (o, rootReducer = state => state) => reduceReducers(
  combineReducers(Object.entries(o).reduce(
    (accumulated, [name, reducerSymbol]) => ({
      ...accumulated,
      [name]: typeof reducerSymbol === 'function' ? reducerSymbol : reducerSymbol.asReducer()
    }),
    {}
  )),
  'asReducer' in rootReducer ? rootReducer.asReducer() : rootReducer
);
