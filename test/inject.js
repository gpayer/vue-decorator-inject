import should from 'should'
import Container from '../lib/Container'
import { Inject, InjectComponent } from '../lib/Inject'
import Component from 'vue-class-component'
import Vue from 'vue'
import { pretty } from 'js-object-pretty-print'
import TYPES from './types'
import CompB from './compb'
import CompA from './compa'

class A {
    test () {
        return true
    }
}
let sA = Symbol('A')

class B {
    @Inject(sA)
    a
}

describe("Inject", function () {
    beforeEach(() => {
        Container.clear()
    })
    describe("@Inject", function () {
        it("should decorate object fields", function () {
            Container.register(sA, A)
            let o = {
                @Inject(sA)
                a: null
            }
            should(o.a.test()).be.exactly(true)
        })
    })

    describe("@InjectComponent", function () {
        it("should set components via a mapping object", function () {
            Container.set(TYPES.compa, CompA)
            const vm = new CompB()
            vm.$mount()
            console.log(pretty(vm.$options))
            // should.exist(b.components['comp-a'])
        })
    })
})
