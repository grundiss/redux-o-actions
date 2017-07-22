import { createStore, applyMiddleware } from 'redux';
import { Action, withOActions, ReducerSymbol, combineReducerSymbols } from '../index.js';

const one = new ReducerSymbol(1);
const two = new ReducerSymbol(2);
const three = new ReducerSymbol(3);
const root = new ReducerSymbol();

const reducer = combineReducerSymbols({
  one,
  two,
  three
}, root);

class AddOne extends Action {
  [one] = state => state + 1;
  [two] = state => state + 1;
  [three] = state => state + 1;
}

class AddNumberToTwo extends Action {
  [two] = state => state + this.payload.n;
}

class MultiplyAndAssignToOne extends Action {
  [root] = state => {
    const { one, two, three } = state;

    return {
      ...state,
      one: one * two * three
    };
  };
}

const store = createStore(reducer, applyMiddleware(withOActions));

console.log(store.getState());

store.dispatch(new AddOne());
console.log(store.getState());

store.dispatch(new AddNumberToTwo({n: 100}));
console.log(store.getState());

store.dispatch(new MultiplyAndAssignToOne());
console.log(store.getState());
