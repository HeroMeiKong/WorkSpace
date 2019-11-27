<template>
    <div style="padding-top: 16px;">
        <h2>支持 HTML</h2>
        <p>
            <strong>预览</strong>
        </p>

        <div>
            <g-button @click="onClickButton">上方弹出</g-button>
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
            .gulu-toast {
              z-index: 30;
            }
          </style>
          <div>
            <g-button @click="onClickButton">上方弹出</g-button>
          </div>
          methods: {
            onClickButton () {
              this.$toast('你知道我在等你吗？', {
                closeButton: {
                  text: '知道了',
                  callback: () => {
                    console.log('他说知道了')
                  }
                }
              })
            }
          },
      `
            }
        },
        methods: {
            onClickButton () {
                this.$toast('<strong style="color:red;">加粗的提示</strong>', {
                    enableHtml: true
                })
            }
        }
    }
</script>

<style scoped lang="scss">

</style>