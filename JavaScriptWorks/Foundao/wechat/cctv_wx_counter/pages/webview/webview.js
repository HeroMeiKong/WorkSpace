// pages/webview/webview.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: 'https://app.cctv.com/2019/02/21/ARTIPugRAroEtJ4fIBXlvr5a190221.shtml'
    },

    onShow: function () {
        let listUrl = this.options.listUrl;
        if (listUrl) {
            this.setData({
                src: listUrl
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },

})