// component/backTitle/backTitle.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: '',
        },
        noBack: {
            type: Boolean,
            value: false,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isIpx:false
    },

    attached(){
        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1) {
                    this.setData({
                        isIpx:true
                    })
                }
            }
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goBack(e) {
            console.log(getCurrentPages())
            if (getCurrentPages().length === 1) {
                wx.switchTab({
                    url: '/pages/index/index',
                })
            } else {
                wx.navigateBack({
                    delta: 1
                })
            }

        },
    }
})
