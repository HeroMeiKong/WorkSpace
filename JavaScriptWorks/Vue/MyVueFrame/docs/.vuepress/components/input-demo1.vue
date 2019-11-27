<template>
    <div>
        <h2>简单用法</h2>
        <p>
            <strong>预览</strong>
        </p>
        <div class="box">
            <g-input value="HeroMeiKong" disabled></g-input>
            <g-input value="SoulWalker" readonly></g-input>
            <g-input value="SoulWalker"></g-input>
        </div>


        <p>代码</p>
        <pre>
            <code>{{content}}</code>
        </pre>
    </div>
</template>
<script>
    import Input from '../../../src/input'

    export default {
        components: {
            'g-input': Input
        },
        data(){
            return{
                message: 'SoulWalker',
                content: `
<div>
    <g-input value="HeroMeiKong" disabled></g-input>
    <g-input value="SoulWalker" readonly></g-input>
    <g-input value="SoulWalker"></g-input>
</div>`
            }
        }
    }
</script>
<style>
    .box{
        margin: 5px;
    }
</style>