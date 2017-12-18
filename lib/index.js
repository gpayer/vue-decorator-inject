'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Container = require('./Container');

Object.defineProperty(exports, 'Container', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Container).default;
  }
});

var _Inject = require('./Inject');

Object.defineProperty(exports, 'Inject', {
  enumerable: true,
  get: function get() {
    return _Inject.Inject;
  }
});
Object.defineProperty(exports, 'InjectComponent', {
  enumerable: true,
  get: function get() {
    return _Inject.InjectComponent;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }