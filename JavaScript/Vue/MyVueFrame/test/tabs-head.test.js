const expect = chai.expect;
import Vue from 'vue'
import Tabs from '../src/tabs'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Toast', () => {
    it('存在', () => {
        expect(Tabs).to.exist
    })
    /*it('接受position', () => {
        const Constructor = Vue.extend(Toast)
        const vm = new Constructor({
            propsData: {
                position: 'middle'
            }
        }).$mount()
        expect(vm.$el.classList.contains('position-middle')).to.eq(true)
    })*/
})