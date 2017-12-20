# vue-decorator-inject
> Dependency injection with ES6 decorators for Vue.js

### Installation

If you are using Webpack or similar:

`npm i --save-dev vue-decorator-inject`

Otherwise `--save` is probably more sensible.

### Design and usage

Read the documentation for [vue-class-component](https://github.com/vuejs/vue-class-component) beforehand. This package is based upon it.

Define your abstract types first, later you bind your concrete classes etc. to them.
``` js
// types.js

export default {
    ComponentA: Symbol('ComponentA'),
    ComponentB: Symbol('ComponentB'),
    MyService: Symbol('MyService'),
    MyFactory: Symbol('MyFactory'),
    SomeConstant: Symbol('SomeConstant')
}
```

Define your components, inject your dependecies.
``` js
import Vue from 'vue'
import Component from 'vue-class-component'
import { InjectComponent, Inject } from 'vue-decorator-inject'
import TYPES from './types'

@Component
@InjectComponent({'ComponentA': TYPES.ComponentA})
export default class ComponentB extends Vue {
    @Inject(TYPES.MyService)
    myService

    @Inject(TYPES.MyFactory)
    generatedFromTheFactory
}
```

Implement your services and factory functions. In services you can either let dependencies be injected into the constructor or get them by using `@Inject`.
``` js
// MyService.js

export default class MyService {
    constructor (someConstant) {
        // do stuff
    }
}

// MyFactory.js

// ... import statements ...

export default function myFactory(MyService) {
    // do stuff, create an instance using MyService
    return someInstance;
}
```

And finally tie it all together with your dependency configuration.
``` js
// config.js

import TYPES from './types'
import { Container } from 'vue-decorator-inject'
// import all other dependencies

// use 'set' for constants or class definitions
Container.set(TYPES.SomeConstant, 23)
Container.set(TYPES.ComponentA, ComponentA)

// use 'register' to register class definitions, which have to be instantiated
// (with optional dependencies)
Container.register(TYPES.MyService, [TYPES.SomeConstant])

// use 'factory' to register factory functions (with optional dependencies)
Container.factory(TYPES.MyFactory, myFactory, [TYPES.MyService])
```

**Important implementation hint:** always include the `config.js` file as early as possible in your project.

``` js
// main.js

import Vue from 'vue'
import './config'
// other imports

// Your typical root component
@Component({
    template: '<App/>',
    @Inject(TYPES.RouteDef)
    router: null
})
@InjectComponent({'App': TYPES.App})
class Root extends Vue {}

new Root({
    el: '#app'
})
```

In the above example `@Inject` is used on an object field to inject your routing definition for `vue-router`. You can define your routing definition by using a factory.

``` js
// router.js

import TYPES from './types'
import Router from 'vue-router'

export default function routeDef(ComponentA, ComponentB) {
    return new Router({
        // your route definitions
    })
}

// config.js

Container.factory(TYPES.RouteDef, routeDef, [TYPES.ComponentA, TYPES.ComponentB])
```
