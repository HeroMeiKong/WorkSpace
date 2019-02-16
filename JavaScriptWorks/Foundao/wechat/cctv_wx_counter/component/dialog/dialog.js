Component ({
  /**
   * 组件的属性列表
   */
  properties : {
    dialog_type : {   //弹框类型
      type : Number,
      value : 1    //1表示昨日未达到目标，2表示到达站点，3表示还剩最后一站
    },
    calorieNum : {   //差卡路里数量
      type : Number,
      value : 1
    },
    siteName : {  //站点名
      type : String,
      value : ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lineBg : 'https://s-js.sports.cctv.com/host/resource/map/bounced_lineBg.png',
    siteBg : 'https://s-js.sports.cctv.com/host/resource/map/bounced_siteBg.png',
    isDialog : true, //是否显示弹框
    isNewsList : false, //是否显示新闻列表弹框
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toAnswer () {
      console.log('去答题')
      this.setData({
        isDialog : false
      })
      wx.navigateTo({
        url : '/pages/question/question'
      })
    },
    viewNews () {
      console.log('看热点')
      this.setData({
        isNewsList : true,
        isDialog : false
      })
    }
  },
})