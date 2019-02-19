// pages/destination/destination.js
const promisify = require('../../utils/promisify')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists : [
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      },
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      },
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      },
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      },
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      },
      {
        name : '哈哈哈',
        time : '01-11 10:22',
        content : '的撒娇恐龙当家按时考虑到骄傲卡老实交代克拉斯自行车把这些吗，从你怎么，那可接受的请叫我接口卵巢囊肿买些， 脑残这么些年离开家按时考虑到',
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url : 'https://common.newcomment.cntv.cn/data/list',
      header : {'content-type': 'application/json'}, // 默认值
      data : {
        app : 'wxapp2019cal',
        itemid : 'lianghui2019',
        avata : 1, //返回用户头像
      },
      method : 'GET',
      dataType : 'json'
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
  
  //跳转留言页面
  message : function () {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },

})