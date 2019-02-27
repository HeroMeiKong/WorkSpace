// pages/dubbingUpload/dubbingUpload.js
import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        models: 'defaultmodel',
        showDiyTabBar: false,
        showOrHidden: ["none", "none", "none"],
        pics: ['', '', ''],
        showNothing: 'none'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('onLoad')
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
                    //iphoneX
                    that.data.models = 'iphoneX'
                } else if (res.model.indexOf("BLA-AL00") > -1) {
                    //huaweimate10plus
                    that.data.models = 'huaweimate10plus'
                } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
                    //OnePlus5T
                    that.data.models = 'oneplus5t'
                } else if (res.model.indexOf("MI 8") > -1) {
                    //xiaomi8
                    that.data.models = 'xiaomi8'
                } else {
                }
                that.setData({
                    models: that.data.models,
                })
            }
        })
        wx.request({
            url: api.showOrhidden,
            success: (res) => {
                console.log(res.data.data)
                const length = res.data.data.length
                for (let i = 0; i < length; i++) {
                    let sorh = 'none'
                    if (res.data.data[i].online === '1') {
                        sorh = 'none'
                    } else {
                        sorh = 'flex'
                    }
                    switch (res.data.data[i].name) {
                        case app.globalData.wangchun_title:
                            that.data.showOrHidden[i] = sorh
                            that.data.pics[i] = res.data.data[i].activity_pic
                            break;
                        // case '超级配配配'://'我要"说"春晚':
                        case app.globalData.ppp_title:
                            that.data.showOrHidden[i] = sorh
                            that.data.pics[i] = res.data.data[i].activity_pic
                            break;
                        case app.globalData.cecece_title:
                            that.data.showOrHidden[i] = sorh
                            that.data.pics[i] = res.data.data[i].activity_pic
                            break;
                        default:
                            that.data.showOrHidden[i] = 'none'
                            that.data.pics[i] = ''
                            break;
                    }
                }
                let nothing = 0
                for (let i = 0; i < length; i++) {
                    if(that.data.showOrHidden[i] === 'none'){
                        nothing++
                    }
                }
                nothing === 3 ? that.data.showNothing = 'flex' : that.data.showNothing = 'none'
                that.setData({
                    showOrHidden: that.data.showOrHidden,
                    pics: that.data.pics,
                    showNothing: that.data.showNothing
                })
            },
            fail: (e) => {
                console.log('请求失败111')
            }
        })
        //wx.showTabBar();
        // this.ctx = wx.createCameraContext()
        // wx.setEnableDebug({
        //   enableDebug: true,
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('onReady')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow')
        const options = {
            op: 'pv',
            wz: 'sprint_activity1',
        }
        app.statistics_pv(options)
        // wx.showTabBar();
        this.hideTabBar()
        console.log('shootsuccess')
        const shootsuccess = app.shootsuccess
        console.log(shootsuccess)
        if (shootsuccess) {
            console.log('不可能啊！')
            wx.navigateTo({
                url: '/pages/preview/preview?usermethod=camera'
            })
        } else {
            console.log('取消下一步')
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
    shotingVideo: function () {
        console.log('shotingVideo')
        const options = {
            op: 'pv',
            wz: 'paishe_click',
            source: 'activity',
        }
        app.statistics_pv(options)
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=camera&showTiems=true'
        })
    },
    uploadLocalVideo: function () {
        console.log('uploadLocalVideo')
        const options = {
            op: 'pv',
            wz: 'local_upload_click',
            source: 'activity',
        }
        app.statistics_pv(options)
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=album&showTiems=true'
        })
    },
    dubbing(e) {
        console.log('dubbing')
        const options = {
            op: 'pv',
            wz: 'peiyin_click',
            source: 'activity',
        }
        app.statistics_pv(options)
        wx.navigateTo({
            url: '/pages/recordList/recordList'
        })
    },

    // 隐藏原生tabbar，并显示自定义tabbar
    hideTabBar() {
        wx.hideTabBar();
        setTimeout(() => {
            this.showDiyTabBar();
        }, 100)
    },

    // 显示自定义tabbar
    showDiyTabBar() {
        this.setData({
            showDiyTabBar: true
        })
    },
    newYear(e) {
        console.log('newYear')
        wx.navigateTo({
            url: '/pages/newYear/newYear'
        })
    },
    superMatch(e) {
        console.log('superMatch')
        wx.navigateTo({
            url: '/pages/ppp/ppp'
        })
    },
    superTest(e) {
        console.log('superTest')
        wx.navigateTo({
            url: '/pages/superTest/superTest'
        })
    }
})