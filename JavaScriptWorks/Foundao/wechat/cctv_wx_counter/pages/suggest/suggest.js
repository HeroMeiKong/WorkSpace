// pages/destination/destination.js
const promisify = require('../../utils/promisify')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    //显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    this.scrollBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      //右上角转发
      return {
        title: '“两会”走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },

  //获取留言列表
  getList: function (isChangePage) {
    wx.request({
      url: 'https://common.newcomment.cntv.cn/data/list',
      header: {'content-type': 'application/json'}, // 默认值
      data: {
        app: 'wxapp2019cal',
        itemid: 'lianghui2019',
        avata: 1, //返回用户头像
        page: isChangePage ? this.data.page : 1
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        //隐藏导航栏加载框
        wx.hideNavigationBarLoading()
        //停止下拉动作
        wx.stopPullDownRefresh()
        //隐藏加载框
        wx.hideLoading()
        if (res.data.code / 1 === 0) {
          const data = res.data.data
          const lists = this.data.lists
          data.content.forEach((item, index) => {   //时间戳转换为日期
            const date = new Date()
            date.setTime(item.dateline*1000)
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            const D = date.getDate() + '  '
            const H = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
            const m = (date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes())
            item.time = M+D+H+m
          })
          if (isChangePage) {
            data.content.forEach((item, index) => {
              lists.push(item)
            })
            this.setData({
              lists: lists
            })
          } else {
            this.setData({
              lists: data.content,
              page: 1
            })
          }
        } else {
          console.log(res.data.data.msg)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  //滑动到底部 翻页
  scrollBottom: function () {
    this.setData({
      page: (this.data.page + 1)
    }, () => {
      this.getList(true)
    })
  },

  //跳转留言页面
  message: function () {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },

})