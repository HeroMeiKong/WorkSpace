const expect = chai.expect;
import Vue from 'vue'
import Input from '../src/input'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Input', () => {
    it('存在.', () => {
        expect(Input).to.exist
    })

    describe('props', () => {
        const Constructor = Vue.extend(Input)
        const vm = new Constructor({
            propsData: {
                value: '1234',
                disabled: true,
                readonly: true,
                error: '你错了'
            }
        }).$mount()
        afterEach(() => {
            vm.$destroy()
        })
        it('接收value', () => {
            const inputElement = vm.$el.querySelector('input')
            expect(inputElement.value).to.equal('1234')
        })
        it('接收disabled', () => {
            const inputElement = vm.$el.querySelector('input')
            expect(inputElement.disabled).to.equal(true)
        })
        it('接收readonly', () => {
            const inputElement = vm.$el.querySelector('input')
            expect(inputElement.readOnly).to.equal(true)
        })
        it('接收error', () => {
            const useElement = vm.$el.querySelector('use')
            expect(useElement.getAttribute('xlink:href')).to.equal('#i-error')
            const errorMessage = vm.$el.querySelector('.errorMessage')
            expect(errorMessage.innerText).to.equal('你错了')
        })
    })
    describe('事件', () => {
        const Constructor = Vue.extend(Input)
        let vm
        it('支持change/input/focus/blur 事件', () => {
            ['change', 'input', 'focus', 'blur'].forEach((eventName) => {
                vm = new Constructor({}).$mount()
                const callback = sinon.fake()
                vm.$on(eventName, callback)
                let event = new Event(eventName)
                Object.defineProperty(event, 'target', {value: {value: 'hi'}, enumerable: true})
                let inputElement = vm.$el.querySelector('input')
                inputElement.dispatchEvent(event)
                expect(callback).to.have.been.calledWith('hi')
                vm.$destroy()
            })
        })
        /*const Constructor = Vue.extend(Input)
        const vm = new Constructor({}).$mount()
        afterEach(()=>{
            vm.$destroy()
        })
        it('支持change事件', () => {
            const callback = sinon.fake()
            vm.$on('change',callback)
            let event=new Event('change')
            let inputElement = vm.$el.querySelector('input')
            inputElement.dispatchEvent(event)
            expect(callback).to.have.been.calledWith(event)

        })
        it('支持input事件', () => {
            const callback = sinon.fake()
            vm.$on('input',callback)
            let event=new Event('input')
            let inputElement = vm.$el.querySelector('input')
            inputElement.dispatchEvent(event)
            expect(callback).to.have.been.calledWith(event)

        })
        it('支持focus事件', () => {
            const callback = sinon.fake()
            vm.$on('focus',callback)
            let event=new Event('focus')
            let inputElement = vm.$el.querySelector('input')
            inputElement.dispatchEvent(event)
            expect(callback).to.have.been.calledWith(event)

        })
        it('支持blur事件', () => {
            const callback = sinon.fake()
            vm.$on('blur',callback)
            let event=new Event('blur')
            let inputElement = vm.$el.querySelector('input')
            inputElement.dispatchEvent(event)
            expect(callback).to.have.been.calledWith(event)

        })*/
    })
})