// component/tabbar/tabbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        select: {
            type: Number,
            value: 1,
        },
        show: {
            type: Boolean,
            value: false,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIpx: false
    },

    attached() {
        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
                    this.setData({
                        isIpx: true
                    })
                }
            }
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchToIndex() {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        },

        switchToRecordList() {
            wx.redirectTo({
                url: '/pages/dubbingUpload/dubbingUpload'
            })
        },

        switchToUser() {
            wx.redirectTo({
                url: '/pages/user/user'
            })
        },
    }
})
