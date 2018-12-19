// pages/dubbingUpload/dubbingUpload.js
import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    wx.getSystemInfo({
      success: function (res) {
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    wx.showTabBar();
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
    console.log(shootsuccess)
    const shootsuccess = app.shootsuccess
    if(shootsuccess){
      wx.navigateTo({
        url: '/pages/preview/preview?usermethod=camera'
      })
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
  }
})