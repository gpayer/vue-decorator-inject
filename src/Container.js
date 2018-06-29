export class ContainerEntry {
    loaded = false
    loading = false
    isFactory = false
    once = true
    dependencies = []
    clazz = null
    instance = null

    constructor (inst) {
        if (inst) {
            this.instance = inst
            this.loaded = true
        }
    }

    get () {
        if (this.loaded) {
            return this.instance
        }
        if (this.loading) {
            throw new Error('circular dependencies detected')
        }
        this.loading = true
        let deps = []
        this.dependencies.forEach( (sym) => {
            deps.push(Container.get(sym))
        })
        if (this.isFactory) {
            this.instance = this.clazz(...deps)
        } else {
            this.instance = Reflect.construct(this.clazz, deps)
        }
        this.loaded = this.once
        this.loading = false
        return this.instance
    }
}

export default class Container {
    static bindings = new Map()

    static clear() {
        Container.bindings.clear()
    }

    static set(sym, instance) {
        if (typeof sym !== 'symbol') {
            throw new Error('key is not a symbol')
        }
        Container.bindings.set(sym, new ContainerEntry(instance))
    }

    static has(sym) {
        return Container.bindings.has(sym)
    }

    static get(sym) {
        if (typeof sym !== 'symbol') {
            throw new Error('key is not a symbol')
        }
        if (Container.bindings.has(sym)) {
            let c = Container.bindings.get(sym)
            return c.get()
        }
        throw new Error("unknown symbol " + sym.toString())
    }

    static register(sym, clazz, deps) {
        if (!deps) {
            deps = []
        }
        if (typeof sym !== 'symbol') {
            throw new Error('key is not a symbol')
        }
        let c = new ContainerEntry()
        c.clazz = clazz
        c.dependencies = deps
        Container.bindings.set(sym, c)
    }

    static factoryOnce(sym, factoryFn, deps) {
        Container.factory(sym, factoryFn, deps, true)
    }

    static factory(sym, factoryFn, deps, once) {
        if (!deps) {
            deps = []
        }
        if (!once) {
            once = false
        }
        if (typeof sym !== 'symbol') {
            throw new Error('key is not a symbol')
        }
        let c = new ContainerEntry()
        c.clazz = factoryFn
        c.dependencies = deps
        c.isFactory = true
        c.once = once
        Container.bindings.set(sym, c)
    }
}
