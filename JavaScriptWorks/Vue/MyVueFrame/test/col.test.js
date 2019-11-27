const expect = chai.expect;
import Vue from 'vue'
import Col from '../src/col'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Col', () => {
    it('存在', () => {
        expect(Col).to.exist
    })
    it('接受span属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                span: 1
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-1')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受offset属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                offset: 1
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('offset-1')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受sm属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                sm: {span: 1,offset:2}
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-sm-1')).to.eq(true)
        expect(vm.$el.classList.contains('offset-sm-2')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受md属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                md: {span: 1,offset:2}
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-md-1')).to.eq(true)
        expect(vm.$el.classList.contains('offset-md-2')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受lg属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                lg: {span: 1,offset:2}
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-lg-1')).to.eq(true)
        expect(vm.$el.classList.contains('offset-lg-2')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受xl属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                xl: {span: 1,offset:2}
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-xl-1')).to.eq(true)
        expect(vm.$el.classList.contains('offset-xl-2')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
    it('接受xxl属性', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const Constructor = Vue.extend(Col)
        const vm = new Constructor({
            propsData: {
                xxl: {span: 1,offset:2}
            }
        }).$mount(div)
        expect(vm.$el.classList.contains('col-xxl-1')).to.eq(true)
        expect(vm.$el.classList.contains('offset-xxl-2')).to.eq(true)
        div.remove()
        vm.$destroy()
    })
})