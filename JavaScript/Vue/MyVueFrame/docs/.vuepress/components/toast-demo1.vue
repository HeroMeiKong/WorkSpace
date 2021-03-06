<template>
    <div style="padding-top: 16px;">
        <h2>this.$toast</h2>
        <p>
            <strong>预览</strong>
        </p>

        <div>
            <g-button @click="$toast('点击弹出提示')">上方弹出</g-button>
            <g-button @click="$toast('点击弹出提示', {position:'middle'})">中间弹出</g-button>
            <g-button @click="$toast('点击弹出提示', {position:'bottom'})">下方弹出</g-button>
        </div>

        <p>
            <strong>代码</strong>
        </p>
        <pre><code>{{content}}</code></pre>
    </div>
</template>
<style>
    .s-toast {
        z-index: 30 !important;
    }
</style>

<script>
    import Plugin from '../../../src/plugin'
    import Button from '../../../src/button'
    import Vue from 'vue'
    Vue.use(Plugin)
    export default {
        name: "toast-demo1",
        components: {'g-button': Button},
        data () {
            return {
                content: `
          <style>
            .s-toast {
              z-index: 30;
            }
          </style>
          <g-button @click="$toast('点击弹出提示')">上方弹出</g-button>
          <g-button @click="$toast('点击弹出提示', {position:'middle'})">中间弹出</g-button>
          <g-button @click="$toast('点击弹出提示', {position:'bottom'})">下方弹出</g-button>
      `
            }
        }
    }
</script>

<style scoped lang="scss">

</style>