import api from "../../config/api";

const app = getApp();
const tippic = {
  right: 'https://s-js.sports.cctv.com/host/resource/map/Qright1.png',
  wrong: 'https://s-js.sports.cctv.com/host/resource/map/Qwrong2.png'
}
const tip = {
  right: '恭喜您',
  wrong: '太遗憾了'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whichQuestion: 0,
    brand: ['第一题', '第二题', '第三题', '第四题', '第五题'],
    options: [], //选项
    showOptions: [{
      show: 'none'
    }, {
      show: 'none'
    }, {
      show: 'none'
    }, {
      show: 'none'
    }], //各选项后图标的显示与隐藏
    allQuestions: [], //所有问题
    showinnercover: 'none',
    showCover: 'none',
    tip: {
      tippic: '',
      tip: '',
      title: ''
    },
    number: 0, //答对几道题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.number = 0
    this.setData({
      number: this.data.number,
      showCover: 'none',
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
    wx.request({
      url: 'https://common.itv.cctv.com/answer/detail/?iid=99023', //'https://manage.itv.cntv.net/cms/detail/index?id=487&column=2517',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.data.allQuestions = res.data.data.questions
        console.log(this.data.allQuestions)
        const length = res.data.data.questions.length
        //设置题目
        this.resetQuestion()
        this.setData({
          allQuestions: this.data.allQuestions,
          options: this.data.options
        })
      },
      fail: () => {},
      complete: () => {}
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
  onShareAppMessage: function (res) {
    console.log('onShareAppMessage')
    if (res.from === 'menu') {
      //右上角转发
      return {
        title: '“两会”走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },
  //用户点击选项
  choose(e) {
    console.log('choose')
    console.log(e.currentTarget.id)
    let which = 0
    for (let i = 0; i < 4; i++) {
      if (this.data.options[i].id === e.currentTarget.id) {
        this.data.options[i].class = 'choose'
        this.data.showOptions[i].show = 'flex'
        which = i
      }
    }
    this.findAnswer(which)
    this.delayReplace()
    this.setData({
      options: this.data.options,
      showOptions: this.data.showOptions
    })
  },
  //重制题目
  resetQuestion() {
    console.log('resetQuestion')
    this.data.options = this.data.allQuestions[this.data.whichQuestion].options
    console.log(this.data.options)
    console.log(this.data.whichQuestion)
    for (let j = 0; j < 4; j++) {
      if (this.data.options[j].is_right === '1') {
        this.data.options[j].image = 'https://s-js.sports.cctv.com/host/resource/map/Qright2.png'
      } else {
        this.data.options[j].image = 'https://s-js.sports.cctv.com/host/resource/map/Qwrong1.png'
      }
      this.data.options[j].class = 'nochoose'
    }
    this.setData({
      showinnercover: 'none',
      options: this.data.options,
      showOptions: [{
        show: 'none'
      }, {
        show: 'none'
      }, {
        show: 'none'
      }, {
        show: 'none'
      }],
    })
  },
  //下一题
  nextQuestion() {
    console.log('nextQuestion')
    if (this.data.whichQuestion < 4) {
      //不是最后一题
      this.data.whichQuestion++
      this.resetQuestion()
    } else {
      //最后一题
      let currTime = new Date();
      let currentDate = currTime.getFullYear() + '-' + (currTime.getMonth() + 1) + '-' + currTime.getDate() + ' ' + currTime.getHours() + ':' + currTime.getMinutes() + ':' + currTime.getSeconds();
      if (this.data.number === 0) {
        //全错
        this.data.tip.tippic = tippic.wrong
        this.data.tip.tip = tip.wrong
        this.data.tip.title = '别灰心，再接再厉，继续前进'
      } else {
        //至少答对一道
        this.data.tip.tippic = tippic.right
        this.data.tip.tip = tip.right
        this.data.tip.title = '成功燃烧' + this.data.number * 10 + '卡路里'
      }
      wx.request({
        url: api.add_calorie,
        data: {
          type: 2,
          date: currentDate,
          value: {
            "all_count": 5,
            "correct_count": this.data.number,
            "error_count": 5 - this.data.number
          },
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'auth-token': wx.getStorageSync('loginSessionKey')
        },
        method: 'POST',
        success: (result) => {
          if(result.data.data){
            app.globalData.allData.site = result.data.data.site_count
            app.globalData.allData.today = result.data.data.today
            app.globalData.allData.q_type = result.data.data.q_type
          }
          app.globalData.successAnswer = (result.data.code === 0 ? true : false)
          wx.setStorageSync('successAnswer',true)
        },
        fail: () => {
            wx.showLoading({
              title: '答题失败，请您检查网络情况并重新尝试',
              mask: true,
              success: (result)=>{
                wx.setStorageSync('successAnswer',false)
                let time = setTimeout(() => {
                  wx.hideLoading();
                },500)
              },
            });
        },
        complete: () => {
          let times = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
            clearTimeout(times)
          },1000)
        }
      });
      this.setData({
        tip: this.data.tip,
        showCover: 'flex',
      })
    }
    this.setData({
      whichQuestion: this.data.whichQuestion,
    })
  },
  //找出正确的选项
  findAnswer(which) {
    console.log('findAnswer')
    if (this.data.options[which].is_right === '1') {
      //直接下一题
      //答对加一
      this.data.number++
    } else {
      //显示正确答案
      for (let i = 0; i < 4; i++) {
        if (this.data.options[i].is_right === '1') {
          console.log(this.data.options[i].is_right)
          this.data.options[i].class = 'choose'
          this.data.showOptions[i].show = 'flex'
        }
      }
    }
    this.setData({
      number: this.data.number
    })
  },
  //延迟替换题目
  delayReplace() {
    console.log('delayReplace')
    this.setData({
      showinnercover: 'flex'
    })
    let time = setTimeout(() => {
      this.nextQuestion()
    }, 1000)
  },
})