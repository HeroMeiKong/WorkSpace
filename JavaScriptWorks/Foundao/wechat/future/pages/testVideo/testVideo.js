// pages/testVideo/testVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc: 'http://mvvideo10.meitudata.com/5bb979eff1770ck81jr2t86233_H264_1_441c6244ca0c12.mp4?k=d3cb8e451bdb2a4da4ee2eefc59da773&t=5c29f59a'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    console.log(options)
    this.setData({
      videoSrc: options.videourl
    })
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

  }
})