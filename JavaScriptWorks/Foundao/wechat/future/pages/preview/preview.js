// pages/preview/preview.js
const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();
let nickName = ''
let usermethod = 'album'
let computeMethod = 'height' //视频比例计算方式
var pasterlength = 0
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //视频屏幕高度
let previewbox = 0
var oldLocation = {x:0,y:0} //计算压条大小

let endrotate = {x:0,y:0}//计算旋转坐标
let rotateValue = {x:0,y:0}//计算旋转角度

var pasterNum = 0 //压条显示个数
var oldmusiclist = {id: 0}     //选中的音乐列表
var musiclistcontent = []      //{id: 0,content: ''}音乐的内容
// const musicpic = {playimg: '../../assets/images/4play.png',pauseimg: '../../assets/images/4ing.gif',addimg: '../../assets/images/4add.png',cancelimg: '../../assets/images/4cancel.png'}
const musicpic = {playimg: '../../assets/images/4play1@2x.png',pauseimg: '../../assets/images/bofang.gif',addimg: '../../assets/images/4tianjia@2x.png',cancelimg: '../../assets/images/4xuanze@2x.png'}//春节样式
var playlock = false //音乐是否播放
let whichone = {who: '',id: 0} //正在播放哪首歌
let tempmusic = {new: {type_id: 0,id: 0}, old: {type_id: 0,id: 0}}
let addmusiclock = false
let samesong = false //是不是同一首歌
let tempmusictype = -1 //选中的音乐类型
let temparray = [] //歌词分类请求列表
let videolock = false //视频是否播放
let autovideolock = true //兼容有些手机视频自动播放
let topiclock = false  //话题是否选择
let nowmusicname = '' //当前音乐名称
let nowfiltername = '' //当前滤镜名称
let pasterswipervalue = 0 //拖拉贴纸swiper的距离
const topicpic = {yes: '../../assets/images/4duigou@2x.png',no: '../../assets/images/4huati2@2x.png'}
const innerAudioContext = wx.createInnerAudioContext()//试听歌曲
innerAudioContext.obeyMuteSwitch = false
innerAudioContext.autoplay = false
innerAudioContext.loop = true
const preInnerAudioContext = wx.createInnerAudioContext()//预览歌曲
preInnerAudioContext.obeyMuteSwitch = false
preInnerAudioContext.autoplay = false
preInnerAudioContext.loop =false
let displayValue = 'none'//贴纸功能键是否消失：none，flex




Page({
  /**
   * 页面的初始数据
   */
  data: {
    //isIpx: false,
    //whichmodel: true,
    chooseVideo: 0,//视频是否选取成功,0初始化，1成功，2失败
    //models: 'defaultmodel',
    showwrappers: 'visible',
    picsize: {height: 0,width: 0}, //图片的大小
    previewsize: {height: 0,width: 0},//预览视频的大小
    tempFilePath: '',
    size: 0,
    duration: 0,
    //movableviewNum: [{id:'movableview0',width: 80,height: 80,show: 'none',x: 0,y: 0,pic: ''}], 
    movableviewNum: [{id:'movableview0',width: 80,height: 80,show: 'none',x: 0,y: 0,pic: '',rotate: 0},
                     {id:'movableview1',width: 80,height: 80,show: 'none',x: 0,y: 0,pic: '',rotate: 0},
                     {id:'movableview2',width: 80,height: 80,show: 'none',x: 0,y: 0,pic: '',rotate: 0}], //压条个数
    oldCoordinatey: 0,
    originMovableview: {x: 0,y: 0},
    oldVideoSize: {width: 0,height: 0},
    previewpic: '', //视频截图加载失败，默认图片
    filters: [{filterdiv: 'chosefilterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-0.png',chose: '../../assets/images/2attention3@2x.png',name: '原画',id: 'none'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-1.png',chose: '../../assets/filter/4filter-1.png',name: '秘语',id: 'vintage'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-2.png',chose: '../../assets/filter/4filter-2.png',name: '绿光',id: 'strong_contrast'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-3.png',chose: '../../assets/filter/4filter-3.png',name: '消逝',id: 'medium_contrast'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-4.png',chose: '../../assets/filter/4filter-4.png',name: '暗淡',id: 'linear_contrast'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-5.png',chose: '../../assets/filter/4filter-5.png',name: '明亮',id: 'lighter'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-6.png',chose: '../../assets/filter/4filter-6.png',name: '原画1',id: 'increase_contrast'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-7.png',chose: '../../assets/filter/4filter-7.png',name: '秘语1',id: 'darker'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-8.png',chose: '../../assets/filter/4filter-8.png',name: '绿光1',id: 'cross_process'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-9.png',chose: '../../assets/filter/4filter-9.png',name: '消逝1',id: 'color_negative'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-0.png',chose: '../../assets/filter/4filter-0.png',name: '暗淡1',id: 'boxblur'},
              {filterdiv: 'filterdiv',ispic: '../../assets/images/2attention3@2x.png',nopic: '../../assets/filter/4filter-0.png',chose: '../../assets/filter/4filter-0.png',name: '明亮1',id: 'black_white'}],
    pasters_type: [],
    pasterbegin: 0,
    pasters: [],
    pasterId: [],
    hiddenpaster: 'flex',
    nowpasterId: 1,
    pastersrequest: [],
    musics: [],
    musicbegin: 0,
    musiclists: [],
    //showVideo: {isvideo:'none',notvidoe:'flex'},  //值为flex或者none
    showmusiclists: [],
    //showwrappers: 'block',   //值为block或者none
    //showcover: 'flex',//遮罩层
    showoption: 'flex',
    showfilter: 'none',
    showpaster: 'none',
    showmusic: 'none',
    //musicimgs: {playimg: '../../assets/images/4ing.gif',pause: '',addimg: '../../assets/images/4add.png',cancel: '',palyorpause: '',},
    showmusiclist: 'none',
    showpublish: 'none',
    showpause: 'flex',
    showVideos: 'flex',
    showtextcontent: 'block', //值为block或者none
    showtopictype: 'none',
    showsure: 'flex',
    topic: '原创',
    topics: [],
    publish: [{pic: '',width: 0,height: 0,x: 0,y: 0,rotate: 0},{pic: '',width: 0,height: 0,x: 0,y: 0,rotate: 0},{pic: '',width: 0,height: 0,x: 0,y: 0,rotate: 0}],
    uploadContent: {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                    join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                    tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0,
                    tiezhi_arr: []},
    myUpload: [{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0}],
    showovercover: 'none',
    //videomuted: false, //是否静音视频
    compose_success: true,
    showsubmission: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    console.log(options.usermethod)
    usermethod = options.usermethod
    // wx.setEnableDebug({
    //   enableDebug: true,
    // })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('看我看我看我')
        console.log(res)
        console.log(res.model)
        windowWidth = res.windowWidth
        windowHeight = res.windowHeight
        that.data.oldCoordinatey = 0
        // if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
        //   //iphoneX
        //   //windowHeight = (res.windowHeight - 186 * windowWidth / 750)*0.73//原来视频大小
        //   //that.data.oldCoordinatey = 186 * windowWidth / 750
        //   that.data.models = 'iphoneX'
        // } else if (res.model.indexOf("BLA-AL00") > -1) {
        //   //huaweimate10plus
        //   //windowHeight = (res.windowHeight - 142 * windowWidth / 750)*0.73
        //   //that.data.oldCoordinatey = 142 * windowWidth / 750
        //   that.data.models = 'huaweimate10plus'
        // } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
        //   //OnePlus5T
        //   //windowHeight = (res.windowHeight - 142 * windowWidth / 750)*0.73
        //   //that.data.oldCoordinatey = 142 * windowWidth / 750
        //   that.data.models = 'oneplus5t'
        // } else if (res.model.indexOf("MI 8") > -1) {
        //   //xiaomi8
        //   //windowHeight = (res.windowHeight - 162 * windowWidth / 750)*0.73
        //   //that.data.oldCoordinatey = 162 * windowWidth / 750
        //   that.data.models = 'xiaomi8'
        // } else {
        //   //其他机型
        //   //windowHeight = (res.windowHeight - 122 * windowWidth / 750)*0.73
        //   //that.data.oldCoordinatey = 122 * windowWidth / 750
        //   // that.setData({
        //   //   whichmodel: false,
        //   // })
        // }
        that.data.originMovableview.x = windowWidth/2 - 40
        that.data.originMovableview.y = windowHeight/2 -40
        previewbox = 69*windowWidth/75
        for(let i=0;i<3;i++){
          that.data.movableviewNum[i].x = that.data.originMovableview.x
          that.data.movableviewNum[i].y = that.data.originMovableview.y
        }
        that.setData({
          //models: that.data.models,
          originMovableview: that.data.originMovableview,
          movableviewNum: that.data.movableviewNum
        })
      }
    })
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        nickName = userInfo.nickName
        console.log(nickName)
      }
    })
    console.log(windowHeight)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext1 = wx.createVideoContext('myVideo1')
    console.log('onReady')
    console.log('选取本地视频')
    let that = this
    wx.chooseVideo({
      sourceType: [usermethod],
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
        console.log('选取视频')
        console.log(res)
        const videoType = res.tempFilePath
        if(videoType.substring(videoType.length-3) === 'mp4' || videoType.substring(videoType.length-3) === 'mov' || videoType.substring(videoType.length-3) === 'avi'){
          console.log(videoType.substring(videoType.length-3))
          that.data.oldVideoSize.height = res.height
          that.data.oldVideoSize.width = res.width
          res.height > res.width ? computeMethod = 'height': computeMethod = 'width'
          let value = res.height/res.width
          if(computeMethod === 'height'){
            that.data.picsize.height = windowHeight
            that.data.picsize.width = windowHeight/value
            that.data.previewsize.height = previewbox
            that.data.previewsize.width = previewbox/value
          } else {
            that.data.picsize.width = windowWidth
            that.data.picsize.height = windowWidth*value
            that.data.previewsize.width = previewbox
            that.data.previewsize.height = previewbox*value
          }
          wx.showToast({
            title: '选取视频成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            tempFilePath: res.tempFilePath,
            duration: res.duration,
            oldVideoSize: that.data.oldVideoSize,
            size: (res.size / (1024 * 1024)).toFixed(2),
            picsize: that.data.picsize,
            previewsize: that.data.previewsize
          })
          console.log(that.data.oldVideoSize)
          wx.showLoading({
            title: '视频上传中',
            mask: true
          })
          if(usermethod === 'camera'){
            console.log('拍摄视频')
            wx.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                console.log(res)
              },
              fail(res) {
                console.log(res.errMsg)
              }
            })
          }
          if (that.data.size > 100) {
            wx.showToast({
              title: '上传的视频大小不能超过100M！',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            const timers = setTimeout(()=>{
              if(usermethod === 'camera'){
                app.shootsuccess = true
              } else {
                app.shootsuccess = false
              }
              wx.navigateBack({
                delta: 1
              });
              clearTimeout(timers)
            },1500)
          } else {
            if (that.data.duration > 30) {
              wx.showToast({
                title: '上传的视频拍摄时间不能大于30秒！',
                icon: 'none',
                duration: 3500,
                mask: true
              })
              const timers = setTimeout(()=>{
                if(usermethod === 'camera'){
                  app.shootsuccess = true
                } else {
                  app.shootsuccess = false
                }
                wx.navigateBack({
                  delta: 1
                });
                clearTimeout(timers)
              },1500)
            } else if (that.data.duration < 5) {
              wx.showToast({
                title: '上传的视频拍摄时间不能低于5秒！',
                icon: 'none',
                duration: 3500,
                mask: true
              })
              const timers = setTimeout(()=>{
                if(usermethod === 'camera'){
                  app.shootsuccess = true
                } else {
                  app.shootsuccess = false
                }
                wx.navigateBack({
                  delta: 1
                });
                clearTimeout(timers)
              },1500)
            } else {
              //上传视频， 取得视频服务器地址
              console.log('发送上传视频请求')
              wx.uploadFile({
                url: api.upload_cover,
                filePath: that.data.tempFilePath,
                name: 'filename',
                header: {
                  'content-type': 'multipart/form-data',
                  "auth-token": wx.getStorageSync('loginSessionKey'),
                },
                formData: {
                  upload_type: 'tmp1',
                  filename: that.data.tempFilePath,
                },
                success(res) {
                  const data = JSON.parse(res.data)
                  that.data.uploadContent.video_url = data.data.file_path
                  console.log(res.data)
                  console.log(data)
                  that.setData({
                    previewpic: data.data.savehttp,
                    uploadContent: that.data.uploadContent,
                    chooseVideo: 1
                  })
                },
                complete () {
                  console.log('隐藏了哈')
                  wx.hideLoading()
                }
              })
            }
          }
        } else {
          wx.showToast({
            title: '视频只支持mp4,aiv和mov格式！',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result)=>{
              const time = setTimeout(()=>{
                clearTimeout(time)
                wx.navigateBack({
                  delta: 1
                });
              },1500)
            },
          });
        }
      },
      fail: function (e) {
        console.log('选择视频失败！')
        console.log(e)
        app.shootsuccess = false
        wx.navigateBack({
          delta: 1
        });
        that.setData({
          chooseVideo: 2
        })
      },
      complete: function (e) {
        console.log('我的错我的错我的错')
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    app.isAuth(() => {
      if (!this.data.hasInit) {
          console.log('未初始化')
          this.data.hasInit = true
          wx.getUserInfo({
              success: (res) => {
                  this.data.userInfo = res.userInfo
                  // var nickName = userInfo.nickName
                  // var avatarUrl = userInfo.avatarUrl
                  // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  // var province = userInfo.province
                  // var city = userInfo.city
                  // var country = userInfo.country
              }
          })
      } else {
          console.log('已初始化')
      }
    })
    this.setData({
      //showovercover: 'none',
      //showsubmission: 'none',
      //videomuted: false
    })
    if(this.data.chooseVideo === 2){
      // wx.navigateTo({
      //   url: '/pages/dubbingUpload/dubbingUpload'
      // })
    }
  },
  onHide (e) {
    console.log('onHide')
    autovideolock = true
    pasterNum = 0
    temparray = []
    musiclistcontent = []
    innerAudioContext.pause()
    preInnerAudioContext.pause()
    const length = this.data.musiclists.length
    for(let i=0;i<length;i++){
      this.data.musiclists[i].forEach(element => {
        element.leftimg = musicpic.playimg
        element.rightimg = musicpic.addimg
      });
    }
    // this.data.uploadContent = {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
    //                            join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
    //                            tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0,
    //                            tiezhi_arr: [{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0}]}
    // preInnerAudioContext.src = 'https://nomusic.mp3'
    // innerAudioContext.src = 'https://nomusic.mp3'
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    this.data.showmusiclists = []
    this.setData({
      musiclists: this.data.musiclists,
      showmusiclists: this.data.showmusiclists,
      //uploadContent: this.data.uploadContent,
      showmusiclist: 'none',
      showpause: 'flex',
      chooseVideo: 0
    })
  },
  onUnload (e) {
    console.log('onUnload')
    autovideolock = true
    pasterNum = 0
    temparray = []
    musiclistcontent = []
    innerAudioContext.pause()
    preInnerAudioContext.pause()
    this.data.uploadContent = {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                                join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                                tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0,
                                tiezhi_arr: []},
    preInnerAudioContext.src = 'https://nomusic.mp3'
    innerAudioContext.src = 'https://nomusic.mp3'
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    const length = this.data.musiclists.length
    for(let i=0;i<length;i++){
      this.data.musiclists[i].forEach(element => {
        element.leftimg = musicpic.playimg
        element.rightimg = musicpic.addimg
      });
    }
    this.data.showmusiclists = []
    this.setData({
      musiclists: this.data.musiclists,
      showmusiclists: this.data.showmusiclists,
      uploadContent: this.data.uploadContent,
      chooseVideo: 0
    })
  },
  blockThis (e) {
    console.log('blockThis')
    if(this.data.showfilter === 'flex'){
      console.log('goHomeFilter')
      if(nowfiltername !== ''){
        wx.showToast({
          title: '已选择'+nowfiltername,
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    } else if(this.data.showpaster === 'flex'){
      console.log('goHomePaster')
    } else if(this.data.showmusic === 'flex'){
      console.log('goHomeMusic')
      if(preInnerAudioContext.src !== 'https://nomusic.mp3' && preInnerAudioContext.src !== ''){
        wx.showToast({
          title: '已选择'+nowmusicname,
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    }
    this.goHome()
  },
  // cancelFilter (e) {
  //   console.log('cancelFilter')
  //   let filterlength = this.data.filters.length
  //   nowfiltername = ''
  //   this.data.filters[0].filterdiv = 'chosefilterdiv'
  //   this.data.filters[0].chose = this.data.filters[0].ispic
  //   for(let i=1;i<filterlength;i++){
  //     this.data.filters[i].filterdiv = 'filterdiv'
  //     this.data.filters[i].chose = this.data.filters[i].nopic
  //   }
  //   this.data.uploadContent.filter = 'none'
  //   this.setData({
  //     showoption: 'flex',
  //     showfilter: 'none',
  //     //showcover: 'flex',
  //     filters: this.data.filters,
  //     uploadContent: this.data.uploadContent
  //   })
  // },
  // cancelPaster (e) {
  //   console.log('cancelPaster')
  //   this.data.uploadContent.tiezhi = ''
  //   this.data.uploadContent.tiezhi_x = 0
  //   this.data.uploadContent.tiezhi_y = 0
  //   this.data.uploadContent.tiezhi_height = 0
  //   this.data.uploadContent.tiezhi_width = 0
  //   this.setData({
  //     showoption: 'flex',
  //     showpaster: 'none',
  //     //showcover: 'flex',
  //     uploadContent: this.data.uploadContent
  //   })
  // },
  // cancelMusic (e) {
  //   console.log('cancelMusic')
  //   this.data.uploadContent.audio_id = ''
  //   this.data.uploadContent.audio_url = ''
  //   this.setData({
  //     showoption: 'flex',
  //     showmusic: 'none',
  //     //showcover: 'flex',
  //     uploadContent: this.data.uploadContent
  //   })
  // },
  // goHomeFilter: function (e) {
  //   console.log('goHomeFilter')
  //   if(nowfiltername !== ''){
  //     wx.showToast({
  //       title: '已选择'+nowfiltername,
  //       icon: 'none',
  //       duration: 1500,
  //       mask: false,
  //     });
  //   }
  //   this.goHome()
  // },
  // goHomePaster: function (e) {
  //   console.log('goHomePaster')
  //   this.goHome()
  // },
  // goHomeMusic: function (e) {
  //   console.log('goHomeMusic')
  //   if(preInnerAudioContext.src !== 'https://nomusic.mp3' && preInnerAudioContext.src !== ''){
  //     wx.showToast({
  //       title: '已选择'+nowmusicname,
  //       icon: 'none',
  //       duration: 1500,
  //       mask: false,
  //     });
  //   }
  //   this.goHome()
  // },
  goHome: function (e) {
    console.log('goHome')
    innerAudioContext.stop()
    // if(this.data.movableviewNum.length > 0){
    //   //this.data.movableviewNum[0].display = 'none'
    //   this.data.uploadContent.tiezhi = this.data.movableviewNum[0].pic
    // }
    // if(this.data.movableviewNum.length > 0){
    //   // let heightValue = this.data.oldVideoSize.height / windowHeight
    //   // let widthValue = this.data.oldVideoSize.width / windowWidth
    //   this.data.uploadContent.tiezhi_height = this.data.movableviewNum[0].height * heightValue
    //   this.data.uploadContent.tiezhi_width = this.data.movableviewNum[0].width * widthValue
    //   this.data.uploadContent.tiezhi_y = this.data.movableviewNum[0].y * heightValue
    //   this.data.uploadContent.tiezhi_x = this.data.movableviewNum[0].x * widthValue
    // }
    const length = this.data.showmusiclists.length
    for(let i=0;i<length;i++){
      if(this.data.showmusiclists[i].leftimg === musicpic.pauseimg){
        this.data.showmusiclists[i].leftimg = musicpic.playimg
      }
    }
    this.setData({
      showoption: 'flex',
      showfilter: 'none',
      showpaster: 'none',
      showmusic: 'none',
      //showcover: 'flex',
      showmusiclists: this.data.showmusiclists,
      movableviewNum: this.data.movableviewNum,
      uploadContent: this.data.uploadContent
    })
  },
  //删除压条
  cancelMovableView (e) {
    console.log('cancelMovableView')
    console.log(e)
    // console.log(this.data.movableviewNum)
    // const arr = this.data.movableviewNum
    // if(arr.length > 0){
    //   pasterNum--
    // }
    // let str = e.target.id
    // let strnum = str.substring(3)
    // for(let i=0;i<arr.length;i++){
    //   console.log(arr[i].id)
    //   if(arr[i].id === strnum){
    //     console.log(arr[i].id)
    //     arr.splice(i-1,1)
    //   }
    // }
    if(pasterNum > 0){
      pasterNum--
    }
    let str = e.target.id
    let strnum = str.substring(str.length-1)
    this.data.movableviewNum[strnum] = {id: str,width: 80,height: 80,show: 'none',x: 0,y: 0,pic: '',rotate: 0}
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
    // var str = e.target.id
    // var pasternumid = this.data.movableviewNum.length
    // console.log(str)
    // for(let i=0;i<pasternumid;i++){
    //   if(str === 'top'+this.data.movableviewNum[i].id){
    //     this.data.movableviewNum[i].show = 'none'
    //     console.log(this.data.movableviewNum[i].display)
    //     this.setData({
    //       movableviewNum: this.data.movableviewNum
    //     })
    //     console.log('删除')
    //     console.log(this.data.movableviewNum[i].id)
    //     pasterNum--
    //     console.log(pasterNum)
    //   }
    // }
  },
  //显示改变压条按钮
  showMovableView (e) {
    console.log('showMovableView')
    displayValue = 'none'
    this.setPasterHidden()
    // var str = e.target.id
    // var pasternumid = this.data.movableviewNum.length
    // for(let i=0;i<pasternumid;i++){
    //   if(str === 'pic'+this.data.movableviewNum[i].id){
    //     if(this.data.movableviewNum[i].display === 'flex'){
    //       this.data.movableviewNum[i].display = 'none'
    //     } else {
    //       this.data.movableviewNum[i].display = 'flex'
    //     }
    //   }
    // }
    // this.setData({
    //   movableviewNum: this.data.movableviewNum
    // })
  },
  moveMovableView (e) {
    console.log('moveMovableView')
    // coordinate.x = e.detail.x
    // coordinate.y = e.detail.y
    // console.log(coordinate)
    console.log(e)
    const str = e.target.id
    const strnum = str.substring(str.length-1)
    this.data.movableviewNum[strnum].x = e.detail.x
    this.data.movableviewNum[strnum].y = e.detail.y
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  //移动压条
  getStartLocation (e) {
    console.log('getStartLocation')
    displayValue = 'flex'
    this.setPasterHidden()
    var str = e.target.id
    for(let i=0;i<pasterNum;i++){
      if(str === 'bottom'+this.data.movableviewNum[i].id){
        oldLocation.x = e.changedTouches[0].pageX - this.data.movableviewNum[i].width
        oldLocation.y = e.changedTouches[0].pageY - this.data.movableviewNum[i].height
      }
    }
  },
  moveLocation (e) {
    console.log('moveLocation')
    var str = e.target.id
    const valueX = e.changedTouches[0].pageX - oldLocation.x
    const valueY = e.changedTouches[0].pageY - oldLocation.y
    const tempValue = valueX > valueY ? valueY : valueX
    const picsizeValue = this.data.picsize.width > this.data.picsize.height ? this.data.picsize.height : this.data.picsize.width
    //只有变化
    // for(let i=0;i<pasterNum;i++){
    //   if(str === 'bottom'+this.data.movableviewNum[i].id){
    //     if(this.data.movableviewNum[i].width <= this.data.picsize.width && this.data.movableviewNum[i].height <= this.data.picsize.height){
    //         console.log('不行不行不行1')
    //         this.data.movableviewNum[i].width = valueX
    //         this.data.movableviewNum[i].height = valueY
    //       } else if(this.data.movableviewNum[i].width === this.data.picsize.width 
    //         && this.data.movableviewNum[i].height === this.data.picsize.height
    //         && e.changedTouches[0].pageX < oldLocation.x
    //         && e.changedTouches[0].pageY < oldLocation.y){
    //           console.log('不行不行不行2')
    //           this.data.movableviewNum[i].width = valueX
    //           this.data.movableviewNum[i].height = valueY
    //       } else if(this.data.movableviewNum[i].width > this.data.picsize.width){
    //         console.log('不行不行不行3')
    //         this.data.movableviewNum[i].width = this.data.picsize.width
    //         this.data.movableviewNum[i].height = valueY
    //       } else if(this.data.movableviewNum[i].height > this.data.picsize.height){
    //         console.log('不行不行不行4')
    //         this.data.movableviewNum[i].width = valueX
    //         this.data.movableviewNum[i].height = this.data.picsize.height
    //       } else if(this.data.movableviewNum[i].width > this.data.picsize.width && this.data.movableviewNum[i].height > this.data.picsize.height){
    //         console.log('不行不行不行5')
    //         this.data.movableviewNum[i].width = this.data.picsize.width
    //         this.data.movableviewNum[i].height = this.data.picsize.height
    //       }
    //   }
    // }
    //等比例变化
    for(let i=0;i<pasterNum;i++){
      if(str === 'bottom'+this.data.movableviewNum[i].id){
        if(tempValue <= this.data.picsize.width && tempValue <= this.data.picsize.height){
            console.log('不行不行不行1')
            this.data.movableviewNum[i].width = tempValue
            this.data.movableviewNum[i].height = tempValue
          } else if(tempValue === this.data.picsize.width 
            && tempValue === this.data.picsize.height
            && e.changedTouches[0].pageX < oldLocation.x
            && e.changedTouches[0].pageY < oldLocation.y){
              console.log('不行不行不行2')
              this.data.movableviewNum[i].width = tempValue
              this.data.movableviewNum[i].height = tempValue
          } else if(tempValue > this.data.picsize.width){
            console.log('不行不行不行3')
            this.data.movableviewNum[i].width = this.data.picsize.width
            this.data.movableviewNum[i].height = this.data.picsize.width
          } else if(tempValue > this.data.picsize.height){
            console.log('不行不行不行4')
            this.data.movableviewNum[i].width = this.data.picsize.height
            this.data.movableviewNum[i].height = this.data.picsize.height
          } else if(tempValue > this.data.picsize.width && tempValue > this.data.picsize.height){
            console.log('不行不行不行5')
            this.data.movableviewNum[i].width = picsizeValue
            this.data.movableviewNum[i].height = picsizeValue
          }
      }
    }
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  endLocation (e) {
    console.log('endLocation')
    displayValue = 'none'
    this.setPasterHidden()
    var str = e.target.id
    for(let i=0;i<pasterNum;i++){
      if(str === 'bottom'+this.data.movableviewNum[i].id){
        if(this.data.movableviewNum[i].width > this.data.picsize.width){
          this.data.movableviewNum[i].width = this.data.picsize.width
        } else if(this.data.movableviewNum[i].height > this.data.picsize.height){
          this.data.movableviewNum[i].height = this.data.picsize.height
        }
      }
    }
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  nextStep (e) {
    console.log('nextStep')
    console.log(preInnerAudioContext.src)
    console.log(this.data.uploadContent)
    console.log(this.data.movableviewNum)
    console.log(this.data.myUpload)
    // wx.showToast({
    //   title: '滤镜效果需视频合成后可见',
    //   mask: true,
    //   icon: 'none',
    //   duration: 3000
    // })
    //默认选择原创话题
    wx.showToast({
      title: '默认选择原创话题！',
      icon: 'none',
      duration: 3000
    })
    if(this.data.topics.length === 0){
      wx.request({
        url: api.topic_sub,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        success: (res) => {
          console.log(res)
          const length = res.data.data.length
          for(let i=0;i<length;i++){
            if('原创' === res.data.data[i].sub_title){
              res.data.data[i].pic = topicpic.yes
              this.data.topic = res.data.data[i].sub_title
              this.data.uploadContent.join_sub_id = res.data.data[i].sub_type
              this.data.uploadContent.join_sub = res.data.data[i].id
              topiclock = true
            } else {
              res.data.data[i].pic = topicpic.no
            }
          }
          this.setData({
            topics: res.data.data
          })
          console.log(this.data.topics)
        },
        complete: () => {
          console.log('设置默认话题！')
        }
      })
    }


    this.videoContext1.play()
    this.videoContext1.pause()
    innerAudioContext.stop()
    if(pasterNum > 0){
      //预览页贴纸位置
      let publishValues = this.data.previewsize.height/this.data.picsize.height
      let videoValues = this.data.oldVideoSize.height / this.data.picsize.height
      const movableviewNumLength = this.data.movableviewNum.length
      for(let i=0;i<movableviewNumLength;i++){
        if(this.data.movableviewNum[i].show === 'flex'){
          this.data.publish[i].pic = this.data.movableviewNum[i].pic
          this.data.publish[i].height = this.data.movableviewNum[i].height * publishValues
          this.data.publish[i].width = this.data.movableviewNum[i].width * publishValues
          this.data.publish[i].y = this.data.movableviewNum[i].y * publishValues
          this.data.publish[i].x = this.data.movableviewNum[i].x * publishValues//- (windowWidth-9*windowHeight/16)/2) / publishValues + 483*windowWidth/2400
          this.data.publish[i].rotate = this.data.movableviewNum[i].rotate
          //上传视频贴纸位置
          this.data.myUpload[i].img_url = this.data.movableviewNum[i].pic
          this.data.myUpload[i].height = this.data.movableviewNum[i].height * videoValues
          this.data.myUpload[i].width = this.data.movableviewNum[i].width * videoValues
          this.data.myUpload[i].y = this.data.movableviewNum[i].y * videoValues
          this.data.myUpload[i].x = this.data.movableviewNum[i].x * videoValues
          this.data.myUpload[i].rotate = this.data.movableviewNum[i].rotate
        }
      }
      //上传视频贴纸位置
      // this.data.uploadContent.tiezhi_height = this.data.movableviewNum[0].height * videoValues
      // this.data.uploadContent.tiezhi_width = this.data.movableviewNum[0].width * videoValues
      // this.data.uploadContent.tiezhi_y = this.data.movableviewNum[0].y * videoValues
      // this.data.uploadContent.tiezhi_x = this.data.movableviewNum[0].x * videoValues// - (windowWidth-9*windowHeight/16)/2) * videoValues
    }
    console.log(this.data.publish)
    //消音
    // if(preInnerAudioContext.src === 'https://nomusic.mp3' || preInnerAudioContext.src === ''){
    //   this.data.videomuted = false
    // } else {
    //   this.data.videomuted = true
    // }
    //数字转为字符串
    // for(let l=0;l<3;l++){
    //   this.data.uploadContent.tiezhi_arr[l] = JSON.stringify(this.data.uploadContent.tiezhi_arr[l])
    // }
    //console.log(this.data.uploadContent.tiezhi_arr)
    this.data.uploadContent.tiezhi_arr = this.data.myUpload
    this.data.uploadContent.tiezhi_arr = JSON.stringify(this.data.uploadContent.tiezhi_arr)
    console.log(this.data.uploadContent.tiezhi_arr)
    this.setData({
      //showwrappers: 'none',
      showwrappers: 'hidden',
      showpublish: 'flex',
      uploadContent: this.data.uploadContent,
      myUpload: this.data.myUpload,
      publish: this.data.publish,
      //videomuted: this.data.videomuted,
      topic: this.data.topic
    })
    // this.videoContext.play()
    // this.videoContext.pause()
    // this.setData({
    //   showVideo: {isvideo:'flex',notvideo:'none'}
    // })
    // console.log(this.data.showVideo)
  },
  //各个选项的显示与隐藏
  filter (e) {
    console.log('filter')
    this.setData({
      showoption: 'none',
      showfilter: 'flex'
    })
  },
  choseFilter (e) {
    console.log('choseFilter')
    let filterlength = this.data.filters.length
    for(let i=0;i<filterlength;i++){
      if(e.target.id === this.data.filters[i].id){
        if(this.data.filters[i].filterdiv !== 'chosefilterdiv'){
          this.data.filters[i].filterdiv = 'chosefilterdiv'
          nowfiltername = this.data.filters[i].name
          this.data.filters[i].chose = this.data.filters[i].ispic
          this.data.uploadContent.filter = this.data.filters[i].id
        }
      } else {
        if(this.data.filters[i].filterdiv === 'chosefilterdiv'){
          this.data.filters[i].filterdiv = 'filterdiv'
          this.data.filters[i].chose = this.data.filters[i].nopic
        }
      }
    }
    this.setData({
      filters: this.data.filters,
      uploadContent: this.data.uploadContent
    })
  },
  paster (e) {
    console.log('paster')
    var that = this
    this.setData({
      showoption: 'none',
      showpaster: 'flex',
      //showcover: 'none'
    })
    wx.request({
      url: api.sticker_type,
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": wx.getStorageSync('loginSessionKey'),
      },
      success: (resp) => {
          const {data} = resp;
          pasterlength = data.data.length
          for(let i=0;i<pasterlength;i++){
            if(i===0){
              data.data[i].chosethispaster = 'chosethispaster'
              that.data.nowpasterId = data.data[i].id
            } else {
              data.data[i].chosethispaster = 'none'
            }
            that.data.pasterId.push(data.data[i].id)
          }
          that.setData({
            pasters_type: data.data,
            pasters: data.data[0].children,
            nowpasterId: that.data.nowpasterId
          })
      },
      complete: () => {
          this.data.loading_num--;
          if (this.data.loading_num == 0) {
              wx.hideLoading()
          }
      }
  })
  },
  music (e) {
    console.log('music')
    this.setData({
      showoption: 'none',
      showmusiclist: 'none',
      showmusic: 'flex'
    })
    wx.request({
      url: api.music_type,
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": wx.getStorageSync('loginSessionKey'),
      },
      success: (res) => {
        console.log(res)
        const length = res.data.data.length
        for(let i=0;i<length;i++){
          res.data.data[i].pic = res.data.data[i].no_music_type_icon
        }
        this.data.musics = res.data.data
        this.setData({
          musics: this.data.musics
        })
      },
      complete: () => {
        console.log('查询音效分类！')
      }
    })
  },
  //选中具体压条
  chosePasterPic (e) {
    console.log('chosePasterPic')
    console.log(this.data.movableviewNum)
    displayValue = 'none'
    this.setPasterHidden()
    //var pasternumid = this.data.movableviewNum.length
    var pic = '../../assets/images/2null2@2x.png' //默认图片
    var pasterpicid = e.currentTarget.id
    var pasterpiclength = this.data.pasters.length
    for(let i=0;i<pasterpiclength;i++){
      if(this.data.pasters[i].id === pasterpicid){
        pic = this.data.pasters[i].pics
      }
    }
    //删除隐藏的压条
    // for(let i=pasternumid-1;i>=0;i--){
    //   //console.log(this.data.movableviewNum[i].show)
    //   if(this.data.movableviewNum[i].show === 'none'){
    //     this.data.movableviewNum.splice(i,1)
    //     console.log(this.data.movableviewNum)
    //   }
    // }
    // var newpaster = {
    //   id:'movableview'+pasternumid,
    //   width: 80,
    //   height: 80,
    //   //display: 'none',//左上角和右下角图标
    //   //show: 'flex',//显示和隐藏贴纸
    //   x: 0,
    //   y: 0,
    //   pic: pic}
    if(pasterNum > 2){
      wx.showToast({
        title: '只能添加三个贴纸',
        duration: 1000
      })
    } else {
      pasterNum++
      console.log(pasterNum)
      //添加压条
      const movableviewNumLength = this.data.movableviewNum.length
      for(let j=0;j<movableviewNumLength;j++){
        if(this.data.movableviewNum[j].show === 'none'){
          console.log('我变了')
          this.data.movableviewNum[j].show = 'flex'
          this.data.movableviewNum[j].pic = pic
          break
        }
        console.log('我执行了一次')
      }
      this.setData({
        movableviewNum: this.data.movableviewNum
      })
    }
  },
  //按时隐藏贴纸
  setPasterHidden () {
    console.log('setPasterHidden')
    const that = this
    that.data.hiddenpaster = 'flex'
    let time = setTimeout(()=>{
      that.setData({
        hiddenpaster: displayValue
      })
      clearTimeout(time)
    },2000)
    that.setData({
      hiddenpaster: that.data.hiddenpaster
    })
  },
  //切换压条类型
  chosePaster(e){
    console.log('chosePaster')
    let str = e.currentTarget.id
    let pasterid = str.substring(str.length-1)
    for(let i=0;i<pasterlength;i++){
      if(this.data.pasterId[i] === pasterid){
        //用户选择这个paster
        this.data.pasters_type[i].chosethispaster = 'chosethispaster'
        this.data.pasters = this.data.pasters_type[i].children
      } else {
        this.data.pasters_type[i].chosethispaster = 'none'
      }
    }
    this.setData({
      pasters_type: this.data.pasters_type,
      pasters: this.data.pasters,
      nowpasterId: pasterid,
      pasterbegin: 0
    })
  },
  pickMusic (e) {
    console.log('pickMusic')
    console.log(e)
    //控制播放按钮
    let str = e.currentTarget.id
    const length = this.data.showmusiclists.length
    const musiclistslength = this.data.musiclists.length
    if(!playlock && !addmusiclock){
      for(let i=0;i<length;i++){
        if(e.currentTarget.id === this.data.showmusiclists[i].id){
          innerAudioContext.src = this.data.showmusiclists[i].music_url
          this.data.showmusiclists[i].leftimg = musicpic.pauseimg
          whichone.who = e.currentTarget.id
          whichone.id = i
        }
      }
      innerAudioContext.play()
      playlock = true
    } else {
      if(e.currentTarget.id === whichone.who){
        this.data.showmusiclists[whichone.id].leftimg = musicpic.playimg
        innerAudioContext.pause()
        playlock = false
      } else {
        for(let i=0;i<length;i++){
          if(e.currentTarget.id === this.data.showmusiclists[i].id){
            innerAudioContext.src = this.data.showmusiclists[i].music_url
            this.data.showmusiclists[i].leftimg = musicpic.pauseimg
            whichone.who = e.currentTarget.id
            whichone.id = i
            innerAudioContext.play()
          } else {
            this.data.showmusiclists[i].leftimg = musicpic.playimg
          }
        }
      }
    }
    //控制选择按钮
    if(!addmusiclock){
      //从未添加音乐
      for(let i=0;i<length;i++){
        if(e.currentTarget.id === this.data.showmusiclists[i].id){
          console.log('选他')
          preInnerAudioContext.src = this.data.showmusiclists[i].music_url
          nowmusicname = this.data.showmusiclists[i].music_name
          this.data.uploadContent.audio_url = this.data.showmusiclists[i].music_url
          this.data.uploadContent.audio_id = this.data.showmusiclists[i].id
          this.data.showmusiclists[i].rightimg = musicpic.cancelimg
          for(let j=0;j<musiclistslength;j++){
            if(this.data.musiclists[j][0].music_type_id === tempmusic.new.type_id){
              this.data.musiclists[j][i].rightimg = musicpic.cancelimg
            }
          }
        } else {
          console.log('我的兄弟')
        }
      }
      tempmusic.new.id = e.currentTarget.id
      tempmusictype = tempmusic.new.type_id
      addmusiclock = true
    } else {
      //已经添加音乐
      for(let i=0;i<length;i++){
        if(this.data.showmusiclists[i].id === e.currentTarget.id && this.data.showmusiclists[i].rightimg === musicpic.cancelimg){
          samesong = true
          break
        } else {
          samesong = false
        }
      }
      for(let j=0;j<musiclistslength;j++){
        if(this.data.musiclists[j][0].music_type_id === tempmusictype){
          this.data.musiclists[j].forEach((element)=>{
            if(element.rightimg === musicpic.cancelimg){
              element.rightimg = musicpic.addimg
            }
          })
        }
      }
      if(samesong){
        //是同一首歌
        console.log('是同一首歌')
        addmusiclock = false
        tempmusictype = -1
        preInnerAudioContext.src = 'https://nomusic.mp3'
        console.log(preInnerAudioContext.src)
        nowmusicname = ''
        this.data.uploadContent.audio_id = ''
        this.data.uploadContent.audio_url = ''
        this.setData({
          uploadContent: this.data.uploadContent
        })
      } else {
        //不是同一首歌
        console.log('不是同一首歌')
        for(let k=0;k<length;k++){
          if(e.currentTarget.id === this.data.showmusiclists[k].id){
            console.log('选他1')
            preInnerAudioContext.src = this.data.showmusiclists[k].music_url
            nowmusicname = this.data.showmusiclists[k].music_name
            this.data.uploadContent.audio_url = this.data.showmusiclists[k].music_url
            this.data.uploadContent.audio_id = this.data.showmusiclists[k].id
            this.data.showmusiclists[k].rightimg = musicpic.cancelimg
            for(let l=0;l<musiclistslength;l++){
              if(this.data.musiclists[l][0].music_type_id === tempmusic.new.type_id){
                this.data.musiclists[l][k].rightimg = musicpic.cancelimg
              }
            }
          } else {
            console.log('我的兄弟1')
          }
        }
        tempmusic.new.id = e.currentTarget.id
        tempmusictype = tempmusic.new.type_id
        addmusiclock = true
      }
    }
    console.log(tempmusic)
    console.log(this.data.showmusiclists)
    console.log(this.data.musiclists)
    console.log(this.data.uploadContent)
    this.setData({
      uploadContent: this.data.uploadContent,
      showmusiclists: this.data.showmusiclists,
      musiclists: this.data.musiclists
    })
  },
  playmusic(e){
    console.log('playmusic')
    console.log(e)
    const length = this.data.showmusiclists.length
    if(!playlock){
      for(let i=0;i<length;i++){
        if(e.currentTarget.id === 'left'+this.data.showmusiclists[i].id){
          innerAudioContext.src = this.data.showmusiclists[i].music_url
          this.data.showmusiclists[i].leftimg = musicpic.pauseimg
          whichone.who = e.currentTarget.id
          whichone.id = i
        }
      }
      innerAudioContext.play()
      playlock = true
    } else {
      if(e.currentTarget.id === whichone.who){
        this.data.showmusiclists[whichone.id].leftimg = musicpic.playimg
        innerAudioContext.pause()
        playlock = false
      } else {
        for(let i=0;i<length;i++){
          if(e.currentTarget.id === 'left'+this.data.showmusiclists[i].id){
            innerAudioContext.src = this.data.showmusiclists[i].music_url
            this.data.showmusiclists[i].leftimg = musicpic.pauseimg
            whichone.who = e.currentTarget.id
            whichone.id = i
            innerAudioContext.play()
          } else {
            this.data.showmusiclists[i].leftimg = musicpic.playimg
          }
        }
      }
    }
    this.setData({
      showmusiclists: this.data.showmusiclists
    })
  },
  addmusic(e){
    console.log('addmusic')
    let str = e.currentTarget.id
    const length = this.data.showmusiclists.length
    const musiclistslength = this.data.musiclists.length
    if(!addmusiclock){
      //从未添加音乐
      for(let i=0;i<length;i++){
        if(e.currentTarget.id === 'right'+this.data.showmusiclists[i].id){
          console.log('选他')
          preInnerAudioContext.src = this.data.showmusiclists[i].music_url
          nowmusicname = this.data.showmusiclists[i].music_name
          this.data.uploadContent.audio_url = this.data.showmusiclists[i].music_url
          //innerAudioContext.pause()
          this.data.uploadContent.audio_id = this.data.showmusiclists[i].id
          this.data.showmusiclists[i].rightimg = musicpic.cancelimg
          for(let j=0;j<musiclistslength;j++){
            if(this.data.musiclists[j][0].music_type_id === tempmusic.new.type_id){
              this.data.musiclists[j][i].rightimg = musicpic.cancelimg
            }
          }
        } else {
          console.log('我的兄弟')
        }
      }
      tempmusic.new.id = e.currentTarget.id
      tempmusictype = tempmusic.new.type_id
      addmusiclock = true
    } else {
      //已经添加音乐
      for(let i=0;i<length;i++){
        if('right'+this.data.showmusiclists[i].id === e.currentTarget.id && this.data.showmusiclists[i].rightimg === musicpic.cancelimg){
          samesong = true
          break
        } else {
          samesong = false
        }
        console.log(this.data.showmusiclists[i].id)
        console.log(e.currentTarget.id)
        console.log(samesong)
      }
      for(let j=0;j<musiclistslength;j++){
        if(this.data.musiclists[j][0].music_type_id === tempmusictype){
          this.data.musiclists[j].forEach((element)=>{
            if(element.rightimg === musicpic.cancelimg){
              element.rightimg = musicpic.addimg
            }
          })
        }
      }
      if(samesong){
        //是同一首歌
        console.log('是同一首歌')
        addmusiclock = false
        tempmusictype = -1
        preInnerAudioContext.src = 'https://nomusic.mp3'
        console.log(preInnerAudioContext.src)
        nowmusicname = ''
        this.data.uploadContent.audio_id = ''
        this.data.uploadContent.audio_url = ''
        this.setData({
          uploadContent: this.data.uploadContent
        })
      } else {
        //不是同一首歌
        console.log('不是同一首歌')
        for(let k=0;k<length;k++){
          if(e.currentTarget.id === 'right'+this.data.showmusiclists[k].id){
            console.log('选他1')
            preInnerAudioContext.src = this.data.showmusiclists[k].music_url
            nowmusicname = this.data.showmusiclists[k].music_name
            this.data.uploadContent.audio_url = this.data.showmusiclists[k].music_url
            //innerAudioContext.pause()
            this.data.uploadContent.audio_id = this.data.showmusiclists[k].id
            this.data.showmusiclists[k].rightimg = musicpic.cancelimg
            for(let l=0;l<musiclistslength;l++){
              if(this.data.musiclists[l][0].music_type_id === tempmusic.new.type_id){
                this.data.musiclists[l][k].rightimg = musicpic.cancelimg
              }
            }
          } else {
            console.log('我的兄弟1')
          }
        }
        tempmusic.new.id = e.currentTarget.id
        tempmusictype = tempmusic.new.type_id
        addmusiclock = true
      }
    }
    console.log(tempmusic)
    console.log(this.data.showmusiclists)
    console.log(this.data.musiclists)
    console.log(this.data.uploadContent)
    this.setData({
      uploadContent: this.data.uploadContent,
      showmusiclists: this.data.showmusiclists,
      musiclists: this.data.musiclists
    })
  },
  choseMusic(e){
    console.log('choseMusic')
    console.log(e.currentTarget.id)
    playlock = false
    innerAudioContext.stop()
    const lengths = this.data.musiclists.length
    tempmusic.old = tempmusic.new
    let newtempmusic = {type_id: 0,id: 0}
    newtempmusic.type_id = e.currentTarget.id
    tempmusic.new = newtempmusic
    let tempmusiclist = {id: 0,content: ''}
    if(temparray.indexOf(e.currentTarget.id)<0){
      temparray.push(e.currentTarget.id)
      //请求歌曲列表
      wx.request({
        url: api.music,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: {
          music_id: e.currentTarget.id,
          page: 1
        },
        success: (res) => {
          console.log(res)
          if(res.data.data.length === 0){
            wx.showToast({
              title: '没有该类型的音乐',
              duration: 2000
            })
            //this.data.showmusiclists = []
            this.data.musiclists.push([])
            this.data.showmusiclist = 'none'
            tempmusiclist.content = 'no'
          } else {
            this.data.musiclists.push(res.data.data)
            const length = this.data.musiclists.length
            for(let i=0;i<length;i++){
              if(e.currentTarget.id === this.data.musiclists[i][0].music_type_id){
                this.data.showmusiclists = this.data.musiclists[i]
              }
            }
            const musiclistslength = this.data.showmusiclists.length
            for(let i=0;i<musiclistslength;i++){
              this.data.showmusiclists[i].leftimg = musicpic.playimg
              this.data.showmusiclists[i].rightimg = musicpic.addimg
            }
            const muisiclength = this.data.musics.length
            for(let j=0;j<muisiclength;j++){
              if(e.currentTarget.id === this.data.musics[j].id){
                this.data.musics[j].pic = this.data.musics[j].music_type_icon
              } else {
                this.data.musics[j].pic = this.data.musics[j].no_music_type_icon
              }
            }
            this.data.showmusiclist = 'flex'
            tempmusiclist.content = 'yes'
            this.setData({
              showmusiclists: this.data.showmusiclists,
              showmusiclist: this.data.showmusiclist,
              musiclists: this.data.musiclists,
              musics: this.data.musics,
              musicbegin: 0
            })
          }
          oldmusiclist.id = e.currentTarget.id
          tempmusiclist.id = e.currentTarget.id
          musiclistcontent.push(tempmusiclist)
          console.log(musiclistcontent)
        },
        complete: () => {
          console.log('查询音效！')
        }
      })
    } else {
      console.log('已存在')
      //开关歌曲列表
      const musiclistcontentlength = musiclistcontent.length
      for(let i=0;i<musiclistcontentlength;i++){
        if(e.currentTarget.id === musiclistcontent[i].id){
          if(musiclistcontent[i].content === 'yes'){
            if(oldmusiclist.id === e.currentTarget.id){
              if(this.data.showmusiclist === 'none'){
                console.log('111')
                this.data.showmusiclist = 'flex'
                this.data.showmusiclists = this.data.musiclists[i]
                console.log(this.data.musiclists[i])
                console.log(musiclistcontent)
              } else {
                console.log('222')
                this.data.showmusiclist = 'none'
                console.log(musiclistcontent)
              }
            } else {
              console.log('555')
              this.data.showmusiclists = this.data.musiclists[i]
              this.data.showmusiclist = 'flex'
            }
          } else {
            this.data.showmusiclist = 'none'
          }
        }
      }
      const musiclength = this.data.musics.length
      for(let r=0;r<musiclength;r++){
        if(e.currentTarget.id === this.data.musics[r].id){
          if(this.data.showmusiclist === 'flex'){
            this.data.musics[r].pic = this.data.musics[r].music_type_icon
          } else {
            this.data.musics[r].pic = this.data.musics[r].no_music_type_icon
          }
        } else {
          this.data.musics[r].pic = this.data.musics[r].no_music_type_icon
        }
      }
      for(let l=0;l<lengths;l++){
        this.data.musiclists[l].forEach(element => {
          if(element.leftimg === musicpic.pauseimg){
            element.leftimg = musicpic.playimg
          }
        });
      }
      oldmusiclist.id = e.currentTarget.id
      console.log(this.data.showmusiclists)
      this.setData({
        showmusiclists: this.data.showmusiclists,
        showmusiclist: this.data.showmusiclist,
        musiclists: this.data.musiclists,
        musics: this.data.musics,
        musicbegin: 0
      })
    }
  },
  uploadContent (e) {
    console.log('uploadContent')
    let that = this
    this.videoContext1.pause()
    preInnerAudioContext.pause()
    if(this.data.uploadContent.video_desc === ''){
      this.data.uploadContent.video_desc = nickName + '的原创'
    }
    if(this.data.uploadContent.join_sub === -1 || this.data.uploadContent.join_sub_id === -1){
      wx.showToast({
        title: '未选择话题！',
        icon: 'none',
        duration: 1000
      })
      // if(this.data.topics.length === 0){
      //   wx.request({
      //     url: api.topic_sub,
      //     method: 'POST',
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         "auth-token": wx.getStorageSync('loginSessionKey'),
      //     },
      //     success: (res) => {
      //       console.log(res)
      //       const length = res.data.data.length
      //       for(let i=0;i<length;i++){
      //         if('原创话题' === res.data.data[i].sub_title){
      //           this.data.topic = res.data.data[i].sub_title
      //           this.data.uploadContent.join_sub_id = res.data.data[i].sub_type
      //           this.data.uploadContent.join_sub = res.data.data[i].id
      //           topiclock = true
      //         } else {
      //           res.data.data[i].pic = topicpic.no
      //         }
      //       }
      //       this.setData({
      //         topics: res.data.data
      //       })
      //       console.log(this.data.topics)
      //     },
      //     complete: () => {
      //       console.log('查询音效分类！')
      //     }
      //   })
      // }
      // that.setData({
      //   uploadContent: this.data.uploadContent,
      //   topic: this.data.topic
      // })
    } else {
      console.log('that.data.uploadContent')
      console.log(that.data.uploadContent)
      that.setData({
        showovercover: 'flex',
      })
      wx.showLoading({
        title: '视频上传中…',
        mask: true,
      });
      wx.request({
        url: api.upload_submit,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": wx.getStorageSync('loginSessionKey'),
        },
        data: this.data.uploadContent,
        success: (resp) => {
          wx.hideLoading()
          wx.showLoading({
            title: '视频上传合成中……',
            mask: true,
          });
          let requestTimes = 1
          var timer = setInterval(()=>{
            requestTimes++
            const {data} = resp
            console.log(data.data)
            console.log(data.code)
            if(requestTimes > 13){
              wx.hideLoading()
              clearInterval(timer)
              wx.showToast({
                title: '合成视频超时！',
                icon: 'fail',
                duration: 1500,
                mask: true,
              });
              that.setData({
                showsubmission: 'flex',
                compose_success: false
              })
            }
            else if(!data.data && data.code === 0){
              console.log('sss')
              wx.hideLoading()
              clearInterval(timer)
              // wx.showToast({
              //   title: '视频上传成功',
              //   icon: 'success',
              //   duration: 1500,
              //   mask: true,
              //   success: (result)=>{
              //     const timers = setTimeout(()=>{
              //       wx.navigateBack({
              //         delta: 1
              //       });
              //       clearTimeout(timers)
              //     },1500)
              //   },
              // });
              that.setData({
                showsubmission: 'flex',
                compose_success: true
              })
            } else if(data.data && data.code === 0) {
              wx.request({
                url: api.get_submit,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    "auth-token": wx.getStorageSync('loginSessionKey'),
                },
                data: {
                  job_id: resp.data.data.job_id,
                  move_name: resp.data.data.move_name,
                  video_url: resp.data.data.video_url
                },
                success: (res) => {
                  console.log(res)
                  console.log(wx.getStorageSync('loginSessionKey'))
                  if(res.data.code === 0){
                    console.log(res)
                    wx.hideLoading()
                    clearInterval(timer)
                    // wx.showToast({
                    //   title: '视频合成成功！',
                    //   icon: 'success',
                    //   duration: 1500,
                    //   mask: true,
                    //   success: (result)=>{
                    //     const timers = setTimeout(()=>{
                    //       wx.navigateBack({
                    //         delta: 1
                    //       });
                    //       clearTimeout(timers)
                    //     },1500)
                    //   },
                    // });
                    that.setData({
                      showsubmission: 'flex',
                      compose_success: true
                    })
                    that.data.uploadContent = {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                                               join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                                               tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0,
                                               tiezhi_arr: [{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0},{img_url: '',width: 0,height: 0,x: 0,y: 0}]}
                    preInnerAudioContext.src = 'https://nomusic.mp3'
                    innerAudioContext.src = 'https://nomusic.mp3'
                  } else if (res.data.code === -2){
                    clearInterval(timer)
                    // wx.showToast({
                    //   title: '视频合成失败！请重新上传！',
                    //   icon: 'none',
                    //   duration: 1500,
                    //   mask: true,
                    //   success: (result)=>{
                    //     const timers = setTimeout(()=>{
                    //       wx.navigateBack({
                    //         delta: 1
                    //       });
                    //       clearTimeout(timers)
                    //     },1500)
                    //   },
                    // });
                    that.setData({
                      showsubmission: 'flex',
                      compose_success: false
                    })
                  }
                },
                complete: () => {
                  console.log('我又发了一次')
                }
              })
            } else {
              console.log(resp.msg)
              wx.hideLoading()
              clearInterval(timer)
              that.setData({
                showsubmission: 'flex',
                compose_success: false
              })
            }
            console.log(innerAudioContext.src)
            console.log(preInnerAudioContext.src)
            that.setData({
              uploadContent: that.data.uploadContent,
            })
          },5000)
        },
      })
    }
  },
  pauseThis (e) {
    console.log('pauseThis')
    autovideolock = true
    if(videolock){
      this.videoContext1.pause()
      //innerAudioContext.pause()
      preInnerAudioContext.pause()
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
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    this.videoContext1.play()
    //innerAudioContext.play()
    preInnerAudioContext.play()
    autovideolock = false
    videolock = true
    this.setData({
      showpause: 'none'
    })
  },
  choseTopic (e) {
    console.log('choseTopic')
    topiclock = true
    // if(this.data.topics.length === 0){
    //   wx.request({
    //     url: api.topic_sub,
    //     method: 'POST',
    //     header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         "auth-token": wx.getStorageSync('loginSessionKey'),
    //     },
    //     success: (res) => {
    //       console.log(res)
    //       const length = res.data.data.length
    //       for(let i=0;i<length;i++){
    //         if('原创话题' === res.data.data[i].sub_title){
    //           res.data.data[i].pic = topicpic.yes
    //         } else {
    //           res.data.data[i].pic = topicpic.no
    //         }
    //       }
    //       this.setData({
    //         topics: res.data.data
    //       })
    //       console.log(this.data.topics)
    //     },
    //     complete: () => {
    //       console.log('查询音效分类！')
    //     }
    //   })
    // }
    this.setData({
      showVideos: 'none',
      showtextcontent: 'none',
      showtopictype: 'flex',
      showsure: 'none'
    })
  },
  choseThisTopic (e) {
    console.log('choseThisTopic')
    console.log(e)
    const length = this.data.topics.length
    for(let i=0;i<length;i++){
      console.log('q')
      if(topiclock){
        if(this.data.topics[i].pic === topicpic.yes){
          this.data.topics[i].pic = topicpic.no
          break
        }
      }
    }
    for(let i=0;i<length;i++){
      if(e.currentTarget.id === this.data.topics[i].id){
        this.data.topics[i].pic = topicpic.yes
        this.data.topic = this.data.topics[i].sub_title
        this.data.uploadContent.join_sub_id = this.data.topics[i].sub_type
        this.data.uploadContent.join_sub = this.data.topics[i].id
        topiclock = true
        break
      }
    }
    this.setData({
      topic: this.data.topic,
      topics: this.data.topics,
      showVideos: 'flex',
      showtextcontent: 'block',
      showtopictype: 'none',
      showsure: 'flex'
    })
  },
  bindTextAreaBlur: function(e) {
    console.log('bindTextAreaBlur')
    this.data.uploadContent.video_desc = e.detail.value
    this.setData({
      uploadContent: this.data.uploadContent
    })
  },
  bindTextAreaInput(e){
    console.log('bindTextAreaInput')
    if(e.detail.cursor === 30){
      wx.showToast({
        title: '最多输入30个字!',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },
  videoend (e) {
    console.log('videoend')
    //innerAudioContext.stop()
    this.videoContext1.play()
    preInnerAudioContext.stop()
    preInnerAudioContext.play()
  },
  cancelUploadContent (e) {
    console.log('cancelUploadContent')
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    autovideolock = true
    this.videoContext1.seek(0)
    this.videoContext1.pause()
    //innerAudioContext.stop()
    preInnerAudioContext.stop()
    this.setData({
      //showwrappers: 'block',
      showwrappers: 'visible',
      showpause: 'flex',
      showpublish: 'none',
    })
  },
  videoAutoPlay (e) {
    console.log('videoAutoPlay')
    autovideolock ? this.videoContext1.pause():this.videoContext1.play()
  },
  successBackHome (e) {
    console.log('successBackHome')
    this.setData({
      showovercover: 'none',
      showsubmission: 'none',
    })
    wx.navigateBack({
      delta: 1
    });
  },
  checkProgress (e) {
    console.log('checkProgress')
    this.setData({
      showovercover: 'none',
      showsubmission: 'none',
    })
    wx.switchTab({
      url: '/pages/user/user'
    })
  },
  returnSubmit (e) {
    console.log('returnSubmit')
    this.setData({
      showovercover: 'none',
      compose_success: true,
      showsubmission: 'none',
      showpause: 'flex'
    })
  },
  pasterSwiperStart (e) {
    console.log('pasterSwiperStart')
    pasterswipervalue = e.changedTouches[0].pageX
  },
  pasterSwiperEnd (e) {
    console.log('pasterSwiperEnd')
    console.log(e)
    var that = this
    wx.createSelectorQuery().select('#pasterId').fields({
      properties: ['current'],
    }, function (res) {
      console.log(res)
      if(e.changedTouches[0].pageX - pasterswipervalue < 100){
        if(res.current === that.data.pasters.length-5 && that.data.pastersrequest.indexOf(that.data.nowpasterId+res.current)<0 && that.data.pasters.length%10 === 0){
          wx.request({
            url: api.sticker,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
              sticker_id: that.data.nowpasterId,
              page: Math.floor((res.current+5)/10)+1,
            },
            success: (resp) => {
              const {data} = resp;
              console.log(data.data)
              if(data.count > 0){
                console.log(that.data.pasters_type)
                console.log(that.data.nowpasterId)
                const length = that.data.pasters_type.length
                let wherei = 0
                for(let i=0;i<length;i++){
                  console.log(that.data.pasters_type[i].id)
                  if(that.data.nowpasterId === that.data.pasters_type[i].id){
                    wherei = i
                    break
                  }
                }
                for(let j=0;j<data.count;j++){
                  that.data.pasters_type[wherei].children.push(data.data[j])
                }
                console.log(that.data.pasters_type[wherei].children)
                that.data.pasters = that.data.pasters_type[wherei].children
                that.setData({
                  pasters_type: that.data.pasters_type,
                  pasters: that.data.pasters
                })
              } else {
                console.log('没有了')
              }
            },
            complete: () => {
              that.data.pastersrequest.push(that.data.nowpasterId+res.current)
              that.setData({
                pastersrequest: that.data.pastersrequest
              })
              console.log(that.data.pastersrequest)
            }
          })
        }
      }
      console.log(e.changedTouches[0].pageX)
      console.log(pasterswipervalue)
    }).exec()
  },
  startRotate (e) {
    console.log('startRotate')
    displayValue = 'flex'
    this.setPasterHidden()
  },
  moveRotate (e) {
    console.log('moveRotate')
    var str = e.target.id
    for(let i=0;i<pasterNum;i++){
      if(str === 'rotate'+this.data.movableviewNum[i].id){
        endrotate.x = e.changedTouches[0].pageX
        endrotate.y = e.changedTouches[0].pageY
        rotateValue.x = endrotate.x - this.data.movableviewNum[i].x - this.data.movableviewNum[i].width/2 - (windowWidth - this.data.picsize.width)/2
        rotateValue.y = endrotate.y - this.data.movableviewNum[i].y - this.data.movableviewNum[i].height/2 - this.data.oldCoordinatey
        this.data.movableviewNum[i].rotate = this.getAngle(rotateValue)
      }
    }
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  endRotate (e) {
    console.log('endRotate')
    displayValue = 'none'
    this.setPasterHidden()
  },
  getAngle(rotateValue){
    console.log('getAngle')
    let angle = Math.round(Math.atan(Math.abs(rotateValue.y) / Math.abs(rotateValue.x)) * 180 / Math.PI)
    if(rotateValue.x > 0 && rotateValue.y < 0){
      //第一象限
      console.log('第一象限')
      return 45 - angle
    }else if(rotateValue.x < 0 && rotateValue.y < 0){
      //第二象限
      console.log('第二象限')
      return -135 + angle
    }else if(rotateValue.x < 0 && rotateValue.y > 0){
      //第三象限
      console.log('第三象限')
      return 225 - angle
    }else if(rotateValue.x > 0 && rotateValue.y > 0){
      //第四象限
      console.log('第四象限')
      return angle + 45
    }else if(rotateValue.x === 0 && rotateValue.y < 0){
      //y正半轴
      console.log('y正半轴')
      return -45
    }else if(rotateValue.x === 0 && rotateValue.y > 0){
      //y负半轴
      console.log('y负半轴')
      return 135
    }else if(rotateValue.x > 0 && rotateValue.y === 0){
      //x正半轴
      console.log('x正半轴')
      return 45
    }else if(rotateValue.x < 0 && rotateValue.y === 0){
      //x负半轴
      console.log('x负半轴')
      return 225
    }
  }
})