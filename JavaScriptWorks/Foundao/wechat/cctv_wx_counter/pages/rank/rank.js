// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rank_num : 123123, //用户排名数
    calorie_num : 111222, //卡路里数
    mode : 'scaleToFill', //缩放模式：不保持纵横比缩放图片，使图片完全适应
    rank_arr : [    //排行榜
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2018/12/10/4736261798435536187.jpg',
        name : '哈哈哈',
        calorie : 12311,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634137649186845.jpg',
        name : '呵呵呵',
        calorie : 9311,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634135656892176.jpg',
        name : '呼呼呼',
        calorie : 8654,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634131273845222.jpg',
        name : '嘻嘻嘻',
        calorie : 7543,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634128040037015.jpg',
        name : '嘿嘿嘿',
        calorie : 6431,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634121442398124.jpg',
        name : '嚯嚯嚯',
        calorie : 4313,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634118716100185.jpg',
        name : '咳咳咳',
        calorie : 1551,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634105738923178.jpg',
        name : '啊啊啊啊啊啊啊啊啊',
        calorie : 443,
      },
      {
        head_img : 'https://test-bjnews.oss-cn-beijing.aliyuncs.com/image/2019/01/27/4753634113972340756.jpg',
        name : '哦哦哦哦哦哦哦',
        calorie : 3,
      },
    ]
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

  }
})