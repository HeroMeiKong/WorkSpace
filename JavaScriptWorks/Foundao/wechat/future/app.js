//app.js
import api from './config/api';
import PubSub from "./utils/pubSub";

const promisify = require('./utils/promisify');
const ald = require('./utils/ald-stat');
const aldstat = require('./utils/ald-stat');
const pubSub = require('./utils/pubSub');
const wxRequest = promisify(wx.request);


App({
    pubSub: new PubSub(),
    onLaunch: function (options) {
        //渠道码
        this.globalData.pt = options.query.pt || '';
        wx.getSystemInfo({
            success: (res) => {
                console.log(res)
            }
        });
    },

    // PV UV  -> statistics_pv
    statistics_pv(options = {}) {
        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        const vir_ID = wx.getStorageSync('vir_ID') || '';
        console.log('vir_ID:')
        console.log(vir_ID)
        wxRequest({
            url: api.statistics_pv,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": loginSessionKey
            },
            data: {
                op: options.op || '',
                wz: options.wz || '',
                uniqueid: options.uniqueid || '',
                pt: this.globalData.pt || '',
                vir_ID: vir_ID || '',
                id: options.id || '',
                source: options.source || ''
            },
        }).then(resp => {
            const {code, msg, data} = resp.data;
            if (code === 0) {

            } else {
                console.log('PV统计失败: ' + msg)
            }
            wx.setStorage({
                key: "vir_ID",
                data: data.vir_ID
            });
        }).catch(err => {
            console.log('PV统计接口错误');
        })
    },
    // vv -> statistics_play_v
    statistics_play_v(options) {
        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        wxRequest({
            url: api.statistics_click,
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": loginSessionKey
            },
            data: {
                video_uuid: options.video_uuid || '',
                // type: options.type || ''
            },
        }).then(resp => {
            const {code, msg} = resp.data;
            if (code === 0) {
                console.log('vv统计成功')
            } else {
                console.log('vv统计失败: ' + msg)
            }
        }).catch(err => {
            console.log('vv统计接口错误');
        })
    },

    //是否登录，是否过期(没有fail_cb，默认前往授权页)
    isAuth(success_cb, fail_cb) {
        var _this = this
        wx.getSetting({
            success: (res) => {
                console.log(res.authSetting)
                if (res.authSetting['scope.userInfo'] && wx.getStorageSync('loginSessionKey')) {
                    // wx.checkSession({
                    //     success: () => {
                    //         // 接口调用成功的回调函数，session_key未过期
                    //         console.log('check token 完毕')
                    //         _this.getUserInfo(success_cb)
                    //     },
                    //     fail: () => {
                    //         //删除过期key
                    //         wx.removeStorageSync('loginSessionKey');
                    //         if (fail_cb) {
                    //             fail_cb()
                    //         } else {
                    //             wx.navigateTo({
                    //                 url: '/pages/auth/auth'
                    //             })
                    //         }
                    //     }
                    // })
                    _this.getUserInfo(success_cb)
                } else {
                    var text = wx.getStorageSync('loginSessionKey') ? 'token有效，没有授权' : 'token无效'
                    wx.showToast({
                        title: 'text',
                        duration: 2000
                    })
                    if (fail_cb) {
                        fail_cb()
                    } else {
                        wx.navigateTo({
                            url: '/pages/auth/auth'
                        })
                    }
                }
            }
        })
    },


    initAuth() {
        wx.removeStorageSync('loginSessionKey');
        wx.navigateTo({
            url: '/pages/auth/auth'
        })
    },


    //获取用户信息到globalData
    getUserInfo: function (fun) {
        var _this = this
        if (this.globalData.userInfo) {
            typeof fun == "function" && fun(this.globalData.userInfo)
        } else {
            wx.getUserInfo({
                success: function (res) {
                    _this.globalData.userInfo = res.userInfo
                    typeof fun == "function" && fun(_this.globalData.userInfo)
                }
            })
        }
    },

    login_auth(userInfo_wx, fun) {
        var _this = this
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                _this.code = res.code;
                wx.getUserInfo({
                    success: function (res) {
                        wx.showLoading()
                        wx.request({
                            url: api.login_auth,
                            method: 'POST',
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                wx_sign: res.signature,
                                raw_user_data: res.rawData,
                                code: _this.code
                            },
                            success: (resp) => {
                                const {code, data, msg} = resp.data;
                                if (code === 0) {
                                    console.log(data.token, 'data.token');
                                    wx.setStorageSync('loginSessionKey', data.token)
                                    fun && fun()
                                } else {
                                    wx.showToast({
                                        title: msg,
                                        icon: 'none'
                                    })
                                }
                            },
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    }
                })
            }
        });
    },

    isFullScreen(fun) {
        wx.getSystemInfo({
            success: (res) => {
                const {screenWidth, screenHeight, windowHeight, windowWidth} = res;
                if (windowHeight / windowWidth > 1.8) {
                    //全面屏
                    fun && fun()
                }
            }
        });
    },

    isPhoneX(fun) {
        wx.getSystemInfo({
            success: (res) => {
                const {model} = res;
                if (model.indexOf('iPhone X') > -1) {
                    fun && fun()
                }
            }
        });
    },


    globalData: {
        userInfo: null,
        pt: '',
        shareImg: 'https://www.newscctv.net/dw/resource/future/share_normal.png',
        shareText: '我在逗牛短视频里玩配音拍视频，现在邀你来玩哦~'
    }
})