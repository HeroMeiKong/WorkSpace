// pages/dubbingTest/dubbingTest.js
import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  shotingVideo: function () {
    wx.setEnableDebug({
      enableDebug: true,
    })
    var that = this;
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 10,
      success: function (res) {
        console.log(res)
        console.log('拍摄视频')
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            console.log(res.errMsg)
          }
        })
        wx.showToast({
          title: res.tempFilePath,
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  uploadLocalVideo: function () {
    wx.setEnableDebug({
      enableDebug: true,
    })
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 10,
      success: function (res) {
        console.log(res)
        console.log('选取视频')
        wx.showToast({
          title: res.tempFilePath,
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showTabBar();
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
    wx.setEnableDebug({
      enableDebug: true,
    })
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