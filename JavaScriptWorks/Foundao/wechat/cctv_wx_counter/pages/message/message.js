// pages/destination/destination.js
const promisify = require('../../utils/promisify')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  //留言失去焦点
  bindblur:function (e) {
    this.setData({
      content : e.detail.value
    })
  },

  //返回留言列表
  backList: function () {
    wx.navigateBack({
      delta : 1, //返回的页面数
    })
  },

  //提交留言
  submit : function () {
    var _this = this
    // wx.request({
    //   url : 'https://newcomment.cntv.cn/comment/post',
    //   methor : 'POST',
    //   dataType : 'json',
    //   header : {'content-type': 'application/json'}, // 默认值
    //   data : {
    //     app : 'wxapp2019cal',
    //     itemid : 'lianghui2019',
    //     message : _this.data.content,
    //
    //   }
    // })
  }

})