<template>
    <div style="padding-top: 16px;">
        <h2>简单用法</h2>
        <p>
            <strong>预览</strong>
        </p>
        <g-tabs :selected="selected">
            <g-tabs-head>
                <g-tabs-item name="1">1</g-tabs-item>
                <g-tabs-item name="2">2</g-tabs-item>
            </g-tabs-head>
            <g-tabs-body>
                <g-tabs-pane name="1">content 111111111111111111111</g-tabs-pane>
                <g-tabs-pane name="2">content 222222222222222222222</g-tabs-pane>
            </g-tabs-body>
        </g-tabs>

        <p>
            <strong>代码</strong>
        </p>
        <pre><code>{{content}}</code></pre>
    </div>
</template>

<script>
    import Tabs from '../../../src/tabs'
    import TabsBody from '../../../src/tabs-body'
    import TabsHead from '../../../src/tabs-head'
    import TabsItem from '../../../src/tabs-item'
    import TabsPane from '../../../src/tabs-pane'
    export default {
        name: "tabs-demo",
        components: {
            'g-tabs': Tabs,
            'g-tabs-body': TabsBody,
            'g-tabs-head': TabsHead,
            'g-tabs-item': TabsItem,
            'g-tabs-pane': TabsPane
        },
        data () {
            return {
                selected: '1',
                content: `
          data:{
            selected: '1'
          }
          <g-tabs :selected="selected">
            <g-tabs-head>
              <g-tabs-item name="1">1</g-tabs-item>
              <g-tabs-item name="2">2</g-tabs-item>
            </g-tabs-head>
            <g-tabs-body>
              <g-tabs-pane name="1">content 111111111111111111111</g-tabs-pane>
              <g-tabs-pane name="2">content 222222222222222222222</g-tabs-pane>
            </g-tabs-body>
          </g-tabs>
      `
            }
        }
    }
</script>

<style scoped lang="scss">

</style>