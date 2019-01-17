// pages/testVideo/testVideo.js
const app = getApp()
let videolock = true //视频是否播放

Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoSrc: '',
        videolock: false,
        isIpx: false,
        showpause: 'none'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('onLoad')
        this.setData({
            videoSrc: options.videourl
        })
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
        this.videoContext = wx.createVideoContext('myVideo')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    // clickVideo(e) {
    //     console.log('clickVideo')
    //     if (this.data.videolock) {
    //         this.videoContext.play()
    //     } else {
    //         this.videoContext.pause()
    //     }
    //     this.setData({
    //         videolock: !this.data.videolock
    //     })
    // },
    pauseThis(e) {
        console.log('pauseThis')
        if (videolock) {
            this.videoContext.pause()
            this.setData({
                showpause: 'flex'
            })
            videolock = false
        } else {
            console.log('还没有播放！')
        }
    },
    playThis(e) {
        console.log('playThis')
        this.videoContext.play()
        videolock = true
        this.setData({
            showpause: 'none'
        })
    },
    // closeVideo (e) {
    //   console.log('closeVideo')
    //   wx.navigateBack({
    //     delta: 1
    //   });
    // },
    videoEnd(e) {
        console.log('videoEnd')
        this.videoContext.stop()
        this.videoContext.play()
    },
    // 返回
    goBack(e) {
        console.log(getCurrentPages())
        if (getCurrentPages().length === 1) {
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },
})