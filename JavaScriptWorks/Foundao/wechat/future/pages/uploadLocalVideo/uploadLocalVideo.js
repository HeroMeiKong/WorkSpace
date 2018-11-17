// pages/uploadLocalVideo/uploadLocalVideo.js
const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();
var windowWidth = 0
var lock = false
var oldRightImgX = 0
var rightImgX = 0
var oldLeftImgX = 0
var originLeftImgL = 0
var originRightImgR = 0
var average = 0
var maxWidth = 0
var minWidth = 0 
var oldBarWidth = 0
var oldBarLeft = 0
var oldBarRight = 0
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    duration: 0,
    times: '10s-30s',
    barWidth: 0,//'75%',
    barLeft: 0,//'12.5%',
    barRight: 0,//'12.5%',
    display: 'none',
    moveBarWidth: '10%',
    barinnerWidth: '80%',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    wx.setEnableDebug({
      enableDebug: true,
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('width=' + res.windowWidth);
        windowWidth = res.windowWidth
        maxWidth = windowWidth * 0.6 + 2 * windowWidth * 0.075
        minWidth = windowWidth * 0.2 + 2 * windowWidth * 0.075
      }
    })
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res)
        console.log('选取视频')
        wx.showToast({
          title: res.tempFilePath,
          icon: 'success',
          duration: 2000
        })
        that.setData({
          tempFilePath: res.tempFilePath,
          duration: res.duration,
          size: (res.size / (1024 * 1024)).toFixed(2),
          display: 'flex',
          moveBarWidth: windowWidth*0.075,
          barinnerWidth: windowWidth*0.6,
          barWidth: windowWidth*0.75,
          barLeft: windowWidth*0.125,
          barRight: windowWidth*0.125,
        })
        wx.showLoading({
          title: '处理中',
        })
        average = that.computerDuration(that.data.duration, windowWidth)
        if (average * 30 > windowWidth){
          //maxWidth = average*30
          that.setData({
            //barWidth: windowWidth,
            times: that.data.duration+'s',
          })
        } else{
          //maxWidth = average * 30
          that.setData({
            //barWidth: maxWidth,
            times: '30s',
          })
        }
        //上传视频，取得视频服务器地址
        // wx.uploadFile({
        //   url: api.upload,
        //   filePath: that.data.tempFilePath,
        //   name: 'filename',
        //   header: {
        //     'content-type': 'multipart/form-data',
        //     "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
        //   },
        //   formData: {
        //     upload_type: 'tmp',
        //     filename: that.data.tempFilePath,
        //   },
        //   success(res) {
        //     const data = JSON.parse(res.data)
        //     wx.showToast({
        //       title: '上传成功',
        //     })
        //     console.log(data)
        //     that.setData({
        //       tempFilePath: data.data.file_path
        //     })
        //   }
        // })
      },
      fail: function (e) {
        console.log(e)
      }
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
  gotoVideo(){
    var average = this.computerDuration(this.data.duration, windowWidth)
    var that = this
    var video = wx.createVideoContext('video')
    video.seek(10)
    //video.pause()
    console.log('pause')
  },
  computerDuration(duration, width) {
    return width / duration
  },
  //触发移动图标
  activeLeft(e){
    console.log('activeLeft')
    lock = true
    oldLeftImgX = e.changedTouches[0].pageX
    oldBarWidth = this.data.barWidth
    oldBarLeft = this.data.barLeft
  },
  activeRight(e) {
    console.log('activeRight')
    console.log(e)
    lock = true
    oldRightImgX = e.changedTouches[0].pageX
    oldBarWidth = this.data.barWidth
    oldBarRight = this.data.barRight
  },
  //移动左图标
  leftImgMove(e){
    console.log('leftImgMove')
    var that = this
    if(lock === true){
      var leftImgX = e.changedTouches[0].pageX - oldLeftImgX
      if (that.data.barLeft > windowWidth * 0.125) {
        if (that.data.barWidth > minWidth){
          this.setData({
            barWidth: (oldBarWidth - leftImgX) > maxWidth ? maxWidth : (oldBarWidth - leftImgX),
            barLeft: (oldBarLeft + leftImgX) < windowWidth * 0.125 ? windowWidth * 0.125 : (oldBarLeft + leftImgX)
          })
        } else if (that.data.barWidth <= minWidth){
          this.setData({
            barWidth: (oldBarWidth - leftImgX) < minWidth ? minWidth : (oldBarWidth - leftImgX),
            barLeft: (oldBarLeft + leftImgX) > windowWidth * 0.525 ? windowWidth * 0.525 : (oldBarLeft + leftImgX)
          })
        }
      } else if (that.data.barLeft = windowWidth * 0.125){
        if (leftImgX < 0){
          console.log('max')
        } else{
          this.setData({
            barWidth: oldBarWidth - leftImgX,
            barLeft: oldBarLeft + leftImgX
          })
        }
      } else {
        this.setData({
          barWidth: oldBarWidth,
          barLeft: windowWidth * 0.125
        })
      }
    } else {
      wx.showToast({
        title: '请长按触发移动左剪切条',
      })
    }
  },
  //移动右图标
  rightImgMove(e) { 
    console.log('rightImgMove')
    var that = this
    if (lock === true) {
      var rightImgX = e.changedTouches[0].pageX - oldRightImgX
      if (that.data.barRight > windowWidth * 0.125) {
        if (that.data.barWidth > minWidth) {
          console.log('111')
          this.setData({
            barWidth: (oldBarWidth + rightImgX) > maxWidth ? maxWidth : (oldBarWidth + rightImgX),
            barRight: (oldBarRight + rightImgX) < windowWidth * 0.125 ? windowWidth * 0.125 : (oldBarRight + rightImgX)
          })
        } else if (that.data.barWidth <= minWidth) {
          console.log('222')
          this.setData({
            barWidth: (oldBarWidth + rightImgX) < minWidth ? minWidth : (oldBarWidth + rightImgX),
            barRight: (oldBarRight - rightImgX) > windowWidth * 0.525 ? windowWidth * 0.525 : (oldBarRight - rightImgX)
          })
        }
      } else if (that.data.barRight = windowWidth * 0.125) {
        if (rightImgX > 0) {
          console.log('333')
        } else {
          console.log('444')
          this.setData({
            barWidth: oldBarWidth + rightImgX,
            barRight: oldBarRight - rightImgX
          })
        }
      } else {
        console.log('555')
        this.setData({
          barWidth: oldBarWidth,
          barRight: windowWidth * 0.125
        })
      }
    } else {
      wx.showToast({
        title: '请长按触发移动右剪切条',
      })
    }
  },
  deactiveMove(){
    console.log('touchend')
    lock = false
  }
})