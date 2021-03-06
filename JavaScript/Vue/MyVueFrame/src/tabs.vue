<template>
    <div class="tabs">
        <slot></slot>
    </div>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: 'SoulWalkerTabs',
        props: {
            selected: {
                type: String,
                required: true
            },
            direction: {
                type: String,
                default: 'horizontal',
                validator(value) {
                    return ['horizontal', 'vertical'].indexOf(value) >= 0
                }
            }
        },
        data() {
            return {eventBus: new Vue()}
        },
        provide() {
            return {eventBus: this.eventBus}
        },
        created() {
            //this.$emit('update:selected', 'xxx')
        },
        mounted() {
            if (this.$children.length === 0) {
                console && console.warn &&
                console.warn('tabs的子组件应该是tabs-head或tabs-body，但它并没有子组件！')
            }
            this.$children.forEach((vm) => {
                if (vm.$options.name === 'SoulWalkerTabsHead') {
                    vm.$children.forEach((childVm) => {
                        if (childVm.$options.name === 'SoulWalkerTabsItem' && childVm.name === this.selected) {
                            this.eventBus.$emit('update:selected', this.selected, childVm)
                        }
                    })
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
    .tabs {}
</style>