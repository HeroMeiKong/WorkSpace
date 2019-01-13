// pages/ppp/ppp.js
import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false,//是否初始化
        loading_num: 0,//loading
        
        ppp_page: 1,
        ppp_scroll: 0,
        ppp_more: true,
        ppp_list: [],

        isIpx: false,

        no_more: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.isFullScreen(() => {
            this.setData({
                isIpx: true
            })
        })
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
        app.isAuth(() => {
            // const options = {
            //     op: 'pv',
            //     wz: 'dub',
            // }
            // app.statistics_pv(options)

            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.getPPPList();
            } else {
                console.log('已初始化')
            }
        })
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
        // const options = {
        //     op: 'share',
        //     wz: 'dub',
        // }
        // app.statistics_pv(options)
        return {
            title: app.globalData.shareText,
            path: '/pages/ppp/ppp',
            imageUrl: app.globalData.shareImg,
        }
    },

    getPPPList() {
        if (!this.data.ppp_more) {
            return
        }

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.ppp,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                page: this.data.ppp_page,
            },
            success: (res) => {
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length > 0) {
                        this.setData({
                            ppp_list: data.data
                        })
                    }
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        app.initAuth()
                    }
                }
            },
            complete: () => {
                this.data.loading_num--;
                if (this.data.loading_num == 0) {
                    wx.hideLoading()
                }
            }
        })
    },

    //前往录音页
    goDub(e) {
        app.aldstat.sendEvent('进入配音', '录音列表进入')
        var data = e.currentTarget.dataset.data;
        wx.navigateTo({
            url: '/pages/dubbing/dubbing?video_uuid=' + data.video_uuid
        })
    }
})