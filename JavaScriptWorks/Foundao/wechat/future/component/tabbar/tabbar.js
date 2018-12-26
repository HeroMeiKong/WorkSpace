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
            wx.navigateTo({
                url: '/pages/index/index'
            })
        },

        switchToRecordList() {
            wx.navigateTo({
                url: '/pages/dubbingUpload/dubbingUpload'
            })
        },

        switchToUser() {
            wx.navigateTo({
                url: '/pages/user/user'
            })
        },
    }
})
