'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.InjectComponent = InjectComponent;
exports.Inject = Inject;

var _vueClassComponent = require('vue-class-component');

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InjectComponent(sym) {
    return (0, _vueClassComponent.createDecorator)(function (options, key) {
        if (!options.components) {
            options.components = {};
        }
        var comp = _Container2.default.get(sym);
        var _name = comp.prototype.constructor.name;
        options.components[_name] = comp;
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