import Vue from 'vue'
import Component from 'vue-class-component'
import TYPES from './types'

@Component
export default class CompA extends Vue {
    render (h) {
        return ('h', 'Hallo')
    }
}
