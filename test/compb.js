import Vue from 'vue'
import Component from 'vue-class-component'
import { InjectComponent } from '../lib'
import TYPES from './types'
import CompA from './compa'
import { Container } from '../lib'

Container.set(TYPES.compa, CompA)

@Component({
    // template: '<span><comp-a></comp-a></span>'
})
@InjectComponent({'comp-a': TYPES.compa})
export default class CompB extends Vue {
render (h) {
    return h('span', [
            h('comp-a', {
                ref: 'child'
            })
        ])
    }
}
