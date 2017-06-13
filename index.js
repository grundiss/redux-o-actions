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
    this.payload = this.create(o);

    if(!this.constructor.__statisticsTracker) {
      this.constructor.__statisticsTracker = new Map();
    }
    this.statistics();
    this._statisticsOnce();
  }

  create(o) {
    return o;
  }

  statistics() {}
  statisticsOncePerLifetime() {}
  statisticsOncePerPayload() {}

  _statisticsOnce() {
    if(!this.constructor.__statisticsTracker.has(this.constructor)) {
      this.statisticsOncePerLifetime();

      this.constructor.__statisticsTracker.set(this.constructor, 1);
    }

    if(!this.constructor.__statisticsTracker.has(JSON.stringify(this.payload))) {
      this.statisticsOncePerPayload();

      this.constructor.__statisticsTracker.set(this.payload || Object, 1);
    }
  }
}

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

