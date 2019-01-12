// pages/newYear/newYear.js
import api from './../../config/api';

let nickName = ''
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //视频屏幕高度
let previewbox = 0
let videolock = false //视频是否播放
let autovideolock = true //兼容有些手机视频自动播放
let computeMethod = 'height' //视频比例计算方式

Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    alldata: [],
    avatar: [{id: 0,name: '',yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 1,name: '',yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 2,name: '',yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 3,name: '',yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'}],
    //whos: '请选择',
    whodata: [],
    row1: [],//第一排拜年对象
    row2: [],//第二排拜年对象
    row3: [],//第三排拜年对象
    showFirst: 'flex',
    showSecond: 'none',
    previewsize: {height: 0,width: 0},//预览视频的大小
    showpause: 'flex',
    showThird: 'none',
    showovercover: 'none',
    compose_success: false,
    originMovableview: {x: 0,y: 0},
    chooseone: {host_id: -1,select_person_id: -1},
    video_title: {host: '',who: '',wish: ''},
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
        windowHeight > windowWidth ? computeMethod = 'height': computeMethod = 'width'
        let value = windowHeight/windowWidth
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
        previewbox = 69*windowWidth/75
        if(computeMethod === 'height'){
          that.data.previewsize.height = previewbox
          that.data.previewsize.width = previewbox/value
        } else {
          that.data.previewsize.width = previewbox
          that.data.previewsize.height = previewbox*value
        }
        that.setData({
          models: that.data.models,
          originMovableview: that.data.originMovableview,
          previewsize: that.data.previewsize
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
    this.videoContext = wx.createVideoContext('myVideo')
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
          that.data.avatar[i].name = that.data.alldata[i].name
        }
        if(length > 5){
          for(let j=0;j<5;j++){
            that.data.row1.push(that.data.whodata[j])
            that.data.row1[j].class = 'nochoose'
          }
          for(let j=5;j<length;j++){
            that.data.row2.push(that.data.whodata[j])
            that.data.row2[j-5].class = 'nochoose'
          }
          if(length > 10){
            for(let j=10;j<length;j++){
              that.data.row3.push(that.data.whodata[j])
              that.data.row3[j-10].class = 'nochoose'
            }
          }
        } else {
          for(let j=0;j<length;j++){
            that.data.row1.push(that.data.whodata[j])
            that.data.row1[j].class = 'nochoose'
          }
        }
        console.log(that.data.whodata)
        that.setData({
          alldata: that.data.alldata,
          whodata: that.data.whodata,
          row1: that.data.row1,
          row2: that.data.row2,
          row3: that.data.row3,
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
        this.data.video_title.host = this.data.alldata[avatarnumber].name
      }
    }
    this.setData({
      avatar: this.data.avatar,
      chooseone: this.data.chooseone,
      video_title: this.data.video_title
    })
  },
  // bindPickerChange (e) {
  //   console.log(e)
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   const length = this.data.whodata.length
  //   for(let i=0;i<length;i++){
  //     this.data.chooseone.select_person_id = this.data.whodata[e.detail.value].id
  //     this.data.video_title.who = this.data.whodata[e.detail.value].name
  //   }
  //   this.setData({
  //     index: e.detail.value,
  //     whos: '',
  //     video_title: this.data.video_title
  //   })
  // },
  sendWish (e) {
    console.log('sendWish')
    console.log(this.data.chooseone)
    let that = this
    if(that.data.chooseone.host_id === -1){
      console.log('未选择祝福主持人')
      wx.showToast({
        title: '未选择祝福主持人',
        icon: 'loading',
        duration: 500,
        mask: false,
      });
    } else if(that.data.chooseone.select_person_id === -1){
      console.log('未选择祝福对象')
      wx.showToast({
        title: '未选择祝福对象',
        icon: 'loading',
        duration: 500,
        mask: false,
      });
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
          that.data.video_title.wish = res.data.data.wangchun_title
          that.setData({
            tempFilePath: res.data.data.wangchun_video_url,
            video_title: that.data.video_title
          })
        },
        fail: () => {
          console.log('发送祝福失败！')
        }
      })
      this.setData({
        showFirst: 'none',
        showSecond: 'flex',
        showpause: 'flex',
      })
    }
  },
  chooseSomebody (e) {
    console.log('chooseSomebody')
    console.log(e)
    const str = e.currentTarget.id
    const length = this.data.whodata.length
    for(let i=0;i<length;i++){
      this.data.whodata[i].class = 'nochoose'
    }
    for(let i=0;i<length;i++){
      if('row' + this.data.whodata[i].id === str){
        this.data.whodata[i].class = 'choose'
        this.data.chooseone.select_person_id = this.data.whodata[i].id
        this.data.video_title.who = this.data.whodata[i].name
      }
    }
    this.setData({
      video_title: this.data.video_title,
      chooseone: this.data.chooseone,
      row1: this.data.row1,
      row2: this.data.row2,
      row3: this.data.row3,
    })
  },
  backFirstPage (e) {
    console.log('backFirstPage')
    this.videoContext.pause()
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
    })
  },
  pauseThis (e) {
    console.log('pauseThis')
    autovideolock = true
    if(videolock){
      this.videoContext.pause()
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
    this.videoContext.play()
    autovideolock = false
    videolock = true
    this.setData({
      showpause: 'none'
    })
  },
  uploadContent (e) {
    console.log('uploadContent')
    this.videoContext.pause()
    let that = this
    const str = nickName+'和'+that.data.video_title.host+'给'+that.data.video_title.who+'拜年了，'+that.data.video_title.wish
    wx.request({
      url: api.sengWishSure,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: {
          host_id: that.data.chooseone.host_id,
          select_person_id: that.data.chooseone.select_person_id,
          video_title: str
        },
        success: (res) => {
          console.log('确认发布成功！')
          that.setData({
            showSecond: 'none',
            showThird: 'flex',
            showovercover: 'flex',
            compose_success: true,
          })
        },
        fail: () => {
          console.log('确认发布失败！')
          that.setData({
            showSecond: 'none',
            showThird: 'flex',
            showovercover: 'flex',
            compose_success: false,
          })
        }
    })
  },
  successBackHome (e) {
    console.log('successBackHome')
    wx.navigateBack({
      delta: 1
    })
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      showThird: 'none',
      showovercover: 'none',
      compose_success: false,
    })
  },
  checkProgress (e) {
    console.log('checkProgress')
    wx.switchTab({
      url: '/pages/user/user'
    })
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      showThird: 'none',
      showovercover: 'none',
      compose_success: false,
    })
  },
  returnSubmit (e) {
    console.log('returnSubmit')
    this.setData({
      showpause: 'flex',
      showSecond: 'flex',
      showThird: 'none',
      showovercover: 'none',
    })
  }
})