//app.js
App({
    onLaunch: function () {

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

    //分享
    onShareAppMessage: function (res) {
        console.log('onShareAppMessage')
        console.log(res.from)
          if (res.from === 'button') {
              console.log('分享地址：')
              console.log('/pages/video/video?scene=sucai_' + this.data.cur_video.id)
              return {
                  title: this.data.cur_video.video_desc,
                  path: '/pages/video/video?scene=sucai_' + this.data.cur_video.id,
                  imageUrl: this.data.cur_video.share_pic || this.data.cur_video.pic,
              }
          } else {
              return {
                  title: '央视虚拟主持人祝新年！携“四小福”，祝大家新春快乐，大吉大利！',
                  path: '/pages/newYear/newYear',
                  imageUrl: app.globalData.shareImg,
              }
          }
    
    },
})