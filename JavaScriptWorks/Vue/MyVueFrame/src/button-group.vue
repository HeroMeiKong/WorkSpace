<template>
    <div class="g-button-group">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'swButtonGroup',
        mounted() {
            for(let node of this.$el.children){
                if(node.nodeName.toLocaleLowerCase() !=='button'){
                    console.log(`g-button-group的子元素应该是g-button，但你写的是${node.nodeName.toLocaleLowerCase()}`)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    $border-radius: 4px;
    .g-button-group {
        display: inline-flex;
        vertical-align: middle;
        > .g-button {
            border-radius: 0;
            &:not(:first-child){
                margin-left: -1px;
            }
            &:first-child {
                border-top-left-radius: $border-radius;
                border-bottom-left-radius: $border-radius;
            }
            &:last-child {
                border-top-right-radius: $border-radius;
                border-bottom-right-radius: $border-radius;
            }
            &:hover {
                position: relative;
                z-index: 1;
            }
        }
    }
</style>