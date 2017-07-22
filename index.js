'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineReducerSymbols = exports.ReducerSymbol = exports.Action = exports.withOActions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _reduceReducers = require('reduce-reducers');

var _reduceReducers2 = _interopRequireDefault(_reduceReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var withOActions = exports.withOActions = function withOActions(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (action[Action.IS_O_ACTION] === Action.IS_O_ACTION) {
        var result = next({
          type: action.type,
          payload: action.payload,
          instance: action
        });

        if (typeof action.dispatch === 'function') {
          action.dispatch(dispatch, getState);
        }

        return result;
      } else {
        return next(action);
      }
    };
  };
};

var Action = exports.Action = function () {
  function Action(o) {
    _classCallCheck(this, Action);

    this.type = this.constructor;
    this.instance = this;
    this.payload = this.create(o);

    this[Action.IS_O_ACTION] = Action.IS_O_ACTION;
  }

  _createClass(Action, [{
    key: 'create',
    value: function create(o) {
      return o;
    }
  }]);

  return Action;
}();

Action.IS_O_ACTION = Symbol();


var createReducer = function createReducer(defaultValue, methodToRun) {
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (state) {
    return state;
  };
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultValue;
    var action = arguments[1];

    if (action.instance && action.instance[Action.IS_O_ACTION] === Action.IS_O_ACTION && typeof action.instance[methodToRun] === 'function') {
      return action.instance[methodToRun](state);
    } else return fallback(state, action);
  };
};

var ReducerSymbol = exports.ReducerSymbol = function () {
  function ReducerSymbol(defaultValue) {
    var fallBackReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {
      return state;
    };

    _classCallCheck(this, ReducerSymbol);

    this.defaultValue = defaultValue;
    this.fallBackReducer = fallBackReducer;
    this.__symbol = ReducerSymbol.createUniqMethodName();
  }

  _createClass(ReducerSymbol, [{
    key: 'asReducer',
    value: function asReducer() {
      return createReducer(this.defaultValue, this.__symbol, this.fallBackReducer);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.__symbol;
    }
  }]);

  return ReducerSymbol;
}();

ReducerSymbol._counter = 1;

ReducerSymbol.createUniqMethodName = function () {
  return '_REDUCE_' + ReducerSymbol._counter++ + '_' + +new Date();
};

var combineReducerSymbols = exports.combineReducerSymbols = function combineReducerSymbols(o) {
  var rootReducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {
    return state;
  };
  return (0, _reduceReducers2.default)((0, _redux.combineReducers)(Object.entries(o).reduce(function (accumulated, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        name = _ref3[0],
        reducerSymbol = _ref3[1];

    return _extends({}, accumulated, _defineProperty({}, name, typeof reducerSymbol === 'function' ? reducerSymbol : reducerSymbol.asReducer()));
  }, {})), 'asReducer' in rootReducer ? rootReducer.asReducer() : rootReducer);
};
