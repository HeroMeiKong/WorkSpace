// pages/testVideo/testVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc: '',
    videolock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.setData({
      videoSrc: options.videourl
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
  clickVideo (e) {
    console.log('clickVideo')
    if(this.data.videolock){
      this.videoContext.play()
    } else {
      this.videoContext.pause()
    }
    this.setData({
      videolock: !this.data.videolock
    })
  },
  // closeVideo (e) {
  //   console.log('closeVideo')
  //   wx.navigateBack({
  //     delta: 1
  //   });
  // },
  videoEnd (e) {
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