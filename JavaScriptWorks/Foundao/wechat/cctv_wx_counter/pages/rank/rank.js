// pages/rank/rank.js
import api from './../../config/api';

const app = getApp()
const promisify = require('../../utils/promisify')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPoster: false,
    page: 1,
    userName: '',//当前用户昵称
    userHead: '', //当前用户头像
    user_rank: {}, //当前用户数据
    rank_list: [],  //排行列表
    top1_bg: 'https://s-js.sports.cctv.com/host/resource/map/top1_head.png',
    top2_bg: 'https://s-js.sports.cctv.com/host/resource/map/top2_head.png',
    top3_bg: 'https://s-js.sports.cctv.com/host/resource/map/top3_head.png',
    chengxuma : 'https://s-js.sports.cctv.com/host/resource/map/eqcode_1.jpg'
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
        title: '两会，走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },

  //获取步数排行榜
  getCalorieList: function (isChangePage) {
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
        if (res.data.code / 1 === 0) {
          const userInfo = app.globalData.userInfo
          const nick_name = userInfo.nickName
          const nick_pic = userInfo.avatarUrl
          const data = res.data.data
          const rank_list = this.data.rank_list
          if (isChangePage) {
            data.rank_list.forEach((item, index) => {
              rank_list.push(item)
            })
            this.setData({
              rank_list: rank_list
            })
          } else {
            this.setData({
              userName: nick_name,
              userHead: nick_pic,
              user_rank: data.user_rank,
              rank_list: data.rank_list,
              page: 1
            }, () => {
              this.getImages()
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
      this.getCalorieList(true)
    })
  },

  //打开海报页面
  saveBox: function () {
    this.setData({
      isPoster: true
    })
  },

  //关闭海报页面
  closePoster: function () {
    this.setData({
      isPoster: false
    })
  },

  //保存海报按钮
  savePoster: function () {
    this.saveImg()
    this.setData({
      isPoster: false
    })
  },

  //加载网络图片
  getImages() {
    const ctx = wx.createCanvasContext('posterCanvas')
    var _this = this
    const getBgImg = promisify(wx.getImageInfo)
    const getchengxumaImg = promisify(wx.getImageInfo)
    const getHeadImg = promisify(wx.getImageInfo)

    getBgImg({src: 'https://s-js.sports.cctv.com/host/resource/map/poster_bg.png'}).then(res1 => {
      const bg_url = res1
      getchengxumaImg({src: 'https://s-js.sports.cctv.com/host/resource/map/eqcode_1.jpg'}).then(res2 => {
        const chengxuma_url = res2
        const head = this.data.userHead

        getHeadImg({src: head}).then(res3 => {
          const head_url = res3
          //  开始绘制
          //绘制背景图片
          ctx.drawImage(bg_url.path, 0, 0, bg_url.width, bg_url.height, 0, 0, 500, 890)
          ctx.save()
          //绘制程序码图片
          ctx.drawImage(chengxuma_url.path, 0, 0, chengxuma_url.width, chengxuma_url.height, 360, 750, 100, 100)
          ctx.save()

          //绘制名字
          const userName = _this.data.userName
          ctx.setFontSize(27)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#84C158')
          ctx.setTextBaseline('top')
          ctx.fillText(userName, 250, 447 + 19)
          ctx.save()

          //绘制名次和步数
          const rank = '名次'
          const calorie = '步数'
          ctx.setFontSize(22)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#84C158')
          ctx.setTextBaseline('top')
          ctx.fillText(rank, 63 + 23, 510 + 15)
          ctx.fillText(calorie, 63 + 23, 572 + 15)
          ctx.save()

          //绘制名次和步数的数字
          const rank_num = this.data.user_rank.rank
          const colorie_num = this.data.user_rank.calorie
          ctx.setFontSize(34)
          ctx.setTextAlign('right')
          ctx.setFillStyle('#84C158')
          ctx.setTextBaseline('top')
          ctx.fillText(rank_num, 431, 501 + 15)
          ctx.fillText(colorie_num, 431, 563 + 15)
          ctx.save()

          //绘制头像
          ctx.beginPath() //开始创建一个路径
          //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  第四个参数是起始弧度，第五个参数是终止弧度，第六个参数是绘图方向  默认是false，即顺时针
          ctx.arc(213 + 41, 366 + 41, 41, Math.PI * 2, false)
          ctx.fill();
          ctx.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
          ctx.drawImage(head_url.path, 213, 366, 82, 82)
          ctx.restore() //恢复状态
          ctx.draw(false, _this.create_poster)
        })
      }).catch(err => {
        console.log('err:', err)
      })
    })
  },


  //生成海报
  create_poster() {
    var _this = this
    const canvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    canvasToTempFilePath({
      canvasId: 'posterCanvas',
      x: 0, //画布区域左上角的横坐标
      y: 0, // 画布区域左上角的纵坐标
      width: 750, //画布区域宽度
      height: 1206, //画布区域高度
      fileType: 'png', //输出图片的格式
      quality: 1.0,//图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理
      destWidth: 520, //输出的图片的宽度,width*屏幕像素密度
      destHeight: 890
    }).then(res => {
      console.log(res.tempFilePath)
      _this.setData({
        poster_url: res.tempFilePath  //生成文件的临时路径
      })
    }).catch(err => {
      console.log('err:', err)
    })
  },

  //保存海报
  saveImg() {
    var _this = this
    const getSetting = promisify(wx.getSetting)  //获取用户的当前设置
    getSetting().then(res => {
      if (!res.authSetting['scope.writePhotosAlbum']) { //如果未授权照片功能
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
            _this.save_photo_sure()
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '前进步数 申请获得保存图片到相册的权限',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({})
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      } else {
        _this.save_photo_sure()  //直接保存
      }
    })
  },

  //确认保存
  save_photo_sure() {
    var _this = this
    wx.showLoading()
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.poster_url,
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          mask: true
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          mask: true
        })
      }
    })
  },

})