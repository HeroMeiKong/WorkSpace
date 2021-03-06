<template>
    <div class="s-toast" :class="{error}">
        <input :value="value" type="text" :disabled="disabled" :readonly="readonly"
               @change="$emit('change', $event.target.value)"
               @input="$emit('input', $event.target.value)"
               @focus="$emit('focus', $event.target.value)"
               @blur="$emit('blur', $event.target.value)">
        <template v-if="error">
            <icon name="error" class="icon-error"></icon>
            <span class="errorMessage">{{error}}</span>
        </template>
    </div>
</template>
<script>
    import Icon from './icon'

    export default {
        components: {Icon},
        name: 'swInput',
        props: {
            value: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            error: {
                type: String
            }
        }
    }
</script>
<style lang="scss" scoped>
    $height: 32px;
    $border-color: #999;
    $border-hover-color: #666;
    $border-radius: 4px;
    $font-size: 14px;
    $box-shadow-color: rgba(0, 0, 0, .5);
    $error-color: #F1453D;
    .s-toast {font-size: $font-size;display: inline-flex;align-items: center;
        > :not(:last-child) {margin-right: .5em;}
        > input {
            height: 32px;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            padding: 0 8px;
            font-size: $font-size;
            &:hover {border-color: $border-hover-color;}
            &:focus {box-shadow: inset 0 1px 3px $box-shadow-color;outline: none;}
            &[disabled] {border-color: #bbb;color: #bbb;cursor: not-allowed;}
            &[readonly] {border-color: #222;color: #222;cursor: not-allowed;}
        }
        &.error {
            > input {border-color: $error-color;}
        }
        .icon-error {fill: $error-color;}
        .errorMessage {color: red;}
    }
</style>