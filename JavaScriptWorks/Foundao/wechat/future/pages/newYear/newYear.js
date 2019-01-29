// pages/newYear/newYear.js
const promisify = require('../../utils/promisify');
import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();

let nickName = ''
let videolock = true //视频是否播放
let autovideolock = true //兼容有些手机视频自动播放

Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    windowHeight: 142,
    chooseHost: {host: -1,wish: -1},//判断是否重复选中一个主持人，即video_src有无变化，来决定showpause显示
    alldata: [],
    whodata: [],
    row1: [],//第一排拜年对象
    row2: [],//第二排拜年对象
    row3: [],//第三排拜年对象，
    way1: [],//第一排拜年语
    way2: [],//第二排拜年语
    showFirst: 'flex',
    showSecond: 'none',
    showpause: 'none',
    showThird: 'none',
    showovercover: 'none',
    compose_success: false,
    chooseone: {host_id: -1,select_person_id: -1},
    video_title: {host: '',who: '',wish: ''},
    wrappers_width: '100%',
    wrappers_height: '100%',
    button_top: '',
    ctx: null,
    cur_video: {},
    qr_code_url: '',
    canvas_poster_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
          //iphoneX
          that.data.models = 'iphoneX'
          that.data.windowHeight = 186
        } else if (res.model.indexOf("BLA-AL00") > -1) {
          //huaweimate10plus
          that.data.models = 'huaweimate10plus'
          that.data.windowHeight = 142
        } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
          //OnePlus5T
          that.data.models = 'oneplus5t'
          that.data.windowHeight = 142
        } else if (res.model.indexOf("MI 8") > -1) {
          //xiaomi8
          that.data.models = 'xiaomi8'
          that.data.windowHeight = 172
        } else {
          that.data.windowHeight = 142
        }
        that.setData({
          models: that.data.models,
          windowHeight: that.data.windowHeight
        })
      }
    })
    // wx.getUserInfo({
    //   success(res) {
    //     const userInfo = res.userInfo
    //     nickName = userInfo.nickName
    //     console.log(nickName)
    //   }
    // })
    nickName = app.globalData.userInfo.nickName
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    // 初始化canvas
    this.createCanvas();
    let that = this
    wx.request({
      url: api.query_host_family,
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": wx.getStorageSync('loginSessionKey'),
      },
      success: (res) => {
        console.log(res)
        const length = res.data.count.length
        const lengths = res.data.data.length
        that.data.alldata = res.data.data
        that.data.whodata = res.data.count
        console.log(that.data.way1)
        console.log(that.data.way2)
        for(let i=1;i<4;i++){
          that.data.alldata[i].class = 'nochooseMessage'
        }
        //选择拜年语
        if(lengths > 2){
          for(let j=0;j<2;j++){
            that.data.way1.push(that.data.alldata[j])
          }
          for(let j=2;j<lengths;j++){
            that.data.way2.push(that.data.alldata[j])
          }
        } else {
          for(let j=0;j<lengths;j++){
            that.data.way1.push(that.data.alldata[j])
          }
        }
        //选择拜年对象
        if(length > 5){
          for(let j=0;j<5;j++){
            that.data.row1.push(that.data.whodata[j])
          }
          for(let j=5;j<length;j++){
            that.data.row2.push(that.data.whodata[j])
          }
          if(length > 10){
            for(let j=10;j<length;j++){
              that.data.row3.push(that.data.whodata[j])
            }
          }
        } else {
          for(let j=0;j<length;j++){
            that.data.row1.push(that.data.whodata[j])
          }
        }
        that.data.alldata[0].class = 'chooseMessage'
        that.data.chooseone.host_id = this.data.alldata[0].id
        that.data.video_title.host = this.data.alldata[0].name
        that.data.whodata[0].class = 'choose'
        that.data.chooseone.select_person_id = this.data.whodata[0].id
        that.setData({
          //alldata: that.data.alldata,
          whodata: that.data.whodata,
          chooseone: that.data.chooseone,
          video_title: that.data.video_title,
          row1: that.data.row1,
          row2: that.data.row2,
          row3: that.data.row3,
          way1: that.data.way1,
          way2: that.data.way2,
        })
      },
      fail: () => {
        console.log('请求头像失败！')
      }
    })
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
    console.log('onHide')
    // this.videoContext.pause()
    // this.setData({
    //   showpause: 'flex',
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // chooseAvatar (e) {
  //   console.log('chooseAvatar')
  //   //const length = this.data.alldata.length
  //   const avatarnumber = e.currentTarget.id
  //   let whichone = -1
  //   for(let i=0;i<length;i++){
  //     if(this.data.alldata[i].id === avatarnumber){
  //       whichone = i
  //     }
  //   }
  //   for(let j=0;j<length;j++){
  //     if(j !== whichone && this.data.alldata[j].pick === 'pick'){
  //       this.data.alldata[j].pick = 'nopick'
  //     }
  //     if(this.data.alldata[whichone].pick !== 'pick'){
  //       this.data.alldata[whichone].pick = 'pick'
  //       this.data.chooseone.host_id = this.data.alldata[whichone].id
  //       this.data.video_title.host = this.data.alldata[whichone].name
  //     }
  //   }
  //   this.setData({
  //     alldata: this.data.alldata,
  //     chooseone: this.data.chooseone,
  //     video_title: this.data.video_title
  //   })
  // },
  // bindPickerChange (e) {
  //   console.log(e)
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   const length = this.data.whodata.length
  //   for(let i=0;i<length;i++){
  //     this.data.chooseone.select_person_id = this.data.whodata[e.detail.value].id
  //     this.data.video_title.who = this.data.whodata[e.detail.value].name
  //   }
  //   this.setData({
  //     index: e.detail.value,
  //     whos: '',
  //     video_title: this.data.video_title
  //   })
  // },
  sendWish (e) {
    console.log('sendWish')
    let that = this
    let showPage = {showFirst: 'none',showSecond: 'flex',how: 0, button_top: 'button_top'}
    // if(that.data.chooseone.host_id === -1){
    //   console.log('未选择祝福主持人')
    //   wx.showToast({
    //     title: '未选择祝福主持人',
    //     icon: 'loading',
    //     duration: 500,
    //     mask: false,
    //   });
    // } else if(that.data.chooseone.select_person_id === -1){
    //   console.log('未选择祝福对象')
    //   wx.showToast({
    //     title: '未选择祝福对象',
    //     icon: 'loading',
    //     duration: 500,
    //     mask: false,
    //   });
    // } else {
    if(that.data.chooseone.host_id === that.data.chooseHost.host && that.data.chooseone.select_person_id === that.data.chooseHost.wish){
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      that.setData({
        showpause: 'flex',
      })
      let time = setTimeout(() => {
        wx.hideLoading()
        clearTimeout(time)
        this.setData({
          showFirst: showPage.showFirst,
          showSecond: showPage.showSecond,
          wrappers_width: showPage.how,
          wrappers_height: showPage.how,
          button_top: showPage.button_top
          // wrappers_width: 0,
          // wrappers_height: 0,
        })
      }, 1000)
      showPage = {showFirst: 'none',showSecond: 'flex',how: 0, button_top: 'button_top'}
    } else {
      videolock = true
      wx.request({
        url: api.sendWish,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: {
          host_id: that.data.chooseone.host_id,
          select_person_id: that.data.chooseone.select_person_id
        },
        success: (res) => {
          console.log(res)
          console.log(res.data.code)
          if(res.data.code === 0){
            showPage = {showFirst: 'none',showSecond: 'flex',how: 0, button_top: 'button_top'}
            wx.showLoading({
              title: '加载中',
              mask: true,
            })
            that.data.video_title.wish = res.data.data.wangchun_title
            that.data.chooseHost.host = that.data.chooseone.host_id
            that.data.chooseHost.wish = that.data.chooseone.select_person_id
            that.setData({
              tempFilePath: res.data.data.wangchun_video_url,
              video_title: that.data.video_title,
              chooseHost: that.data.chooseHost,
              showpause: 'none',
            })
          } else {
            showPage = {showFirst: 'flex',showSecond: 'none',how: '100%', button_top: ''}
            wx.showLoading({
              title: '请求失败',
              mask: true,
            })
          }
          let time = setTimeout(() => {
            wx.hideLoading()
            clearTimeout(time)
            this.setData({
              showFirst: showPage.showFirst,
              showSecond: showPage.showSecond,
              wrappers_width: showPage.how,
              wrappers_height: showPage.how,
              button_top: showPage.button_top
            })
          }, 1000)
        },
        fail: () => {
          console.log('发送祝福失败！')
        }
      })
    }
    //}
  },
  chooseSomebody (e) {
    console.log('chooseSomebody')
    console.log(e)
    const str = e.currentTarget.id
    const length = this.data.whodata.length
    for(let i=0;i<length;i++){
      this.data.whodata[i].class = 'nochoose'
    }
    for(let i=0;i<length;i++){
      if('row' + this.data.whodata[i].id === str){
        this.data.whodata[i].class = 'choose'
        this.data.chooseone.select_person_id = this.data.whodata[i].id
        this.data.video_title.who = this.data.whodata[i].name
      }
    }
    this.setData({
      video_title: this.data.video_title,
      chooseone: this.data.chooseone,
      row1: this.data.row1,
      row2: this.data.row2,
      row3: this.data.row3,
    })
  },
  chooseMessage (e) {
    console.log('chooseMessage')
    console.log(e)
    // const str = e.currentTarget.id
    // const length = this.data.alldata.length
    // for(let i=0;i<length;i++){
    //   this.data.alldata[i].class = 'nochooseMessage'
    // }
    // for(let i=0;i<length;i++){
    //   if('way' + this.data.alldata[i].id === str){
    //     this.data.alldata[i].class = 'chooseMessage'
    //     this.data.chooseone.select_person_id = this.data.alldata[i].id
    //     this.data.video_title.who = this.data.alldata[i].name
    //   }
    // }
    // this.setData({
    //   video_title: this.data.video_title,
    //   chooseone: this.data.chooseone,
    //   way1: this.data.way1,
    //   way2: this.data.way2,
    // })
    const length = this.data.alldata.length
    const avatarnumber = e.currentTarget.id
    let whichone = -1
    for(let i=0;i<length;i++){
      if(this.data.alldata[i].id === avatarnumber){
        whichone = i
      }
    }
    for(let j=0;j<length;j++){
      if(j !== whichone && this.data.alldata[j].class === 'chooseMessage'){
        this.data.alldata[j].class = 'nochooseMessage'
      }
      if(this.data.alldata[whichone].class !== 'chooseMessage'){
        this.data.alldata[whichone].class = 'chooseMessage'
        this.data.chooseone.host_id = this.data.alldata[whichone].id
        this.data.video_title.host = this.data.alldata[whichone].name
      }
    }
    this.setData({
      alldata: this.data.alldata,
      chooseone: this.data.chooseone,
      video_title: this.data.video_title,
      way1: this.data.way1,
      way2: this.data.way2,
    })
  },
  backFirstPage (e) {
    console.log('backFirstPage')
    this.videoContext.pause()
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      wrappers_width: '100%',
      wrappers_height: '100%',
      button_top: ''
    })
    // wx.request({
    //   url: 'https://web-happy.foundao.com/host/api/api/wangchun_poster_qrcode.php',
    //   method: 'POST',
    //   header: {
    //     "auth-token": wx.getStorageSync('loginSessionKey'),
    //   },
    //   data: {
    //     material_id: '7678123456789',
    //     // material_id: '1',
    //     page: 'pages/dubbingUpload/dubbingUpload',
    //     scene: decodeURIComponent('12'),
    //     //path: '/pages/index/index?video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
    //     // path: 'pages/dubbing/dubbing',
    //     // path: 'pages/index/index',
    //     width: 720,           // 二维码的宽度
    //     auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
    //     line_color: {"r": "255", "g": "255", "b": "255"},
    //     // line_color: {"r": "0", "g": "0", "b": "1"},
    //     is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
    //   },
    //   success: (res) => {
    //     console.log('生成二维码成功！')
    //   },
    //   fail: (res) => {
    //     console.log('生成二维码失败！')
    //   }
    // })
  },
  pauseThis (e) {
    console.log('pauseThis')
    autovideolock = true
    if(videolock){
      this.videoContext.pause()
      this.setData({
        showpause: 'flex'
      })
      videolock = false
    } else {
      console.log('还没有播放！')
    }
  },
  playThis (e) {
    console.log('playThis')
    this.videoContext.play()
    autovideolock = false
    videolock = true
    this.setData({
      showpause: 'none'
    })
  },
  videoend (e) {
    console.log('videoend')
    this.videoContext.stop()
    this.setData({
      showpause: 'flex'
    })
  },
  videoAutoPlay (e) {
    console.log('videoAutoPlay')
  },
  uploadContent (e) {
    console.log('uploadContent')
    this.videoContext.pause()
    let that = this
    //const str = nickName+'和'+that.data.video_title.host+'给'+that.data.video_title.who+'拜年了，'+that.data.video_title.wish
    wx.request({
      url: api.sengWishSure,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: {
          host_id: that.data.chooseone.host_id,
          select_person_id: that.data.chooseone.select_person_id,
          video_title: that.data.video_title.wish //str
        },
        success: (res) => {
          console.log('确认发布成功！')
          console.log(res)
          if(res.statusCode === 200){
            if(res.data.code === 0 && res.data.data.id !== ''){
              //调用接口成功，获取二维码
              that.data.cur_video.share_pic = res.data.data.wangchun_share_pic
              that.data.cur_video.nick_pic = res.data.data.nick_pic
              that.data.cur_video.nick_name = res.data.data.nick_name
              that.data.cur_video.video_desc = res.data.data.video_title
              that.data.cur_video.video_uuid = res.data.data.video_uuid
              that.data.cur_video.id = res.data.data.id
              wx.request({
                url: api.wangchun_poster_qrcode,
                // url: api.poster_qrcode,
                method: 'POST',
                header: {
                  "auth-token": wx.getStorageSync('loginSessionKey'),
                },
                data: {
                    material_id: res.data.data.video_uuid,
                    page: 'pages/index/index',
                    scene: 'sucai_'+res.data.data.id,
                    // material_id: res.data.data.video_uuid,
                    // path: '/pages/index/index?video_uuid=' + res.data.data.video_uuid + '&id=' + res.data.data.id,
                    width: 188,
                    auto_color: false,
                    line_color: {"r": "255", "g": "216", "b": "146"},
                    is_hyaline: false,
                },
                success: (resp) => {
                  console.log('生成二维码成功！')
                  that.data.qr_code_url = resp.data.data.file_path.replace('http://', 'https://');
                  that.create_poster()
                  that.setData({
                    cur_video: that.data.cur_video,
                    qr_code_url: that.data.qr_code_url
                  })
                },
                fail: (resp) => {
                  console.log('生成二维码失败！')
                }
              })
            }
          } else {
            that.setData({
              showSecond: 'none',
              showThird: 'flex',
              showovercover: 'flex',
              compose_success: false,
            })
          }
        },
        fail: () => {
          console.log('确认发布失败！')
          that.setData({
            showSecond: 'none',
            showThird: 'flex',
            showovercover: 'flex',
            compose_success: false,
          })
        }
    })
  },
  successBackHome (e) {
    console.log('successBackHome')
    wx.navigateBack({
      delta: 1
    })
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      showThird: 'none',
      showovercover: 'none',
      compose_success: false,
    })
  },
  checkProgress (e) {
    console.log('checkProgress')
    wx.switchTab({
      url: '/pages/user/user'
    })
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      showThird: 'none',
      showovercover: 'none',
      compose_success: false,
    })
  },
  returnSubmit (e) {
    console.log('returnSubmit')
    this.setData({
      showpause: 'flex',
      showSecond: 'flex',
      showThird: 'none',
      showovercover: 'none',
    })
  },
  goBack(e) {
    console.log('goBack')
    console.log(getCurrentPages())
    if (getCurrentPages().length === 1) {
        wx.switchTab({
            url: '/pages/index/index',
        })
    } else {
        wx.navigateBack({
            delta: 1
        })
    }
  },
  onShareAppMessage: function (res) {
    console.log('onShareAppMessage')
      if (res.from === 'button') {
          console.log('分享地址：')
          console.log('/pages/index/index?scene=sucai_' + this.data.cur_video.id)
          return {
              title: this.data.cur_video.video_desc,
              path: '/pages/index/index?scene=sucai_' + this.data.cur_video.id,
              imageUrl: this.data.cur_video.share_pic || this.data.cur_video.pic,
          }
          // return {
          //     title: this.data.cur_video.video_desc,
          //     path: '/pages/index/index?video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
          //     // path: '/pages/newYear/newYear',
          //     imageUrl: this.data.cur_video.share_pic,
          // }
      } else {
          return {
              title: '央视虚拟主持人祝新年！携“四小福”，祝大家新春快乐，大吉大利！',
              path: '/pages/newYear/newYear',
              imageUrl: app.globalData.shareImg,
          }
      }

  },
  // 创建画布对象
  createCanvas() {
    console.log('createCanvas')
    this.data.ctx = wx.createCanvasContext('canvas_poster');
  },
  // 生成海报
  create_poster() {
    var _this = this
    // const canvas_width = 750;
    // const canvas_height = 1238;
    const {userInfo, cur_video} = this.data;

    wx.showLoading({
        title: '祝福视频提交中'
    });
        const getImage = promisify(wx.getImageInfo);
        const getImage1 = promisify(wx.getImageInfo);
        const getImage2 = promisify(wx.getImageInfo);
        const getImage3 = promisify(wx.getImageInfo);
        const getImage4 = promisify(wx.getImageInfo);

        var ctx = this.data.ctx;
        // ctx.setFillStyle('#FFD892');
        // ctx.fillRect(0, 0, 750, 1238);
        ctx.setFillStyle('#a32b30');

        getImage({src: 'https://s-js.sports.cctv.com/host/resource/future/poster.png'}).then(res_bg => {
            const posterBg_img = res_bg.path;  // 背景图片
            getImage4({src: 'https://s-js.sports.cctv.com/host/resource/future/poster_0.png'}).then(resp_phone => {
                const posterBg_img_phone = resp_phone.path;  // 相机图片
                getImage1({src: ((_this.data.cur_video.share_pic).replace('http://', 'https://') + '')}).then(res_poster => {
                    var bg_img = res_poster.path;  // 封面图
                    getImage2({src: _this.data.qr_code_url}).then(res_QR => {
                        const qr_img = res_QR.path; // 二维码
                        getImage3({src: cur_video.nick_pic.replace('http://', 'https://')}).then(re_user => {
                            const user_img = re_user.path; // 头像

                            ////////////////////////开始绘制 ////////////////////////

                            // 绘制背景图
                            ctx.save();
                            ctx.drawImage(posterBg_img, 0, 0, 375, 619, 0, 0, res_bg.path.width, res_bg.path.height);

                            //绘制封面图
                            ctx.rotate(5 * Math.PI / 180);
                            ctx.drawImage(bg_img, 190, 225, 160, 140);
                            ctx.restore();

                            // 绘制手机
                            ctx.drawImage(posterBg_img_phone, 33, 25, 343, 455, 0, 0, resp_phone.path.width, resp_phone.path.height);
                            ctx.restore();

                            //绘制封面图
                            // ctx.drawImage(bg_img, 133, 126, 165, 241, sx, sy, sWidth, sHeight);

                            // 绘制头像
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(160 + 28, 28 + 28, 28, 0, Math.PI * 2, false);
                            ctx.clip();
                            ctx.drawImage(user_img, 160, 28, 56, 56);
                            ctx.restore();


                            // 绘制名称
                            ctx.font = "bold";
                            ctx.setFillStyle('#A48764');
                            ctx.setFontSize(14);
                            ctx.setTextBaseline('top')
                            ctx.setTextAlign('center')
                            ctx.fillText(cur_video.nick_name, 186, 92);

                            // 绘制描述
                            var all_str = cur_video.video_desc;
                            ctx.setFillStyle('#BA2228');
                            ctx.setFontSize(14);
                            ctx.setTextBaseline('top');
                            ctx.setTextAlign('left')
                            if (all_str.length <= 20) {
                                ctx.fillText(all_str, 53, 117);
                            } else {
                                const stringArr = Tool.stringToArr(all_str, 20);
                                stringArr.forEach((item, index) => {
                                    ctx.setFillStyle('#BA2228');
                                    ctx.setTextAlign('left')
                                    ctx.fillText(item, 53, 117 + (index * 16));
                                });
                            }

                            ctx.setFillStyle('#A48764');
                            ctx.setFontSize(13);
                            ctx.setTextBaseline('top')
                            ctx.setTextAlign('left')
                            ctx.fillText('「长按图片识别二维码查看」', 53, 158);


                            // 绘制二维码
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(38 + 35, 518 + 35, 37, 0, Math.PI * 2, false);
                            ctx.setFillStyle('#fff')
                            ctx.fill()
                            ctx.clip();
                            ctx.drawImage(qr_img, 38, 518, 70, 70);
                            // ctx.drawImage(qr_img, 40, 520, 66, 66);
                            ctx.restore();


                            // // 绘制底部文字
                            ctx.font = "bold";
                            ctx.setFillStyle('#FFD792');
                            ctx.setFontSize(13);
                            ctx.setTextBaseline('top')
                            ctx.fillText('四小福送吉祥，想要喜提你的小福？', 118, 538);
                            ctx.fillText('扫码开启偶邦湃友人工智能', 118, 556);
                            ctx.draw(false, this.create_poster_image);
                        })
                    })

                })
            })

        })


  },

  // 生成海报图片
  create_poster_image() {
      console.log('生成海报图片');
      const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
      canvasToTempFilePath({
          canvasId: 'canvas_poster',
          fileType: 'png',
          quality: 1.0,
          destWidth: 750 * 2,
          destHeight: 1238 * 2,
      }, this).then(resp => {
          // console.log(resp.tempFilePath);
          this.setData({
              canvas_poster_url: resp.tempFilePath,
              show_poster: true,
              show_select: false,
              showThird: 'flex',
              showovercover: 'flex',
              compose_success: true,
          });
          wx.hideLoading();
      }).catch(err => {
          console.log('err:', err)
          // canvas_poster_url
      });
  },

  // 保存海报
  save_poster() {
      const getSetting = promisify(wx.getSetting);
      // 判断用户是否有保存文件的权限
      getSetting().then(resp => {
          if (!resp.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: () => {
                      // 用户已经同意小程序使用录音功能，后续调用 接口不会弹窗询问
                      this.save_photo_sure();
                      console.log('用户同意保存');
                  },
                  fail: () => {
                      console.log('用户不同意保存');
                      wx.showModal({
                          title: '提示',
                          content: '逗牛短视频 申请获得保存图片到相册的权限',
                          success(res) {
                              if (res.confirm) {
                                  wx.openSetting({})
                                  console.log('用户点击确定')
                              } else if (res.cancel) {
                                  console.log('用户点击取消')
                              }
                          }
                      })
                      // wx.openSetting({
                      //     success(res) {
                      //         console.log(res)
                      //     },
                      //     fail(res) {
                      //         console.log(res)
                      //     }
                      // })
                      // this.showAuthorize('scope.writePhotosAlbum');
                  }
              })
          } else {
              // 直接保存
              this.save_photo_sure();
          }
      })

  },

  // 保存海报动作
  save_photo_sure() {
      const {canvas_poster_url} = this.data;
      wx.saveImageToPhotosAlbum({
          filePath: canvas_poster_url,
          success(res) {
              wx.showToast({
                  title: '保存成功'
              })
          }
      })
  },
})