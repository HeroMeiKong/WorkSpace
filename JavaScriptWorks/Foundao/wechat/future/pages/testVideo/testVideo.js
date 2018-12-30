// pages/testVideo/testVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    //videoSrc: '',
    videoSrc: 'http://mvvideo10.meitudata.com/5bb979eff1770ck81jr2t86233_H264_1_441c6244ca0c12.mp4?k=d3cb8e451bdb2a4da4ee2eefc59da773&t=5c29f59a',
    videolock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    console.log(options)
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
          //iphoneX
          that.data.models = 'iphoneX'
        } else if (res.model.indexOf("BLA-AL00") > -1) {
          //huaweimate10plus
          that.data.models = 'huaweimate10plus'
        } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
          //OnePlus5T
          that.data.models = 'oneplus5t'
        } else if (res.model.indexOf("MI 8") > -1) {
          //xiaomi8
          that.data.models = 'xiaomi8'
        } else {
          //其他机型
          that.data.models = 'defaultmodel'
        }
        that.setData({
          models: that.data.models
        })
      }
    })
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
  closeVideo (e) {
    console.log('closeVideo')
    wx.navigateBack({
      delta: 1
    });
  }
})