# redux-o-actions

```(javascript)
import { withNiceActions, Action } from 'redux-o-actions';
import { createStore, applyMiddleware } from 'redux';

class MyAction extends Action {}

const reducer = (state = 'yyy', action) => {
  switch(action.type) {
    case MyAction:
      return action.payload.xxx;
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware(withNiceActions)
);

store.dispatch(new MyAction({ xxx: 'xxx' }));
```

See code for all available options
