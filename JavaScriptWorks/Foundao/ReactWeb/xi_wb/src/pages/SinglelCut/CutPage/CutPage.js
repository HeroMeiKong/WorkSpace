/* eslint-disable */

import React, {Component , Fragment} from 'react';
import Tool from '@/utils/tool';
import {} from 'react-router-dom';
import './CutPage.scss';
import httpRequest from  '@/utils/httpRequest';
import Comfirm from '@/components/Comfirm/index';
import Alert from '@/components/Alert/index';
import api from  '@/API/api';
import {Message} from "element-react";
import transCode  from  '@/utils/transCode';
import API from "@/API/api";
import {connect} from 'react-redux';
import {login, show_loading, hide_loading} from '@/redux/models/admin';
import CONST from "../../../config/const";
// import $ from "jquery";
let videoTra=null;
@connect(
  state => ({admin: state.admin}),
  {login, show_loading, hide_loading}
)
class CutPage extends Component {
  constructor (props) {
    super(props);
    this.state={
      duration : 0,//视频长度
      cutLeft:0,//裁剪区域left值
      cutRight:724,//裁剪区域Right
      leftzIndex:11,//重叠时的Left
      rightzIndex:11,//重叠时的Right
      videoPause : true,//视频是否是站厅状态
      formatList:['MP4'],//支持导出的格式
      powerList:[window.intl.get('不变'),'1080p','720p','480p','360p','240p'],//支持导出的分辨率
      currFormat:'MP4',//当前导出视频格式
      currpower:window.intl.get('不变'),//当前导出视频分辨率
      currUrl:'',//当前视频链接
      curCover:'',//当前视频封面
      videoCover:[],//视频封面帧图
      currStart:0,//当前开始时间
      currEnd:0,//当前结束时间
      width:0,//视频宽度
      height:0,//视频高度
      cutStatus:1,//视频处理状态   1  剪切操作中  2 剪切转码中  3 完成准备下载
      cutProgress:0,//剪切视频进度
      downUrl:'',//剪切好的视频的地址（下载链接）
      clipBox:1,//裁剪框的当前比例（默认为1）
      currtype:1,//当前裁剪工作内容（1:裁剪 2:切割  3：旋转  4: 翻转）
      clipType:1, //裁剪类型 (1：自由  2: 1比1   3： 4比3  4：16比9  5: 21比9)
      clipCenterT:0,//中心容器top值
      clipCenterR:0,//中心容器right值
      clipCenterB:0,//中心容器bottom值
      clipCenterL:0,//中心容器left值
      rotateType:0,//旋转类型 （ 0 不旋转  1 顺时针旋转90°  2 旋转180°   3 逆时针旋转90°）
      returnType:-1,//翻转类型( -1 不翻转   1 垂直翻转  0 水平翻转  )
      rotateZomm:1,//旋转缩放比例
      currTimeLeft:0,
      videoCurr:0,
      dialog:false,//弹窗状态
      dialogMsg:'',
      alertDialog:false,
      alertMsg:'',
      cancelExport:false,
      timeLinemove:false,
      loacalTips:false,//加载到本地
      downloadUrl:'',//下载链接
      videoToken:""
    };
    this.all_length = 724;//裁剪控制区总长度
  }
  componentWillMount() {
    // console.log(this.props.data)
    if (this.props.data.md5||this.props.data.curUrl){
      this.setState({
        currUrl : this.props.data.curUrl||'',
        md5 : this.props.data.md5||'',
        videoToken : this.props.data.token||''
      });
      // this.blob_load(this.props.data.curUrl);
      this.getVideoDetail(this.props.data.md5);
    } else {
      this.returnUpload();
    }
  }
  componentDidMount() {}
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  /**返回上传界面**/
  returnUpload=()=>{
    // console.log(1211)
    this.props.returnPage();
  };
  /**获取视频详细信息**/
  getVideoDetail=(md5)=>{
    // console.log(md5,'md5')
    // this.props.show_loading();
    httpRequest({
      url:api.qureyMeidiaInfo,
      data:{
        MD5:md5
      }
    }).done(res=>{
      // this.props.hide_loading();
      let clipBox = 1;
      if (738 / res.width < 1){
        if (res.height * 738 /res.width < 482 ){
          clipBox = 738 / res.width
        } else {
          clipBox = 414 / res.height
        }
      }else if(res.height>414){
        clipBox = 414/res.height
      }
      // else{
      //   if (res.height*(738 / res.width)<414) {
      //     console.log(res.height/(738 / res.width))
      //     clipBox = 738 / res.width;
      //   }else{
      //     console.log(2)
      //     clipBox = 414 / res.height;
      //   }
      // }
      this.setState({
        duration:res.duration,
        currEnd:res.duration,
        height: res.height,
        inFileName: res.inFileName,
        size: res.size,
        width: res.width,
        clipBox:clipBox,
        videoCover:res.video_cover_imgurl||[]
      })
    }).fail(()=>{
      // this.props.hide_loading();
      this.setState({
        alertDialog:true,
        alertMsg:window.intl.get('获取视频信息失败,请重新上传！')
      });
    })
  };
  length_To_time(l) {
    return (l / this.all_length) * this.state.duration;
  }

  time_To_length(t) {
    return (t / this.state.duration) * this.all_length;
  }

  video_play() {
    this.refs.video.play();
  }

  video_pause() {
    this.refs.video.pause();
  }
  /**---裁剪控制--**/
  left_mouseDown = (e) => {
    this.setState({
      videoPause:true,
      timeLinemove:true
    });
    this.video_pause();
    this.mouse_start = e.pageX;
    this.oli_time = this.state.cutLeft; //点击获取点击时的left值
    Tool.addEventHandler(document.body, 'mousemove', this.left_move);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  left_move=(e)=>{
    const {cutRight} = this.state;
    let x = e.pageX - this.mouse_start;
    let cl = x + this.oli_time;
    if (cl<0){
      cl = 0;
      this.refs.video.currentTime  = this.length_To_time(cl);
      this.setState({
        leftzIndex:10,
        cutLeft:cl,
        currTimeLeft:cl,
        currStart:this.length_To_time(cl),
        videoCurr: this.length_To_time(cl)
      })
    } else if (cl>this.all_length) {
      return
    }else if (cl>cutRight){
      cl = cutRight;
      this.refs.video.currentTime = this.length_To_time(cl);
      this.setState({
        leftzIndex:11,
        cutLeft:cl,
        videoCurr: this.length_To_time(cl),
        currTimeLeft:cl,
        currStart:this.length_To_time(cl),
      })
    }else{
      this.refs.video.currentTime = this.length_To_time(cl);
      this.setState({
        leftzIndex:10,
        cutLeft:cl,
        currTimeLeft:cl,
        currStart:this.length_To_time(cl),
        videoCurr: this.length_To_time(cl)
      })
    }
  };
  mouseUp=()=>{
    Tool.removeEventHandler(document.body, 'mousemove', this.left_move);
    Tool.removeEventHandler(document.body, 'mousemove', this.right_move);
    Tool.removeEventHandler(document.body, 'mousemove', this.main_move);
    // Tool.removeEventHandler(document.body, 'mousemove', this.topLineMove);
    // Tool.removeEventHandler(document.body, 'mousemove', this.bottomLineMove);
    // Tool.removeEventHandler(document.body, 'mousemove', this.rightLineMove);
    // Tool.removeEventHandler(document.body, 'mousemove', this.leftLineMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.centerBoxMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.rightDownMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.rightTopMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.leftDownMove);
    Tool.removeEventHandler(document.body, 'mousemove', this.leftTopMove);
    Tool.removeEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  right_mouseDown=(e)=>{
    this.setState({
      videoPause:true,
      timeLinemove:true
    });
    this.video_pause();
    this.mouse_start = e.pageX;
    this.ori_time = this.state.cutRight; //点击获取点击时的right值
    Tool.addEventHandler(document.body, 'mousemove', this.right_move);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  right_move=(e)=>{
    
    const {cutLeft} = this.state;
    let x = e.pageX - this.mouse_start;
    let cr = x + this.ori_time;
    // console.log(cr)
    if (cr<0){
      return;
    } else if (cr>this.all_length){
      this.refs.video.currentTime = this.length_To_time(this.all_length);
      this.setState({
        rightzIndex:10,
        cutRight:this.all_length,
        currEnd: this.length_To_time(this.all_length),
      })
    }else if(cr<cutLeft){
      this.refs.video.currentTime = this.length_To_time(cutLeft);
      this.setState({
        rightzIndex:11,
        cutRight:cutLeft,
        currEnd: this.length_To_time(cutLeft),
      })
    }else{
      this.refs.video.currentTime = this.length_To_time(cr);
      this.setState({
        rightzIndex:10,
        cutRight:cr,
        currEnd: this.length_To_time(cr),
      })
    }

  };
  mainMove=(e)=>{
    this.main_start = e.pageX;
    this.setState({
      videoPause:true,
      timeLinemove:true
    });
    this.video_pause();
    this.mainLeft = this.state.cutLeft;
    this.mainRight = this.state.cutRight;
    Tool.addEventHandler(document.body, 'mousemove', this.main_move);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  main_move=(e)=>{
    let cha = e.pageX - this.main_start;
    let leng = this.mainRight-this.mainLeft;
    let newLeft = this.mainLeft+cha ;
    let newRight = this.mainRight+cha;
    if ( this.mainLeft+cha <= 0) {
      newLeft = 0 ;
      newRight = leng;
    }else if (this.mainRight+cha >= this.all_length){
      newLeft =  this.all_length - leng;
      newRight = this.all_length;
    }else{
      newLeft = this.mainLeft+cha ;
      newRight = this.mainRight+cha;
    }
    this.refs.video.currentTime = this.length_To_time(newLeft);
    this.setState({
      cutLeft : newLeft,
      currTimeLeft:newLeft,
      cutRight :newRight,
      currEnd: this.length_To_time(newRight),
      currStart:this.length_To_time(newLeft),
      videoCurr: this.length_To_time(newLeft)
    });
  };
  /**----**/
  /**视频暂停**/
  play_video=()=>{
    const _this = this;
    const {cutLeft } = this.state;
    this.refs.video.currentTime = this.length_To_time(cutLeft);
    let pauseTime = _this.length_To_time(_this.state.cutRight);
    this.video_play();
    this.setState({
      videoPause:false,
      timeLinemove:false
    });
    this.refs.video.onended = function(){
      _this.setState({
        videoCurr:pauseTime,
        currTimeLeft:_this.time_To_length(pauseTime)
      });
    }
    this.refs.video.ontimeupdate = function() {
      let curr = this.currentTime;
      _this.setState({
        videoCurr:curr,
        currTimeLeft:_this.time_To_length(curr)
      });
      if (curr>=pauseTime){
        this.currentTime=pauseTime;
        _this.pause_video();
        _this.setState({
          videoCurr:pauseTime,
          currTimeLeft:_this.time_To_length(pauseTime)
        });
      }
    }
  };
  pause_video=()=>{
    this.video_pause();
    this.setState({
      videoPause:true
    })
  };
  /***改变输出视频分辨率/格式***/
  changeFormat=(val)=>{
    this.setState({
      currFormat:val
    })
  };
  changePower=(val)=>{
    this.setState({
      currpower:val
    })
  };
  /**--------------------保存/转码视频------------------------**/
  saveVideo=()=> {
    const {width,height,md5 ,currpower,duration ,currStart,currEnd,clipCenterT,clipCenterR,clipCenterB,clipCenterL,
      clipBox,clipType ,rotateType, returnType,videoToken
    } = this.state;
    let cropTop = parseInt(clipCenterT / clipBox);
    let cropRight = parseInt( width-clipCenterR/clipBox);
    let cropBottom = parseInt(height-clipCenterB/clipBox);
    let cropLeft = parseInt(clipCenterL / clipBox);
    let outheight =height;
    let outWidth = width;
    // console.log(clipBox)
    // console.log(cropTop,'cropTop')
    // console.log(cropRight,'cropRight')
    // console.log(cropBottom,'cropBottom')
    // console.log(cropLeft,'cropLeft')
    if ((clipType===1 && (clipCenterT!==0||clipCenterR!==0||clipCenterB!==0||clipCenterL!==0))||clipType===2||clipType===3||clipType===4||clipType===5){
      outWidth = 0;
      outheight = 0;
    }else{
      if (currpower!==window.intl.get('不变')) {
        outWidth=parseInt(currpower)*width/height;//导出视频宽度
        outheight=parseInt(currpower)+'';//导出视频高度
      }
    }
    let data = {
      outWidth : outWidth+'',//导出视频宽度
      outHeight : outheight+'',//导出视频高度
      inFileMd5:md5,
      rotate:rotateType,
      mirrorFormat:returnType,
      token:videoToken,
      cut_time:[
        {
          start:'0',//截取开始时间（微秒）
          end:currStart*1000000+''//截取结束时间（微秒）
        },
        {
          start:currEnd*1000000+'',//截取开始时间（微秒）
          end:duration*1000000+''//截取结束时间（微秒）
        }
      ],
      crop: {
        left:cropLeft>=0?cropLeft:0+'',
        right:cropRight>=0?cropRight:0+'',
        top:cropTop>=0?cropTop:0+'',
        bottom:cropBottom>=0?cropBottom:0+''
      },
    };
    // console.log(data,'data');
    // return;
    this.cutTransVideo(data)
  };
  cutTransVideo = (data)=>{
    this.setState({
      cutStatus:2
    })
    videoTra = transCode({
      transOptions:data,
      transSuccess:(val)=>{
        this.setState({
          cutProgress:100,
          downUrl:val,
          cutStatus:3
        },()=>{
          // this.downloadVideo();
        })
      },
      transFail: (val)=>{
        Message.error(val)
      },
      transProgress:(val)=>{
        this.setState({
          cutProgress:val
        })
      }
    })
  };
  cancelExport=()=>{
    videoTra.stopTransCode();
    this.setState({
      cutStatus:1,
      cancelExport:false
    })
  };
  downloadVideo=()=>{
    const {downUrl} = this.state;
    // window.gtag&& window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'})
    this.getDownload(downUrl);
  };
  IseeIt=()=>{
    this.setState({
      alertDialog:false,
    });
    this.returnUpload();
  };
  //获取下载地址并跳转下载
  getDownload = (data)=>{
    const {videoToken} = this.state;
    const path = data;
    // const newWin = window.open();
    httpRequest({
      url : API.downloadVideo,
      dataType : 'json',
      type : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      data : {
        path : path,
        trans_type:4,
        up_token: videoToken
      }
    }).done((res)=>{
      if(res.code /1 === 0){
        window.location.href = res.data||''
        this.setState({
          downloadUrl:res.data
        })
        // newWin.location.href = res.data;
        // setTimeout(function () {
        //   newWin.close()
        // },5000)
      }else {
        // newWin.close()
        // console.log(res.msg)
      }
    }).fail(()=>{
      // newWin.close()
      // console.log('内部服务器错误！')
    })
  };
  openDetail=()=>{
    this.setState({
      dialog:true,
      dialogMsg:window.intl.get('删除不会保存当前已有操作，是否确认删除？')
    })
  }
  delectVideo=()=>{
    this.setState({
      dialog:false
    });
    this.returnUpload();
  };
  cancelDetail=()=>{
    this.setState({
      dialog:false
    });
  };
  otherVideo=()=>{
    this.setState({
      dialog:true,
      dialogMsg:window.intl.get('开始编辑新的视频，请确认当前视频已保存！')
    })
  };
  /**改变当前操作区类型**/
  changeType =(val)=>{
    this.setState({
      currtype:val
    })
  };

  /**--------裁剪视频------------**/
  /**初始化裁剪区域**/
  getClipDiv=(type)=>{
    const {width,height,clipBox , rotateType, returnType ,
    } = this.state;
    let zoom = 1 ,cw = width * clipBox , ch = height*clipBox;
    if (width *clipBox >414){
      zoom = 414 / (width*clipBox)
    }
    if (type === 1){
      if (clipBox<1){
        return {
          width:Math.ceil(cw+2) + 'px',
          height:Math.ceil(ch+2) + 'px',
        }
      }else{
        return {
          width:Math.ceil(cw+2) + 'px',
          height:Math.ceil(ch+2) + 'px',
        }
      }
    } else{
      let css = 'translate(-50%,-50%)';
      if (rotateType!==0){
          css += rotateType===1?'rotateZ(90deg) ':
            rotateType===2?"rotateZ(180deg) ":
              rotateType===3?"rotateZ(-90deg) ":
                ''
      }
      if (returnType!==-1){
        css += returnType===0?'rotateY(180deg) ':
          returnType === 1 ?"rotateX(180deg) ":''
      }
      if (clipBox<1){
        return {
          width:Math.ceil(width * clipBox+2) + 'px',
          height:Math.ceil(height * clipBox) + 'px',
          transform:css,
          // marginLeft:'-1px',
          zoom : rotateType===1 || rotateType===3 ? zoom : 1
        }
      }else{
        return {
          width:width + 'px',
          height:height + 'px',
          transform:css,
          // marginLeft:'-1px',
          zoom : rotateType===1 || rotateType===3 ? zoom : 1
        }
      }
    }

  };
  /**选中裁剪区域改变裁剪框大小**/
  changeClipBox=(val)=>{
    const {width,height ,clipBox} = this.state;
    if (val===2){
      this.setState({
        clipCenterT:height*clipBox/2-100,
        clipCenterR:width*clipBox/2-100,
        clipCenterB:height*clipBox/2-100,
        clipCenterL:width*clipBox/2-100,
      })
    }else if (val ===3){
      this.setState({
        clipCenterT:height*clipBox/2-200*3/8,
        clipCenterR:width*clipBox/2-100,
        clipCenterB:height*clipBox/2-200*3/8,
        clipCenterL:width*clipBox/2-100,
      })
    } else if (val ===4){
      this.setState({
        clipCenterT:height*clipBox/2-200*9/32,
        clipCenterR:width*clipBox/2-100,
        clipCenterB:height*clipBox/2-200*9/32,
        clipCenterL:width*clipBox/2-100,
      })
    } else if (val ===5){
      this.setState({
        clipCenterT:height*clipBox/2-200*9/42,
        clipCenterR:width*clipBox/2-100,
        clipCenterB:height*clipBox/2-200*9/42,
        clipCenterL:width*clipBox/2-100,
      })
    }else {
      this.setState({
        clipCenterT:0,
        clipCenterR:0,
        clipCenterB:0,
        clipCenterL:0,
      })
    }
  }
  /**改变裁剪区域大小**/
  changeClipType = (val)=>{
    this.changeClipBox(val);
    this.setState({
      clipType:val
    })
  };
  /****centerbox拖动***/
  centerBoxDown=(e)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL} = this.state;
    this.centerX = e.pageX;
    this.centerY = e.pageY;
    this.centerL = clipCenterL;
    this.centerT = clipCenterT;
    this.centerR = clipCenterR;
    this.centerB = clipCenterB;
    Tool.addEventHandler(document.body, 'mousemove', this.centerBoxMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  centerBoxMove=(e)=>{
    const {rotateType , returnType} = this.state;
    let newcenterL =e.pageX-this.centerX + this.centerL;
    let newcenterR =this.centerX-e.pageX + this.centerR;
    let newcenterT =e.pageY-this.centerY + this.centerT;
    let newcenterB =this.centerY - e.pageY + this.centerB;
    if (rotateType===0){//不旋转
      if (returnType===-1){
        newcenterL =e.pageX-this.centerX + this.centerL;
        newcenterR =this.centerX-e.pageX + this.centerR;
        newcenterT =e.pageY-this.centerY + this.centerT;
        newcenterB =this.centerY - e.pageY + this.centerB;
      } else if (returnType===0){//水平
        newcenterL =this.centerX - e.pageX+ this.centerL;
        newcenterR = e.pageX - this.centerX + this.centerR;
        newcenterT =e.pageY-this.centerY + this.centerT;
        newcenterB =this.centerY - e.pageY + this.centerB;
      } else if(returnType===1){//垂直
        newcenterL =e.pageX-this.centerX + this.centerL;
        newcenterR =this.centerX-e.pageX + this.centerR;
        newcenterT =this.centerY -e.pageY + this.centerT;
        newcenterB = e.pageY - this.centerY + this.centerB;
      }
    } else if(rotateType===1){//顺时针旋转90度
      if (returnType===-1){
        newcenterL =e.pageY-this.centerY + this.centerL;
        newcenterR =this.centerY-e.pageY + this.centerR;
        newcenterT =this.centerX - e.pageX + this.centerT;
        newcenterB = e.pageX - this.centerX + this.centerB;
      } else if (returnType===0){
        newcenterL =this.centerY - e.pageY + this.centerL;
        newcenterR =e.pageY - this.centerY + this.centerR;
        newcenterT =this.centerX - e.pageX + this.centerT;
        newcenterB = e.pageX - this.centerX + this.centerB;
      } else if(returnType===1){
        newcenterL =e.pageY-this.centerY + this.centerL;
        newcenterR =this.centerY-e.pageY + this.centerR;
        newcenterT =e.pageX - this.centerX+ this.centerT;
        newcenterB =this.centerX - e.pageX + this.centerB;
      }
    }else if (rotateType===2){//旋转180deg
      if (returnType===-1){
        newcenterL = this.centerX - e.pageX+ this.centerL;
        newcenterR = e.pageX - this.centerX + this.centerR;
        newcenterT = this.centerY - e.pageY + this.centerT;
        newcenterB = e.pageY - this.centerY + this.centerB;
      } else if (returnType===0){//水平
        newcenterL = e.pageX - this.centerX + this.centerL;
        newcenterR = this.centerX - e.pageX + this.centerR;
        newcenterT = this.centerY - e.pageY + this.centerT;
        newcenterB = e.pageY - this.centerY + this.centerB;
      } else if(returnType===1){//垂直
        newcenterL =this.centerX - e.pageX + this.centerL;
        newcenterR =e.pageX - this.centerX + this.centerR;
        newcenterT =e.pageY - this.centerY + this.centerT;
        newcenterB =this.centerY - e.pageY + this.centerB;
      }
    } else if (rotateType===3){//逆时针旋转90度
      if (returnType===-1){
        newcenterL =this.centerY - e.pageY + this.centerL;
        newcenterR =e.pageY - this.centerY + this.centerR;
        newcenterT =e.pageX - this.centerX + this.centerT;
        newcenterB =this.centerX - e.pageX + this.centerB;
      } else if (returnType===0){
        newcenterL = e.pageY - this.centerY + this.centerL;
        newcenterR = this.centerY - e.pageY + this.centerR;
        newcenterT = e.pageX - this.centerX + this.centerT;
        newcenterB =  this.centerX - e.pageX + this.centerB;
      } else if(returnType===1){
        newcenterL =this.centerY - e.pageY + this.centerL;
        newcenterR =e.pageY - this.centerY + this.centerR;
        newcenterT =this.centerX - e.pageX + this.centerT;
        newcenterB =e.pageX - this.centerX  + this.centerB;
      }
    }
    if (newcenterL<=0){
      newcenterL = 0;
      newcenterR = this.centerL+this.centerR
    }
    if (newcenterR<=0){
      newcenterR = 0;
      newcenterL =this.centerL+this.centerR
    }
    if (newcenterT<0){
      newcenterT = 0;
      newcenterB =this.centerT+this.centerB
    }
    if (newcenterB<0){
      newcenterB = 0;
      newcenterT =this.centerT+this.centerB
    }
    this.setState({
      clipCenterT : newcenterT,
      clipCenterL : newcenterL,
      clipCenterR : newcenterR,
      clipCenterB : newcenterB
    })
  };
  rightDownDown = (e)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL} = this.state;
    e.stopPropagation();
    e.preventDefault();
    this.rdX = e.pageX;
    this.rdY = e.pageY;
    this.rdL = clipCenterL;
    this.rdT = clipCenterT;
    this.rdR = clipCenterR;
    this.rdB = clipCenterB;
    Tool.addEventHandler(document.body, 'mousemove', this.rightDownMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  rightDownMove = (e)=>{
    const {clipCenterT,clipCenterL,
      height, width, clipBox, clipType,  rotateType, returnType
    } = this.state;
    let newrdR = this.rdX - e.pageX + this.rdR;
    let newrdB = this.rdY - e.pageY + this.rdB;
    if(rotateType===0){//不旋转
      if(returnType===-1){
        newrdR = this.rdX - e.pageX + this.rdR;
        newrdB = this.rdY - e.pageY + this.rdB;
      }else if(returnType===0){
        newrdR = e.pageX -this.rdX + this.rdR;
        newrdB = this.rdY - e.pageY + this.rdB;
      }else if(returnType===1){
        newrdR = this.rdX - e.pageX + this.rdR;
        newrdB = e.pageY - this.rdY + this.rdB;
      }
    }else if (rotateType===1){//顺时针90°
      if(returnType===-1){
        newrdR = this.rdY - e.pageY + this.rdR;
        newrdB = e.pageX - this.rdX+ this.rdB;
      }else if(returnType===0){
        newrdR = e.pageY - this.rdY + this.rdR;
        newrdB = e.pageX -this.rdX+ this.rdB;
      }else if(returnType===1){
        newrdR = this.rdY- e.pageY + this.rdR;
        newrdB = this.rdX - e.pageX+ this.rdB;
      }
    }else if (rotateType===3){//逆时针90°
      if(returnType===-1){
        newrdR = e.pageY - this.rdY+ this.rdR;
        newrdB = this.rdX - e.pageX + this.rdB;
      }else if(returnType===0){
        newrdR = this.rdY - e.pageY + this.rdR;
        newrdB = this.rdX - e.pageX + this.rdB;
      }else if(returnType===1){
        newrdR = e.pageY - this.rdY + this.rdR;
        newrdB = e.pageX - this.rdX + this.rdB;
      }
    }else if(rotateType===2){//旋转180°
      if(returnType===-1){
        newrdR = e.pageX - this.rdX + this.rdR;
        newrdB = e.pageY - this.rdY + this.rdB;
      }else if(returnType===0){
        newrdR = this.rdX -e.pageX + this.rdR;
        newrdB = e.pageY - this.rdY + this.rdB;
      }else if(returnType===1){
        newrdR = e.pageX  - this.rdX+ this.rdR;
        newrdB = this.rdY - e.pageY+ this.rdB;
      }
    }
    if(clipType===1){
      if (newrdR<=0) {newrdR= 0}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL}
      if(newrdB<=0){newrdB=0}
      else if(newrdB>=height*clipBox-10-clipCenterT){newrdB = height*clipBox-10-clipCenterT}
    }else if (clipType===2){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterT - vw <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw
        }
      }
    } else if (clipType===3){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterT - vw*3/4 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*3/4
        }
      }
    }else if(clipType===4){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterT - vw*9/16 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*9/16
        }
      }
    }else if (clipType===5){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterT - vw*9/21 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*9/21
        }
      }
    }
    this.setState({
      clipCenterR : newrdR,
      clipCenterB : newrdB
    })
  };
  rightTopDown = (e)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL} = this.state;
    e.stopPropagation();
    e.preventDefault();
    this.rdX = e.pageX;
    this.rdY = e.pageY;
    this.rdL = clipCenterL;
    this.rdT = clipCenterT;
    this.rdR = clipCenterR;
    this.rdB = clipCenterB;
    Tool.addEventHandler(document.body, 'mousemove', this.rightTopMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  rightTopMove=(e)=>{
    //翻转类型( -1 不翻转   1 垂直翻转  0 水平翻转  )
    //旋转类型 （ 0 不旋转  1 顺时针旋转90°  2 旋转180°   3 逆时针旋转90°）
    const {clipCenterB,clipCenterL,rotateType, returnType,
      height, width, clipBox, clipType
    } = this.state;
    let newrdR = this.rdX - e.pageX + this.rdR;
    let newrdT = e.pageY  - this.rdY + this.rdT;
    if (rotateType===0){//不旋转
      if (returnType===-1){
        newrdR = this.rdX - e.pageX + this.rdR;
        newrdT = e.pageY  - this.rdY + this.rdT;
      } else if (returnType===0){
        newrdR = e.pageX - this.rdX + this.rdR;
        newrdT = e.pageY  - this.rdY + this.rdT;
      } else if(returnType===1){
        newrdR =this.rdX - e.pageX + this.rdR;
        newrdT = this.rdY - e.pageY + this.rdT;
      }
    } else if(rotateType===1){//顺时针旋转90度
      if (returnType===-1){
        newrdR = this.rdY - e.pageY + this.rdR;
        newrdT = this.rdX - e.pageX + this.rdT;
      } else if (returnType===0){
        newrdR = e.pageY - this.rdY + this.rdR;
        newrdT = this.rdX - e.pageX + this.rdT;
      } else if(returnType===1){
        newrdR = this.rdY - e.pageY + this.rdR;
        newrdT = e.pageX - this.rdX + this.rdT;
      }
    }else if (rotateType===2){//旋转180deg
      if (returnType===-1){
        newrdR = e.pageX - this.rdX + this.rdR;
        newrdT = this.rdY - e.pageY + this.rdT;
      } else if (returnType===0){
        newrdR = this.rdX - e.pageX + this.rdR;
        newrdT = this.rdY - e.pageY + this.rdT;
      } else if(returnType===1){
        newrdR = e.pageX - this.rdX + this.rdR;
        newrdT = e.pageY - this.rdY + this.rdT;
      }
    } else if (rotateType===3){//逆时针旋转90度
      if (returnType===-1){
        newrdR =  e.pageY - this.rdY + this.rdR;
        newrdT = e.pageX - this.rdX + this.rdT;
      } else if (returnType===0){
        newrdR = this.rdY - e.pageY + this.rdR;
        newrdT = e.pageX - this.rdX+ this.rdT;
      } else if(returnType===1){
        newrdR = e.pageY - this.rdY + this.rdR;
        newrdT = this.rdX - e.pageX + this.rdT;
      }
    }
    if(clipType===1){
      if (newrdR<=0) {newrdR= 0}
      else if(newrdR>=width*clipBox-clipCenterL-10){newrdR = width*clipBox-clipCenterL-10}
      if(newrdT<=0){newrdT=0}
      else if(newrdT >= height*clipBox - clipCenterB -10){ newrdT = height*clipBox-10-clipCenterB }
    }else if (clipType===2){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterB - vw <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw
        }
      }
    } else if (clipType===3){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterB - vw*3/4 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*3/4
        }
      }
    }else if(clipType===4){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterB - vw*9/16 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*9/16
        }
      }
    }else if (clipType===5){
      if (newrdR<=0) {newrdR= 0;return}
      else if(newrdR>=width*clipBox-10-clipCenterL){newrdR = width*clipBox-10-clipCenterL;return}
      else{
        let vw = width*clipBox-newrdR-clipCenterL;
        if (height*clipBox - clipCenterB - vw*9/21 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*9/21
        }
      }
    }
    this.setState({
      clipCenterR : newrdR,
      clipCenterT : newrdT
    })
  };
  LeftTopDown = (e)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL} = this.state;
    e.stopPropagation();
    e.preventDefault();
    this.rdX = e.pageX;
    this.rdY = e.pageY;
    this.rdL = clipCenterL;
    this.rdT = clipCenterT;
    this.rdR = clipCenterR;
    this.rdB = clipCenterB;
    Tool.addEventHandler(document.body, 'mousemove', this.leftTopMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  leftTopMove=(e)=>{
    const {clipCenterR,clipCenterB,rotateType, returnType,
      height, width, clipBox, clipType
    } = this.state;
    let newrdL = e.pageX -this.rdX + this.rdL;
    let newrdT = e.pageY - this.rdY + this.rdT;
    if (rotateType===0){//不旋转
      if (returnType===-1){
        newrdL = e.pageX -this.rdX + this.rdL;
        newrdT = e.pageY - this.rdY + this.rdT;
      } else if (returnType===0){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdT = e.pageY - this.rdY + this.rdT;
      } else if(returnType===1){
        newrdL = e.pageX -this.rdX + this.rdL;
        newrdT = this.rdY - e.pageY + this.rdT;
      }
    } else if(rotateType===1){//顺时针旋转90度
      if (returnType===-1){
        newrdL = e.pageY -this.rdY + this.rdL;
        newrdT = this.rdX - e.pageX + this.rdT;
      } else if (returnType===0){
        newrdL = this.rdY - e.pageY + this.rdL;
        newrdT = this.rdX - e.pageX + this.rdT;
      } else if(returnType===1){
        newrdL = e.pageY -this.rdY + this.rdL;
        newrdT = e.pageX - this.rdX + this.rdT;
      }
    }else if (rotateType===2){//旋转180deg
      if (returnType===-1){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdT = this.rdY - e.pageY + this.rdT;
      } else if (returnType===0){
        newrdL =  e.pageX - this.rdX + this.rdL;
        newrdT = this.rdY - e.pageY + this.rdT;
      } else if(returnType===1){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdT = e.pageY - this.rdY + this.rdT;
      }
    } else if (rotateType===3){//逆时针旋转90度
      if (returnType===-1){
        newrdL = this.rdY - e.pageY + this.rdL;
        newrdT = e.pageX - this.rdX + this.rdT;
      } else if (returnType===0){
        newrdL = e.pageY - this.rdY + this.rdL;
        newrdT = e.pageX - this.rdX + this.rdT;
      } else if(returnType===1){
        newrdL = this.rdY - e.pageY + this.rdL;
        newrdT =  this.rdX - e.pageX + this.rdT;
      }
    }
    if(clipType===1){
      if (newrdL<=0) {newrdL= 0}
      else if(newrdL>=width*clipBox-clipCenterR-10){newrdL = width*clipBox-clipCenterR-10}
      if(newrdT<=0){newrdT=0}
      else if(newrdT >= height*clipBox - clipCenterB -10){ newrdT = height*clipBox-10-clipCenterB }
    }else if (clipType===2){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterB - vw <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw
        }
      }
    } else if (clipType===3){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterB - vw*3/4 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*3/4
        }
      }
    }else if(clipType===4){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterB - vw*9/16 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*9/16
        }
      }
    }else if (clipType===5){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterB - vw*9/21 <=0){
          return
        }else {
          newrdT = height*clipBox - clipCenterB-vw*9/21
        }
      }
    }
    this.setState({
      clipCenterL : newrdL,
      clipCenterT : newrdT
    })
  };
  LeftBottomDown=(e)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL} = this.state;
    e.stopPropagation();
    e.preventDefault();
    this.rdX = e.pageX;
    this.rdY = e.pageY;
    this.rdL = clipCenterL;
    this.rdT = clipCenterT;
    this.rdR = clipCenterR;
    this.rdB = clipCenterB;
    Tool.addEventHandler(document.body, 'mousemove', this.leftDownMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  leftDownMove=(e)=>{
    const {clipCenterT,clipCenterR,rotateType, returnType,
      height, width, clipBox, clipType
    } = this.state;
    let newrdL = e.pageX - this.rdX + this.rdL;
    let newrdB = this.rdY - e.pageY + this.rdB;
    if (rotateType===0){//不旋转
      if (returnType===-1){
        newrdL = e.pageX - this.rdX + this.rdL;
        newrdB = this.rdY - e.pageY + this.rdB;
      } else if (returnType===0){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdB = this.rdY - e.pageY + this.rdB;
      } else if(returnType===1){
        newrdL = e.pageX - this.rdX + this.rdL;
        newrdB = e.pageY - this.rdY + this.rdB;
      }
    } else if(rotateType===1){//顺时针旋转90度
      if (returnType===-1){
        newrdL = e.pageY - this.rdY + this.rdL;
        newrdB = e.pageX - this.rdX + this.rdB;
      } else if (returnType===0){
        newrdL = this.rdY - e.pageY + this.rdL;
        newrdB = e.pageX - this.rdX + this.rdB;
      } else if(returnType===1){
        newrdL = e.pageY - this.rdY + this.rdL;
        newrdB = this.rdX - e.pageX + this.rdB;
      }
    }else if (rotateType===2){//旋转180deg
      if (returnType===-1){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdB = e.pageY - this.rdY + this.rdB;
      } else if (returnType===0){
        newrdL = e.pageX - this.rdX + this.rdL;
        newrdB = e.pageY - this.rdY + this.rdB;
      } else if(returnType===1){
        newrdL = this.rdX - e.pageX + this.rdL;
        newrdB = this.rdY - e.pageY + this.rdB;
      }
    } else if (rotateType===3){//逆时针旋转90度
      if (returnType===-1){
        newrdL = this.rdY -  e.pageY + this.rdL;
        newrdB = this.rdX - e.pageX + this.rdB;
      } else if (returnType===0){
        newrdL = e.pageY - this.rdY+ this.rdL;
        newrdB = this.rdX - e.pageX + this.rdB;
      } else if(returnType===1){
        newrdL = this.rdY - e.pageY + this.rdL;
        newrdB = e.pageX - this.rdX + this.rdB;
      }
    }

    if(clipType===1){
      if (newrdL<=0) {newrdL= 0}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR}
      if(newrdB<=0){newrdB=0}
      else if(newrdB>=height*clipBox-10-clipCenterT){newrdB = height*clipBox-10-clipCenterT}
    }else if (clipType===2){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterT - vw <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw
        }
      }
    } else if (clipType===3){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterT - vw*3/4 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*3/4
        }
      }
    }else if(clipType===4){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterT - vw*9/16 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*9/16
        }
      }
    }else if (clipType===5){
      if (newrdL<=0) {newrdL= 0;return}
      else if(newrdL>=width*clipBox-10-clipCenterR){newrdL = width*clipBox-10-clipCenterR;return}
      else{
        let vw = width*clipBox-newrdL-clipCenterR;
        if (height*clipBox - clipCenterT - vw*9/21 <=0){
          return
        }else {
          newrdB = height*clipBox - clipCenterT-vw*9/21
        }
      }
    }

    this.setState({
      clipCenterL : newrdL,
      clipCenterB : newrdB
    })
  };
  setStyle=(type)=>{
    const {clipCenterT,clipCenterR,clipCenterB,clipCenterL,currtype,cutStatus
    } = this.state;
    let bc = 'rgba(0,0,0,.6)';
    let boxshow = ' 0px 0px 0px 1px rgba(0, 0, 0, 0.13)';
    if (currtype===2&&cutStatus===1){
      bc = 'rgba(0,0,0,.6)';
      boxshow = '0px 0px 0px 1px rgba(0, 0, 0, 0.13) ';
    } else{
      bc = 'rgba(0,0,0,1)';
      boxshow = '0px 0px 0px 1px rgba(0, 0, 0, 1) ';
    }
    if (type===1){
      return {top:0, width:clipCenterL+'px', bottom:0, backgroundColor:bc}
    } else if(type === 2){
      return {left:clipCenterL+'px',height:clipCenterT+'px',right:clipCenterR+'px',backgroundColor:bc,boxShadow:boxshow}
    }else if(type === 3){
      return {top:0,width:clipCenterR+'px',bottom:0,backgroundColor:bc}
    }else if (type===4){
      return {left:clipCenterL+'px',height:clipCenterB+'px',right:clipCenterR+'px',backgroundColor:bc,boxShadow:boxshow}
    }else if(type===5){
      return {top:clipCenterT+'px',left:clipCenterL+'px',right :clipCenterR+'px',bottom:clipCenterB+'px'}
    }
  };
  /**----------视频旋转-------------**/
  changeRotateType=(type)=>{
    this.setState({
      rotateType:type
    })
  };
  /**---------视频翻转-----------**/
  changeReturnType = (type)=>{
    this.setState({
      returnType:type
    })
  }
  /**---------视频加载到-----------**/
  blob_load = (src) => {
    var _this = this;
    this.setState({
      loacalTips:true
    });
    this.req = new XMLHttpRequest();
    this.req.open('GET', src, true);
    this.req.responseType = 'blob';
    this.req.onload = function (e) {
      if (this.status === 200) {
        const videoBlob = this.response;
        const blobSrc = URL.createObjectURL(videoBlob); // IE10+
        _this.setState({
          currUrl:blobSrc,
          loacalTips:false
        })
      }
    };
    this.req.onerror = function () {
      _this.props.returnPage();
    };
    this.req.send();
    this.req.onprogress = function (e) {
      // let {currIndex,dataLists} = _this.state;

    }
  };
  /**---------***/
  render() {
    const { language} = this.props.admin;
    const {cutLeft , cutRight ,leftzIndex , rightzIndex ,videoPause ,formatList , powerList ,dialogMsg,timeLinemove,
      currFormat,currpower ,currUrl ,currEnd ,currStart,cutStatus ,cutProgress ,videoCurr,dialog,alertDialog,
      currtype,clipType, videoCover,currTimeLeft,alertMsg,downloadUrl,
      rotateType,returnType,cancelExport,loacalTips
    } = this.state;
    var is_ZH = language === CONST.LANGUAGE.ZH ? true : false
    return (
      <div className='CutPage-box' style={cutStatus===1?{marginBottom:'380px'}:{marginBottom:'260px'}}>
        <div className='cutPage-inner'>
          {/*<div className='cutPage-title clearfix'>*/}
            {/*<div className='cutLeft'>*/}
              {/*<p></p>*/}
              {/*<div>*/}
                {/*<h3>喜剪</h3>*/}
                {/*<p>随时随地创作/编辑视频从未如此方便</p>*/}
              {/*</div>*/}
            {/*</div>*/}
            {/*<div className='cutRight'>*/}
              {/*/!*<a>*!/*/}
                {/*/!*<h3>一站式视频包装神器</h3>*!/*/}
                {/*/!*<p className='line'></p>*!/*/}
                {/*/!*<p>高画质/无水印/云端存储</p>*!/*/}
              {/*/!*</a>*!/*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*{*/}
            {/*loacalTips? <div className='loacal-tips'>*/}
              {/*<p className='loading-tips'> </p>*/}
              {/*<p>{window.intl.get('正在帮你优化视频...')}</p>*/}
            {/*</div>:""*/}
          {/*}*/}

          <div className='cutMain'>

            <div className='video-box'>
              <div className='videoInner' style={this.getClipDiv(2)}>
                <video
                  ref='video'
                  controls={false}
                  // style={this.getClipDiv(1)}
                  src={currUrl}>
                </video>

                {/**裁剪**/}
                <div className={currtype===2&&cutStatus===1?'clip-box':"clip-box notchoose"} style={this.getClipDiv(1)}>
                  <div className='clip-left' style={this.setStyle(1)}><p> </p></div>
                  <div className='clip-top' style={this.setStyle(2)}> </div>
                  <div className='clip-right' style={this.setStyle(3)}><p> </p></div>
                  <div className='clip-bottom' style={this.setStyle(4)}> </div>
                  <div className='clip-center'
                       onMouseDown={ cutStatus ===1 ? this.centerBoxDown:this.mouseUp}
                       style={this.setStyle(5)}>
                    {currtype===2&&cutStatus===1 ?<Fragment>
                        <p className='top-line'> </p>
                        <p className='right-line'> </p>
                        <p className='bottom-line'> </p>
                        <p className='left-line' > </p>
                        <div className='rightDown-btn' onMouseDown={ cutStatus ===1 ? this.rightDownDown : this.mouseUp}> </div>
                        <div className='rightTop-btn' onMouseDown={ cutStatus ===1 ? this.rightTopDown :this.mouseUp}> </div>
                        <div className='leftTop-btn' onMouseDown={ cutStatus ===1 ? this.LeftTopDown :this.mouseUp}> </div>
                        <div className='leftBottom-btn' onMouseDown={ cutStatus ===1 ? this.LeftBottomDown :this.mouseUp}> </div>
                      </Fragment>:
                      ''}
                  </div>
                </div>
              </div>

              {videoPause ?
              < button className='play_video_btn'
                onClick={this.play_video}
                >播放</button>
                :
                <button
                  className='pause_video_btn'
                  onClick={this.pause_video}
                >暂停</button>
              }
              <p className='cutTimeLen'>{window.intl.get("时长")}：{Tool.timeModel_zhen(currEnd-currStart)}</p>
            </div>
            <div className='shadow-box'></div>
            { cutStatus === 1 ?
              <Fragment>
                {/**--视频处理---***/}
                <div className='edit-box'>
                  {/***--裁剪--***/}
                  <div className='cutVideo-box'
                       style={
                         {
                           display:currtype ===1 ? '' : 'none',
                         }
                       }>
                    <ul className='cutVideoBg'>
                      {
                        videoCover.map((item,index)=>{
                          return <li key={'cutVideo'+index} style={
                            {
                              background:`url(${item.img_url}) no-repeat center / contain`
                            }
                          }>></li>
                        })
                      }
                    </ul>
                    <p className='mark-left' style={{right: 724 - cutLeft + 'px'}}> </p>
                    <p className='mark-curr' onMouseDown={this.mainMove}
                       style={{left: cutLeft, right: 724 - cutRight + 'px'}}> </p>
                    <p className='mark-right' style={{left: cutRight + 'px'}}> </p>
                    <p className='timeLine' style={timeLinemove?{left:currTimeLeft}:{left:currTimeLeft,transition:'all 0.25s'}}>
                      <span>{Tool.timeModel_zhen(videoCurr-currStart>0?videoCurr-currStart:0)}</span>
                    </p>
                    <div
                      className='leftControl'
                      style={{left: cutLeft - 15, zIndex: leftzIndex}}
                      onMouseDown={this.left_mouseDown}
                    >
                      <p>{Tool.timeModel_zhen(currStart)}</p>
                    </div>
                    <div
                      onMouseDown={this.right_mouseDown}
                      style={{left: cutRight - 15, zIndex: rightzIndex}}
                      className='rightControl'>
                      <p>{Tool.timeModel_zhen(currEnd)}</p>
                    </div>
                  </div>
                  {/****--切割--****/}
                  <div className='clip-size-box' style={{display:currtype ===2 ? '' : 'none'}}>
                    <ul className={is_ZH?'clip-size ':'clip-size isEnglish'}>
                      <li className={clipType===1?"active":''} onClick={this.changeClipType.bind(this,1)}>{window.intl.get('自由')}</li>
                      <li className={clipType===2?"active":''} onClick={this.changeClipType.bind(this,2)}>{window.intl.get('1:1 正方形')}</li>
                      <li className={clipType===3?"active":''} onClick={this.changeClipType.bind(this,3)}>{window.intl.get('4:3 经典电视')}</li>
                      <li className={clipType===4?"active":''} onClick={this.changeClipType.bind(this,4)}>{window.intl.get('16:9 宽屏幕')}</li>
                      <li className={clipType===5?"active":''} onClick={this.changeClipType.bind(this,5)}>{window.intl.get('21:9 银幕')}</li>
                    </ul>
                  </div>
                  {/***--旋转--***/}
                  {/*<div className='rotate-box' style={{display:currtype ===3 ? '' : 'none'}}>*/}
                    {/*<ul >*/}
                      {/*<li className={rotateType===2?'active':""} onClick={this.changeRotateType.bind(this,2)}>180°</li>*/}
                      {/*<li className={rotateType===1?'active':""} onClick={this.changeRotateType.bind(this,1)}>{window.intl.get('顺时针90°')}</li>*/}
                      {/*<li className={rotateType===3?'active':""} onClick={this.changeRotateType.bind(this,3)}>{window.intl.get('逆时针90°')}</li>*/}
                      {/*<li onClick={this.changeRotateType.bind(this,0)}>默认</li>*/}
                    {/*</ul>*/}
                  {/*</div>*/}
                  {/*/!***--翻转--***!/*/}
                  {/*<div className='return-box' style={{display:currtype ===4 ? '' : 'none'}}>*/}
                    {/*<ul>*/}
                      {/*<li className={returnType===1?'active':""}  onClick={this.changeReturnType.bind(this,1)}>垂直翻转</li>*/}
                      {/*<li className={returnType===0?'active':""} onClick={this.changeReturnType.bind(this,0)}>水平翻转</li>*/}
                      {/*<li onClick={this.changeReturnType.bind(this,-1)}>默认</li>*/}
                    {/*</ul>*/}
                  {/*</div>*/}
                </div>
                {/**---工具栏---**/}
                <div className='control-box'>
                  <ul>
                    <li className={currtype===1?'cutBox-btn active':'cutBox-btn'} onClick={this.changeType.bind(this,1)}>cut</li>
                    <li className={currtype===2 ? 'clipBox-btn active':'clipBox-btn'} onClick={this.changeType.bind(this,2)}>clip</li>
                    {/*<li className={currtype===3 ? 'rotateZ-btn active':'rotateZ-btn'} onClick={this.changeType.bind(this,3)}>rotateZ</li>*/}
                    {/*<li className={currtype===4 ? 'rotateXY-btn active':'rotateXY-btn'} onClick={this.changeType.bind(this,4)}>rotateXY</li>*/}
                    <li className='delect-btn' onClick={this.openDetail}>delect</li>
                  </ul>
                </div>
                {/**---保存---**/}
                <div className='save-box'>
                  <div className='format-box'>
                    <p><span>{currFormat}</span></p>
                    <ul>
                      {formatList.map((item, index) => {
                        return <li className={currFormat === item ? 'active' : ''}
                                   onClick={this.changeFormat.bind(this, item)}
                                   key={'format' + index}>{item}</li>
                      })}
                    </ul>
                  </div>
                  <div className='power-box'>
                    <p><span>{currpower}</span></p>
                    <ul>
                      {powerList.map((item, index) => {
                        return <li className={currpower === item ? 'active' : ''}
                                   onClick={this.changePower.bind(this, item)}
                                   key={'powerList' + index}>{item}</li>
                      })}
                    </ul>
                  </div>
                  <button className='save-btn' onClick={this.saveVideo}>{window.intl.get('处 理')}</button>
                </div>
              </Fragment>
              : cutStatus === 2 ?
              <div className='transing-box clearfix'>
                <p>{window.intl.get("处理中...")}</p>
                <div className='transing-out'>
                  <p className='transing-inner'
                     style={{width:cutProgress*10+'px'}}
                  > </p>
                </div>
                <button onClick={()=>this.setState({cancelExport:true})}>{window.intl.get('取 消')}</button>
              </div>
                :
              <div className='download-box'>
                <a onClick={this.downloadVideo}>{window.intl.get('下 载')}</a>
                <button onClick={this.otherVideo}>{window.intl.get('编辑另一个视频')}</button>
              </div>
            }
          </div>
        </div>
        {alertDialog?
          <Alert
            cancelCallBack={this.IseeIt}
            msg={alertMsg}
          />
          :''
        }
        {
          cancelExport?
            <Comfirm
              okCallBack={this.cancelExport}
              cancelCallBack={()=>this.setState({cancelExport:false})}
              msg={window.intl.get('是否取消视频导出')}
            />
            :""
        }
        {dialog ?
        <Comfirm
          okCallBack={this.delectVideo}
          cancelCallBack={this.cancelDetail}
          msg={dialogMsg}
        />
          :''}
      </div>
    );
  }
}

export default CutPage;
