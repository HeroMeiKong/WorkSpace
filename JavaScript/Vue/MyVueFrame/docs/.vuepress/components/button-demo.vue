<template>
    <div>
        <p>
            <strong>预览</strong>
        </p>
        <g-button>按钮</g-button>
        <g-button icon="set">按钮</g-button>
        <g-button :loading="true">按钮</g-button>
        <g-button disabled>按钮</g-button>
        <g-button icon="next" icon-position="right">按钮</g-button>

        <p>代码</p>
        <pre>
            <code>{{content1}}</code>
        </pre>

        <p>
            <strong>预览</strong>
        </p>
        <g-button :loading="loading1" @click="loading1=!loading1">按钮</g-button>
        <g-button icon="set" :loading="loading2" @click="loading2=!loading2">按钮</g-button>
        <g-button icon="next" icon-position="right" :loading="loading3" @click="loading3=!loading3">按钮</g-button>

        <p>代码</p>
        <pre>
            <code>{{content2}}</code>
        </pre>
    </div>
</template>
<script>
    import Button from '../../../src/button'
    export default {
        components: {
            'g-button': Button
        },
        data(){
            return{
                loading1: false,
                loading2: false,
                loading3: false,
                content1: `
<g-button>按钮</g-button>
<g-button icon="set">按钮</g-button>
<g-button :loading="true">按钮</g-button>
<g-button disabled>按钮</g-button>
<g-button icon="next" icon-position="right">按钮</g-button>`,
                content2: `
<g-button :loading="loading1" @click="loading1=!loading1">按钮</g-button>
<g-button icon="set" :loading="loading2" @click="loading2=!loading2">按钮</g-button>
<g-button icon="next" icon-position="right" :loading="loading3" @click="loading3=!loading3">按钮</g-button>

new Vue({
    data: {
        loading1: false,
        loading2: false,
        loading3: false,
    },
})`
            }
        }
    }
</script>