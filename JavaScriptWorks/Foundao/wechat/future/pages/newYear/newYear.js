// pages/newYear/newYear.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    avatar: [{id: 1,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 2,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 3,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'},{id: 4,yes: '../../assets/images/4cancel.png',no: '../../assets/images/4add.png',choose: '../../assets/images/4add.png'}],
    whos: '请选择',
    who: ['爷爷','爸爸'],
    showFirst: 'none',
    showSecond: 'none',
    showThird: 'flex',
    showovercover: 'none',
    compose_success: false,
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
    const avatarnumber = e.currentTarget.id - 1
    console.log(avatarnumber)
    for(let i=0;i<length;i++){
      if(i !== avatarnumber && this.data.avatar[i].choose === this.data.avatar[i].yes){
        this.data.avatar[i].choose = this.data.avatar[i].no
      }
      if(this.data.avatar[avatarnumber].choose !== this.data.avatar[avatarnumber].yes){
        this.data.avatar[avatarnumber].choose = this.data.avatar[avatarnumber].yes
      }
    }
    this.setData({
      avatar: this.data.avatar
    })
  },
  bindPickerChange (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      whos: ''
    })
  },
  sendWish (e) {
    console.log('sendWish')
    this.setData({
      showFirst: 'none',
      showSecond: 'flex',
    })
  }
})