// component/tabbar/tabbar.js
const app = getApp();

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
        app.isPhoneX(() => {
            this.setData({
                isIpx: true
            })
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchToIndex() {
            wx.switchTab({
                url: '/pages/index/index'
            })
        },

        switchToRecordList() {
            wx.switchTab({
                url: '/pages/dubbingUpload/dubbingUpload'
            })
        },

        switchToUser() {
            wx.switchTab({
                url: '/pages/user/user'
            })
        },
    }
})
