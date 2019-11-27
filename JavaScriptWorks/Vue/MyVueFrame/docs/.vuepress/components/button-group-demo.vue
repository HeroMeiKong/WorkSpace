<template>
    <div>
        <p>
            <strong>预览</strong>
        </p>
        <g-button-group>
            <g-button icon="before">上一页</g-button>
            <g-button>more</g-button>
            <g-button icon="next" icon-position="right">下一页</g-button>
        </g-button-group>

        <p>代码</p>
        <pre>
            <code>{{content}}</code>
        </pre>
    </div>
</template>

<script>
    import ButtonGroup from '../../../src/button-group'
    import Button from '../../../src/button'
    export default {
        components: {
            'g-button': Button,
            'g-button-group': ButtonGroup
        },
        data() {
            return {
                content: `
<g-button-group>
    <g-button icon="before">上一页</g-button>
    <g-button>more</g-button>
    <g-button icon="next" icon-position="right">下一页</g-button>
</g-button-group>`
            }
        }
    }
</script>
