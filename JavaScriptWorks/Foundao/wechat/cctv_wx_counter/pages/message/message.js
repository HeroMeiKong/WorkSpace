// pages/destination/destination.js
const promisify = require('../../utils/promisify')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : '',
    userName :'',
    userHead : '',
    unionId : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userName = app.globalData.userInfo.nickName
    const userHead = app.globalData.userInfo.avatarUrl
    const unionId = app.globalData.allData.unionId
    this.setData({
      userName : userName,
      userHead : userHead,
      unionId : unionId
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
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      //右上角转发
      return {
        title: '两会，走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },

  //输入流言
  bindinput:function (e) {
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
    let timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000  //当前时间戳
    const {unionId,content,userHead,userName} = this.data
    const data = 'urlencode(base64(uid='+unionId+'&time='+timestamp+'))' //匿名留言参数，组成格式为：urlencode(base64(uid=xx&time=1xxx))。uid为任意整数，time为当前uninx时间戳，urlencode, base64 对应两种编码方式。
    if(!content){
      wx.showToast({
        title: '请输入留言内容',
        icon : 'none'
      })
      return
    }
    wx.showLoading()
    wx.request({
      url : 'https://newcomment.cntv.cn/comment/post',
      methor : 'POST',
      dataType : 'json',
      header : {'content-type': 'application/json'}, // 默认值
      data : {
        app : 'wxapp2019cal',
        itemid : 'lianghui2019',
        message : content,
        pic : userHead, //用户头像
        authorid : unionId, //用户id，匿名留言传任意整数
        author : userName, //用户名，匿名留言传任意值
        data : data
      },
      success : res=>{
        wx.hideLoading()
        if(res.data.code/1 === 0){
          wx.showToast({
            title: '成功',
            icon : 'success',
            mask : true,
            duration : 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta : 1, //返回的页面数
            })
          },2000)
        }else {
          wx.showToast({
            title: res.data.msg,
            icon : 'none',
            mask : true
          })
        }
      },
      fail : err=>{
        wx.hideLoading()
        wx.showToast({
          title: err,
          icon : 'none',
          mask : true
        })
      }
    })
  }

})