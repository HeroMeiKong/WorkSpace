import React, { Component, Fragment } from 'react'
import './index.scss'
import Tool from '@/utils/tool.js'
// import $ from 'jquery'
import API from "@/API/api";
import messageBox from '@/utils/messageBox.js'
import transCode from '@/utils/transCode';
import httpRequest from "@/utils/httpRequest";
import {logout} from '@/redux/models/admin';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import MoudleList from "./MoudleList";
import Alert from "@/components/Alert";
import DynamicsText from '../DynamicsText/DynamicsText'
import Animation_BigSubtitles from '@/components/Animations/Animation_BigSubtitles/Animation_BigSubtitles'
import Animation_Character from '@/components/Animations/Animation_Character/Animation_Character'
import Animation_inAndOut from '@/components/Animations/Animation_inAndOut/Animation_inAndOut'
import Animation_showAndHidden from '@/components/Animations/Animation_showAndHidden/Animation_showAndHidden'
import Animation_bigAndSmall from '@/components/Animations/Animation_bigAndSmall/Animation_bigAndSmall'
// import OtherProduct from '@/components/OtherProduct/OtherProduct'
/* eslint-disable */
const $ = window.jQuery;
@withRouter
@connect(
  state => ({admin: state.admin}),
  {logout}
)
export default class MakeWater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false, //是否播放视频
      cur_time: 0, //播放时间
      lineLength: 699, //进度条长度
      duration: 0, //视频时长
      water_list: [], //水印列表
      isUploading: false,// 是否正在上传图片
      is_guides: false, //是否显示参考线
      isCompose: false, //是否合成
      isSuccessCompose: false, //是否完成合成
      isMoudleList: false, //是否显示模板列表弹窗
      isSave: false, //是否正在保存模板
      percent: 0, //处理视频的进度
      compose_url: '', //处理之后视频的url
      nologin: false, //未登录弹窗
      hor_guides: [
        { top: 20, left: 0, right: 0 },
        { top: 221, left: 0, right: 0 },
        { top: 420, left: 0, right: 0}
      ], //横参考线
      ver_guides: [
        { top: 0, left: 20, bottom: 0},
        { top: 0, left: 395, bottom: 0},
        { top: 0, left: 768, bottom: 0}
      ], //纵参考线
      showDynamicsText: false,//显示隐藏动态贴纸栏
      whichdynamicsText: 0,//哪一个文字压条
      temporaryText: window.intl.get('请双击输入文本'),//暂时大部分文字
      temporaryTime: 'time',//暂时时间文字
      temporaryLocation: 'location',//暂时地方文字
      temporaryName: 'name',//暂时人物文字
      temporaryResume: 'resume',//暂时自我介绍文字
      Animation_data: {
        text: window.intl.get('请双击输入文本'),
        time_text: 'time',
        location_text: 'location',
        name: 'name',
        resume: 'resume',
        color: '#ffffff',
        realColor: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Heiti',
        time: '10s',
        backgroundColor: '#00000080',
        times: 'infinite',//动画次数
        contentEditable: false,//文字是否可以编辑
        wider: false,//文字加粗
        italic: false,//斜体
        underline: false,//加下划线
        textAlign: 'center',//文字对齐方式
      },//动效属性
      site: [
        {x: 0, y: 20},       //定位left,bottom
        {x: 0, y: 0},      //定位left,top
        {x: 0, y: 20},       //定位left,bottom
        {x: 0, y: 20},       //定位right,bottom
        {x: 0, y: 0}        //定位left,top
      ],
      dynamicsTextData: {
        width: '',//导出视频宽度
        height: '',//导出视频高度
        video: [],//url//视频url,type//暂时固定video
        layer: [],//x//压条坐标x,y//压条坐标y,start_time//压条开始显示的时间,duration//压条显示的时长,yt_type//暂时固定text,text_type//暂时固定text,text//压条文字内容,width//压条宽,height//压条高
      },//动态贴纸属性
      cancelHttpTimes: false,//是否取消发送请求
      layerSize: [
        {width: 0,height: 0},
        {width: 200,height: 0},
        {width: 120,height: 130},
        {width: 200,height: 38},
        {width: 200,height: 0},
        {width: 300,height: 28}
      ],
      currentHeight: 0,//当前元素高度（有些元素不固定高度）
    };
    this.uploaded_num = 0; //已上传文件数
    this.upload_num = 0; //上传文件数
    /*定义两个值用来存放参考线按下的地方距离元素上侧和左侧边界的值*/
    this.lineX = 0;
    this.lineY = 0;
  }

  componentWillMount() {
    const {videoInfo, water_list} = this.props
    // const videoInfo = {
    //   duration: "144",
    //   height: "360",
    //   file_name: "测试视频1.mp4",
    //   size: "20031261",
    //   status: "0",
    //   width: "848",
    //   g_filemd5: "b08d83b126fcfc1f0c486d9113a1488a",
    //   up_token: "31b3ac58493bff9c47833689013270881655ce369d48"
    // }
    this.box_width = 791 //视频外层框宽度
    this.box_height = 443 //视频外层框高度
    this.box_p = this.box_width / this.box_height //视频框比例
    this.video_p = videoInfo.width / videoInfo.height  //视频原始宽高比
    if (this.video_p > this.box_p) {  //如果视频原始宽大于视频框宽，则宽铺满，高自适应
      this.videoWidth = this.box_width  //视频框内视频的宽
      this.videoHeight = this.box_width / this.video_p   //视频框内视频的高
      this.videoTop = this.box_height / 2 - this.videoHeight / 2    //视频框的top
      this.videoLeft = 0   //视频框的left
    } else if (this.video_p < this.box_p) { //如果视频原始宽小于视频框宽，则高铺满，宽自适应
      this.videoHeight = this.box_height
      this.videoWidth = this.box_height * this.video_p
      this.videoTop = 0
      this.videoLeft = this.box_width / 2 - this.videoWidth / 2
    } else {  //视频原始宽高比例与框相同
      this.videoWidth = this.box_width
      this.videoHeight = this.box_height
      this.videoTop = 0
      this.videoLeft = 0
    }
    this.old_new_p = videoInfo.width / this.videoWidth //原视频与视频框内视频的比例大小

    this.setState({
      duration: videoInfo.duration / 1 || 0,
      videoInfo,
      water_list
    })
  }

  componentDidMount() {
    const waterbox = this.refs['water_box'];
    //如果添加的事件处理函数将来想要移除就不能使用匿名函数的方式
    waterbox.addEventListener("dragenter", this.dragenter, false);
    waterbox.addEventListener("dragover", this.dragover, false);
    waterbox.addEventListener("drop", this.drop, false);
    var _this = this
    const {duration} = this.state
    var video = this.refs.video
    this.timer = setInterval(function () {
      if (_this.state.isPlay && duration) {
        if (Math.ceil(video.currentTime) >= duration) {
          video.pause()
          _this.setState({isPlay: false})
        }
        _this.setState({
          cur_time: video.currentTime
        })
      }
      if (_this.state.isCompose) {  //处理视频   移除拖拽事件
        waterbox.removeEventListener("dragenter", _this.dragenter, false);
        waterbox.removeEventListener("dragover", _this.dragover, false);
        waterbox.removeEventListener("drop", _this.drop, false);
      }
    }, 100)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  dragenter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  dragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  drop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    this.upload_num = 0;
    this.uploaded_num = 0;
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type;
      if (fileType.indexOf('image') !== -1) {
        const fileData = new FormData()
        fileData.append('file', files[i])
        this.upload_num += 1
        this.setState({
          isUploading: true
        }, () => {
          this.uploadImg(fileData)
        })
      } else {
        messageBox(window.intl.get('更多格式的转换功能即将上线，敬请期待'))
        return
      }
    }
  };

  //播放视频
  playVideo = () => {
    const {isPlay, duration} = this.state
    const video = this.refs.video
    if (Math.ceil(video.currentTime) >= duration && !isPlay) {
      video.currentTime = 0
      video.play()
      this.setState({isPlay: true})
    } else {
      if (isPlay) {
        video.pause()
      } else {
        video.play()
      }
      this.setState({isPlay: !isPlay})
    }
  }

  //替换时间
  changeTime = () => {
    const {duration} = this.state
    if (duration) {  //秒
      let h = 0, i = 0, s = parseInt(duration, 0)
      if (s > 60) {
        i = parseInt(s / 60, 0)
        s = parseInt(s % 60, 0)
      }
      if (i > 60) {
        h = parseInt(i / 60, 0)
        i = parseInt(i % 60, 0)
      }
      // 补零
      var zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
      }
      return [zero(h), zero(i), zero(s)].join(':')
    } else {
      return '00:00:00'
    }
  }

  //点击进度条
  setCurTime = (e) => {
    var setTime = e.pageX;
    var left = $(this.refs.line).offset().left;
    var diff = setTime - left;
    var t = this.length_To_time(diff);
    this.refs.video.currentTime = t;
    this.setState({
      cur_time: t
    })
  }

  //长度转换时间
  length_To_time = (l) => {
    return (l / this.state.lineLength) * parseFloat(this.state.duration);
  }
  //时间转换长度
  time_To_length = (t) => {
    return (t / parseFloat(this.state.duration)) * this.state.lineLength;
  }
  main_mouseDown = (e) => {
    // this.bef_isPaused = this.refs.video.paused;
    // this.video_pause();
    this.mouse_start_main = e.pageX;
    this.ori_time = this.state.cur_time;
    this.main_mouseMove();
  }
  main_mouseMove = () => {
    Tool.addEventHandler(document.body, 'mousemove', this.main_move);
    Tool.addEventHandler(document.body, 'mouseup', this.main_mouseUp);
  }
  main_mouseUp = () => {
    Tool.removeEventHandler(document.body, 'mousemove', this.main_move);
    Tool.removeEventHandler(document.body, 'mouseup', this.main_mouseUp);
    // if (!this.bef_isPaused) {
    //   this.refs.video.play();
    // }
  }
  main_move = (e) => {
    var x = e.pageX - this.mouse_start_main;
    var t = this.length_To_time(x);
    var cur_t = this.ori_time + t;
    if (cur_t < 0) {
      this.setState({
        cur_time: 0
      })
    } else if (cur_t >= parseFloat(this.state.duration)) {
      this.setState({
        cur_time: parseFloat(this.state.duration) - 0.2
      })
    } else {
      this.setState({
        cur_time: cur_t
      })
    }
    this.refs.video.currentTime = this.state.cur_time;
  }

  //选择文件
  inputFile = (e) => {
    const files = e.target.files
    this.upload_num = 0
    this.uploaded_num = 0
    if (files.length > 0) { //有选择
      for (let i = 0; i < files.length; i++) {
        const arr = files[i].name.split('.')
        const type = arr[arr.length - 1].toLowerCase()
        if (type === 'svg') {
          messageBox(window.intl.get('暂时不支持svg格式，敬请期待'))
          return
        } else {
          const fileType = files[i].type;
          if (fileType.indexOf('image') !== -1) {
            const fileData = new FormData()
            fileData.append('file', files[i])
            this.upload_num += 1
            this.setState({
              isUploading: true
            }, () => {
              this.uploadImg(fileData)
            })
          } else {
            messageBox(window.intl.get('更多格式的转换功能即将上线，敬请期待'))
            return
          }
        }
      }
    }
  }

  //上传图片
  uploadImg = (fileData) => {
    const {water_list} = this.state
    $.ajax({
      url: API.upload_img,
      type: 'POST',
      dataType: 'json',
      async: true,         //异步
      processData: false,  //很重要 ，告诉jquery不要对form进行处理 要求为Boolean类型的参数，默认为true。默认情况下，发送的数据将被转换为对象（从技术角度来讲并非字符串）以配合默认内容类型"application/x-www-form-urlencoded"。如果要发送DOM树信息或者其他不希望转换的信息，请设置为false。
      contentType: false,  //很重要，指定为false才能形成正确的Content-Type
      data: fileData,
    }).done((res) => {
      if (res.code / 1 === 0) {
        const data = res.data
        const width = 80
        const height = (80 / data.file_width) * data.file_height
        data.top = this.videoHeight / 2 - height / 2
        data.left = this.videoWidth / 2 - width / 2
        data.width = width
        data.height = height
        water_list.push(data)
        this.uploaded_num += 1
        this.setState({water_list}, () => {
          if (this.upload_num === this.uploaded_num) {  //上传的文件数与已上传的文件数相等
            this.setState({isUploading: false})
          } else {
            this.setState({isUploading: true})
          }
        })
      } else {
        this.setState({isUploading: false})
        messageBox(res.msg)
      }
      this.refs.upload_img.value = ''
    }).fail(() => {
      this.setState({isUploading: false})
      Tool.checkNetwork() ? messageBox(window.intl.get('网络出错，请检查您的网络链接!')) : messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //点击添加水印提示框
  clickTipsBox = () => {
    this.refs.upload_img.click()
  }

  //删除水印
  deleteMark = (index) => {
    const {water_list} = this.state
    water_list.splice(index, 1)
    this.setState({water_list})
  }

  //是否显示隐藏参考线
  showGuides = () => {
    const {is_guides} = this.state
    this.setState({is_guides: !is_guides}, () => {
      const showGuidesTip = localStorage.getItem('showGuidesTip')
      if (showGuidesTip !== 'true') {
        this.showGuidesTip()
      }
    })
  }

  //显示参考线提示框
  showGuidesTip = () => {
    var _this = this
    setTimeout(function () {
      $('#guides_tip').fadeIn()
      localStorage.setItem('showGuidesTip', 'true')
      _this.guidesTipTimer = setTimeout(_this.closeGuidesTip, 3000)
    }, 1000)
  }

  //关闭参考线提示框
  closeGuidesTip = () => {
    if ($('#guides_tip')) {
      $('#guides_tip').fadeOut()
    } else {
      clearTimeout(this.guidesTipTimer)
    }
  }

  //水印移动
  handleMouseDown = (index, e) => {
    const {water_list} = this.state
    const disx = e.pageX - water_list[index].left
    const disy = e.pageY - water_list[index].top

    var _this = this
    document.onmousemove = function (ev) {
      let left = ev.pageX - disx
      let top = ev.pageY - disy
      const video_box = _this.refs.video_box
      // 移动最大距离
      const left_max = video_box.offsetWidth - water_list[index].width
      const top_max = video_box.offsetHeight - water_list[index].height
      left = left <= 0 ? 0 : left >= left_max ? left_max : left
      top = top <= 0 ? 0 : top >= top_max ? top_max : top
      water_list[index].left = left
      water_list[index].top = top
      _this.setState({water_list})
    }
    document.onmouseup = function (ev) {
      const {hor_guides, ver_guides, water_list, is_guides} = _this.state
      if (is_guides && water_list[index]) {
        const water = water_list[index]
        hor_guides.forEach((item, guideIndex) => {
          const top_dis = Math.abs(water.top + _this.videoTop - item.top) //上边缘
          const bottom_dis = Math.abs(water.top + water.height + _this.videoTop - item.top) //下边缘
          const center_dis = Math.abs(water.top + _this.videoTop + water.height / 2 - item.top)  //中心点
          const min_top = 0
          const max_top = _this.videoHeight - water.height
          if (center_dis <= 20) {
            let top = item.top - _this.videoTop - water.height / 2
            top = top > max_top ? max_top : top < min_top ? min_top : top
            water.top = top
          } else if (top_dis < bottom_dis && top_dis <= 20) {
            let top = item.top - _this.videoTop
            top = top > max_top ? max_top : top < min_top ? min_top : top
            water.top = top
          } else if (top_dis > bottom_dis && bottom_dis <= 20) {
            let top = item.top - _this.videoTop - water.height
            top = top > max_top ? max_top : top < min_top ? min_top : top
            water.top = top
          }
        })
        ver_guides.forEach((item, guideIndex) => {
          const left_dis = Math.abs(water.left + _this.videoLeft - item.left) //左边缘
          const right_dis = Math.abs(water.left + water.width + _this.videoLeft - item.left) //右边缘
          const center_dis = Math.abs(water.left + water.width / 2 + _this.videoLeft - item.left)
          const min_left = 0
          const max_left = _this.videoWidth - water.width
          if (center_dis <= 20) {
            let left = item.left - _this.videoLeft - water.width / 2
            left = left > max_left ? max_left : left < min_left ? min_left : left
            water.left = left
          } else if (left_dis < right_dis && left_dis <= 20) {
            let left = item.left - _this.videoLeft
            left = left > max_left ? max_left : left < min_left ? min_left : left
            water.left = left
          } else if (left_dis > right_dis && right_dis <= 20) {
            let left = item.left - _this.videoLeft - water.width
            left = left > max_left ? max_left : left < min_left ? min_left : left
            water.left = left
          }
        })
        _this.setState({water_list})
      }
      document.onmousemove = null
      document.onmousedown = null
    }
  }

  /*定义参考线鼠标下落事件*/
  lineDown = (index, direction, e) => {
    /*事件兼容*/
    let event = e || window.event;
    /*事件源对象兼容*/
    let target = event.target || event.srcElement;
    /*获取鼠标按下的地方距离元素左侧和上侧的距离*/
    if (direction === 'ver') {  //竖线
      this.lineX = event.clientX - target.offsetLeft;
    } else if (direction === 'hor') {  //横线
      this.lineY = event.clientY - target.offsetTop;
    }
    /*定义鼠标移动事件*/
    document.onmousemove = this.LineMove.bind(this, index, direction);
    /*定义鼠标抬起事件*/
    document.onmouseup = this.LineUp.bind(this, index);
  }

  /*定义参考线鼠标移动事件*/
  LineMove = (index, direction, e) => {
    /*事件兼容*/
    let event = e || window.event;
    const {ver_guides, hor_guides} = this.state
    /*事件源对象兼容*/
    // let target = event.target || event.srcElement;
    if (direction === 'ver') { //竖线
      ver_guides[index].left = event.clientX - this.lineX
      ver_guides[index].active = true
      if (ver_guides[index].left <= 1) {
        ver_guides[index].left = 0
        return
      }
      if(ver_guides[index].left >= 785){
        ver_guides[index].left = 785
        return
      }
    } else if (direction === 'hor') { //横线
      hor_guides[index].top = event.clientY - this.lineY
      hor_guides[index].active = true
      if (hor_guides[index].top <= 1) {
        hor_guides[index].top = 0
        return
      }
      if(hor_guides[index].top >= 438){
        hor_guides[index].top = 438
        return
      }
    }
    this.setState({ver_guides});
  }

  LineUp = (index) => {
    const {hor_guides, ver_guides, is_guides} = this.state
    if (is_guides) {
      if (Math.abs(hor_guides[index].top - this.box_height / 2) <= 10) {
        hor_guides[index].top = this.box_height / 2
      }
      if (Math.abs(ver_guides[index].left - this.box_width / 2) <= 10) {
        ver_guides[index].left = this.box_width / 2
      }
    }
    ver_guides[index].active = false
    hor_guides[index].active = false
    document.onmousemove = null;
    document.onmuseup = null;
    this.setState({ver_guides, hor_guides})
  }

  //图片缩放mousedown
  scaleMouseDown = (index, e) => {
    /*事件兼容*/
    let event = e || window.event;
    /*事件源对象兼容*/
    // let target = event.target || event.srcElement;
    // 阻止冒泡,避免缩放时触发移动事件
    event.stopPropagation();
    event.preventDefault();
    const {water_list} = this.state
    var _this = this
    const video_box = this.refs.video_box
    const mark_box = water_list[index]
    var pos = {
      'w': mark_box.width,
      'h': mark_box.height,
      'x': event.clientX,
      'y': event.clientY
    };
    document.onmousemove = function (ev) {
      ev.preventDefault();
      // 设置图片的最小缩放为24*24
      const scale = pos.h / pos.w

      var w = Math.max(24, ev.clientX - pos.x + pos.w)
      var h = Math.max(24 * scale, w * scale)

      // 设置图片的最大宽高
      const w_max = video_box.offsetWidth - mark_box.left
      const h_max = video_box.offsetHeight - mark_box.top
      const scaleWidth = w_max/w
      const scaleHeight = h_max/h
      if(scaleWidth >= scaleHeight){
        if (h >= h_max) {
          h = h_max
          mark_box.width = h/scale
          mark_box.height = h
          _this.setState({water_list})
        } else {
          w = w
          h = h
          mark_box.width = w
          mark_box.height = h
          _this.setState({water_list})
        }
      } else {
        if (w >= w_max) {
          w = w_max
          mark_box.width = w
          mark_box.height = w*scale
          _this.setState({water_list})
        } else {
          w = w
          h = h
          mark_box.width = w
          mark_box.height = h
          _this.setState({water_list})
        }
      }
      
    }
    document.onmouseleave = function () {
      document.onmousemove = null
      document.onmousedown = null
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmousedown = null
    }
  }

  //处理视频
  composeVideo = () => {
    const that = this
    const { whichdynamicsText, dynamicsTextData, cancelHttpTimes, water_list, videoInfo } = this.state
    const layer = []
    this.setState({
      isCompose: true,
      is_guides: false,
      percent: 0
    }, () => {
      if(whichdynamicsText !== 0 && water_list.length === 0){
        this.resetDynamicsTextData()
        httpRequest({
          url: API.get_dynamicsWatermaker,
          dataType: 'json',
          type: 'POST',
          data: {
              token: Tool.getUserData_storage().token,
              data: JSON.stringify(dynamicsTextData),
              video_name: 22,
          }
        }).done(res => {
          if(res.code === '0'){
            let times = 0
            const time = setInterval(() => {
              times++
              if(times < 1000 && ! cancelHttpTimes){
                httpRequest({
                  url: API.get_status,
                  data: {
                    trans_id: res.data.trans_id
                  }
                }).done(resp => {
                  if(resp.code === '0'){
                    if(resp.data.status === '2' && resp.data.url){
                      clearInterval(time)
                      that.transSuccess(resp.data.url)
                    } else if(resp.data.status === '1'){
                      that.transProgress(resp.data.progress)
                    } else {
                      clearInterval(time)
                      that.transFail(resp.data.msg)
                    }
                  } else {
                    clearInterval(time)
                    that.transFail(resp.msg)
                  }
                }).fail(resp => {
                  clearInterval(time)
                  that.transFail(resp.msg)
                })
              } else if(cancelHttpTimes){
                clearInterval(time)
                that.setState({
                  cancelHttpTimes: false
                })
                messageBox(window.intl.get('取消上传视频！'))
              } else {
                clearInterval(time)
                messageBox(window.intl.get('请求转码视频超时！'))
                that.setState({isCompose: false})
              }
            }, 1000)
          } else {
            that.transFail(res.msg)
          }
        }).fail(res => {
          that.transFail(res.msg)
        })
      } else if(whichdynamicsText !== 0 && water_list.length > 0){
        const layer = this.resetTextData()
        httpRequest({
          url: API.get_dynamicsWatermaker,
          dataType: 'json',
          type: 'POST',
          data: {
              token: Tool.getUserData_storage().token,
              data: JSON.stringify(layer),
              video_name: 22,
          }
        }).done(res => {
          if(res.code === '0'){
            let times = 0
            const time = setInterval(() => {
              times++
              if(times < 1000 && ! cancelHttpTimes){
                httpRequest({
                  url: API.get_status,
                  data: {
                    trans_id: res.data.trans_id
                  }
                }).done(resp => {
                  if(resp.code === '0'){
                    if(resp.data.status === '2' && resp.data.url){
                      clearInterval(time)
                      that.transSuccess(resp.data.url)
                    } else if(resp.data.status === '1'){
                      that.transProgress(resp.data.progress)
                    } else {
                      clearInterval(time)
                      that.transFail(resp.data.msg)
                    }
                  } else {
                    clearInterval(time)
                    that.transFail(resp.msg)
                  }
                }).fail(resp => {
                  clearInterval(time)
                  that.transFail(resp.msg)
                })
              } else if(cancelHttpTimes){
                clearInterval(time)
                that.setState({
                  cancelHttpTimes: false
                })
                messageBox(window.intl.get('取消上传视频！'))
              } else {
                clearInterval(time)
                messageBox(window.intl.get('请求转码视频超时！'))
                that.setState({isCompose: false})
              }
            }, 1000)
          } else {
            that.transFail(res.msg)
          }
        }).fail(res => {
          that.transFail(res.msg)
        })
      } else {
        water_list.forEach((item, index) => {
          const water = {
            img_url: item.file_url,
            width: item.width,
            height: item.height,
            x: item.left,
            y: item.top
          }
          water.width = Math.round(water.width * this.old_new_p)
          water.height = Math.round(water.height * this.old_new_p)
          water.x = Math.round(water.x * this.old_new_p)
          water.y = Math.round(water.y * this.old_new_p)
          layer.push(water)
        })
        this.trans = transCode({
          transOptions: {
            inFileName: videoInfo.file_name,
            inFileMd5: videoInfo.g_filemd5,
            outWidth: videoInfo.width,
            outHeight: videoInfo.height,
            token: videoInfo.upToken,
            layer: layer
          },
          transSuccess: this.transSuccess,
          transFail: this.transFail,
          transProgress: this.transProgress
        })
      }
    })
  }

  //转码成功回调
  transSuccess = (url) => {
    this.setState({
      percent: 100,
      isSuccessCompose: true,
      compose_url: url,
      showDynamicsText: false
    })
  }

  //转码进度
  transProgress = (percent) => {
    this.setState({percent: percent})
  }

  //转码失败
  transFail = (msg) => {
    const {dynamicsTextData} = this.state
    messageBox(msg)
    alert(msg)
    dynamicsTextData.layer.pop()
    dynamicsTextData.video.pop()
    this.setState({
      isCompose: false,
      showDynamicsText: false,
      dynamicsTextData
    })
  }

  //取消转码
  cancleCompose = () => {
    const {dynamicsTextData} = this.state
    if(this.state.whichdynamicsText === 0){
      this.trans.stopTransCode()
      this.setState({
        isCompose: false,
        showDynamicsText: false
      })
    } else {
      dynamicsTextData.layer.pop()
      dynamicsTextData.video.pop()
      this.setState({
        isCompose: false,
        cancelHttpTimes: true,
        showDynamicsText: false,
        dynamicsTextData
      })
    }
  }

  //视频处理中和处理后的暂停、播放
  composePlay = () => {
    const {isPlay, duration} = this.state
    const video = this.refs.video
    if (Math.ceil(video.currentTime) >= duration && !isPlay) {
      video.currentTime = 0
      video.play()
      this.setState({isPlay: true})
    } else {
      if (isPlay) {
        video.pause()
      } else {
        video.play()
      }
      this.setState({isPlay: !isPlay})
    }
  }

  //下载视频
  downloadCompose = () => {
    // window.gtag && window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'}) //统计下载
    const {compose_url, videoInfo} = this.state
    // const newWin = window.open()
    let openedWindow = window.open('','_self')
    httpRequest({
      url: API.downloadVideo,
      dataType: 'json',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        path: compose_url,
        up_token: videoInfo.upToken,
        name_type: 'Watermark',
        trans_type: 3
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        // newWin.location.href = res.data
        openedWindow.location.href=res.data
        // setTimeout(function () {
        //   newWin.close()
        // }, 1500)
      } else {
        // newWin.close()
        messageBox(res.msg)
      }
    }).fail(() => {
      // newWin.close()
      Tool.checkNetwork() ? messageBox(window.intl.get('网络出错，请检查您的网络链接!')) : messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //保存模板
  saveMoudle = () => {
    if (!this.isLogin()) {
      return
    }
    const {water_list, videoInfo} = this.state
    const user_info = this.props.admin
    const data = []
    water_list.forEach((item, index) => {
      const water = {
        img_url: item.file_url,
        width: item.width,
        height: item.height,
        x: item.left,
        y: item.top,
        videoWidth: this.videoWidth,
        videoHeight: this.videoHeight
      }
      // water.width = water.width * this.old_new_p
      // water.height = water.height * this.old_new_p
      // water.x = water.x * this.old_new_p
      // water.y = water.y * this.old_new_p
      data.push(water)
    })
    const video_info = {
      videoWidth: this.videoWidth,
      videoHeight: this.videoHeight
    }
    var _this = this
    this.setState({
      isSave: true
    }, () => {
      setTimeout(function () {
        _this.setState({isSave: false})
      }, 1000)
      httpRequest({
        url: API.save_moudle,
        dataType: 'json',
        type: 'POST',
        data: {
          token: user_info.token,
          id: '',
          name: videoInfo.file_name.split('.')[0] || videoInfo.file_name,
          data: data.length === 0 ? '' : JSON.stringify(data),
          videoInfo: JSON.stringify(video_info)
        }
      }).done((res) => {
        if (res.code / 1 === 0) {

        } else {
          this.setState({isSave: false, isAlert: true})
        }
      }).fail(() => {
        this.setState({isSave: false})
        Tool.checkNetwork() ? messageBox(window.intl.get('网络出错，请检查您的网络链接!')) : messageBox(window.intl.get('内部服务器错误！'))
      })
    })
  }

  //显示模板列表弹窗
  showMoudleList = () => {
    if (!this.isLogin()) {
      return
    }
    var mo = function (e) {
      e.preventDefault();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener("touchmove", mo, false);//禁止页面滑动
    this.setState({
      isMoudleList: true
    })
  }

  //判断是否登录
  isLogin = () => {
    const user_info = this.props.admin
    if (!user_info.isLogin) {  //未登录
      this.setState({nologin: true})
      return false
    } else {
      return true
    }
  }

  //关闭模板列表弹窗
  closeMoudleList = () => {
    var mo = function (e) {
      e.preventDefault();
    };
    document.body.style.overflow = '';//出现滚动条
    document.removeEventListener("touchmove", mo, false);
    this.setState({isMoudleList: false})
  }

  //使用模板
  userMoudle = (data) => {
    if (data) {
      const water_list = []
      data.forEach((item, index) => {
        const water = {
          width: item.width,
          height: item.height,
          file_url: item.img_url,
          left: item.x,
          top: item.y
        }
        if (water.left > this.videoWidth - water.width) { //模板的定位超出了视频
          water.left = this.videoWidth - water.width
        }
        if (water.left < 0) { //模板的定位超出了视频
          water.left = 0
        }
        if (water.top > this.videoHeight - water.height) {
          water.top = this.videoHeight - water.height
        }
        if (water.top < 0) {
          water.top = 0
        }
        if (water.width > this.videoWidth) {
          const p = water.width / water.height
          water.width = this.videoWidth
          water.height = water.width / p
        }
        if (water.height > this.videoHeight) {
          const p = water.width / water.height
          water.height = this.videoHeight
          water.width = water.height * p
        }
        water_list.push(water)
      })
      this.setState({water_list: water_list})
    } else {
      this.setState({water_list: []})
    }
    this.closeMoudleList()
  }

  cancleAlert = () => {
    this.setState({isAlert: false})
  }

  backThis = () => {
    const {isBack, videoInfo, water_list} = this.state
    const {video_url} = this.props
    if (isBack) {
      window.location.reload()
    } else {
      const waterData = {
        'videoInfo': videoInfo,
        'water_list': water_list,
        'video_url': video_url
      }
      sessionStorage.setItem('waterData', JSON.stringify(waterData))
      const current_url = encodeURIComponent(window.location.href);
      this.props.history.push(`./user/login?callback=${current_url}`);
    }
  }

  //显示动态文字压条
  showDynamics = () => {
    const { showDynamicsText, isUploading } = this.state
    this.setState({
      showDynamicsText: !showDynamicsText
    })
  }

  //添加动态文字压条,改变其属性
  dynamicsText = (e,eventName) => {
    const { Animation_data } = this.state
    switch (eventName) {
      case 'changeFontFamily':
        Animation_data.fontFamily = e
        break;
      case 'changeFontSize':
        Animation_data.fontSize = e
        break;
      case 'changeColor':
        Animation_data.color = e.color
        Animation_data.realColor = e.realColor
        break;
      case 'changeDynamics':
        this.changeDynamics(e)
        break;
      case 'changeWider':
        Animation_data.wider = !Animation_data.wider
        break;
      case 'changeItalic':
        Animation_data.italic = !Animation_data.italic
        break;
      case 'changeUnderline':
        Animation_data.underline = !Animation_data.underline
        break;
      case 'text_left':
        Animation_data.textAlign = 'left'
        break;
      case 'text_center':
        Animation_data.textAlign = 'center'
        break;
      case 'text_right':
        Animation_data.textAlign = 'right'
        break;
      case 'noChangeTextType':
        Animation_data.textAlign = ''
        break;

      default:
        break;
    }
    this.setState({
      Animation_data
    })
  }

  //选择哪个动态文字效果
  changeDynamics = (e) => {
    let which = 0
    switch (e) {
      case window.intl.get('无动效'):
      which = 0
      break;
      case window.intl.get('版权动效'):
      which = 1
      break;
      case window.intl.get('文字渐入'):
      which = 2
      break;
      case window.intl.get('地点标注'):
      which = 3
      break;
      case window.intl.get('矩阵动效'):
      which = 4
      break;
      case window.intl.get('特殊标记'):
      which = 5
      break;
      default:
      which = 0
      break;
    }
    this.setState({
      whichdynamicsText: which
    })
  }

  //改变动态文字内容
  changeText = (text,value) => {
    const { Animation_data } = this.state
    Animation_data.contentEditable = true
    switch (value) {
      case 'name':
        this.setState({
          temporaryName: text
        })
      break;
      case 'resume':
        this.setState({
          temporaryResume: text
        })
      break;
      case 'time':
        this.setState({
          temporaryTime: text
        })
      break;
      case 'location':
        this.setState({
          temporaryLocation: text
        })
      break;

      default:
        this.setState({
          temporaryText: text
        })
      break;
    }
    // if(value === 'name'){
    //   this.setState({
    //     temporaryName: text
    //   })
    // } else if(value === 'resume'){
    //   this.setState({
    //     temporaryResume: text
    //   })
    // } else if(value === 'time'){
    //   this.setState({
    //     temporaryTime: text
    //   })
    // } else if(value === 'location'){
    //   this.setState({
    //     temporaryLocation: text
    //   })
    // } else {
    //   this.setState({
    //     temporaryText: text
    //   })
    // }
    this.setState({
      Animation_data: this.state.Animation_data,
    })
  }

  //不修改文字状态
  noModify = () => {
    const { Animation_data } = this.state
    Animation_data.contentEditable = false
    this.setState({
      Animation_data: this.state.Animation_data,
    })
  }

  //根据比例计算正式视频中，文字压条位置
  resetSite = (arr,scale) => {
    if(arr){
      const length = arr.length
      let newArr = []
      let x = 0
      let y = 0
      for(let i=0;i<length;i++){
        x = Math.round(arr[i].x * scale.scaleWidth)
        y = Math.round(arr[i].y * scale.scaleHeight)
        newArr.push({x,y})
      }
      return newArr
    } else {
      return arr
    }
  }

  //获取子组件的高度
  getHeight = (height) => {
    this.setState({
      currentHeight: height
    })
  }

  //统一设置动态文字的数据
  resetDynamicsTextData = () => {
    const { video_url, videoInfo } = this.props
    const { dynamicsTextData, duration, layerSize, whichdynamicsText, 
      temporaryText, temporaryTime, temporaryLocation, temporaryName, 
      temporaryResume, Animation_data, site, currentHeight } = this.state
    //视频宽高/显示框宽高
    const scale = {
      scaleWidth: videoInfo.width/this.videoWidth || 1,
      scaleHeight: videoInfo.height/this.videoHeight || 1,
    }
    const getlength = Animation_data.fontSize.length
    const fontSize = (Animation_data.fontSize.substring(0,getlength-2) - 0)*scale.scaleWidth
    const arr = this.resetSite( site, scale )
    dynamicsTextData.width = videoInfo.width
    dynamicsTextData.height = videoInfo.height
    dynamicsTextData.video.push({"url": video_url,"type":"video"})
    let text_type = 'text'
    let text = ''
    let text2 = ''
    let realWidth = ''
    let realHeight = ''
    let bg_color = '#00000080'
    let x = 0
    let y = 0

    realWidth = layerSize[whichdynamicsText].width*scale.scaleWidth
    realHeight = layerSize[whichdynamicsText].height*scale.scaleHeight

    //根据某个压条，传特定的值
    switch (whichdynamicsText) {
      case 0:
        break;
      case 1:
        text_type = 'paragraph'
        text = temporaryText
        x = arr[0].x
        y = videoInfo.height- arr[0].y - Math.round(currentHeight * scale.scaleHeight)
        break;
      case 2:
        text_type = 'person'
        text = temporaryName
        text2 = temporaryResume
        bg_color = '#fddd4600'
        x = arr[1].x
        y = arr[1].y
        break;
      case 3:
        text_type = 'address'
        text = temporaryTime
        text2 = temporaryLocation
        bg_color = '#fddd4600'
        x = arr[2].x
        y = videoInfo.height- arr[2].y - Math.round(currentHeight * scale.scaleHeight)
        break;
      case 4:
        text_type = 'text'
        text = temporaryText
        bg_color = '#fddd4600'
        x = videoInfo.width - arr[3].x - Math.round(200 * scale.scaleWidth)
        y = videoInfo.height- arr[3].y - Math.round(currentHeight * scale.scaleHeight)
        break;
      case 5:
        text_type = 'copyright'
        text = temporaryText
        x = arr[4].x
        y = arr[4].y
        break;

      default:
        text_type = 'text'
        text = temporaryText
        bg_color = '#fddd4600'
        x = arr[3].x
        y = arr[3].y
        break;
    }
    let layer = {
      "x": x,
      "y": y,
      "start_time": 0,
      "duration": duration,
      "yt_type": "text",
      "text_type": text_type,
      "text": text,
      "text2": text2,
      "width": Math.round(realWidth)+'',
      "height": Math.round(realHeight)+'',
      "bg_color": bg_color,
      "text_color": Animation_data.realColor,
      "text2_color": Animation_data.realColor,
      "font_family": Animation_data.fontFamily,
      "font2_family": Animation_data.fontFamily,
      "text_align": Animation_data.textAlign,
      "font": Math.round(fontSize)+'px',
      "font2": Math.round(14*scale.scaleWidth)+'px',
    }
    dynamicsTextData.layer.push(layer)
    this.setState({
      dynamicsTextData
    })
  }

  //在同时传图片与动态压条的时候需要
  resetTextData = () => {
    const that = this
    const { water_list, duration, dynamicsTextData } = this.state
    let newTextData = dynamicsTextData
    const layer = []
    this.resetDynamicsTextData()
    water_list.forEach((item, index) => {
      const water = {
        yt_type: "image",
        url: item.file_url,
        width: item.width,
        height: item.height,
        x: item.left,
        y: item.top,
        start_time: 0,
        duration
      }
      water.width = Math.round(water.width * this.old_new_p)
      water.height = Math.round(water.height * this.old_new_p)
      water.x = Math.round(water.x * this.old_new_p)
      water.y = Math.round(water.y * this.old_new_p)
      newTextData.layer.push(water)
    })
    return newTextData
  }

  //渲染动画函数
  renderWhichDynamicsText = () => {
    const { whichdynamicsText, Animation_data, layerSize, site } = this.state
    const { videoInfo } = this.props
    const scale = {
      scaleWidth: videoInfo.width/this.videoWidth || 1,
      scaleHeight: videoInfo.height/this.videoHeight || 1,
    }
    const arr = this.resetSite( site, scale )
    //选择渲染哪个动画
    switch (whichdynamicsText) {
      case 0:
        return ''

      case 1:
        return <div className='animations'><Animation_BigSubtitles data={Animation_data} site={arr[0]} layerSize={layerSize[1]} getHeight={this.getHeight} callBack={this.changeText} noModify={this.noModify} /></div>

      case 2:
        return <div className='animations'><Animation_Character data={Animation_data} site={arr[1]} layerSize={layerSize[2]} getHeight={this.getHeight} callBack={this.changeText} noModify={this.noModify} /></div>

      case 3:
        return <div className='animations'><Animation_inAndOut data={Animation_data} site={arr[2]} layerSize={layerSize[3]} getHeight={this.getHeight} callBack={this.changeText} noModify={this.noModify} /></div>

      case 4:
        return <div className='animations'><Animation_showAndHidden data={Animation_data} site={arr[3]} layerSize={layerSize[4]} getHeight={this.getHeight} callBack={this.changeText} noModify={this.noModify} /></div>

      case 5:
        return <div className='animations'><Animation_bigAndSmall data={Animation_data} site={arr[4]} layerSize={layerSize[5]} getHeight={this.getHeight} callBack={this.changeText} noModify={this.noModify} /></div>
      
      default:
        return ''
    }
  }

  render() {
    const { video_url } = this.props
    const { isForeign } = this.props.admin
    const {
      isPlay, cur_time, water_list, isUploading, hor_guides, isMoudleList, isAlert,
      ver_guides, is_guides, isCompose, percent, isSuccessCompose, isBack, isSave, nologin,
      showDynamicsText, whichdynamicsText
    } = this.state
    return (
      <div className="makeWater_content">
        {isUploading ?   //上传水印
          <div className="water_uploadingBg"></div>
          : ''
        }
        {isAlert ?
          <Alert cancelCallBack={this.cancleAlert}
                 btn={window.intl.get('我知道了')}
                 msg={window.intl.get('您保存的模版已达上限，更多模版存储空间正在开发中，敬请期待...')}/> : ''
        }
        {isMoudleList ? //模板列表弹窗
          <MoudleList closeMoudleList={this.closeMoudleList}
                      userMoudle={this.userMoudle}
          />
          : ''
        }
        {isBack || nologin ?  //是否返回上传视频前
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
                {isBack ?
                  window.intl.get('即将离开此页面，开始编辑另一个视频') :
                  window.intl.get('您还没有登录，登录后可以使用模版')
                }
              </h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box"
                    onClick={() => this.setState({isBack: false, nologin: false})}>
                  {isBack ?
                    window.intl.get('稍等一下') :
                    window.intl.get('稍后登录')
                  }
                </div>
                <div className="cancle_btn_box"
                    onClick={this.backThis}>
                  {isBack ?
                    window.intl.get('我要离开') :
                    window.intl.get('立刻登录')
                  }
                </div>
              </div>
            </div>
          </div> : ''
        }
        <div className="makeWater_head">
          <div className="makeWater_headLeft">
            <h2 className="headLeft_tit">{window.intl.get('喜印')}</h2>
            <h3 className="headLeft_tip">{window.intl.get('为视频创作个性化水印')}</h3>
          </div>
          {/*<div className="makeWater_headRight">*/}
          {/*<h2 className="headRight_tit">{window.intl.get('一站式视频包装神器')}</h2>*/}
          {/*<div className="headRight_line"></div>*/}
          {/*<h3 className="headRight_tip">{window.intl.get('高速处理/无损画质/云端存储')}</h3>*/}
          {/*</div>*/}
        </div>

        <div className={is_guides ? "makeWater_box makeWater_box_bg" : "makeWater_box"}
             ref="water_box">
          <input ref="upload_img"
                 type="file"
                 style={{display: 'none'}}
                 accept='image/*'
                 multiple={true}
                 onChange={this.inputFile}
          />

          {/* 视频框 */}
          <div className="video_fullBox">
            {/* 参考线 */}
            {is_guides ?
              <ul className="guides_box">
                <div className="guides_tip" id="guides_tip" ref="guides_tip">{window.intl.get('辅助线可以拖动哟')}</div>
                {hor_guides.map((item, index) => {
                  return <li className={item.active ?
                    "hor_guide_line hor_guide_active" : "hor_guide_line"}
                             onMouseDown={this.lineDown.bind(this, index, 'hor')}
                             style={{top: `${item.top}px`, left: item.left, right: item.right}}
                             key={`1-${index}`}></li>
                })}
                {ver_guides.map((item, index) => {
                  return <li className={item.active ?
                    "ver_guide_line ver_guide_active" : "ver_guide_line"}
                             onMouseDown={this.lineDown.bind(this, index, 'ver')}
                             style={{top: item.top, left: `${item.left}px`, bottom: item.bottom}}
                             key={`2-${index}`}></li>
                })}
              </ul> : ''
            }

            {/* 处理中和处理后会有播放、暂停按钮 */}
            {isCompose ?
              <div className={isPlay ? "compose_pauseBtn" : "compose_playBtn"}
                   onClick={this.composePlay}
              ></div> : ''
            }

            <div className="video_box"
                 style={{
                   width: this.videoWidth,
                   height: this.videoHeight,
                   top: this.videoTop,
                   left: this.videoLeft
                 }}
                 ref="video_box">
              <video
                src={video_url || 'http://cd.foundao.com:18080/dst/b08d83b126fcfc1f0c486d9113a1488a_848x360.mp4'}
                controls={false}
                ref="video"
              />
              {/* 有水印 */}
              {water_list.length > 0 && isUploading ?
                <div className="water_tipsBox" style={showDynamicsText ? {display: 'none'} : {}}>
                  <div className="water_tipsContent uploading_cantClick noBorder">
                    <div className="uploading_gifIcon"></div>
                    <p className="uploading_gifTip">{window.intl.get('正在上传图片水印')}</p>
                  </div>
                </div>
                : ''
              }

              {/* 没有水印时 */}
              {water_list.length === 0 && !isCompose ?
                <div className="water_tipsBox" style={showDynamicsText ? {display: 'none'} : {}}>
                  {!isUploading ?
                    <div className="water_tipsContent" onClick={this.clickTipsBox}>
                      <div className="tipsContent_icon"></div>
                      <p className="tipsContent_tit">{window.intl.get('点击或拖拽来上传水印')}</p>
                      <p className="tipsContent_tip">{window.intl.get('支持多种图片格式类型，建议上传透明背景的PNG')}</p>
                    </div>
                    :
                    <div className="water_tipsContent uploading_cantClick noBorder">
                      <div className="uploading_gifIcon"></div>
                      <p className="uploading_gifTip">{window.intl.get('正在上传图片水印')}</p>
                    </div>
                  }
                </div>
                :
                // 有水印时
                water_list.map((item, index) => {
                  return isCompose ?
                    //视频处理中，不可选择、拖拽、删除、收缩
                    <div className="mark_box_compose"
                         style={{
                           zIndex: `100${index}`,
                           top: `${item.top}px`,
                           left: `${item.left}px`,
                           width: `${item.width}px`,
                           height: `${item.height}px`
                         }}
                         key={index}>
                      <img src={item.file_url}
                           draggable={false}
                           alt={item.ori_name}/>
                    </div>
                    :
                    //视频未处理
                    <div className="mark_box"
                         ref="mark_box"
                         onMouseDown={this.handleMouseDown.bind(this, index)}
                         style={{
                           zIndex: `100${index}`,
                           top: `${item.top}px`,
                           left: `${item.left}px`,
                           width: `${item.width}px`,
                           height: `${item.height}px`
                         }}
                         key={index}>
                      <img src={item.file_url}
                           draggable={false}
                           alt={item.ori_name}/>
                      <span className="delete_mark"
                            onClick={this.deleteMark.bind(this, index)}></span>
                      <span className="shrink_mark"
                            onMouseDown={this.scaleMouseDown.bind(this, index)}></span>
                    </div>
                })
              }

              {/* 文字压条 */}
              {whichdynamicsText ? this.renderWhichDynamicsText() : ''}
            </div>
          </div>

          {/* 视频处理完成 */}
          {isCompose && isSuccessCompose ?
            <div className="successComposeBox">
              <div className="downloadCompose"
                   onClick={this.downloadCompose}>
                {window.intl.get('下载')}
              </div>
              <div className="replyOther"
                   onClick={() => this.setState({isBack: true})}>
                {window.intl.get('编辑另一个视频')}
              </div>
            </div>
            :
            //视频处理中
            isCompose ?
              <Fragment>
                <div className="composeBox">
                  <h2 className="composeTit">{window.intl.get('处理')}</h2>
                  <div className="composeProgressBar">
                    <div className="composeProgress"
                        style={{width: `${(percent / 100) * 758}px`}}></div>
                  </div>
                  <div className="cancleCompose"
                      onClick={this.cancleCompose}>
                    {window.intl.get('取消')}
                  </div>
                </div>
                {/* <OtherProduct /> */}
              </Fragment>
              :
              // 视频未处理
              <div className="beforeCompose">
                <div className="video_controller">
                  <div className={isPlay ? "video_play video_pause" : "video_play"}
                       onClick={this.playVideo}></div>
                  <div className="video_progressBar"
                       onClick={this.setCurTime}
                       ref="line">
                    <div className="video_progress"
                         style={{width: this.time_To_length(cur_time)}}>
                    </div>
                    <div className="video_progressBtn"
                         style={{left: this.time_To_length(cur_time) - 2}}
                         onMouseDown={this.main_mouseDown.bind(this)}
                    ></div>
                  </div>
                  <div className="video_time">{this.changeTime()}</div>
                </div>
                {/* 动态贴纸 */}
                {showDynamicsText ? <DynamicsText callBack={this.dynamicsText} /> : ''}

                {/* 工具栏 */}
                <ul className="video_tools">
                  <li className="video_tool">
                    <div className="tool_btn" onClick={() => this.refs.upload_img.click()}>
                      <div className={isForeign ? 'tool_btn_hover tool_btn_hover_foreign' : 'tool_btn_hover'}>{window.intl.get('添加水印')}</div>
                    </div>
                  </li>
                  {/* 显示或者隐藏动态压条 */}
                  {/* <li className="video_tool">
                    <div className="tool_btn" onClick={this.showDynamics}>
                      <div className={isForeign ? 'tool_btn_hover tool_btn_hover_foreign' : 'tool_btn_hover'}>{window.intl.get('文字压条')}</div>
                    </div>
                  </li> */}
                  <li className="video_tool">
                    <div className={is_guides ? "tool_btn tool_btn_active" : "tool_btn"}
                         onClick={this.showGuides}>
                      <div className={isForeign ? 'tool_btn_hover tool_btn_hover_foreign' : 'tool_btn_hover'}>{window.intl.get('参考线')}</div>
                    </div>
                  </li>
                  <li className="video_tool">
                    {isSave ?
                      <div className="tool_saveBtn">
                        <div className="tool_saveIcon"></div>
                      </div>
                      :
                      <div className="tool_btn" onClick={this.saveMoudle}>
                        <div className={isForeign ? 'tool_btn_hover tool_btn_hover_foreign' : 'tool_btn_hover'}>{window.intl.get('存为模板')}</div>
                      </div>
                    }
                  </li>
                  <li className="video_tool">
                    <div className="tool_btn" onClick={this.showMoudleList}>
                      <div className={isForeign ? 'tool_btn_hover tool_btn_hover_foreign' : 'tool_btn_hover'}>{window.intl.get('使用模板')}</div>
                    </div>
                  </li>
                </ul>

                <div className="video_compose">
                  <div className="vide_composeBtn"
                       onClick={this.composeVideo}>
                    {window.intl.get('开始添加水印')}
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}