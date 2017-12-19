'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.InjectComponent = InjectComponent;
exports.Inject = Inject;

var _vueClassComponent = require('vue-class-component');

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InjectComponent(map) {
    return (0, _vueClassComponent.createDecorator)(function (options, key) {
        if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
            throw new Error('map needs to be an object');
        }
        if (!options.components) {
            options.components = {};
        }
        Object.entries(map).forEach(function (value) {
            var _value = _slicedToArray(value, 2),
                name = _value[0],
                sym = _value[1];

            var comp = _Container2.default.get(sym);
            options.components[name] = comp;
        });
    });
}

function Inject(sym) {
    return function (target, key, descriptor) {
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || !key) {
            throw new Error('Inject can only be used on class members');
        }
        descriptor.initializer = function () {
            return _Container2.default.get(sym);
        };
    };
}