const expect = chai.expect;
import Vue from 'vue'
import Popover from '../src/popover'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Popover', () => {
    it('存在.', () => {
        expect(Popover).to.be.exist
    })
    it('可以设置position', (done) => {
        Vue.component('g-popover', Popover)
        const div = document.createElement('div')
        document.body.appendChild(div)
        div.innerHTML = `
        <g-popover position="top" ref="a">
            <template slot="content">
                内容
            </template>
            <button>显示</button>
        </g-popover>
        `
        const vm = new Vue({
            el: div
        })
        vm.$el.querySelector('button').click()
        vm.$nextTick(() => {
            const {contentWrapper} = vm.$refs.a.$refs
            expect(contentWrapper.classList.contains('position-top')).to.eq(true)
            done()
            vm.$nextTick(()=>{
                vm.$destroy()
            })
        })
    })
    xit('可以设置trigger', (done) => {
        Vue.component('g-popover', Popover)
        const div = document.createElement('div')
        document.body.appendChild(div)
        div.innerHTML = `
        <g-popover trigger="hover" ref="a">
            <template slot="content">
                内容
            </template>
            <button>显示</button>
        </g-popover>
        `
        const vm = new Vue({
            el: div
        })
        let event=new Event('mouseenter')
        vm.$el.dispatchEvent(event)
        vm.$nextTick(()=>{

            done()
        })
    })
})