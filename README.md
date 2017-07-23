# redux-o-actions
## The idea
Instead of redux 'classical' smart reducers and dummy action makers have smart actions and relaying on them reducer symbols.
## Example
```js
import { createStore, applyMiddleware } from 'redux';
import { Action, withOActions, ReducerSymbol, combineReducerSymbols } from 'redux-o-actions';

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

console.log(store.getState()); // { one: 1, two: 2, three: 3 }

store.dispatch(new AddOne());
console.log(store.getState()); // { one: 2, two: 3, three: 4 }

store.dispatch(new AddNumberToTwo({n: 100}));
console.log(store.getState()); // { one: 2, two: 103, three: 4 }

store.dispatch(new MultiplyAndAssignToOne());
console.log(store.getState()); // { one: 824, two: 103, three: 4 }

```

# API
## Action
`Action` is an abstract class, the basis of other actions. Its constructor takes care of proxying its arguments to the payload
```js
class FooAction extends Action {}

const foo = new FooAction({bar: 'buz'});
console.log(foo.payload.bar); // 'buz'
```
### Action#create(o)
Hook for constructing payload, should return payload (typically an object)
```js
class Greeting extends Action {
  create(o) {
    return {
      phrase: `Hello ${o.name}!`
    }
  }
}

const greeting = new Greeting({name: 'world'});
console.log(greeting.payload.phrase); // 'Hello world!'
```
Defaults to `o => o`
### Action#dispatch(dispatch, getState)
If this method exists in the action, it will be called with arguments `dispatch` and `getState` which represent redux store methods. Usefull for async methods. Can be async itself.
```js
class MyAsyncAction extends Action {
  async dispatch(dispatch, getState) {
    const data = await getchDataFromDB(getState().keyToFetchDataFor);
    dispatch({type: 'my-app/DATA_ARRIVED', payload: data});
    // or even better
    // dispatch(new DataArrivedAction({ data }));
  }
} 
```

## withOActions()
Middleware that converts object-oriented actions intp plain objects that redux insists on. Runs ReducerSymbol-methods (see below) in the dispatched action and then runs `dispatch` method.

## ReducerSymbol(defaultValue, fallbackReducer = (state, action) => state)
The symbol which represetns reducer. Can be used as a method name.
The main usage of the symbal is to name reducer methods in your actions
```js
const collection = new ReducerSymbol([]);

class AddToCollection extends Action {
  [collection](state) {
    return [...state, this.payload.object];
  }
}

// ...
store.dispatch(new AddToCollection({object: {foo: 'bar'}}));
```
### defaultValue
Default value of a peace of redux state.
### fallbackReducer
Function that runs in case tha dispatched action doesn't have method to reduce this symbol. Use it in case you want to deal with 'old-fashioned' reducers
```js
const variable = new ReducerSymbol('initial value', (state, action) => {
  switch(action.type) {
    case 'OLD_FASHIONED_ACTION':
      return 'such redux very pure much wow';
    default:
      return state;
  }
});
```
### ReducerSymbol#asReducer()
Converts reducer symbol into reducer function. Hopefully you will never need to call it directly.

## combineReducerSymbols(object, rootReducer = (state, action) => state)
It's wrapper over `redux#combineReducers` that takes care of calling `#asReducer` on your symbols. Returns function. Consider these two peaces of code the same:
```js
const foo = new ReducerSymbol('foo');
const bar = new ReducerSymbol('bar');

// with combineReducerSymbols
const reducer = combineReducerSymbols({
  foo,
  bar
});

// without combineReducerSymbols
const reducer = combineReducers({
  foo: foo.asReducer(),
  bar: bar.asReducer()
});
```
Of cause besides `ReducerSymbol`s you can use functions, which makes those reducers nestable.
```js
const foo = new ReducerSymbol('foo');
const bar = new ReducerSymbol('bar');
const buz = new ReducerSymbol('buz');

const reducer = combineReducerSymbols({
  foo,
  qoox: combineReducerSymbols({
    bar,
    baz
  })
});
```
### rootReducer
After your combined reducer changes your store state slice-by-slice you might want to reduce it one more time having all the slices together. Use `rootReducer` for that. 
`rootReducer` can be reducer function or a ReducerSymbol (`asReducer` method will be called for you automatically).

# Using alone with other tools
Since the type of dispatched action is no longer a string (it's an Action class instead), it may break the behavior of some tools.

## [redux-logger](https://github.com/evgenyrodionov/redux-logger)
Make sure your class is convertable to String
```js
class MyAction extends Action {
  static toString() {
    return 'MyAction';
  }
  // ...
}
```

## [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
Important trick here is to use `withOActions` middleware first!
```js
import { createStore, applyMiddleware, compose } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { withOActions } from 'redux-o-actions';
import { reducer, otherMiddleware1, otherMiddleware2 } from './my/app';

const enhancers = [applyMiddleware(withOActions)]; // important! make sure it's first enhancer
if(process.env.NODE_ENV !== 'production') {
  enhancers.push(devToolsEnhancer({
    serialize: true // important! see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize for details
  }))
}
enhancers.push(applyMiddleware(otherMiddleware1, otherMiddleware2));

const store = createStore(reducer, /* preloadedState, */, compose(...enhancers));
```
