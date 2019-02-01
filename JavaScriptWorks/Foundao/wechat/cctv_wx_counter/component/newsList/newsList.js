// component/newsList/newsList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        newList: {
            type: Array,
            value: [
                {
                    bg: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f'
                },
                {
                    bg: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f',
                    text: '商务部澄清：有关“美方取消与中方经贸磋商”报道不实'
                },
                {
                    bg: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f',
                    text: '商务部澄清：有关“美方取消与中方经贸磋商”报道不实商务部澄清：有关“美方取消与中方经贸磋商”报道不实商务部澄清：有关“美方取消与中方经贸磋商”报道不实'
                }
            ]
        },
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {},

    // 前往资讯页
    goDetail(event) {
        var id = event.currentTarget.dataset.id
        wx.setStorageSync('webview_src', id);
        wx.navigateTo({
            url: 'pages/webview/webview'
        })
    }
})
