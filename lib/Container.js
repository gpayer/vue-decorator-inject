'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _class2, _temp;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContainerEntry = exports.ContainerEntry = function () {
    function ContainerEntry(inst) {
        _classCallCheck(this, ContainerEntry);

        this.loaded = false;
        this.loading = false;
        this.isFactory = false;
        this.once = true;
        this.dependencies = [];
        this.clazz = null;
        this.instance = null;

        if (inst) {
            this.instance = inst;
            this.loaded = true;
        }
    }

    _createClass(ContainerEntry, [{
        key: 'get',
        value: function get() {
            if (this.loaded) {
                return this.instance;
            }
            if (this.loading) {
                throw new Error('circular dependencies detected');
            }
            this.loading = true;
            var deps = [];
            this.dependencies.forEach(function (sym) {
                deps.push(Container.get(sym));
            });
            if (this.isFactory) {
                this.instance = this.clazz.apply(this, deps);
            } else {
                this.instance = Reflect.construct(this.clazz, deps);
            }
            this.loaded = this.once;
            this.loading = false;
            return this.instance;
        }
    }]);

    return ContainerEntry;
}();

var Container = (_temp = _class2 = function () {
    function Container() {
        _classCallCheck(this, Container);
    }

    _createClass(Container, null, [{
        key: 'clear',
        value: function clear() {
            Container.bindings.clear();
        }
    }, {
        key: 'set',
        value: function set(sym, instance) {
            if ((typeof sym === 'undefined' ? 'undefined' : _typeof(sym)) !== 'symbol') {
                throw new Error('key is not a symbol');
            }
            Container.bindings.set(sym, new ContainerEntry(instance));
        }
    }, {
        key: 'has',
        value: function has(sym) {
            return Container.bindings.has(sym);
        }
    }, {
        key: 'get',
        value: function get(sym) {
            if ((typeof sym === 'undefined' ? 'undefined' : _typeof(sym)) !== 'symbol') {
                throw new Error('key is not a symbol');
            }
            if (Container.bindings.has(sym)) {
                var c = Container.bindings.get(sym);
                return c.get();
            }
            throw new Error("unknown symbol " + sym.toString());
        }
    }, {
        key: 'register',
        value: function register(sym, clazz, deps) {
            if (!deps) {
                deps = [];
            }
            if ((typeof sym === 'undefined' ? 'undefined' : _typeof(sym)) !== 'symbol') {
                throw new Error('key is not a symbol');
            }
            var c = new ContainerEntry();
            c.clazz = clazz;
            c.dependencies = deps;
            Container.bindings.set(sym, c);
        }
    }, {
        key: 'factoryOnce',
        value: function factoryOnce(sym, factoryFn, deps) {
            Container.factory(sym, factoryFn, deps, true);
        }
    }, {
        key: 'factory',
        value: function factory(sym, factoryFn, deps, once) {
            if (!deps) {
                deps = [];
            }
            if (!once) {
                once = false;
            }
            if ((typeof sym === 'undefined' ? 'undefined' : _typeof(sym)) !== 'symbol') {
                throw new Error('key is not a symbol');
            }
            var c = new ContainerEntry();
            c.clazz = factoryFn;
            c.dependencies = deps;
            c.isFactory = true;
            c.once = once;
            Container.bindings.set(sym, c);
        }
    }]);

    return Container;
}(), _class2.bindings = new Map(), _temp);
exports.default = Container;