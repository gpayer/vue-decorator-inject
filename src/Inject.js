import { createDecorator } from 'vue-class-component'
import Container from './Container'

export function InjectComponent(map) {
    return createDecorator((options, key) => {
        if (typeof map !== 'object') {
            throw new Error('map needs to be an object')
        }
        if (!options.components) {
            options.components = {}
        }
        Object.entries(map).forEach((value) => {
            let [name, sym] = value
            let comp = Container.get(sym)
            options.components[name] = comp
        })
    })
}

export function Inject(sym) {
    return function (target, key, descriptor) {
        if (typeof target !== 'object' || !key) {
            throw new Error('Inject can only be used on class members')
        }
        descriptor.initializer = () => {
            return Container.get(sym)
        }
    }
}
