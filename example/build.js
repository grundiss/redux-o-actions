'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _index = require('../index.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var one = new _index.ReducerSymbol(1);
var two = new _index.ReducerSymbol(2);
var three = new _index.ReducerSymbol(3);
var root = new _index.ReducerSymbol();

var reducer = (0, _index.combineReducerSymbols)({
  one: one,
  two: two,
  three: three
}, root);

var AddOne = function (_Action) {
  _inherits(AddOne, _Action);

  function AddOne() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AddOne);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddOne.__proto__ || Object.getPrototypeOf(AddOne)).call.apply(_ref, [this].concat(args))), _this), _this[one] = function (state) {
      return state + 1;
    }, _this[two] = function (state) {
      return state + 1;
    }, _this[three] = function (state) {
      return state + 1;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return AddOne;
}(_index.Action);

var AddNumberToTwo = function (_Action2) {
  _inherits(AddNumberToTwo, _Action2);

  function AddNumberToTwo() {
    var _ref2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, AddNumberToTwo);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = AddNumberToTwo.__proto__ || Object.getPrototypeOf(AddNumberToTwo)).call.apply(_ref2, [this].concat(args))), _this2), _this2[two] = function (state) {
      return state + _this2.payload.n;
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  return AddNumberToTwo;
}(_index.Action);

var MultiplyAndAssignToOne = function (_Action3) {
  _inherits(MultiplyAndAssignToOne, _Action3);

  function MultiplyAndAssignToOne() {
    var _ref3;

    var _temp3, _this3, _ret3;

    _classCallCheck(this, MultiplyAndAssignToOne);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_ref3 = MultiplyAndAssignToOne.__proto__ || Object.getPrototypeOf(MultiplyAndAssignToOne)).call.apply(_ref3, [this].concat(args))), _this3), _this3[root] = function (state) {
      var one = state.one,
          two = state.two,
          three = state.three;


      return _extends({}, state, {
        one: one * two * three
      });
    }, _temp3), _possibleConstructorReturn(_this3, _ret3);
  }

  return MultiplyAndAssignToOne;
}(_index.Action);

var store = (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(_index.withOActions));

console.log(store.getState());

store.dispatch(new AddOne());
console.log(store.getState());

store.dispatch(new AddNumberToTwo({ n: 100 }));
console.log(store.getState());

store.dispatch(new MultiplyAndAssignToOne());
console.log(store.getState());
