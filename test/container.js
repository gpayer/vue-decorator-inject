import Container from '../lib/Container'
import should from 'should'

class A {
    a () { return true }
}

class B {
    incB (v) { return v + 1 }
}

class B2 {
    v () { return 1 }
}

class C {
    constructor (b, b2) {
        this.b = b
        this.b2 = b2
    }
    inc (v) {
        return this.b.incB(v) + this.b2.v()
    }
}

describe("Container", function () {
    describe("#set", function () {
        it("should only take symbols as key", function () {
            should.throws(function () {
                Container.set('a', 23)
            })
        })

        it("should return the same instance", function () {
            let s = Symbol()
            Container.set(s, 23)
            should(Container.get(s)).be.exactly(23)
        })
    })

    describe("#register", function () {
        it("should register a class", function () {
            Container.clear()
            let s = Symbol()
            should.doesNotThrow(function () {
                Container.register(s, A)
            })
            should(Container.has(s)).be.exactly(true)
        })
    })

    describe("#get", function () {
        it("should instantiate a class", function () {
            Container.clear()
            let s = Symbol()
            Container.register(s, A)
            let a = Container.get(s)
            should(a).be.a.Object()
            should(a.a()).be.exactly(true)
        })

        it("should instantiate dependencies and pass them to the constructor", function () {
            Container.clear()
            let sB = Symbol("B")
            let sB2 = Symbol("B2")
            let sC = Symbol("C")
            Container.register(sC, C, [sB, sB2])
            Container.register(sB, B)
            Container.register(sB2, B2)
            let c = Container.get(sC)
            let v = c.inc(1)
            should(v).be.exactly(3)
        })

        it("should detect dependency loops", function () {
            Container.clear()
            let sA = Symbol("A")
            let sB = Symbol("B")
            Container.register(sA, A, [sB])
            Container.register(sB, B, [sA])
            should.throws(function () {
                Container.get(sA)
            })
        })
    })

    describe("#factory", function () {
        it("should have a working factory method", function () {
            Container.clear()
            let s = Symbol()
            let c = 0
            Container.factory(s, function () {
                let v = c
                c += 1
                return v
            })
            should(Container.get(s)).be.exactly(0)
            should(Container.get(s)).be.exactly(1)
            should(Container.get(s)).be.exactly(2)
        })

        it("should have factories with dependencies", function () {
            Container.clear()
            let sB = Symbol("B")
            let f = Symbol("f")
            Container.register(sB, B)
            Container.factory(f, function (b) {
                return b.incB(1)
            }, [sB])
            should(Container.get(f)).be.exactly(2)
        })
    })
})
