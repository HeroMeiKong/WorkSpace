// pages/messageTest/messageTest.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

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


    },

    send() {
        let timestamp = Date.parse(new Date())
        var unionId = 10000001
        timestamp = timestamp / 1000  //当前时间戳
        const data = 'urlencode(base64(uid=' + unionId + '&time=' + timestamp + '))' //匿名留言参数，组成格式为：urlencode(base64(uid=xx&time=1xxx))。uid为任意整数，time为当前uninx时间戳，urlencode, base64 对应两种编码方式。
        wx.request({
                url: 'https://newcomment.cntv.cn/comment/post',
                methor: 'POST',
                dataType: 'json',
                header: {'content-type': 'application/json'}, // 默认值
                data: {
                    app: 'wxapp2019cal',
                    itemid: 'lianghui2019',
                    message: '看到村里的房子越来越好了，车子越来越多了，新农合也有很多人受惠，行政手续也变得简化，加油。希望各种手续可以更加简化，落实到具体工作中。',
                    pic: 'https://s-js.sports.cctv.com/host/resource/map/user_3.jpg', //用户头像
                    authorid: unionId, //用户id，匿名留言传任意整数
                    author: '懒傻欢乐多', //用户名，匿名留言传任意值
                    data: data
                },
            }
        )
    }
})