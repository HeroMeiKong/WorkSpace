module.exports = {
    title: 'SoulWalker',
    description: '一个好用的基于 Vue 的 UI 框架',
    base: '/MyVueFrame/',
    themeConfig: {
        sidebar: [
            '/',
            {
                title: '入门',
                collapsable: true,
                children: [
                    '/install/',
                    '/get-started/',
                ]
            },
            {
                title: '组件',
                collapsable: true,
                children: [
                    '/components/button',
                    '/components/button-group',
                    '/components/grid',
                    '/components/input',
                    '/components/layout',
                    '/components/popover',
                    '/components/tabs',
                    '/components/toast',
                ]
            },
        ]
    }

}