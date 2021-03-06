<template>
    <div style="padding-top: 16px;">
        <h2>布局</h2>
        <p>
            <strong>预览</strong>
        </p>

        <g-layout style="color: white; overflow:hidden; margin-bottom:50px;">
            <g-sider style=" background:#ddd; width:200px; color: black;">
                sider
            </g-sider>
            <g-layout>
                <g-header style="height: 50px; background:lightskyblue;">
                    header
                </g-header>
                <g-content style="height: 100px; background:deepskyblue;">
                    content
                </g-content>
                <g-footer style="height: 50px; background:lightskyblue;">
                    footer
                </g-footer>
            </g-layout>
        </g-layout>
        <p>
            <strong>代码</strong>
        </p>
        <pre><code>{{content}}</code></pre>
    </div>
</template>

<script>
    import Layout from '../../../src/layout'
    import Header from '../../../src/header'
    import Footer from '../../../src/footer'
    import Content from '../../../src/content'
    import Sider from '../../../src/sider'
    export default {
        components: {
            'g-layout': Layout,
            'g-header': Header,
            'g-footer': Footer,
            'g-content': Content,
            'g-sider': Sider,
        },
        data () {
            return {
                content: `
          <g-layout style="color: white; overflow:hidden; margin-bottom:50px;">
            <g-sider style=" background:#ddd; width:200px; color: black;">
              sider
            </g-sider>
            <g-layout>
              <g-header style="height: 50px; background:lightskyblue;">
                header
              </g-header>
              <g-content style="height: 100px; background:deepskyblue;">
                content
              </g-content>
              <g-footer style="height: 50px; background:lightskyblue;">
                footer
              </g-footer>
            </g-layout>
          </g-layout>
      `
            }
        }
    }
</script>

<style scoped lang="scss">
    * {
        box-sizing: border-box;
    }
</style>