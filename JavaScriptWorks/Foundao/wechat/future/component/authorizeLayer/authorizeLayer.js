// component/authorizeLayer/authorizeLayer.js
var app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        cb: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindgetuserinfo: function (e) {
            console.log(e)
            if (e.detail.userInfo) {
                //通过授权
                // this.close()
                app.globalData.userInfo = e.detail.userInfo;
                app.login_auth(e.detail, this.cb)
            } else {
                //拒绝授权

            }
        },

        set_cb: function (fun) {
            this.cb = fun;
        },
        //
        // close: function () {
        //     this.setData({
        //         show: false
        //     })
        // }
    }
})
