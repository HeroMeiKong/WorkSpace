// pages/newYear/newYear.js
import api from './../../config/api';

let nickName = ''
let videolock = true //视频是否播放
let autovideolock = true //兼容有些手机视频自动播放

Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    windowHeight: 142,
    chooseHost: {host: -1,wish: -1},//判断是否重复选中一个主持人，即video_src有无变化，来决定showpause显示
    alldata: [],
    whodata: [],
    row1: [],//第一排拜年对象
    row2: [],//第二排拜年对象
    row3: [],//第三排拜年对象
    showFirst: 'flex',
    showSecond: 'none',
    showpause: 'none',
    showThird: 'none',
    showovercover: 'none',
    compose_success: false,
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
        console.log(res)
        if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
          //iphoneX
          that.data.models = 'iphoneX'
          that.data.windowHeight = 186
        } else if (res.model.indexOf("BLA-AL00") > -1) {
          //huaweimate10plus
          that.data.models = 'huaweimate10plus'
          that.data.windowHeight = 142
        } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
          //OnePlus5T
          that.data.models = 'oneplus5t'
          that.data.windowHeight = 142
        } else if (res.model.indexOf("MI 8") > -1) {
          //xiaomi8
          that.data.models = 'xiaomi8'
          that.data.windowHeight = 172
        } else {
          that.data.windowHeight = 142
        }
        that.setData({
          models: that.data.models,
          windowHeight: that.data.windowHeight
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
        for(let i=1;i<4;i++){
          that.data.alldata[i].pick = 'nopick'
        }
        if(length > 4){
          for(let j=0;j<4;j++){
            that.data.row1.push(that.data.whodata[j])
          }
          for(let j=4;j<length;j++){
            that.data.row2.push(that.data.whodata[j])
          }
          if(length > 8){
            for(let j=8;j<length;j++){
              that.data.row3.push(that.data.whodata[j])
            }
          }
        } else {
          for(let j=0;j<length;j++){
            that.data.row1.push(that.data.whodata[j])
          }
        }
        that.data.alldata[0].pick = 'pick'
        that.data.chooseone.host_id = this.data.alldata[0].id
        that.data.video_title.host = this.data.alldata[0].name
        that.data.whodata[0].class = 'choose'
        that.data.chooseone.select_person_id = this.data.whodata[0].id
        that.setData({
          alldata: that.data.alldata,
          whodata: that.data.whodata,
          chooseone: that.data.chooseone,
          video_title: that.data.video_title,
          row1: that.data.row1,
          row2: that.data.row2,
          row3: that.data.row3,
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
    console.log('onHide')
    // this.videoContext.pause()
    // this.setData({
    //   showpause: 'flex',
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  chooseAvatar (e) {
    console.log('chooseAvatar')
    const length = this.data.alldata.length
    const avatarnumber = e.currentTarget.id
    let whichone = -1
    for(let i=0;i<length;i++){
      if(this.data.alldata[i].id === avatarnumber){
        whichone = i
      }
    }
    for(let j=0;j<length;j++){
      if(j !== whichone && this.data.alldata[j].pick === 'pick'){
        this.data.alldata[j].pick = 'nopick'
      }
      if(this.data.alldata[whichone].pick !== 'pick'){
        this.data.alldata[whichone].pick = 'pick'
        this.data.chooseone.host_id = this.data.alldata[whichone].id
        this.data.video_title.host = this.data.alldata[whichone].name
      }
    }
    this.setData({
      alldata: this.data.alldata,
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
    let that = this
    let showPage = {showFirst: 'none',showSecond: 'flex'}
    // if(that.data.chooseone.host_id === -1){
    //   console.log('未选择祝福主持人')
    //   wx.showToast({
    //     title: '未选择祝福主持人',
    //     icon: 'loading',
    //     duration: 500,
    //     mask: false,
    //   });
    // } else if(that.data.chooseone.select_person_id === -1){
    //   console.log('未选择祝福对象')
    //   wx.showToast({
    //     title: '未选择祝福对象',
    //     icon: 'loading',
    //     duration: 500,
    //     mask: false,
    //   });
    // } else {
    if(that.data.chooseone.host_id === that.data.chooseHost.host && that.data.chooseone.select_person_id === that.data.chooseHost.wish){
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      that.setData({
        showpause: 'flex',
      })
      showPage = {showFirst: 'none',showSecond: 'flex'}
    } else {
      videolock = true
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
          console.log(res.data.code)
          if(res.data.code === 0){
            showPage = {showFirst: 'none',showSecond: 'flex'}
            wx.showLoading({
              title: '加载中',
              mask: true,
            })
            that.data.video_title.wish = res.data.data.wangchun_title
            that.data.chooseHost.host = that.data.chooseone.host_id
            that.data.chooseHost.wish = that.data.chooseone.select_person_id
            that.setData({
              tempFilePath: res.data.data.wangchun_video_url,
              video_title: that.data.video_title,
              chooseHost: that.data.chooseHost,
              showpause: 'none',
            })
          } else {
            showPage = {showFirst: 'flex',showSecond: 'none'}
            wx.showLoading({
              title: '请求失败',
              mask: true,
            })
          }
        },
        fail: () => {
          console.log('发送祝福失败！')
        }
      })
    }
    let time = setTimeout(() => {
      wx.hideLoading()
      clearTimeout(time)
      this.setData({
        showFirst: showPage.showFirst,
        showSecond: showPage.showSecond,
      })
    }, 1000)
    //}
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
    // wx.request({
    //   url: 'https://web-happy.foundao.com/host/api/api/wangchun_poster_qrcode.php',
    //   method: 'POST',
    //   header: {
    //     "auth-token": wx.getStorageSync('loginSessionKey'),
    //   },
    //   data: {
    //     material_id: '7678123456789',
    //     // material_id: '1',
    //     page: 'pages/dubbingUpload/dubbingUpload',
    //     scene: decodeURIComponent('12'),
    //     //path: '/pages/index/index?video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
    //     // path: 'pages/dubbing/dubbing',
    //     // path: 'pages/index/index',
    //     width: 720,           // 二维码的宽度
    //     auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
    //     line_color: {"r": "255", "g": "255", "b": "255"},
    //     // line_color: {"r": "0", "g": "0", "b": "1"},
    //     is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
    //   },
    //   success: (res) => {
    //     console.log('生成二维码成功！')
    //   },
    //   fail: (res) => {
    //     console.log('生成二维码失败！')
    //   }
    // })
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
  videoend (e) {
    console.log('videoend')
    this.videoContext.stop()
    this.setData({
      showpause: 'flex'
    })
  },
  videoAutoPlay (e) {
    console.log('videoAutoPlay')
  },
  uploadContent (e) {
    console.log('uploadContent')
    this.videoContext.pause()
    let that = this
    //const str = nickName+'和'+that.data.video_title.host+'给'+that.data.video_title.who+'拜年了，'+that.data.video_title.wish
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
          video_title: that.data.video_title.wish //str
        },
        success: (res) => {
          console.log('确认发布成功！')
          that.setData({
            //showSecond: 'none',
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
  },
  goBack(e) {
    console.log('goBack')
    console.log(getCurrentPages())
    if (getCurrentPages().length === 1) {
        wx.switchTab({
            url: '/pages/index/index',
        })
    } else {
        wx.navigateBack({
            delta: 1
        })
    }
  },
})