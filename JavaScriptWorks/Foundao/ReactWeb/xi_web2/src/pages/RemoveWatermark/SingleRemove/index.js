import React, { Component ,Fragment} from 'react';
import './index.scss'
import Tool from '@/utils/tool';
import {Link} from "react-router-dom";
import Upload from '@/components/Upload/index';
import transCode  from  '@/utils/transCode';
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import tools from '@/utils/tool';
import messageBox from '@/utils/messageBox';
import {connect} from 'react-redux';
import {login, show_loading, hide_loading} from '@/redux/models/admin';
import Comfirm from '@/components/Comfirm/index';
import card1 from '@/assets/removewatermark/card_1@3x.png';
import card2 from '@/assets/removewatermark/card_2@3x.png';
import card3 from '@/assets/removewatermark/card_3@3x.png';
import card4 from '@/assets/removewatermark/card_4@3x.png';
import card5 from '@/assets/removewatermark/card_5@3x.png';
import card1_en from '@/assets/removewatermark/card_1_en.png';
import card2_en from '@/assets/removewatermark/card_2_en.png';
import card3_en from '@/assets/removewatermark/card_3_en.png';
import card4_en from '@/assets/removewatermark/card_4_en.png';
import card5_en from '@/assets/removewatermark/card_5_en.png';
import Grade from '@/components/Grade/index';
let removeTrans=null;
@connect(
  state => ({admin: state.admin}),
  {login, show_loading, hide_loading}
)

export default class SingleRemove extends Component {
  constructor(props){
    super(props)
    this.state = {
      isVip:false,//是否是vip
      video_url : '',
      isBefore : false, // 长传之前还是之后
      videoInfo:[], // 视频信息
      isPlay:'', //当前播放状态
      cur_time: 0, //当前播放时间
      duration:0,//当前播放器的时长
      currIndex:0,//当前播放视频
      videoZoom:1,//视频缩放比例
      handdleStatus:1,//当前处理步骤
      clipStyle:{
        top:0,
        left:0,
        width: 0,
        height:0
      },
      hasClip:false,//是否有去水印框
      isdarlog:false,
      uploadState:0,//上传状态  0 未上传  1上传中 2 转码中
      uploadProgress:0,//上传进度
      singleTransProgress:0,//非会员去水印进度
      singleDownUrl:'',//非会员去水印下载链接
      comformDialog:false,//编辑
      comformMsg:'',//编辑提示信息
      uploadMuliTips:false,//批量上传提示框
      upmuliMsg:'',//批量上传提示语
      isAutoDownload:false,//完成是否自动下载
      isMuliRemove : false,//是否正在去水印
      muliRemoveCurr:0,//多视频去水印当前第几个视频
      muiliVideoList:[],//待下载视频
      muliSuccessCount : 0,//去水印成功
      showCard:true,//是否展示卡片
      showGrade:false,
      cardList:[//小卡片轮播
        {
          index:0,
          name:"处理中",
          imageUrl:this.props.admin.isForeign?card1_en:card1,
          link:''
        }, {
          index:1,
          name:"在线转码",
          imageUrl:this.props.admin.isForeign?card5_en:card5,
          link:'/convert',
          onlineRoute : '//convert.enjoycut.com',
        }, {
          index:2,
          name:"单段剪辑",
          imageUrl:this.props.admin.isForeign?card3_en:card3,
          link:'/trim',
          onlineRoute : '//trim.enjoycut.com',
        }, {
          index:3,
          name:"多段拼接",
          imageUrl:this.props.admin.isForeign?card4_en:card4,
          link:'/merge',
          onlineRoute : '//merge.enjoycut.com',
        }, {
          index:4,
          name:"在线水印",
          imageUrl:this.props.admin.isForeign?card2_en:card2,
          link:'/watermark',
          onlineRoute : '//watermark.enjoycut.com',
        }
      ],
      showRemoveTips:false,//是否展示操作提示
      isShow:false
    };
    this.lineLength= 642; //进度条长度
    this.wrapWidth = 778;//容器宽度
    this.wrapHeight = 470;//容器高度
    this.listWidth = 378;//视频列表容器宽度
    this.listHeight = 228;//视频列表容器高度
  }

  componentWillMount() {
    const {admin} = this.props;
    // console.log(this.props.videoInfo,'11')
    this.setState({
      isVip:admin.isRemoveVip
    })
    let {videoInfo} = this.props;
    if (!videoInfo){return}
    this.setState({
      videoInfo,
      duration:videoInfo[0].duration
    })
  }
  componentDidMount(){
    this.initVideoData();
    let removeTips = localStorage.getItem('removeTips');
    if (removeTips){
      this.setState({
        showRemoveTips:false
      })
    }else {
      this.setState({
        showRemoveTips:true
      })
      localStorage.setItem('removeTips','see');
      setTimeout(()=>{
        this.setState({
          showRemoveTips:false
        })
      },5000)
    }
  }
  //初始化轮播
  initSwiper = () => {
    var _this = this;
    _this.removeWarter = new window.Swiper('#removeWater', {
      loop: true,
      initialSlide: 0,
      slidesPerView: 'auto',
      freeMode: false,
      autoplay: true,
      delay: 3000,
    })
  }
  //长度转换时间
  length_To_time = (l) => {
    const {currIndex ,videoInfo} = this.state;
    return (l / this.lineLength) * parseFloat(videoInfo[currIndex].duration);
  }
  //时间转换长度
  time_To_length = (t) => {
    const {currIndex ,videoInfo} = this.state;
    return (t / parseFloat(videoInfo[currIndex].duration)) * this.lineLength;
  }
  /**视频数据初始化**/
  initVideoData=()=>{
    const {videoInfo} = this.state;
    videoInfo.forEach(item=>{
      let videoWidth = item.width*1;
      let videoHeight = item.height*1;
      let zoom=1;
      let listZoom = 1;
      if (videoWidth>videoHeight){
        zoom= videoWidth / this.wrapWidth;//初始化缩放比例
        listZoom = videoWidth / this.listWidth;
        if ( videoHeight/zoom >this.wrapHeight){
          zoom = videoHeight / this.wrapHeight
        }
        if ( videoHeight/listZoom >this.listHeight){
          listZoom = videoHeight / this.listHeight
        }
      } else{
        zoom = videoHeight/this.wrapHeight
        listZoom = videoHeight/this.listHeight
        if ( videoWidth / zoom > this.wrapWidth){
          zoom= videoWidth / this.wrapWidth;
        }
        if ( videoWidth / listZoom > this.listHeight){
          listZoom= videoWidth / this.listHeight;
        }
      }
      item.videoZoom = zoom;
      item.listZoom = listZoom;
      item.clipStyle = {
        top:0,
        left:0,
        width: 0,
        height:0
      };
    })
    this.setState({
      videoInfo
    })
  }
  //获取总时间
  changeTime = () => {
    const {videoInfo,currIndex} = this.state;
    let duration = videoInfo[currIndex].duration||0;
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
  //播放视频
  playVideo = () => {
    const {isPlay, duration} = this.state
    const video = this.refs.video;
    let _this = this;
    this.setState({
      isdarlog:false
    })
    if (Math.ceil(video.currentTime) >= duration && !isPlay) {
      video.currentTime = 0
      video.play()
      this.setState({isPlay: true})
    } else {
      if (isPlay) {
        video.pause()
      } else {
        this.refs.video.ontimeupdate = function() {
          let curr = this.currentTime;
          _this.setState({
            cur_time:curr
          })
        }
        this.refs.video.onended = function(){
          _this.setState({
            isPlay:false,
            cur_time:0
          })
        }
        video.play()
      }
      this.setState({isPlay: !isPlay})
    }
  }
  /**视频切换**/
  changeVideo=(index)=>{
    const {currIndex ,videoInfo} = this.state;
    // console.log(index,'dsdsad')
    this.setState({
      isPlay:false,
      currIndex:index,
      cur_time:0,
      duration:videoInfo[index].duration,
      clipStyle : videoInfo[index].clipStyle
    })
  }
  /**视频控件拖动**/
  videoBtnDown=(e)=>{
    const {currIndex ,videoInfo , cur_time} = this.state;
    this.vbSX = e.pageX;
    this.vbSl = cur_time/videoInfo[currIndex].duration * this.lineLength
    this.setState({
      isdarlog:true
    })
    Tool.addEventHandler(document.body, 'mousemove', this.videoBtnmove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  videoBtnmove=(e)=>{
    const {currIndex ,videoInfo} = this.state;
    let newL = e.pageX - this.vbSX + this.vbSl;
    if (newL >= this.lineLength){
      newL = this.lineLength
    } else if(newL<=0){
      newL = 0
    }
    let currTime = newL / this.lineLength * videoInfo[currIndex].duration
    this.setState({
      cur_time :currTime
    })
    this.gotoCurrTime(currTime)
  }
  gotoCurrTime = (time)=>{
    if (this.refs.video){
      this.refs.video.currentTime = time
    }
  }
  mouseUp=()=>{
    Tool.removeEventHandler(document.body, 'mousemove', this.videoBtnmove);
    Tool.removeEventHandler(document.body, 'mousemove', this.createClipMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.clipboxMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.rbMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.rtMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.lbMove);
    Tool.removeEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  /**计算视频缩放比例**/
  getZoom=()=>{
    const {videoInfo,currIndex} = this.state;
    let videoWidth = videoInfo[currIndex].width*1;
    let videoHeight = videoInfo[currIndex].height*1;
    let zoom=1;
    if (videoWidth>videoHeight){
      // console.log(123)
      zoom= videoWidth / this.wrapWidth;//初始化缩放比例
      if ( videoHeight/zoom >this.wrapHeight){
        // console.log(456)
        zoom = videoHeight / this.wrapHeight
      }
    } else{
      zoom = videoHeight/this.wrapHeight
      if ( videoWidth / zoom > this.wrapWidth){
        zoom= videoWidth / this.wrapWidth;
      }
    }
    return zoom
  }
  /**视频裁剪框样式计算**/
  clipStyle=(type,index)=>{
    const {videoInfo,currIndex} = this.state;
    if (type===1){
      // console.log(videoInfo[currIndex])
      let videoZ = this.getZoom();
      let style = {
        top : ( this.wrapHeight - videoInfo[currIndex].height/videoZ)/2,
        bottom :( this.wrapHeight - videoInfo[currIndex].height/videoZ)/2,
        left: (this.wrapWidth - videoInfo[currIndex].width/videoZ)/2,
        right:(this.wrapWidth - videoInfo[currIndex].width/videoZ)/2
      }
      return style
    } else {
      let videoZ = videoInfo[index].listZoom;
      let style = {
        top : (( this.listHeight - videoInfo[index].height/videoZ)/2)||0,
        bottom :(( this.listHeight - videoInfo[index].height/videoZ)/2)||0,
        left: ((this.listWidth - videoInfo[index].width/videoZ)/2)||0,
        right:((this.listWidth - videoInfo[index].width/videoZ)/2)||0
        }
      return style
    }

  }
  /**拖动出现框**/
  createClip=(ev)=>{
    var ev=window.event||ev;
    const {clipStyle,videoInfo , hasClip,handdleStatus} = this.state;
    if (handdleStatus===3){return}
    if (hasClip){return}
    let top = ev.offsetY;
    let left = ev.offsetX;
    this.clipX = ev.pageX;
    this.clipY = ev.pageY;
    videoInfo.forEach(item=>{
      //判断点击位置是否超出视频，如果超出就置为0
      let obj = {...item.clipStyle};
      if (left > item.width/item.videoZoom) {
        obj.left =0;
      }else {
        obj.left =left;
      }
      if (top > item.height/item.videoZoom) {
        obj.top =0;
      }else {
        obj.top =top;
      }
      item.clipStyle={...obj}
    })
    this.setState({
      clipStyle: Object.assign({},clipStyle,{top,left})
    })
    Tool.addEventHandler(document.body, 'mousemove', this.createClipMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  createClipMove=(ev)=>{
    const {clipStyle,videoInfo,currIndex} = this.state;
    let width = ev.pageX-this.clipX;
    let height = ev.pageY-this.clipY;
    /**计算当前不要画出去**/
    if (width >= videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - videoInfo[currIndex].clipStyle.left-2){
      width = videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - videoInfo[currIndex].clipStyle.left-2
    }
    if (height>= videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - videoInfo[currIndex].clipStyle.top-2) {
      height= videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - videoInfo[currIndex].clipStyle.top-2
    }

    videoInfo.forEach(item=>{
      //计算每一个视频防止水印框超出区域
      let Obj ={...item.clipStyle}
      if (width>=item.width/item.videoZoom - item.clipStyle.left-2){
        Obj.width = item.width/item.videoZoom - item.clipStyle.left-2;
      }else {
        Obj.width = width;
      }
      if(height>=item.height/item.videoZoom - item.clipStyle.top-2){
        Obj.height =item.height/item.videoZoom - item.clipStyle.top-2;
      }else {
        Obj.height =height;
      }
      item.clipStyle = {...Obj}
    })
    this.setState({
      clipStyle: Object.assign({},clipStyle,{width,height}),
      hasClip:true,
    })
  }
  /**隐藏裁剪框**/
  hiddenClip=()=>{
    this.setState({
      hasClip:false,
    })
    this.initVideoData()
  }
  /**去水印框移动***/
  clipDown=(e)=>{
    const {clipStyle} = this.state;
    this.clipmx = e.pageX;
    this.clipmy = e.pageY;
    this.clipLeft = clipStyle.left;
    this.clipTop = clipStyle.top;
    Tool.addEventHandler(document.body, 'mousemove', this.clipboxMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  clipboxMove=(e)=>{
    const {clipStyle,videoInfo,currIndex} = this.state;
    let newX = e.pageX - this.clipmx +this.clipLeft
    let newY = e.pageY - this.clipmy + this.clipTop
    let zoom = this.getZoom();
    if (newX<=0){newX = 0}else if(newX>(videoInfo[currIndex].width / zoom - clipStyle.width)){ newX=(videoInfo[currIndex].width / zoom - clipStyle.width-2)}
    if (newY<=0) {newY=0}
    else if (newY>(videoInfo[currIndex].height / zoom - clipStyle.height)) {
      newY=(videoInfo[currIndex].height / zoom - clipStyle.height-2 )
    }
    // console.log(videoInfo[currIndex].clipStyle)
    let obj = {...videoInfo[currIndex].clipStyle}
    obj.left = newX;
    obj.top = newY;
    videoInfo[currIndex].clipStyle = {...obj}
    this.setState({
      clipStyle:Object.assign({} , clipStyle , {left:newX,top:newY})
    })
  }
  /**右下角移动**/
  rbdown=(e)=>{
    e.stopPropagation();
    e.preventDefault();
    const {clipStyle} = this.state;
    this.rbx = e.pageX;
    this.rby = e.pageY;
    this.rbWidth = clipStyle.width;
    this.rbHeight = clipStyle.height;
    Tool.addEventHandler(document.body, 'mousemove', this.rbMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  rbMove=(e)=>{
    const {clipStyle,videoInfo,currIndex} = this.state;
    let newWidth = e.pageX - this.rbx + this.rbWidth;
    let newHeight = e.pageY - this.rby + this.rbHeight;

    /**边界判定**/
    if (newWidth<=20){newWidth = 20}
    else if(newWidth >= videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2){
      newWidth = videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2
    }
    if (newHeight<=20){newHeight = 20}
    else if (newHeight >= videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2){
      newHeight = videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2
    }
    let obj = {...videoInfo[currIndex].clipStyle}
    obj.width = newWidth;
    obj.height = newHeight;
    videoInfo[currIndex].clipStyle = {...obj}
    this.setState({
      clipStyle:Object.assign({} , clipStyle , {width:newWidth,height:newHeight})
    })
  }
  /**右上角移动**/
  rtdown = (e)=>{
    e.stopPropagation();
    e.preventDefault();
    const {clipStyle} = this.state;
    this.rtx = e.pageX;
    this.rty = e.pageY;
    this.rtWidth = clipStyle.width;
    this.rtHeight = clipStyle.height;
    this.rtTop = clipStyle.top;
    Tool.addEventHandler(document.body, 'mousemove', this.rtMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  rtMove=(e)=>{
    const {clipStyle,videoInfo,currIndex} = this.state;
    let newWidth = e.pageX - this.rtx + this.rtWidth;
    let newHeight =this.rty -  e.pageY + this.rtHeight;
    let newTop = e.pageY - this.rty + this.rtTop;
    // console.log(newTop,'123')
    /**边界判定**/
    if (newWidth<=20){newWidth = 20}
    else if(newWidth >= videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2){
      newWidth = videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2
    }
    if (newHeight<=20){newHeight = 20}
    else if (newHeight >= videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2){
      newHeight = videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2
    }
    if (newTop<=0){
      newTop=0
    }else if (newTop>=videoInfo[currIndex].height/videoInfo[currIndex].videoZoom-22){
      newTop=videoInfo[currIndex].height/videoInfo[currIndex].videoZoom-22
    }
    let obj = {...videoInfo[currIndex].clipStyle}
    obj.width = newWidth;
    obj.height = newHeight;
    obj.top = newTop;
    videoInfo[currIndex].clipStyle = {...obj}
    this.setState({
      clipStyle:Object.assign({} , clipStyle , {width:newWidth,height:newHeight,top:newTop})
    })
  }
  /**左下角拖动**/
  lbdown = (e)=>{
    e.stopPropagation();
    e.preventDefault();
    const {clipStyle} = this.state;
    this.lbx = e.pageX;
    this.lby = e.pageY;
    this.lbWidth = clipStyle.width;
    this.lbHeight = clipStyle.height;
    this.lbLeft = clipStyle.left;
    Tool.addEventHandler(document.body, 'mousemove', this.lbMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  }
  lbMove=(e)=>{
    const {clipStyle,videoInfo,currIndex} = this.state;
    let newWidth =this.lbx -  e.pageX + this.lbWidth;
    let newHeight =e.pageY - this.lby + this.lbHeight;
    let newLeft = e.pageX - this.lbx + this.lbLeft;
    /**边界判定**/
    if (newWidth<=20){newWidth = 20}
    else if(newWidth >= videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2){
      newWidth = videoInfo[currIndex].width/videoInfo[currIndex].videoZoom - clipStyle.left - 2
    }
    if (newHeight<=20){newHeight = 20}
    else if (newHeight >= videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2){
      newHeight = videoInfo[currIndex].height/videoInfo[currIndex].videoZoom - clipStyle.top - 2
    }
    if (newLeft<=0){
      newLeft=0
    }else if (newLeft>=videoInfo[currIndex].width/videoInfo[currIndex].videoZoom-22){
      newLeft=videoInfo[currIndex].width/videoInfo[currIndex].videoZoom-22
    }
    let obj = {...videoInfo[currIndex].clipStyle}

    obj.width = newWidth;
    obj.height = newHeight;
    obj.left = newLeft;
    videoInfo[currIndex].clipStyle = {...obj}
    this.setState({
      clipStyle:Object.assign({} , clipStyle , {width:newWidth,height:newHeight,left:newLeft})
    })
  }
  /**计算视频列表裁剪框位置**/
  getListStyle=(item)=> {
    let ostyle = item.clipStyle;
    if (!ostyle){return}
    let style = {
      top:ostyle.top*item.videoZoom/item.listZoom,
      left:ostyle.left*item.videoZoom/item.listZoom,
      width:ostyle.width*item.videoZoom/item.listZoom,
      height:ostyle.height*item.videoZoom/item.listZoom,
    }
    return style
  }
  /**文件上传**/
  uploadProgress=(progress)=>{
    this.setState({
      uploadProgress:progress
    })
  }
  uploadSuccess=(file_name , dd , g_filemd5,token)=>{
    this.uploadBack(token)
    let _this = this;
    this.setState({
      uploadProgress:100
    })
    let format =file_name.slice(file_name.lastIndexOf('.')+1);
    if (format==='mp4'){
      _this.getVideoUrl(g_filemd5,file_name);
    } else {
      this.setState({
        uploadState:2,
        uploadProgress:0
      })
      transCode({
        transOptions: {
          inFileName: file_name,
          inFileMd5: g_filemd5
        },
        transSuccess: (res) => {
          _this.setState({
            uploadProgress:100
          })
          _this.getVideoInfo(g_filemd5, file_name, res);
        },
        transFail: () => {
          messageBox(window.intl.get('转码失败'))
          this.setState({
            uploadState:0,
            uploadProgress:0
          })
        },
        transProgress: (progress) => {
          _this.setState({
            uploadProgress:progress
          })
        }
      })
    }
  }
  timeOut=()=>{
    this.setState({
      uploadState:0
    })
  }
  uploadChange=()=>{
    this.setState({
      uploadState:1
    })
  }
  /**获取视频链接**/
  getVideoUrl=(md5,file_name)=>{
    httpRequest({
      url:API.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      this.getVideoInfo(md5,file_name,res);
    }).fail(()=>{
      this.setState({
        isAlert:true,
        alertMsg : window.intl.get('获取视频链接失败！')
      })
    })
  }
  /**获取视频信息**/
  getVideoInfo = (g_filemd5,file_name,url)=>{
    httpRequest({
      url: API.qureyMeidiaInfo,
      data: {
        MD5: g_filemd5
      }
    }).done((res) => {
      if (res.status / 1 === 0) {
        this.initNewVideo(res,file_name,url,g_filemd5);
      } else {
        this.setState({
          isAlert: true,
          alertMsg: window.intl.get('此视频已损坏或未完全上传！')
        })
        this.initUpload()
      }
    }).fail(() => {
      tools.checkNetwork() ? messageBox(window.intl.get('网络出错，请检查您的网络链接!')) : messageBox(window.intl.get('内部服务器错误！'))
      this.initUpload()
    })
  }
  /**新上传视频初始化计算**/
  initNewVideo=(res,file_name,url,g_filemd5)=>{
    let {hasClip,clipStyle,videoInfo} = this.state
    let zoom=1;
    let listZoom = 1;
    let videoWidth = res.width*1||0;
    let videoHeight = res.height*1||0;
    if (videoWidth>videoHeight){
      zoom= videoWidth / this.wrapWidth;//初始化缩放比例
      listZoom = videoWidth / this.listWidth;
      if ( videoHeight/zoom >this.wrapHeight){
        zoom = videoHeight / this.wrapHeight
      }
      if ( videoHeight/listZoom >this.listHeight){
        listZoom = videoHeight / this.listHeight
      }
    } else{
      zoom = videoHeight/this.wrapHeight
      listZoom = videoHeight/this.listHeight
      if ( videoWidth / zoom > this.wrapWidth){
        zoom= videoWidth / this.wrapWidth;
      }
      if ( videoWidth / listZoom > this.listHeight){
        listZoom= videoWidth / this.listHeight;
      }
    }
    if (hasClip){
      let obj = {...clipStyle}
      if (clipStyle.left>res.width/zoom){
        obj.left = 0;
      }
      if (clipStyle.top > res.height/zoom){
        obj.top = 0
      }
      if (clipStyle.width >= res.width/zoom - clipStyle.left-2){
        obj.width = res.width/zoom - clipStyle.left-2
      }
      if (clipStyle.height>= res.height/zoom - clipStyle.top-2) {
        obj.height= res.height/zoom - clipStyle.top-2
      }
      clipStyle = {...obj}
    } else {
      clipStyle = {
        top:0,
        left:0,
        width: 0,
        height:0
      };
    }
    const newVideo = {
      width: res.width,
      height: res.height,
      duration: res.duration,
      g_filemd5: g_filemd5,
      file_name: file_name,
      url:url,
      left:0,
      boxwidth:100,
      boxheight:100,
      top:0,
      videoZoom : zoom,
      listZoom : listZoom,
      clipStyle:clipStyle
    }
    videoInfo.push(newVideo)
    this.setState({
      videoInfo,
      uploadState:0,
      uploadProgress:0
    })
  }
  /**去水印开始按钮**/
  beginRemove=()=>{
    const {isVip,hasClip,videoInfo} = this.state;
    this.setState({
      handdleStatus:2
    });
    if (!videoInfo){return}
    if (isVip&&videoInfo.length>1){
      /**是会员**/
      this.setState({
        isMuliRemove:true,
        muiliVideoList:[],
      },this.initSwiper)
      this.removeWaterMuli();
    } else {
      /**不是会员或者只有一个**/
      let videoData = videoInfo[0]
      let data = {
        inFileName: videoData.file_name,
        inFileMd5: videoData.g_filemd5
      }
      if (hasClip){
        let vl = parseInt(videoData.clipStyle.left * videoData.videoZoom);
        let vt = parseInt(videoData.clipStyle.top * videoData.videoZoom);
        let vw = Math.ceil(videoData.clipStyle.width * videoData.videoZoom);
        let vh = Math.ceil(videoData.clipStyle.height * videoData.videoZoom);
        // let vr = videoData.width*1 - vl-vw-1 <0 ? 0 : videoData.width*1 - vl-vw-1;
        // let vb = videoData.height*1 - vt-vh-1 <0 ? 0 : videoData.height*1 - vt-vh-1;
        data = {
          inFileName: videoData.file_name,
          inFileMd5: videoData.g_filemd5,
          token:videoData.token,
          delogo: {
            left:vl,
            right:vl+vw,
            top:vt,
            bottom:vt+vh
          },
        }
      }
      removeTrans = transCode({
        transOptions: data,
        transSuccess: (res) => {
          const {currIndex ,videoInfo} = this.state;
          this.showStartTimes(videoInfo[currIndex].token||'')
          videoInfo[currIndex].dealUrl=res
          this.setState({
            handdleStatus:3,
            videoInfo,
            singleDownUrl:res,
            hasClip:false,
            isShow:true,
            showGrade:true
          })
          if (!isVip){
            Tool.getTimes()
          }
        },
        transFail: () => {
          messageBox(window.intl.get('去水印失败，请重试！'));
          this.setState({
            handdleStatus:1,
          })
        },
        transProgress: (progress) => {
          this.setState({
            singleTransProgress:progress
          })
        }
      })

    }
  }
  /**取消去水印**/
  cancelRemove=()=>{
    removeTrans.stopTransCode();
    this.setState({
      handdleStatus:1,
      singleTransProgress:0
    })
  }
  /**点击下载**/
  downloadVideo=()=>{
    const {singleDownUrl} = this.state;
   this.downVideo(singleDownUrl)
  }
  /**编辑另一个视频**/
  editOtherVideo=()=>{
    this.setState({
      comformMsg:window.intl.get('开始编辑新的视频，请确认当前视频已保存！'),
      comformDialog:true
    })
  }
  /**弹窗确定按钮 **/
  comformOkBtn = ()=>{
    this.props.goPre()
  }
  /**批量上传按钮**/
  muliUploadTips=()=>{
    const {isVip} = this.state;
    if (isVip){
      this.setState({
        upmuliMsg:window.intl.get('开始编辑新的视频，请确认当前视频已保存！'),
        uploadMuliTips:true
      })
    }else {
      window.open('/mulipay/remove')
    }

  }
  /**批量上传**/
  uploadMuliOk=()=>{
    this.refs.muliUpload.click();
  }
  filesChange=(e)=>{
    if (e.target.files.length<1){
      messageBox(window.intl.get('请选择文件'));
      return
    }
    let chooseFiles =[];
    for (let i=0 ; i < e.target.files.length;i++){
      chooseFiles.push(e.target.files[i])
    }
    // console.log(chooseFiles)
    this.props.getMuliFile(chooseFiles)
  }
  /**改变是否自动下载**/
  changeDownloadType=()=>{
    const {isAutoDownload} = this.state;
    this.setState({
      isAutoDownload:!isAutoDownload
    })
  }
  /**批量处理水印**/
  removeWaterMuli=()=>{
    const {videoInfo, muliRemoveCurr,hasClip , muiliVideoList ,muliSuccessCount} = this.state;
    let videoData = videoInfo[muliRemoveCurr]
    // return
    let data = {
      inFileName: videoData.file_name,
      inFileMd5: videoData.g_filemd5
    }
    if (hasClip){
      let vl = parseInt(videoData.clipStyle.left * videoData.videoZoom);
      let vt = parseInt(videoData.clipStyle.top * videoData.videoZoom);
      let vw = Math.ceil(videoData.clipStyle.width * videoData.videoZoom);
      let vh = Math.ceil(videoData.clipStyle.height * videoData.videoZoom);
      let vr = videoData.width*1 - vl-vw-1 <0 ? 0 : videoData.width*1 - vl-vw-1;
      let vb = videoData.height*1 - vt-vh-1 <0 ? 0 : videoData.height*1 - vt-vh-1;
      data = {
        inFileName: videoData.file_name,
        inFileMd5: videoData.g_filemd5,
        token:videoData.token,
        delogo: {
          left:vl,
          right:vl+vw,
          top:vt,
          bottom:vt+vh
        },
      }
    }
    removeTrans = transCode({
      transOptions: data,
      transSuccess: (res) => {
        videoInfo[muliRemoveCurr].downloadUrl = res;
        videoInfo[muliRemoveCurr].dealUrl = res;
        this.showStartTimes(videoInfo[muliRemoveCurr].token||'')
        muiliVideoList.push(res);
        this.setState({
          videoInfo,
          showGrade:true,
          muiliVideoList,
          muliSuccessCount:muliSuccessCount+1
        })
        if (muliRemoveCurr<videoInfo.length-1){
          this.setState({
            muliRemoveCurr:muliRemoveCurr+1
          },()=>{
            this.removeWaterMuli();
          })
        }else if(muliRemoveCurr===videoInfo.length-1){
          // console.log(muliRemoveCurr)
          const {isAutoDownload,muiliVideoList} = this.state;
          if (isAutoDownload){
            this.downVideo(muiliVideoList)
          }
        }
      },
      transFail: () => {
        videoInfo[muliRemoveCurr].transfail = true;
        this.setState({
          videoInfo
        })
        if (muliRemoveCurr<videoInfo.length-1){
          this.setState({
            muliRemoveCurr:muliRemoveCurr+1
          },()=>{
            this.removeWaterMuli();
          })
        }else if(muliRemoveCurr===videoInfo.length-1){
          // console.log(muliRemoveCurr)
          const {isAutoDownload,muiliVideoList} = this.state;
          if (isAutoDownload){
            this.downVideo(muiliVideoList)
          }
        }
      },
      transProgress: (progress) => {
        videoInfo[muliRemoveCurr].chuliProgress = progress;
        this.setState({
          videoInfo
        })
      }
    })
  }
  /**继续处理按钮**/
  dealContinue=()=>{
    removeTrans.stopTransCode();
    this.setState({
      isMuliRemove:false,
      handdleStatus:1,
      singleTransProgress:0
    })
  }
  /**下载视频**/
  downloadItem=(url)=>{
    this.downVideo(url);
  }
  downloadAllVideo=()=>{
    const {muiliVideoList} = this.state;
    this.downVideo(muiliVideoList);
  }
  showStartTimes=(token)=>{
    // console.log(token)
    httpRequest({
      url: API.starTimes,
      data: {
        trans_type: '5',
        up_token: token||''
      }
    }).done((res) => {
      // console.log('打星记录成功')
    })
  }
  /**下载**/
  downVideo=(data)=>{
    const {videoInfo} = this.state;
    let downToken = [];
    for (let i in videoInfo){
      if (videoInfo[i].token){
        downToken.push(videoInfo[i].token)
      }
    }
    // console.log(downToken,'downToken')
    // console.log(videoInfo,'videoInfo')
    window.gtag && window.gtag('event', 'click', {'event_category': 'remove_download','event_label': 'remove'})
    httpRequest({
      url : API.downloadVideo,
      dataType : 'json',
      type : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      data : {
        path : data,
        trans_type:5,
        up_token:downToken
      }
    }).done((res)=>{
      if(res.code /1 === 0){
        window.location.href = res.data||''
      }
    }).fail(()=>{
      messageBox(window.intl.get('下载失败'))
    })
  }
  /**关闭卡片**/
  closeCard=(e)=>{
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      showCard:false
    })
  }
  /**点击卡片跳转**/
  cradJump=(item)=>{
    const _hostname = window.location.hostname;
    if (!item.link){return}
    window.open(item.link)
    // if (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com') {
    //   window.open(item.onlineRoute||item.link)
    // }else {
    //   window.open(item.link)
    // }
  }

  /**获取还剩余次数**/
  getTodayTimes=()=>{
    if (localStorage.getItem('Date')&&localStorage.getItem('times'))  {
      let times = localStorage.getItem('times')||2
      return times*1<0?0:times
    }else {
      return 2
    }
  }
  /**上传成功后回调(埋点统计)**/
  uploadBack=(uptoken)=>{
    httpRequest({
      url:API.up_end,
      type:'POST',
      data:{
        trans_type:5,
        up_token:uptoken
      }
    }).done(res=>{}).fail(()=>{})
  }
  render() {
    const {isPlay,cur_time ,currIndex ,videoInfo,clipStyle ,hasClip ,isdarlog ,uploadState,
      uploadProgress , handdleStatus ,singleTransProgress ,isVip ,comformDialog ,comformMsg,
      uploadMuliTips,upmuliMsg ,isAutoDownload ,isMuliRemove ,muliSuccessCount ,cardList ,showCard,
      showRemoveTips,isShow,showGrade
    } = this.state
    // console.log(videoInfo)
    return (
      <Fragment>
        {!isMuliRemove ?
           // {!true ?
          <div className='singleRemove'>
            <div className='videoName'>{videoInfo[currIndex].file_name||''}</div>
            <div className='videoBox'>
              {isShow&&!isVip&&handdleStatus===3 ?
                <div className='VipTips'>
                  <p>{window.intl.get('今日剩余次数：')}{this.getTodayTimes()}{window.intl.get('次，解锁更多去水印特权。')}</p>
                  <Link to='/muliPay/remove' target='_blank'>{window.intl.get('即刻了解')}</Link>
                  <div className='close' onClick={()=>this.setState({isShow:false})}> </div>
                </div>
                :""
              }
              <video controls={false} src={videoInfo[currIndex].dealUrl||videoInfo[currIndex].url||''} ref="video"></video>
              <div className='clip-box-out'
                   style={this.clipStyle(1)}
                   onMouseDown={this.createClip}
              >
                {hasClip ?
                    <div className='clip-box' style={clipStyle}
                         onMouseDown={this.clipDown}>
                      <span className='closeClip' onClick={this.hiddenClip}>×</span>
                      <div className='rbMove' onMouseDown={this.rbdown}></div>
                      <div className='rtMove' onMouseDown={this.rtdown}></div>
                      <div className='lbMove' onMouseDown={this.lbdown}></div>
                    </div>
                    :""
                }
              </div>
              {showRemoveTips? <div className='handdleTips' onClick={()=>{this.setState({showRemoveTips:false})}}> </div> :""}
            </div>
            {/* 视频控件栏 */}
            <div className="video_controller">
              <div>
                {handdleStatus===1 || handdleStatus === 3 ?
                  <Fragment>
                    {/**播放按钮**/}
                    <div className={isPlay ? "video_play video_pause" : "video_play"}
                         onClick={this.playVideo}></div>
                    <div className="video_progressBar" ref="line">
                      <div className="video_progress"
                           style={{width: this.time_To_length(cur_time)}}
                      >
                      </div>
                      <div className="video_progressBtn"
                           style={!isdarlog?{left: this.time_To_length(cur_time) - 2,transition:'all 0.25s'}:{left: this.time_To_length(cur_time) - 2}}
                           onMouseDown={this.videoBtnDown}
                      ></div>
                    </div>
                    <div className="video_time">{this.changeTime()}</div>
                  </Fragment>
                  :handdleStatus===2?
                    <Fragment>
                      {/**处理进度条**/}
                      <div className='singeleRemove-progress'>
                        <div className='singleRemove-out'>
                          <p className='singleRemove-inner' style={{width:singleTransProgress+'%'}}></p>
                        </div>
                        <p className='progreeNumber'>{singleTransProgress}%</p>
                      </div>
                    </Fragment>
                    :""
                }
              </div>
            </div>
            <div className='contorlBtn'>
              {
                handdleStatus===1 ?
                  <button className='startBtn' onClick={this.beginRemove}>{window.intl.get('开 始')}</button>:
                  handdleStatus===2 ?
                    <button className='cancelBtn' onClick={this.cancelRemove}>{window.intl.get('取 消')}</button>:
                    <Fragment>
                      <button className='downloadBtn' onClick={this.downloadVideo}>{window.intl.get('下 载')}</button>
                      <button className='editOther' onClick={this.editOtherVideo}>{window.intl.get('编辑另一个')}</button>
                      <button className='getAllbtn' onClick={this.muliUploadTips}>{window.intl.get('批量处理')}<span>{window.intl.get('推荐')}</span></button>
                    </Fragment>
              }
            </div>
            {isVip&&videoInfo.length>1?
              <div className='videoListbox'>
                <h4>{window.intl.get('小图预览')}</h4>
                <ul className='video-list'>
                  {
                    videoInfo.map((item,index)=>{
                      return  <li
                        className={ currIndex===index ?'video-item active':'video-item'}
                        key={index}
                        onClick={this.changeVideo.bind(this,index)}
                      >
                        <div className='videobox'>
                          <video src={item.url} controls={false}></video>
                          <div style={this.clipStyle(2,index)} className='listclip'>
                            {hasClip?
                              <div style={this.getListStyle(item)}></div>:
                              ""}
                          </div>
                        </div>
                        <p>{index<9?'0'+(index+1):index+1}</p>
                      </li>
                    })
                  }
                  {videoInfo.length<10 ?
                    <li className='video-item uploadVideo'  onClick={()=>{window.gtag&& window.gtag('event', 'click', {'event_category': 'remove_upload','event_label': 'remove'})}}>
                      <Upload
                        accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                        project='rewatermark'
                        className={uploadState===0?'removeWaterUpload':"removeWaterUpload hide"}
                        onChange={this.uploadChange}
                        autoUpload={true}
                        onProgress={this.uploadProgress}
                        onSuccess={this.uploadSuccess}
                        onTimeOut = {this.timeOut}
                      >
                        <p className='upload-imgBtn'> </p>
                        <p className='upload-tips'>( {window.intl.get('最多支持十个视频')} )</p>
                      </Upload>
                      {uploadState!==0?
                      // {true?
                        <div className='upload-info'>
                          <p className='uploadState'>{uploadState===1?window.intl.get('载入中...') : window.intl.get('转码中...')}</p>
                          <div className='progress-out'>
                            <p className='progress-inner' style={{width:uploadProgress*3.6}}></p>
                          </div>
                        </div>
                        :""}
                    </li>
                    :""
                  }

                </ul>
              </div>
              :""
            }
          </div>
          :
          <div className='muliDownload'>
            <div className='header'>
              <div className='leftDiv'>
                <div className='logo'></div>
                <div className='functionText'>
                  <p className='functionName'>{window.intl.get('去水印3')}</p>
                  <p className='functionDesc'>{window.intl.get('随时随地创作/编辑视频从未如此方便')}</p>
                </div>
              </div>
            </div>
            <div className='muliDownload-main'>
              <div className='muliDownload-inner'>
                <div className='videoContent'>
                  <div className='content-header'>
                    <div style={{width:'802px'}}>
                      <div>
                        <p className={isAutoDownload?'checkIcon checked':'checkIcon'}
                          onClick={this.changeDownloadType}
                        ></p>
                        <p className='checkText'>{window.intl.get('处理完成后自动下载')}</p>
                      </div>
                    </div>
                  </div>
                  <div className='content-body'>
                    <ul>
                      {videoInfo.map((item,index)=>{
                        return <li className='chuliItem' key={item.g_filemd5 + index}>
                          <div className='fileItem'>
                            <p className='file_index'>{ index<9 ?'0'+(index+1) : index+1}</p>
                            <div className='file_img'>
                              <video src={item.url||''} controls={false}> </video>
                            </div>
                            <p className='fileName'>{item.file_name||''}</p>
                            {
                              item.downloadUrl?
                                <p className='downloadIcon' onClick={this.downloadItem.bind(this,item.downloadUrl)}></p>
                                :
                                <Fragment>
                                  {item.transfail?
                                      <p className='fileProgress' style={{color:'red'}}>{window.intl.get('转码失败')}</p>
                                      :
                                      <p className='fileProgress'>{item.chuliProgress ? item.chuliProgress+'%':window.intl.get('等待中')}</p>
                                  }
                                </Fragment>
                            }
                          </div>
                        </li>
                      })
                      }

                    </ul>
                  </div>
                  <div className='content-footer'>
                    <button className='downloadAll' onClick={this.downloadAllVideo}>{muliSuccessCount}/{videoInfo.length}{window.intl.get('已完成，下载已完成文件')}</button>
                    <button className='jx' onClick={this.muliUploadTips}>{window.intl.get('继续处理')}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className='muliDownload-footer'>
              <div className='footerInner'>
                <div className={showCard?'card-box':'card-box hiden' }>
                  <div className="swiper-container" id="removeWater">
                    <div className="swiper-wrapper">
                      {cardList.map((item, index) => {
                        return <div className="swiper-slide" key={index}>
                          <img src={item.imageUrl}/>
                          {item.link ?
                            <Link to={ item.link||''} target='_blank'>
                              <p></p>
                            </Link>
                            :''
                          }

                          <span className='closeIcon'
                                onClick={this.closeCard}
                                style={index===0?{color:'white'}:{color:"#666"}}>×</span>
                        </div>
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/**编辑另一个视频**/}
        <input type="file" accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*" multiple={true} ref='muliUpload' style={{display:'none'}} onChange={this.filesChange}/>

        {comformDialog ?
          <Comfirm
            msg={comformMsg}
            okCallBack={this.comformOkBtn}
            cancelCallBack={()=>{this.setState({comformDialog:false})}}
          />
          :""}
        {/**批量上传提示**/}
        {uploadMuliTips ?
          <Comfirm
            msg={upmuliMsg}
            okCallBack={this.uploadMuliOk}
            cancelCallBack={()=>{this.setState({uploadMuliTips:false})}}
          />
          :""
        }
        {showGrade?
            <Grade tipsMessage='Rate Our Processing Speed!'
                   token={videoInfo[0].token||''}
                   type='5'
            />
            :""
        }

      </Fragment>
    )
  }
}
