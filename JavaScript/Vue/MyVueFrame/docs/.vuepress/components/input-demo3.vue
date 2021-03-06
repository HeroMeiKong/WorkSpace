<template>
    <div>
        <h2>错误提示</h2>
        <p>
            <strong>预览</strong>
        </p>
        <div class="box">
            <g-input value="SoulWalker" error="不能输入大写字母"></g-input>
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
    <g-input value="SoulWalker" error="不能输入大写字母"></g-input>
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