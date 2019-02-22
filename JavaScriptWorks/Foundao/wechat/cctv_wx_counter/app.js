//app.js
App({
    onLaunch: function (options) {
        this.onMusicTap()
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
        musicSrc: 'https://s-js.sports.cctv.com/host/resource/map/bgMusic.mp3'
    },
    /*创建背景音乐*/
    onMusicTap() {
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = 'Spring In My Step';
        backgroundAudioManager.epname = 'Spring In My Step';
        backgroundAudioManager.singer = 'Silent Partner';
        backgroundAudioManager.coverImgUrl = 'https://s-js.sports.cctv.com/host/resource/map/bgMusicPic.jpg';
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = this.globalData.musicSrc;
        backgroundAudioManager.play();
        backgroundAudioManager.onPlay(() => {
            console.log("音乐播放开始");
        })
        backgroundAudioManager.onEnded(() => {
            console.log("音乐播放结束");
        })
    },
    onShow() {
        // console.log('onpageshow');
    },
    onHide() {
        // console.log('onpagehide')
        wx.pauseBackgroundAudio();
    }
})