// pages/newYear/newYear.js
import api from './../../config/api';

let nickName = ''
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //视频屏幕高度
let previewbox = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    alldata: [],
    avatar: [{id: 0,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 1,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 2,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 3,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'}],
    whos: '请选择',
    whodata: [],
    who: [],
    showFirst: 'flex',
    showSecond: 'none',
    showThird: 'none',
    showovercover: 'none',
    compose_success: false,
    originMovableview: {x: 0,y: 0},
    chooseone: {host_id: -1,select_person_id: -1},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth
        windowHeight = res.windowHeight
        that.data.oldCoordinatey = 0
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
        }
        that.data.originMovableview.x = windowWidth/2 - 40
        that.data.originMovableview.y = windowHeight/2 -40
        previewbox = 69*windowWidth/75
        that.setData({
          models: that.data.models,
          originMovableview: that.data.originMovableview,
        })
      }
    })
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        nickName = userInfo.nickName
        console.log(nickName)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.request({
      url: api.query_host_family,
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": wx.getStorageSync('loginSessionKey'),
      },
      success: (res) => {
        console.log(res)
        const length = res.data.count.length
        that.data.alldata = res.data.data
        that.data.whodata = res.data.count
        for(let i=0;i<4;i++){
          that.data.avatar[i].no = that.data.alldata[i].host_pic
          that.data.avatar[i].yes = that.data.alldata[i].host_pic_select
          that.data.avatar[i].choose = that.data.alldata[i].host_pic
        }
        for(let j=0;j<length;j++){
          that.data.who.push(that.data.whodata[j].name)
        }
        console.log(that.data.whodata)
        console.log(that.data.who)
        that.setData({
          alldata: that.data.alldata,
          whodata: that.data.whodata,
          who: that.data.who,
          avatar: that.data.avatar
        })
      },
      fail: () => {
        console.log('请求头像失败！')
      }
    })
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
  chooseAvatar (e) {
    console.log('chooseAvatar')
    const length = this.data.avatar.length
    const avatarnumber = e.currentTarget.id
    console.log(avatarnumber)
    for(let i=0;i<length;i++){
      if(i !== avatarnumber && this.data.avatar[i].choose === this.data.avatar[i].yes){
        this.data.avatar[i].choose = this.data.avatar[i].no
      }
      if(this.data.avatar[avatarnumber].choose !== this.data.avatar[avatarnumber].yes){
        this.data.avatar[avatarnumber].choose = this.data.avatar[avatarnumber].yes
        this.data.chooseone.host_id = this.data.alldata[avatarnumber].id
      }
    }
    this.setData({
      avatar: this.data.avatar,
      chooseone: this.data.chooseone
    })
  },
  bindPickerChange (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const length = this.data.whodata.length
    for(let i=0;i<length;i++){
      this.data.chooseone.select_person_id = this.data.whodata[e.detail.value].id
    }
    this.setData({
      index: e.detail.value,
      whos: ''
    })
  },
  sendWish (e) {
    console.log('sendWish')
    console.log(this.data.chooseone)
    let that = this
    if(that.data.chooseone.host_id === -1){
      console.log('未选择祝福主持人')
    } else if(that.data.chooseone.select_person_id === -1){
      console.log('未选择祝福对象')
    } else {
      wx.request({
        url: api.sendWish,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: {
          host_id: that.data.chooseone.host_id,
          select_person_id: that.data.chooseone.select_person_id
        },
        success: (res) => {
          console.log(res)
          that.setData({
            tempFilePath: res.data.data.wangchun_video_url
          })
        },
        fail: () => {
          console.log('发送祝福失败！')
        }
      })
      this.setData({
        showFirst: 'none',
        showSecond: 'flex',
      })
    }
  },
  backFirstPage (e) {
    console.log('backFirstPage')
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
    })
  },
  pauseThis (e) {
    console.log('pauseThis')
    autovideolock = true
    if(videolock){
      this.videoContext1.pause()
      //innerAudioContext.pause()
      preInnerAudioContext.pause()
      this.setData({
        showpause: 'flex'
      })
      videolock = false
    } else {
      console.log('还没有播放！')
    }
  },
  playThis (e) {
    console.log('playThis')
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    this.videoContext1.play()
    //innerAudioContext.play()
    preInnerAudioContext.play()
    autovideolock = false
    videolock = true
    this.setData({
      showpause: 'none'
    })
  },
})