// pages/index/index.js
import api from './../../config/api';
const app = getApp()
let hasShowModal = false //是否有showModal
let userinfo = false //获取用户信息授权
let werun = false //获取用户步数授权
let inMap = false //用户是否已经授权

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false, //是否初始化
        showRule_flag: false, //显示游戏规则
        showGameTips_flag: false, //显示游戏提示
        hasAuthorize: 'none', //用户已授权
        showCover: 'flex', //显示遮罩层
        showActivity: 'none',//活动是否结束
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.onMusicTap(); //进入页面创建背景音乐
        console.log('onLoad')
        inMap = options.inMap
        hasShowModal = false
        userinfo = false
        werun = false
        options.share_uuid ? app.globalData.share_uuid = options.share_uuid : app.globalData.share_uuid = ''
        wx.showShareMenu({
            withShareTicket: true,
        })
        wx.getSystemInfo({
            success(res) {
                app.globalData.systemInfo = res
            }
        })
        // this.getQuestion()
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
        app.isAuth(() => {
            //统计
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
            } else {
                console.log('已初始化')
            }
            this.isFisrt()
        })
        if (!this.data.hasGetRunData) {
            console.log('还没有获取用户步数')
            this.getLogin(true)
        } else {
            console.log('已经获取用户步数')
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

    //显示规则浮层
    showRule() {
        this.setData({
            showRule_flag: true
        })
    },
    //关闭规则浮层
    closeRule() {
        this.setData({
            showRule_flag: false
        })
    },

    //显示游戏提示浮层
    showGameTips() {
        this.setData({
            showGameTips_flag: true
        })
    },
    //关闭游戏提示浮层
    closeGameTips() {
        this.setData({
            showGameTips_flag: false
        })
    },

    // 点击地图
    go_map(event) {
        var map_id = event.currentTarget.dataset.id
        wx.showToast({
            title: '您选择了线路' + map_id
        })
        app.globalData.map_id = map_id
        wx.setStorageSync('route', map_id);
        let time = setTimeout(()=>{
            wx.redirectTo({
                url: '/pages/map/map',
                success: (result) => {
                    wx.request({
                        url: api.selectRoute,
                        data: {
                            user_way_id: map_id
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'auth-token': wx.getStorageSync('loginSessionKey')
                        },
                        method: 'POST',
                        success: (result) => {},
                        fail: () => {},
                        complete: () => {}
                    });
                },
            });
            clearTimeout(time)
        },500)
    },

    //判断用户是否第一次打开app
    isFisrt() {
        var first_flag = parseInt(wx.getStorageSync('isFirst'));
        if (!first_flag) {
            wx.setStorageSync('isFirst', 1);
            this.showGameTips();
        }
    },

    //用户跳转页面
    gotoMap(route) {
        if (!app.globalData.ischange) {
            app.globalData.map_id = route
            wx.redirectTo({
                url: '/pages/map/map',
            });
            app.globalData.ischange = true
        }
    },
    //获取用户登陆信息
    getLogin(isSet) {
        //isSet是否存储用户信息
        console.log('getLogin')
        wx.login({
            timeout: 10000,
            success: (result) => {
                wx.getUserInfo({
                    success: (res) => {
                        const signature = res.signature
                        if (isSet) {
                            app.globalData.userInfo = res.userInfo
                            this.getRunData(api.backGetUserCalorie, result.code, signature, isSet)
                            //setTimeout(() => {
                            //由于连着放，两个请求会忽略一个，所以设置延时
                            this.getLogin(!isSet)
                            //}, 10000)
                        } else {
                            this.getRunData(api.getUserCalorie, result.code, signature, false)
                        }
                    }
                })
            },
            fail: () => {},
            complete: () => {}
        });
    },

    //获取步数
    getRunData(url, code, signature, isFont) {
        //isSet是否获取步数
        console.log('getRunData')
        let that = this
        wx.getWeRunData({
            success: (res) => {
                if (!app.globalData.hasGetRunData) {
                    wx.showLoading({
                        title: '加载数据中',
                        mask: true,
                    });
                }
                const encryptedData = res.encryptedData
                const iv = res.iv
                this.setData({
                    hasAuthorize: 'none'
                })
                wx.request({
                    url: url,
                    data: {
                        code: code,
                        encryptedData: encryptedData,
                        iv: iv,
                        wx_sign: signature
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'auth-token': wx.getStorageSync('loginSessionKey')
                    },
                    method: 'POST',
                    success: (re) => {
                        if (!isFont) {
                            console.log('发送前端步数请求成功!')
                            wx.hideLoading();
                            app.globalData.steps = re.data.data || ''
                            app.globalData.allData = re.data.count || ''
                            app.globalData.map_id = parseInt(wx.getStorageSync('route'));
                            //this.getACode()//获取二维码
                            if (!app.globalData.map_id) {
                                wx.setStorageSync('route', re.data.count.user_way_id || 0);
                            }
                            if (app.globalData.allData) {
                                switch (app.globalData.allData.start_end) {
                                    case -10086:
                                        wx.showToast({
                                            title: '活动未开始！',
                                            icon: 'none',
                                            duration: 1500,
                                            mask: true,
                                        });
                                        break;
                                    case -10087:
                                        if (re.data.count && re.data.count.user_way_id > 0) {
                                            this.gotoMap(re.data.count.user_way_id)
                                        }
                                        app.globalData.hasGetRunData = true
                                        break;
                                    case -10088:
                                        that.setData({
                                            showActivity: 'flex'
                                        })
                                        break;
                                    default:
                                        if (re.data.count && re.data.count.user_way_id > 0) {
                                            this.gotoMap(re.data.count.user_way_id)
                                        }
                                        app.globalData.hasGetRunData = true
                                        break;
                                }
                            } else {
                                wx.showToast({
                                    title: '刷新数据失败！请重新尝试',
                                    icon: 'none',
                                    duration: 1500,
                                    mask: true,
                                });
                            }
                        } else {
                            console.log('发送后端步数请求成功!')
                            this.setData({
                                showCover: 'none'
                            })
                        }
                    },
                    fail: () => {
                        wx.showToast({
                            title: '刷新数据失败！请重新尝试',
                            icon: 'none',
                            duration: 1500,
                            mask: true,
                        });
                    },
                    complete: () => {}
                });
            },
            fail: (res) => {
                console.log('用户拒绝获取步数')
                if (!isFont) {
                    this.showModal()
                }
            }
        })
    },
    //弹窗提示用户
    showModal() {
        console.log('showModal')
        if (!inMap) {
            wx.openSetting({
                success: (e) => {
                    userinfo = e.scope.userInfo
                    werun = e.scope.werun
                }
            })
            if (!hasShowModal && !(userinfo && werun)) {
                hasShowModal = true
                wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        if (result.confirm) {
                            wx.openSetting({})
                        } else {
                            this.setData({
                                hasAuthorize: 'flex'
                            })
                        }
                    },
                    fail: () => {},
                    complete: () => {
                        hasShowModal = false
                    }
                });
            }
        }
    },
    quit() {
        console.log('quit')
        this.setData({
            hasAuthorize: 'none'
        })
        this.getLogin(true)
    },
    //获取二维码
    // getACode() {
    //     console.log('getACode')
    //     wx.request({
    //         url: 'https://a-js.sports.cctv.com/calorie/api/erweima.php',
    //         data: {
    //             material_id: app.globalData.allData.uuid,
    //             page: '/pages/index/index',
    //             scene: 1,
    //             width: 188,           // 二维码的宽度
    //             auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
    //             line_color: {"r": "255", "g": "255", "b": "255"},
    //             is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
    //         },
    //         header: {
    //             'auth-token': wx.getStorageSync('loginSessionKey')
    //         },
    //         method: 'POST',
    //         success: (result)=>{
    //             console.log(result)
    //         },
    //         fail: ()=>{},
    //         complete: ()=>{}
    //     })
    // },
})