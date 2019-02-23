// pages/webview/webview.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        if (res.from === 'menu') {
            //右上角转发
            return {
              title: '两会，走起来',
              path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
              imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
            }
          }
    }
})