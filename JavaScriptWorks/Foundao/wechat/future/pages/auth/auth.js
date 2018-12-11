// pages/auth/auth.js
import api from './../../config/api';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        isIpx: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('auth onLoad')
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.removeStorage({
            key: 'loginSessionKey',
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
    // onShareAppMessage: function () {
    //
    // },

    //获取用户信息，将相关用户信息传给后台，获取token，并存在storage中
    getUserInfo: function (e) {
        // console.log('用户点击授权：')
        // console.log(e)
        var _this = this
        app.globalData.userInfo = e.detail.userInfo
        wx.login({
            success: res => {
                wx.showLoading({
                    mask: true
                })
                console.log('code:')
                console.log(res.code)
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
                                code: res.code
                            },
                            success: (resp) => {
                                console.log('login_auth:')
                                console.log(resp)
                                const {code, data, msg} = resp.data;
                                if (code === 0) {
                                    console.log(data.token, 'data.token');
                                    wx.setStorageSync('loginSessionKey', data.token)
                                    //返回上一层页面
                                    wx.navigateBack();
                                } else {
                                    // wx.showToast({
                                    //     title: msg,
                                    //     icon: 'none'
                                    // })
                                    wx.removeStorage({
                                        key: 'loginSessionKey',
                                    })
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
                    complete:function (re) {
                        wx.hideLoading()
                    }
                })


            }
        });
    },
})