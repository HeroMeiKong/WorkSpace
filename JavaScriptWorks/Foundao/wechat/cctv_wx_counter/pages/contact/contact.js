// pages/contact/contact.js
import api from './../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  getContact (e) {
    console.log('getContact')
    console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  sendContact () {
    console.log('sendContact')
    if(this.data.phoneNumber){
      if(this.data.phoneNumber.length === 11){
        const number = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if(number.test(this.data.phoneNumber)){
          //是正规电话号码
          wx.showModal({
            title: '若您已经填写过手机号码请勿重复填写，此次操作将会覆盖上一次的手机号码！请确认您最新且有效的手机号码为：',
            content: this.data.phoneNumber,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                wx.request({
                  url: api.user_info,
                  data: {
                    mobile: this.data.phoneNumber
                  },
                  header: {
                    'content-type':'application/x-www-form-urlencoded',
                    'auth-token': wx.getStorageSync('loginSessionKey')
                  },
                  method: 'POST',
                  success: (result)=>{
                    console.log(result)
                    wx.showToast({
                      title: '发送成功，谢谢',
                      icon: 'success',
                      duration: 1500,
                      mask: true,
                    });
                  },
                  fail: ()=>{
                    wx.showToast({
                      title: '发送失败！请您重新尝试！',
                      icon: 'none',
                      duration: 1500,
                      mask: true,
                    });
                  },
                });
              }
            },
          });
        } else {
          wx.showToast({
            title: '电话号码有误！',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      } else {
        wx.showToast({
          title: '电话号码有误！',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    } else {
      wx.showToast({
        title: '电话号码不能为空！',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  }
})