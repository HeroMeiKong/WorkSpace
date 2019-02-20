// pages/rank/rank.js
import api from './../../config/api';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    userName : '',//当前用户昵称
    userHead : '', //当前用户头像
    user_rank: {}, //当前用户数据
    rank_list: []  //排行列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCalorieList()
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
    this.getCalorieList()
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

  //获取卡路里排行榜
  getCalorieList :function(isChangePage) {
    wx.request({
      url: api.calorie_rank,
      header: {
        'auth-token': wx.getStorageSync('loginSessionKey'),
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      dataType: 'json',
      data: {
        page: isChangePage ? this.data.page : 1
      },
      success: res => {
        //隐藏导航栏加载框
        wx.hideNavigationBarLoading()
        //停止下拉动作
        wx.stopPullDownRefresh()
        //隐藏加载框
        wx.hideLoading()
        if(res.data.code /1 === 0){
          const userInfo = app.globalData.userInfo
          const nick_name = userInfo.nickName
          const nick_pic = userInfo.avatarUrl
          const data = res.data.data
          const rank_list = this.data.rank_list
          if(isChangePage){
            data.rank_list.forEach((item,index)=>{
              rank_list.push(item)
            })
            this.setData({
              rank_list: rank_list
            })
          }else {
            this.setData({
              userName: nick_name,
              userHead: nick_pic,
              user_rank: data.user_rank,
              rank_list: data.rank_list,
              page :1
            })
          }
        }else {
          console.log(res.data.data.msg)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  //滑动到底部 翻页
  scrollBottom : function () {
    this.setData({
      page : (this.data.page+1)
    },()=>{
      this.getCalorieList(true)
    })
  },

})