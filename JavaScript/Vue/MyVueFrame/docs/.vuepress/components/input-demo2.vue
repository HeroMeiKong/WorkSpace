<template>
    <div>
        <h2>双向绑定</h2>
        <p>
            <strong>预览</strong>
        </p>
        <div class="box"  id="inputApp">
            <g-input v-model="message"></g-input><p>{{message}}</p>
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
    <g-input v-model="message"></g-input>
    <p>{{message}}</p>
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