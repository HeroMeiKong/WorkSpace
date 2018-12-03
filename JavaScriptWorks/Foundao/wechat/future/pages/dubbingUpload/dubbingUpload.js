// pages/dubbingUpload/dubbingUpload.js
import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.showTabBar();
    // this.ctx = wx.createCameraContext()
    wx.setEnableDebug({
      enableDebug: true,
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
  shotingVideo: function () {
    console.log('shotingVideo')
    wx.navigateTo({
      url: '/pages/preview/preview?usermethod=camera'
    })
  },
  uploadLocalVideo: function () {
    console.log('uploadLocalVideo')
    wx.navigateTo({
      url: '/pages/preview/preview?usermethod=album'
    })
  },
  dubbing (e) {
    console.log('dubbing')
    wx.switchTab({
      url: '/pages/recordList/recordList'
    })
  }
})