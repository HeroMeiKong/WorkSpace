// pages/preview/preview.js
const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();
let usermethod = 'album'
let computeMethod = 'height' //视频比例计算方式
var pasterlength = 0
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //视频屏幕高度
let previewbox = 0
var oldLocation = {x:0,y:0} //计算压条大小
var pasterNum = 0 //压条个数
var oldmusiclist = {id: 0}     //选中的音乐列表
var musiclistcontent = []      //{id: 0,content: ''}音乐的内容
const musicpic = {playimg: '../../assets/images/4play.png',pauseimg: '../../assets/images/4ing.gif',addimg: '../../assets/images/4add.png',cancelimg: '../../assets/images/4cancel.png'}
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
const topicpic = {yes: '../../assets/images/4duigou.png',no: '../../assets/images/1huati@2x.png'}
const innerAudioContext = wx.createInnerAudioContext()//试听歌曲
innerAudioContext.obeyMuteSwitch = false
innerAudioContext.autoplay = false
innerAudioContext.loop = true
const preInnerAudioContext = wx.createInnerAudioContext()//预览歌曲
preInnerAudioContext.obeyMuteSwitch = false
preInnerAudioContext.autoplay = false
preInnerAudioContext.loop =false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //isIpx: false,
    whichmodel: true,
    models: 'defaultmodel',
    showwrappers: 'visible',
    picsize: {height: 0,width: 0}, //图片的大小
    previewsize: {height: 0,width: 0},//预览视频的大小
    tempFilePath: '',
    size: 0,
    duration: 0,
    movableviewNum: [], //压条个数
    oldCoordinatey: 0,
    oldVideoSize: {width: 0,height: 0},
    previewpic: '../../assets/images/2null2@2x.png', //视频截图加载失败，默认图片
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
    musicimgs: {playimg: '../../assets/images/4ing.gif',pause: '',addimg: '../../assets/images/4add.png',cancel: '',palyorpause: '',},
    showmusiclist: 'none',
    showpublish: 'none',
    showpause: 'flex',
    showVideos: 'flex',
    showtextcontent: 'block', //值为block或者none
    showtopictype: 'none',
    showsure: 'flex',
    topic: '话题',
    topics: [],
    publish: {width: 0,height: 0,x: 0,y: 0},
    uploadContent: {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                    join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                    tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0}
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
        if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
          //iphoneX
          windowHeight = (res.windowHeight - 186 * windowWidth / 750)*0.8
          that.data.oldCoordinatey = 186 * windowWidth / 750
          that.data.models = 'iphoneX'
        } else if (res.model.indexOf("BLA-AL00") > -1) {
          //huaweimate10plus
          windowHeight = (res.windowHeight - 142 * windowWidth / 750)*0.8
          that.data.oldCoordinatey = 142 * windowWidth / 750
          that.data.models = 'huaweimate10plus'
        } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
          //OnePlus5T
          windowHeight = (res.windowHeight - 142 * windowWidth / 750)*0.8
          that.data.oldCoordinatey = 142 * windowWidth / 750
          that.data.models = 'oneplus5t'
        } else {
          //其他机型
          windowHeight = (res.windowHeight - 122 * windowWidth / 750)*0.8
          that.data.oldCoordinatey = 122 * windowWidth / 750
          that.setData({
            whichmodel: false,
          })
        }
        previewbox = 69*windowWidth/75
        that.setData({
          models: that.data.models
        })
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
            title: '视频处理中',
            duration: 2000,
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
              title: '视频超过100M！',
              duration: 1500,
              mask: true
            })
            const timers = setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              });
              clearTimeout(timers)
            },1500)
          } else {
            if (that.data.duration > 30) {
              wx.showToast({
                title: '视频超过30s！',
                duration: 1500,
                mask: true
              })
              const timers = setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                });
                clearTimeout(timers)
              },1500)
            } else if (that.data.duration < 10) {
              wx.showToast({
                title: '视频时间太短！',
                duration: 1500,
                mask: true
              })
              const timers = setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                });
                clearTimeout(timers)
              },1500)
            } else {
              //上传视频， 取得视频服务器地址
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
                    uploadContent: that.data.uploadContent
                  })
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
        console.log(e)
        wx.navigateBack({
          delta: 1
        });
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
    this.data.uploadContent = {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                    join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                    tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0}
    preInnerAudioContext.src = 'none'
    innerAudioContext.src = 'none'
    console.log(innerAudioContext.src)
    console.log(preInnerAudioContext.src)
    this.data.showmusiclists = []
    this.setData({
      musiclists: this.data.musiclists,
      showmusiclists: this.data.showmusiclists,
      uploadContent: this.data.uploadContent
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
                    tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0}
    preInnerAudioContext.src = 'none'
    innerAudioContext.src = 'none'
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
      uploadContent: this.data.uploadContent
    })
  },
  cancelFilter (e) {
    console.log('cancelFilter')
    this.data.uploadContent.filter = 'none'
    this.setData({
      showoption: 'flex',
      showfilter: 'none',
      //showcover: 'flex',
      uploadContent: this.data.uploadContent
    })
  },
  cancelPaster (e) {
    console.log('cancelPaster')
    this.data.uploadContent.tiezhi = ''
    this.data.uploadContent.tiezhi_x = 0
    this.data.uploadContent.tiezhi_y = 0
    this.data.uploadContent.tiezhi_height = 0
    this.data.uploadContent.tiezhi_width = 0
    this.setData({
      showoption: 'flex',
      showpaster: 'none',
      //showcover: 'flex',
      uploadContent: this.data.uploadContent
    })
  },
  cancelMusic (e) {
    console.log('cancelMusic')
    this.data.uploadContent.audio_id = ''
    this.data.uploadContent.audio_url = ''
    this.setData({
      showoption: 'flex',
      showmusic: 'none',
      //showcover: 'flex',
      uploadContent: this.data.uploadContent
    })
  },
  goHome: function (e) {
    console.log('goHome')
    innerAudioContext.stop()
    if(this.data.movableviewNum.length > 0){
      //this.data.movableviewNum[0].display = 'none'
      this.data.uploadContent.tiezhi = this.data.movableviewNum[0].pic
    }
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
    if(this.data.movableviewNum.length > 0){
      pasterNum--
    }
    this.data.movableviewNum.pop()
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
    this.data.movableviewNum[0].x = e.detail.x
    this.data.movableviewNum[0].y = e.detail.y
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  //移动压条
  getStartLocation (e) {
    console.log('getStartLocation')
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
    for(let i=0;i<pasterNum;i++){
      if(str === 'bottom'+this.data.movableviewNum[i].id){
        this.data.movableviewNum[i].width = e.changedTouches[0].pageX - oldLocation.x
        this.data.movableviewNum[i].height = e.changedTouches[0].pageY - oldLocation.y
      }
    }
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
  },
  endLocation (e) {
    console.log('endLocation')
  },
  nextStep (e) {
    console.log('nextStep')
    wx.showToast({
      title: '滤镜效果需视频合成后可见',
      mask: true,
      icon: 'none',
      duration: 3000
    })
    this.videoContext1.play()
    this.videoContext1.pause()
    innerAudioContext.stop()
    if(this.data.movableviewNum.length > 0){
      //预览页贴纸位置
      let publishValues = this.data.previewsize.height/this.data.picsize.height
      this.data.publish.height = this.data.movableviewNum[0].height * publishValues
      this.data.publish.width = this.data.movableviewNum[0].width * publishValues
      this.data.publish.y = this.data.movableviewNum[0].y * publishValues
      this.data.publish.x = this.data.movableviewNum[0].x * publishValues//- (windowWidth-9*windowHeight/16)/2) / publishValues + 483*windowWidth/2400
      //上传视频贴纸位置
      let videoValues = this.data.oldVideoSize.height / this.data.picsize.height
      this.data.uploadContent.tiezhi_height = this.data.movableviewNum[0].height * videoValues
      this.data.uploadContent.tiezhi_width = this.data.movableviewNum[0].width * videoValues
      this.data.uploadContent.tiezhi_y = this.data.movableviewNum[0].y * videoValues
      this.data.uploadContent.tiezhi_x = this.data.movableviewNum[0].x * videoValues// - (windowWidth-9*windowHeight/16)/2) * videoValues
    }
    console.log(this.data.publish)
    this.setData({
      //showwrappers: 'none',
      showwrappers: 'hidden',
      showpublish: 'flex',
      uploadContent: this.data.uploadContent,
      publish: this.data.publish
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
            } else {
              data.data[i].chosethispaster = 'none'
            }
            that.data.pasterId.push(data.data[i].id)
          }
          that.setData({
            pasters_type: data.data,
            pasters: data.data[0].children
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
    var pasternumid = this.data.movableviewNum.length
    var pic = '../../assets/images/2null2@2x.png' //默认图片
    var pasterpicid = e.currentTarget.id
    var pasterpiclength = this.data.pasters.length
    for(let i=0;i<pasterpiclength;i++){
      if(this.data.pasters[i].id === pasterpicid){
        pic = this.data.pasters[i].icon
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
    var newpaster = {
      id:'movableview'+pasternumid,
      width: 80,
      height: 80,
      //display: 'none',//左上角和右下角图标
      //show: 'flex',//显示和隐藏贴纸
      x: 0,
      y: 0,
      pic: pic}
    if(pasterNum > 0){
      wx.showToast({
        title: '只能添加一个压条',
        duration: 1000
      })
    } else {
      pasterNum++
      console.log(pasterNum)
      //添加压条
      this.data.movableviewNum.push(newpaster)
      this.setData({
        movableviewNum: this.data.movableviewNum
      })
    }
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
      pasterbegin: 0
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
        addmusiclock = false
        tempmusictype = -1
        preInnerAudioContext.src = 'none'
        this.data.uploadContent.audio_id = ''
        this.data.uploadContent.audio_url = ''
        this.setData({
          uploadContent: this.data.uploadContent
        })
      } else {
        //不是同一首歌
        for(let k=0;k<length;k++){
          if(e.currentTarget.id === 'right'+this.data.showmusiclists[k].id){
            console.log('选他1')
            preInnerAudioContext.src = this.data.showmusiclists[k].music_url
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
            this.data.showmusiclist = 'flex'
            tempmusiclist.content = 'yes'
            this.setData({
              showmusiclists: this.data.showmusiclists,
              showmusiclist: this.data.showmusiclist,
              musiclists: this.data.musiclists,
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
        musicbegin: 0
      })
    }
  },
  uploadContent (e) {
    console.log('uploadContent')
    let that = this
    this.videoContext1.pause()
    preInnerAudioContext.pause()
    if(this.data.uploadContent.join_sub === -1 || this.data.uploadContent.join_sub_id === -1){
      wx.showToast({
        title: '未选择话题！',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: '视频上传中……',
        icon: 'loading',
        duration: 5000,
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
          console.log('resp')
          console.log(resp)
          console.log(wx.getStorageSync('loginSessionKey'))
          var timer = setInterval(()=>{
            wx.showToast({
              title: '视频处理中……',
              icon: 'loading',
              duration: 5000,
              mask: true,
            });
            if(!resp.data.data){
              console.log('sss')
              clearInterval(timer)
              wx.showToast({
                title: '视频上传成功！',
                icon: 'success',
                duration: 1500,
                mask: true,
                success: (result)=>{
                  const timers = setTimeout(()=>{
                    wx.navigateBack({
                      delta: 1
                    });
                    clearTimeout(timers)
                  },1500)
                },
              });
            } else {
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
                    clearInterval(timer)
                    wx.showToast({
                      title: '视频上传成功！',
                      icon: 'success',
                      duration: 1500,
                      mask: true,
                      success: (result)=>{
                        const timers = setTimeout(()=>{
                          wx.navigateBack({
                            delta: 1
                          });
                          clearTimeout(timers)
                        },1500)
                      },
                    });
                  }
                },
                complete: () => {
                  console.log('我又发了一次')
                }
              })
            }
            that.data.uploadContent = {video_url: '',filter: 'none',video_desc: '',join_sub_id: -1,
                    join_sub: -1,audio_url: '',audio_id: '',tiezhi: '',tiezhi_x: 0,
                    tiezhi_y: 0,tiezhi_height: 0,tiezhi_width: 0}
            preInnerAudioContext.src = 'none'
            innerAudioContext.src = 'none'
            console.log(innerAudioContext.src)
            console.log(preInnerAudioContext.src)
            that.setData({
              uploadContent: that.data.uploadContent
            })
          },5000)
        },
        complete: () => {
            this.data.loading_num--;
            if (this.data.loading_num == 0) {
                wx.hideLoading()
            }
        }
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
            res.data.data[i].pic = topicpic.no
          }
          this.setData({
            topics: res.data.data
          })
          console.log(this.data.topics)
        },
        complete: () => {
          console.log('查询音效分类！')
        }
      })
    }
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
})