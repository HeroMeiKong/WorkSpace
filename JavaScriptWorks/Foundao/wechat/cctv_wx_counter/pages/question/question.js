// pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whichQuestion: 0,
    options: [{id: 1, title: 'A.10亿', pic: 'https://s-js.sports.cctv.com/host/resource/map/Qwrong2.png',class: 'nochoose',is_right: 0},
              {id: 2, title: 'A.10亿', pic: 'https://s-js.sports.cctv.com/host/resource/map/Qwrong2.png',class: 'nochoose',is_right: 0},
              {id: 3, title: 'A.10亿', pic: 'https://s-js.sports.cctv.com/host/resource/map/Qright2.png',class: 'nochoose',is_right: 1},
              {id: 4, title: 'A.10亿', pic: 'https://s-js.sports.cctv.com/host/resource/map/Qwrong2.png',class: 'nochoose',is_right: 0}],
    showOptions: [{show: 'none'},{show: 'none'},{show: 'none'},{show: 'none'}],
    allQuestions: [],
    showinnercover: 'none'
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
    wx.request({
      url: 'https://common.itv.cntv.cn/answer/detail/42326',
      header: {'content-type':'application/json'},
      success: (res)=>{
        console.log(res)
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //用户点击选项
  choose (e) {
    console.log('choose')
    console.log(e.currentTarget.id)
    this.data.options[e.currentTarget.id-1].class = 'choose'
    this.data.showOptions[e.currentTarget.id-1].show = 'flex'
    this.findAnswer(this.data.whichQuestion)
    this.delayReplace()
    this.setData({
      options: this.data.options,
      showOptions: this.data.showOptions
    })
  },
  //重制题目
  resetQuestion (e) {
    console.log('resetQuestion')
    this.data.options = this.data.allQuestions[this.data.whichQuestion]
  },
  //下一题
  nextQuestion () {
    console.log('nextQuestion')
    if(this.data.whichQuestion < 4){
      //不是最后一题
      this.resetQuestion()
      this.data.whichQuestion++
    } else {
      //最后一题
    }
    this.setData({
      whichQuestion: this.data.whichQuestion
    })
  },
  //找出正确的选项
  findAnswer (which) {
    console.log('findAnswer')
    if(this.data.options[which].is_right === '1'){

    } else {
      for(let i=0;i<4;i++){
        if(this.data.options[i].is_right === '1'){
          this.data.options[i].class = 'choose'
          this.data.showOptions[i].show = 'flex'
        }
      }
    }
  },
  //延迟替换题目
  delayReplace () {
    console.log('delayReplace')
    this.setData({
      showinnercover: 'flex'
    })
    let time = setTimeout(()=>{
      this.nextQuestion()
    },2000)
  }
})