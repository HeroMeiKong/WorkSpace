//app.js
App({
    onLaunch: function (options) {
        //this.onMusicTap()
    },
    //是否登录，是否过期(没有fail_cb，默认前往授权页)
    isAuth(success_cb, fail_cb) {
        wx.getSetting({
            fail: res => {
                console.log(res)
            },
            success: (res) => {
                console.log(res.authSetting)
                if (res.authSetting['scope.userInfo'] && wx.getStorageSync('loginSessionKey')) {
                    this.getUserInfo(success_cb)
                } else {
                    if (fail_cb) {
                        fail_cb()
                    } else {
                        var text = wx.getStorageSync('loginSessionKey') ? '授权过期' : '请先授权登录'
                        if (wx.getStorageSync('loginSessionKey')) {
                            console.log(text)
                        }
                        wx.navigateTo({
                            url: '/pages/auth/auth'
                        })
                    }

                }
            }
        })
    },

    //获取用户信息到globalData
    getUserInfo: function (fun) {
        if (this.globalData.userInfo) {
            typeof fun == "function" && fun(this.globalData.userInfo)
        } else {
            wx.getUserInfo({
                success: (res) => {
                    res.userInfo.avatarUrl = res.userInfo.avatarUrl ? res.userInfo.avatarUrl : this.globalData.default_avatarUrl
                    this.globalData.userInfo = res.userInfo
                    typeof fun == "function" && fun(this.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        userInfo: null,     //用户信息
        shareImg: 'https://www.newscctv.net/dw/resource/future/share_normal.png',   //默认分享图片
        shareText: '两会燃烧卡路里',   //默认分享文字
        default_avatarUrl: 'https://s-js.sports.cctv.com/host/resource/future/3mrtx.png',//默认头像路径
    },
    /*创建背景音乐*/
    onMusicTap() {
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = '此时此刻';
        backgroundAudioManager.epname = '此时此刻';
        backgroundAudioManager.singer = '许巍';
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000';
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
        backgroundAudioManager.play();
        backgroundAudioManager.onPlay(() => {
            console.log("音乐播放开始");
        })
        backgroundAudioManager.onEnded(() => {
            console.log("音乐播放结束");
        })
    }
})