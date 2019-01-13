// pages/dubbingUpload/dubbingUpload.js
import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDiyTabBar:false,
    showOrHidden: ["flex","flex","flex"]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    wx.request({
      url: api.showOrhidden,
      success: (res) => {
        console.log(res.data.data)
        const length = res.data.data.length
        for(let i=0;i<length;i++){
          that.data.showOrHidden[i] = res.data.data[i].online
        }
        that.setData({
          showOrHidden: that.data.showOrHidden
        })
      },
      fail: (e) => {
        console.log('请求失败111')
      }
    })
    //wx.showTabBar();
    // this.ctx = wx.createCameraContext()
    // wx.setEnableDebug({
    //   enableDebug: true,
    // })
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
    // wx.showTabBar();
      this.hideTabBar()
    app.isAuth(() => {
      if (!this.data.hasInit) {
          console.log('未初始化')
          this.data.hasInit = true
          wx.getUserInfo({
              success: (res) => {
                  this.data.userInfo = res.userInfo
                  // var nickName = userInfo.nickName
                  // var avatarUrl = userInfo.avatarUrl
                  // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  // var province = userInfo.province
                  // var city = userInfo.city
                  // var country = userInfo.country
              }
          })
      } else {
          console.log('已初始化')
      }
    })
    console.log('shootsuccess')
    const shootsuccess = app.shootsuccess
    console.log(shootsuccess)
    if(shootsuccess){
      console.log('不可能啊！')
      wx.navigateTo({
        url: '/pages/preview/preview?usermethod=camera'
      })
    } else {
      console.log('取消下一步')
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
  shotingVideo: function () {
    console.log('shotingVideo')
    wx.navigateTo({
      url: '/pages/preview/preview?usermethod=camera&showTiems=true'
    })
  },
  uploadLocalVideo: function () {
    console.log('uploadLocalVideo')
    wx.navigateTo({
      url: '/pages/preview/preview?usermethod=album&showTiems=true'
    })
  },
  dubbing (e) {
    console.log('dubbing')
    wx.navigateTo({
      url: '/pages/recordList/recordList'
    })
  },

  // 隐藏原生tabbar，并显示自定义tabbar
  hideTabBar() {
        wx.hideTabBar();
        setTimeout(() => {
            this.showDiyTabBar();
        }, 100)
  },

  // 显示自定义tabbar
  showDiyTabBar() {
        this.setData({
            showDiyTabBar: true
        })
  },
  newYear (e) {
    console.log('newYear')
    wx.navigateTo({
      url: '/pages/newYear/newYear'
    })
  },
  superMatch (e) {
    console.log('superMatch')
    wx.navigateTo({
      url: '/pages/ppp/ppp'
    })
  },
  superTest (e) {
    console.log('superTest')
    wx.navigateTo({
      url: '/pages/superTest/superTest'
    })
  }
})