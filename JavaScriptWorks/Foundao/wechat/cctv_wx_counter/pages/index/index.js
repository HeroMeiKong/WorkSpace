// pages/index/index.js
import api from './../../config/api';
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false, //是否初始化
        showRule_flag: false, //显示游戏规则
        showGameTips_flag: false, //显示游戏提示
        hasGetRunData: false, //是否获取用户步数
        hasAuthorize: 'none', //用户已授权
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.onMusicTap(); //进入页面创建背景音乐
        console.log('onLoad')
        wx.getSystemInfo({
            success(res) {
                app.globalData.systemInfo = res
            }
        })
        this.getQuestion()
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
        console.log(app.globalData.uuid)
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
        wx.redirectTo({
            url: '/pages/map/map',
            success: (result) => {
                app.globalData.map_id = map_id
                wx.setStorageSync('route', map_id);
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
                    success: (result) => {
                        console.log(result)
                    },
                    fail: () => {},
                    complete: () => {}
                });
            },
        });
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
                            this.getRunData(api.getUserCalorie, result.code, signature, isSet)
                            setTimeout(() => {
                                //由于连着放，两个请求会忽略一个，所以设置延时
                                this.getLogin(!isSet)
                            }, 10000)
                        } else {
                            this.getRunData(api.backGetUserCalorie, result.code, signature, false)
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
        wx.getWeRunData({
            success: (res) => {
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
                        if (isFont) {
                            console.log('发送前端步数请求成功!')
                            app.globalData.steps = re.data.data || ''
                            app.globalData.allData = re.data.count || ''
                            app.globalData.map_id = parseInt(wx.getStorageSync('route'));
                            this.getACode()//获取二维码
                            if (!app.globalData.map_id) {
                                wx.setStorageSync('route', re.data.count.user_way_id);
                            }
                            if (re.data.count && re.data.count.user_way_id > 0) {
                                this.gotoMap(re.data.count.user_way_id)
                            }
                            this.setData({
                                hasGetRunData: true
                            })
                        } else {
                            console.log('发送后端步数请求成功!')
                        }
                    },
                    fail: () => {},
                    complete: () => {}
                });
            },
            fail: (res) => {
                console.log('用户拒绝获取步数')
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
                    complete: () => {}
                });
            }
        })
    },
    quit() {
        console.log('quit')
        this.setData({
            hasAuthorize: 'none'
        })
        this.getLogin(true)
    },
    //分享
    onShareAppMessage: function (res) {
        console.log('onShareAppMessage')
        console.log(res.from)
        if (res.from === 'menu') {
            //右上角转发
            console.log('分享地址：')
            console.log('/pages/index/index?share_uuid=' + app.globalData.allData.uuid)
            return {
                title: '我为“两会”燃烧卡路里',
                path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
                imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
            }
        }
    },
    //获取二维码
    getACode() {
        console.log('getACode')
        wx.request({
            url: 'https://a-js.sports.cctv.com/calorie/api/erweima.php',
            data: {
                material_id: app.globalData.allData.uuid,
                page: 'pages/index/index',
                scene: app.globalData.allData.uuid,
                width: 188,           // 二维码的宽度
                auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
                line_color: {"r": "255", "g": "255", "b": "255"},
                is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
            },
            header: {
                'auth-token': wx.getStorageSync('loginSessionKey')
            },
            method: 'POST',
            success: (result)=>{
                console.log(result)
            },
            fail: ()=>{},
            complete: ()=>{}
        })
    },
    //获取问题
    getQuestion() {
        wx.request({
            url: 'https://common.itv.cctv.com/answer/detail',//'https://manage.itv.cntv.net/cms/detail/index?id=487&column=2517',
            header: {'content-type':'application/json'},
            success: (res)=>{
              this.data.allQuestions = res.data.data.questions
              console.log(this.data.allQuestions)
              const length = res.data.data.questions.length
              //设置题目
              this.setData({
                allQuestions: this.data.allQuestions,
                options: this.data.options
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
    },
    /*创建背景音乐*/
    // onMusicTap() {
    //     const backgroundAudioManager = wx.getBackgroundAudioManager()
    //     backgroundAudioManager.title = '此时此刻';
    //     backgroundAudioManager.epname = '此时此刻';
    //     backgroundAudioManager.singer = '许巍';
    //     backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000';
    //     // 设置了 src 之后会自动播放
    //     backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
    //     backgroundAudioManager.play();
    //     backgroundAudioManager.onPlay(() => {
    //         console.log("音乐播放开始");
    //     })
    //     backgroundAudioManager.onEnded(() => {
    //         console.log("音乐播放结束");
    //     })
    // }
})