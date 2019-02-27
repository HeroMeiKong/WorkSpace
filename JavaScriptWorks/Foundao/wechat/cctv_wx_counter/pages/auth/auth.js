// pages/auth/auth.js
import api from './../../config/api';

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showActivity: 'none'
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
        wx.removeStorageSync('loginSessionKey')
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
    onShareAppMessage: function (res) {
        console.log('onShareAppMessage')
        if (res.from === 'menu') {
            //右上角转发
            return {
                title: '两会，走起来',
                path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
                imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
            }
        }
    },

    //获取用户信息，将相关用户信息传给后台，获取token，并存在storage中
    getUserInfo: function (e) {
        var _this = this
        e.detail.userInfo.avatarUrl = e.detail.userInfo.avatarUrl ? e.detail.userInfo.avatarUrl : app.globalData.default_avatarUrl
        app.globalData.userInfo = e.detail.userInfo
        wx.removeStorageSync('loginSessionKey')
        wx.login({
            success: res => {
                wx.showLoading({
                    mask: true
                })
                wx.getUserInfo({
                    success: function (re) {
                        wx.request({
                            url: api.login_auth,
                            method: 'POST',
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                wx_sign: re.signature,
                                raw_user_data: re.rawData,
                                code: res.code,
                                share_uuid: app.globalData.share_uuid
                            },
                            success: (resp) => {
                                const {code, data, msg} = resp.data;
                                if (code === 0) {
                                    wx.setStorageSync('loginSessionKey', data.token)
                                    wx.navigateBack();
                                } else {
                                    if(resp.data.data && resp.data.data.start_end === -10088){
                                        _this.setData({
                                            showActivity: 'flex'
                                        })
                                    } else {
                                        wx.showToast({
                                            title: '活动未开始……请静候佳音！',
                                            icon: 'none',
                                            duration: 1500,
                                            mask: true,
                                        });
                                    }
                                    try {
                                        wx.removeStorageSync('key')
                                    } catch (e) {
                                        // Do something when catch error
                                    }
                                }
                            },
                            fail(res) {
                                console.log('login_auth fail')
                                console.log(res)
                            },
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    },
                    complete: function (re) {
                        wx.hideLoading()
                    }
                })
            }
        });
    },


})