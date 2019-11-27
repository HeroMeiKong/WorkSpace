<template>
    <div class="col" :class="colClasses" :style="colStyle">
        <slot></slot>
    </div>
</template>
<script>
    let validator = (value) => {
        let keys = Object.keys(value)
        let valid = true
        keys.forEach(key => {
            if (!['span', 'offset'].includes(key)) {
                valid = false
            }
        })
        return valid
    }
    export default {
        name: 'SoulWalkerCol',
        props: {
            span: {type: [Number, String]},
            offset: {type: [Number, String]},
            sm: {type: Object, validator},
            md: {type: Object, validator},
            lg: {type: Object, validator},
            xl: {type: Object, validator},
            xxl: {type: Object, validator}
        },
        data() {
            return {gutter: 0,}
        },
        methods: {
            createClasses(obj, str = '') {
                //str=== sm-||md-
                if (!obj) { return [] }
                let array = []
                if (obj.span) { array.push(`col-${str}${obj.span}`) }
                if (obj.offset) { array.push(`offset-${str}${obj.offset}`) }
                return array
            }
        },
        computed: {
            colClasses() {
                let {span, offset, sm, md, lg, xl, xxl} = this
                let createClasses = this.createClasses
                return [
                    ...createClasses({span, offset}),
                    ...createClasses(sm, 'sm-'),
                    ...createClasses(md, 'md-'),
                    ...createClasses(lg, 'lg-'),
                    ...createClasses(xl, 'xl-'),
                    ...createClasses(xxl, 'xxl-'),
                ]
            },
            colStyle() {
                let {gutter} = this
                return {paddingLeft: gutter / 2 + 'px', paddingRight: gutter / 2 + 'px'}
            }
        }
    }
</script>
<style lang="scss" scoped>
    .col {
        $class-prefix: col-;
        @for $n from 1 through 24 {
            &.#{$class-prefix}#{$n} {
                width: ($n/24) * 100%;
            }
        }
        $class-prefix: offset-;
        @for $n from 1 through 24 {
            &.#{$class-prefix}#{$n} {
                margin-left: ($n/24) * 100%;
            }
        }
        @media(min-width: 576px) {
            $class-prefix: col-sm-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    width: ($n/24) * 100%;
                }
            }
            $class-prefix: offset-sm-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    margin-left: ($n/24) * 100%;
                }
            }
        }
        @media(min-width: 768px) {
            $class-prefix: col-md-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    width: ($n/24) * 100%;
                }
            }
            $class-prefix: offset-md-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    margin-left: ($n/24) * 100%;
                }
            }
        }
        @media(min-width: 992px) {
            $class-prefix: col-lg-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    width: ($n/24) * 100%;
                }
            }
            $class-prefix: offset-lg-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    margin-left: ($n/24) * 100%;
                }
            }
        }
        @media(min-width: 1200px) {
            $class-prefix: col-xl-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    width: ($n/24) * 100%;
                }
            }
            $class-prefix: offset-xl-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    margin-left: ($n/24) * 100%;
                }
            }
        }
        @media(min-width: 1600px) {
            $class-prefix: col-xxl-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    width: ($n/24) * 100%;
                }
            }
            $class-prefix: offset-xxl-;
            @for $n from 1 through 24 {
                &.#{$class-prefix}#{$n} {
                    margin-left: ($n/24) * 100%;
                }
            }
        }
    }
</style>