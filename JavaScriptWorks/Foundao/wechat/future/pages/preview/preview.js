// pages/preview/preview.js
const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();
var pasterlength = 0
var windowWidth = 0  //屏幕宽度
var windowHeight = 0  //屏幕宽度
var oldLocation = {x:0,y:0} //计算压条大小
var pasterNum = 0 //压条个数
var oldmusiclist = ''     //选中的音乐列表
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
    filters: [{filterdiv: 'chosefilterdiv',pic: '../../assets/images/2attention3@2x.png',name: '原画',id: 'filter1'},
              {filterdiv: 'filterdiv',pic: '../../assets/images/share_normal.png',name: '秘语',id: 'filter2'},
              {filterdiv: 'filterdiv',pic: '../../assets/images/share_normal.png',name: '绿光',id: 'filter3'},
              {filterdiv: 'filterdiv',pic: '../../assets/images/share_normal.png',name: '消逝',id: 'filter4'},
              {filterdiv: 'filterdiv',pic: '../../assets/images/share_normal.png',name: '暗淡',id: 'filter5'},
              {filterdiv: 'filterdiv',pic: '../../assets/images/share_normal.png',name: '明亮',id: 'filter6'}],
    pasters_type: [],
    pasters: [],
    pasterId: [],
    // pasters: [{pasterdiv: 'pasterdiv',pic: '../../assets/images/2attention3@2x.png',id: 'paster1'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster2'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster3'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster4'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster5'},
    //           {pasterdiv: 'pasterdiv',pic: '../../assets/images/share_normal.png',id: 'paster6'}],
    musics: [{musicdiv: 'musicdiv',pic: '../../assets/images/2attention3@2x.png',id: 'music0',name: '秘语'},
              {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music1',name: '秘语'},
              {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music3',name: '秘语'},
              {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music4',name: '秘语'},
              {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music5',name: '秘语'},
              {musicdiv: 'musicdiv',pic: '../../assets/images/share_normal.png',id: 'music6',name: '秘语'}],
    musiclists: [[{id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 's'},
                 {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 'f'},
                 {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '0',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'}],
                 [{id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 'h'},
                 {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'},
                 {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: 't'},
                 {id: '1',pic: '../../assets/images/2attention3@2x.png',music_type_id: '3',name: '秘语'}]],
    showVideo: {isvideo:'none',notvidoe:'flex'},  //值为flex或者none
    showmusiclists: [],
    showoption: {father: 'flex',son: 'none'},
    ischosewrapper: 'none',
    showfilter: 'none',
    showpaster: 'none',
    //chosethispaster: {text: 'chosethispaster',interest: 'none',doodle: 'none'}, //值为chosethispaster或者none
    showmusic: 'none',
    musicimgs: {playimg: '../../assets/images/4ing.gif',addimg: '../../assets/images/4add.png'},
    showmusiclist: 'none',
    uploadContent: {video_url: '',filter: '',video_desc: '',join_sub_id: 0,
                    join_sub: 0,audio_url: '',audio_id: '',tiezhi: 'http://cdn-live.foundao.com/host/image/2018/11/19/15426166456712.jpg',tiezhi_x: 0,
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
    this.setData({
      showVideo: {isvideo:'flex',notvideo:'none'}
    })
    console.log(this.data.showVideo)
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
    console.log(e)
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
      pasters: this.data.pasters
    })
  },
  playmusic(e){
    console.log('playmusic')
  },
  addmusic(e){
    console.log('addmusic')
  },
  choseMusic(e){
    console.log('choseMusic')
    console.log(e)
    //开关歌曲列表
    if(oldmusiclist === e.currentTarget.id){
      this.setData({
        showmusiclist: 'none'
      })
    } else {
      this.setData({
        showmusiclist: 'flex'
      })
    }
    oldmusiclist = e.currentTarget.id
    //切换歌曲列表
    const length = this.data.musiclists.length
    var str = e.currentTarget.id
    var musicnum = str.substring(str.length-1)
    this.data.showmusiclists = this.data.musiclists[musicnum]
    console.log(this.data.showmusiclists)
    this.setData({
      showmusiclists: this.data.showmusiclists
    })
  },
  uploadContent (e) {
    let heightValue = this.data.oldVideoSize.height / windowHeight
    let widthValue = this.data.oldVideoSize.width / windowWidth
    this.data.uploadContent.video_url = this.data.tempFilePath
    this.data.uploadContent.filter = 'none'
    this.data.uploadContent.join_sub_id = 4
    this.data.uploadContent.join_sub = 5
    this.data.uploadContent.tiezhi_height = this.data.movableviewNum[0].height * heightValue
    this.data.uploadContent.tiezhi_width = this.data.movableviewNum[0].width * widthValue
    this.data.uploadContent.tiezhi_y = this.data.movableviewNum[0].y * heightValue
    this.data.uploadContent.tiezhi_x = this.data.movableviewNum[0].x * widthValue
    console.log(this.data.uploadContent.tiezhi_width)
    console.log(this.data.uploadContent.video_url)
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
})