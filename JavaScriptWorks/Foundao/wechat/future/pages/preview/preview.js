// pages/preview/preview.js
const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();
var pasterlength = 0
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //屏幕高度
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
let topiclock = false  //话题是否选择
const topicpic = {yes: '../../assets/images/4duigou.png',no: '../../assets/images/1huati@2x.png'}
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    size: 0,
    duration: 0,
    movableviewNum: [], //压条个数
    oldCoordinatey: 0,
    oldVideoSize: {width: 0,height: 0},
    //videoSize: {width: 0,height: 0},
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
    // pasters: [{pasterdiv: 'pasterdiv',pic: '../../assets/images/2attention3@2x.png',id: 'paster1'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster2'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster3'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster4'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster5'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster6'}],
    musics: [],
    musicbegin: 0,
    // musics: [{musicdiv: 'musicdiv',pic: '../../assets/images/2attention3@2x.png',id: 'music0',name: '秘语'},
    //           {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music1',name: '秘语'},
    //           {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music3',name: '秘语'},
    //           {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music4',name: '秘语'},
    //           {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music5',name: '秘语'},
    //           {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music6',name: '秘语'}],
    musiclists: [],
    // musiclists: [[{id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 's'},
    //              {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 'f'},
    //              {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'}],
    //              [{id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 'h'},
    //              {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
    //              {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 't'},
    //              {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'}]],
    showVideo: {isvideo:'none',notvidoe:'flex'},  //值为flex或者none
    showmusiclists: [],
    showwrappers: 'block',   //值为block或者none
    showoption: {father: 'flex',son: 'none'},
    ischosewrapper: 'none',
    showfilter: 'none',
    showpaster: 'none',
    //chosethispaster: {text: 'chosethispaster',interest: 'none',doodle: 'none'}, //值为chosethispaster或者none
    showmusic: 'none',
    musicimgs: {playimg: '../../assets/images/4ing.gif',pause: '',addimg: '../../assets/images/4add.png',cancel: '',palyorpause: '',},
    showmusiclist: 'none',
    showpublish: 'none',
    showpause: 'flex',
    showVideos: 'flex',
    showtextcontent: 'block', //值为block或者none
    showtopictype: 'none',
    showsure: 'flex',
    topic: '请选择话题！',
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
    wx.setEnableDebug({
      enableDebug: true,
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        windowWidth = res.windowWidth
        windowHeight = (res.windowHeight - 122 * windowWidth / 750)*0.8
        that.data.oldCoordinatey = 122 * windowWidth / 750
      }
    })
    console.log(windowHeight)
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log('选取视频')
        console.log(res)
        that.data.oldVideoSize.height = res.height
        that.data.oldVideoSize.width = res.width
        wx.showToast({
          title: res.tempFilePath,
          icon: 'success',
          duration: 2000
        })
        that.setData({
          tempFilePath: res.tempFilePath,
          duration: res.duration,
          oldVideoSize: that.data.oldVideoSize,
          size: (res.size / (1024 * 1024)).toFixed(2),
          //display: 'flex',
        })
        console.log(that.data.oldVideoSize)
        wx.showLoading({
          title: '视频处理中',
          duration: 2000
        })
        if (that.data.size > 100) {
          wx.showToast({
            title: '视频大小超过100M,请重新选择视频！',
            duration: 1500,
            // success: (result)=>{

            // }
          })
        } else {
          if (that.data.duration > 30) {
            wx.showToast({
              title: '视频长度为' + res.duration + ',视频长度超过30s,请重新选择视频！',
              duration: 1500,
              // success: (result)=>{

              // }
            })
          } else {
            //上传视频， 取得视频服务器地址
            wx.uploadFile({
              url: api.upload_cover,
              filePath: that.data.tempFilePath,
              name: 'filename',
              header: {
                'content-type': 'multipart/form-data',
                "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
              },
              formData: {
                upload_type: 'tmp1',
                filename: that.data.tempFilePath,
              },
              success(res) {
                const data = JSON.parse(res.data)
                console.log(res.data)
                console.log(data)
                that.setData({
                  previewpic: data.data.savehttp,
                  tempFilePath: data.data.file_path
                })
              }
            })
          }
        }
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext1 = wx.createVideoContext('myVideo1')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  backHome: function (e) {
    console.log('backHome')
    this.setData({
      showoption: {father: 'flex',son: 'none'},
      ischosewrapper: 'none',
      showfilter: 'none',
      showpaster: 'none',
      showmusic: 'none'
    })
  },
  goHome: function (e) {
    console.log('goHome')
    this.setData({
      showoption: {father: 'flex',son: 'none'},
      ischosewrapper: 'none',
      showfilter: 'none',
      showpaster: 'none',
      showmusic: 'none'
    })
  },
  //删除压条
  cancelMovableView (e) {
    console.log('cancelMovableView')
    var str = e.target.id
    var pasternumid = this.data.movableviewNum.length
    console.log(str)
    for(let i=0;i<pasternumid;i++){
      if(str === 'top'+this.data.movableviewNum[i].id){
        this.data.movableviewNum[i].show = 'none'
        console.log(this.data.movableviewNum[i].display)
        this.setData({
          movableviewNum: this.data.movableviewNum
        })
        console.log('删除')
        console.log(this.data.movableviewNum[i].id)
        pasterNum--
        console.log(pasterNum)
      }
    } 
  },
  //显示改变压条按钮
  showMovableView (e) {
    console.log('showMovableView')
    var str = e.target.id
    var pasternumid = this.data.movableviewNum.length
    for(let i=0;i<pasternumid;i++){
      if(str === 'pic'+this.data.movableviewNum[i].id){
        if(this.data.movableviewNum[i].display === 'flex'){
          this.data.movableviewNum[i].display = 'none'
        } else {
          this.data.movableviewNum[i].display = 'flex'
        }
      }
    }
    this.setData({
      movableviewNum: this.data.movableviewNum
    })
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
    console.log(this.data.movableviewNum)
  },
  nextStep (e) {
    this.videoContext1.play()
    this.videoContext1.pause()
    if(this.data.movableviewNum.length > 0){
      let heightValues = this.data.oldVideoSize.height / (16*windowWidth/15)
      let widthValues = this.data.oldVideoSize.width / (72*windowWidth/75)
      this.data.publish.height = this.data.uploadContent.tiezhi_height / heightValues
      this.data.publish.width = this.data.uploadContent.tiezhi_width / widthValues
      this.data.publish.y = this.data.uploadContent.tiezhi_y / heightValues
      this.data.publish.x = this.data.uploadContent.tiezhi_x / widthValues
    }
    console.log(this.data.publish)
    this.setData({
      showwrappers: 'none',
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
      showoption: {father: 'none',son: 'flex'},
      ischosewrapper: 'flex',
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
      showoption: {father: 'none',son: 'flex'},
      showpaster: 'flex'
    })
    wx.request({
      url: api.sticker_type,
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
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
      showoption: {father: 'none',son: 'flex'},
      showmusic: 'flex'
    })
    wx.request({
      url: api.music_type,
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
      },
      success: (res) => {
        console.log(res)
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
    for(let i=pasternumid-1;i>=0;i--){
      //console.log(this.data.movableviewNum[i].show)
      if(this.data.movableviewNum[i].show === 'none'){
        this.data.movableviewNum.splice(i,1)
        console.log(this.data.movableviewNum)
      }
    }
    var newpaster = {
      id:'movableview'+pasternumid,
      width: 80,
      height: 80,
      display: 'none',
      show: 'flex',
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
        } else {
          samesong = false
        }
      }
      let ooo = e.currentTarget.id
      for(let j=0;j<musiclistslength;j++){
        console.log('111')
        console.log(this.data.musiclists[j])
        console.log(ooo.substring(5))
        if(this.data.musiclists[j][0].music_type_id === tempmusictype){
          for(let r=0;r<length;r++){
            if(this.data.musiclists[j][r].rightimg === musicpic.cancelimg){
              this.data.musiclists[j][r].rightimg = musicpic.addimg
            }
          }
        }
      }
      if(samesong){
        //是同一首歌
        addmusiclock = false
        tempmusictype = -1
      } else {
        //不是同一首歌
        for(let k=0;k<length;k++){
          if(e.currentTarget.id === 'right'+this.data.showmusiclists[k].id){
            console.log('选他1')
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
  choseMusic(e){
    console.log('choseMusic')
    playlock = false
    innerAudioContext.pause()
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
            "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
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
      oldmusiclist.id = e.currentTarget.id
      this.setData({
        showmusiclists: this.data.showmusiclists,
        showmusiclist: this.data.showmusiclist,
        musiclists: this.data.musiclists,
        musicbegin: 0
      })
    }
  },
  uploadContent (e) {
    if(this.data.uploadContent.join_sub === -1 || this.data.uploadContent.join_sub_id === -1){
      wx.showToast({
        title: '未选择话题！',
        duration: 1000
      })
    } else {
      if(this.data.movableviewNum.length > 0){
        let heightValue = this.data.oldVideoSize.height / windowHeight
        let widthValue = this.data.oldVideoSize.width / windowWidth
        this.data.uploadContent.video_url = this.data.tempFilePath
        this.data.uploadContent.tiezhi_height = this.data.movableviewNum[0].height * heightValue
        this.data.uploadContent.tiezhi_width = this.data.movableviewNum[0].width * widthValue
        this.data.uploadContent.tiezhi_y = this.data.movableviewNum[0].y * heightValue
        this.data.uploadContent.tiezhi_x = this.data.movableviewNum[0].x * widthValue
        this.setData({
          uploadContent: this.data.uploadContent
        })
      }
      wx.request({
        url: api.upload_submit,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
        },
        data: this.data.uploadContent,
        success: (resp) => {
          console.log('resp')
          console.log(resp)
          var timer = setInterval(()=>{
            wx.request({
              url: api.get_submit,
              method: 'POST',
              header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
              },
              data: {
                job_id: resp.data.data.job_id,
                move_name: resp.data.data.move_name,
                video_url: resp.data.data.video_url
              },
              success: (res) => {
                console.log(res)
                  if(res.data.code === 0){
                    console.log(res)
                    clearInterval(timer)
                  }
              },
              complete: () => {
                console.log('我又发了一次')
              }
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
    console.log('showPlayOrPause')
    if(videolock){
      this.videoContext1.pause()
      this.setData({
        showpause: 'flex'
      })
      videolock = false
    } else {
      console.log('还没有播放！')
    }
  },
  playThis (e) {
    console.log('playOrPause')
    this.videoContext1.play()
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
            "auth-token": 'M5j8c7z9N6V4l3U2b13pPbnR6T2pFd09pSnNiMmRwYmw5MGFXMWxJanR6T2pFNU9pSXlNREU0TFRFeExUQTNJREUzT2pBMU9qTTVJanR6T2pRNkluVjFhV1FpTzNNNk16WTZJakl5UmtRNFJFVTNMVVJEUWpJdE9FRXlRaTAyTVRRNUxUSkJRakkyTXpjMk56TTBRU0k3Y3pveE16b2lkRzlyWlc1ZmRtVnljMmx2YmlJN2N6b3pPaUl4TGpBaU8zMD1fMTU0MTU4MTUzOTAyN19jZTdkNGZiZjE3MzA3NzFkMWMwN2I5MGMwMGI5OTMyOF9fMTk4NTljODE5YzMwZDg4YTMzNjZhYjMyZDhlOGYwOTIO0O0O',
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
})