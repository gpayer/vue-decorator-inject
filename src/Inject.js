import { createDecorator } from 'vue-class-component'
import Container from './Container'

export function InjectComponent(sym) {
    return createDecorator((options, key) => {
        if (!options.components) {
            options.components = {}
        }
        let comp = Container.get(sym)
        let _name = comp.prototype.constructor.name
        options.components[_name] = comp
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
