/* eslint-disable */
import React, {Component,Fragment} from 'react';
// import $ from 'jquery';
import {withRouter} from 'react-router-dom';
import './index.scss';
import Tool from '@/utils/tool';
import  SortableItem from './Item/index';
import httpRequest from '@/utils/httpRequest';
import Upload from '@/components/Upload/index';
import transCode  from  '@/utils/transCode';
import api from "@/API/api";
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
import messageBox from '@/utils/messageBox';
import Comfirm from '@/components/Comfirm/index';

const $ = window.jQuery;
@connect(
  state => ({admin: state.admin}),
  {login}
)
class Splicing extends Component {
  constructor (props) {
    super(props);
    this.state={
      dataLists:[],//数据列表
      isVip:false,//是否是VIP
      currIndex:0,//当前获取媒体信息的值
      progress:0,//上传进度
      status:false,//上传状态
      timeLine:5,//时间线的位置
      changeVideo:0,//转场效果 0 无  1 淡入淡出  2 擦除  3 渐变  4 圆圈
      currVideo:0,//当前视频序号
      videoPlay:false,//视频是否在播放
      showTips:false,
      localVideoSrc:[],//本地视频
      showOptimize:true,//是否显示视频加载的图
      handleStatus:1,//当前处理状态
      formatList:['MP4'],//支持导出的格式
      powerList:[window.intl.get('不变'),'1080p','720p','480p','360p','240p'],//支持导出的分辨率
      fenbian : ['16:9','1:1','4:3','9:16'],
      currfenbian:0,
      currFormat:'MP4',//当前导出视频格式
      currpower:window.intl.get('不变'),//当前导出视频分辨率
      isShowWater:true,
      lastProgress:0,//上一次进度
      md5List:[],//转码md5List
      outPutLink:'',
      addWarter:false,//是否在加水印
      outPutMd5:'',
      contactProgress:0,
      showComfirm:false,
      ComfirmMsg:'',
      epStatus:false,//是否可以导出
      outWidth:0,
      outHeight:0,
      downLoadUrl:"",//下载链接
    };
    this.canvas=null;
    this.cw = 740;
    this.ch = 415;
    this.t = null;
    this.video=null;
    this.isplay = false;//视频是否在播放
    this.videoWidth=1280;//导出视频宽
    this.trans=null
  }
  componentWillMount() {
    this.getVideoInfo();
    this.setState({
      isVip : this.props.admin.isMuliVip
    });
    if(!window.localStorage.getItem('showSplicingTips')){
      window.localStorage.setItem('showSplicingTips','xiVideo');
      this.setState({
        showTips:true
      })
    }
  }
  componentDidMount() {
  }

  /**获取媒体信息**/
  getVideoInfo=()=>{
    const {dataList} = this.props;
    let {currIndex,dataLists} = this.state;
    httpRequest({
      url:api.qureyMeidiaInfo,
      data:{
        MD5:dataList[currIndex].md5
      }
    }).done(res=>{
      dataLists.push(Object.assign(res, dataList[currIndex]));
      this.blob_load(dataList[currIndex].link);
      this.setState({
        dataLists
      });
      if (currIndex < dataList.length-1){
        currIndex++;
        this.setState({
          currIndex
        },()=>{
          this.getVideoInfo()
        })
      }
    }).fail(()=>{
      if (currIndex < dataList.length-1){
        currIndex++;
        this.setState({
          currIndex
        },()=>{
          this.getVideoInfo()
        })
      }
    })
  };
  /**拖动排序***/
  onSortItems=(dataList)=>{
    this.setState({
      dataList,
      videoPlay:false
    },()=>{
      this.pauseVideo();
      this.setState({
        timeLine:5,
        currVideo:0,
      });
    })
  };
  /**删除视频**/
  delVideo = (index) =>{
    let {dataLists} = this.state;
    dataLists.splice(index,1);
    this.setState({
      dataLists,
      timeLine:5,
      videoPlay:false
    });
    this.pauseVideo();
  };
  /**时间转换成长度**/
  time_to_length=(time)=>{
    const {dataLists,currVideo} = this.state;
    let currVideoTime=dataLists[currVideo].duration;
    return time / currVideoTime * 230
  };
  length_to_time=(length)=>{
    const {dataLists,currVideo} = this.state;
    let currVideoTime=dataLists[currVideo].duration;
    return length / 230 * currVideoTime
  };
  /**所有视频暂停**/
  pauseVideo=()=>{
    const {dataLists} = this.state;
    let length = dataLists.length;
    for (let i =0 ; i<length ; i++){
      this.refs['video'+i].pause();
    }
    this.isplay = false;
    clearInterval(this.t);
  }
  /**获取所有视频总时间**/
  getTotalTime=()=>{
    const {dataLists} = this.state;
    let count = 0;
    for (let i = 0;i<dataLists.length ;i++){
      count = count + dataLists[i].duration*1
    }
    return Tool.timeModel_zhen(count)
  };
  /****---------文件上传------------*****/
  getVideoUrl=(md5,val,token,callBack)=>{
    httpRequest({
      url:api.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      callBack(md5,val,res,token)
    }).fail(()=>{
      this.setState({
        status:false,
        alertDialog:true,
        alertMsg : window.intl.get('获取视频链接失败！')
      });
    })
  };
  getVideoSingleInfo=(md5,name,link,token)=>{
    const {dataLists} = this.state;
    httpRequest({
      url:api.qureyMeidiaInfo,
      data:{
        MD5:md5
      }
    }).done(res=>{
      dataLists.push(Object.assign(res, {link,name,md5,token:token}));
      this.setState({
        dataLists,
        status:false
      })
    }).fail(()=>{
      this.setState({
        status:false
      })
    })
  };
  uploadChange=()=>{
    this.setState({
      status:true
    })
  };
  uploadProgress=(progress)=>{
    // console.log(progress)
    this.setState({
      progress,
      status:true
    })
  };
  uploadSuccess=(name,d,md5,token)=>{
    this.uploadBack(token)
    let _this = this;
    /**判断是否需要转码**/
    let format =name.slice(name.lastIndexOf('.')+1);
    if (format==='mp4'){
      _this.getVideoUrl(md5,name,token,this.getVideoSingleInfo);
    } else{
      /**开始转码***/
      transCode({
        transOptions:{
          inFileName:name,
          inFileMd5:md5
        },
        transSuccess:(res)=>{
          this.getVideoSingleInfo(md5,name,res,token)
        },
        transFail: ()=>{
          this.setState({
            status:false
          })
        },
        transProgress:(progress)=>{
          this.setState({
            progress
          })
        }
      })
    }
  };
  timeOut=()=>{
    this.setState({
      status:false
    })
  };
  /**时间线鼠标按下**/
  timeLineDown=(e)=>{
    const {timeLine} = this.state;
    this.pauseVideo();
    this.setState({
      videoPlay:false
    });
    Tool.addEventHandler(document.body, 'mousemove', this.timeLineMove);
    Tool.addEventHandler(document.body, 'mouseup', this.mouseUp);
    this.timeLineLeft = e.pageX;
    this.initLeft=timeLine;
  };
  timeLineMove=(e)=>{
    let _this = this;
    const {dataLists} = this.state;
    let maxLength=dataLists.length*246+20;
    let timeLine = e.pageX-this.timeLineLeft+this.initLeft;
    for (let i = 0;i<dataLists.length;i++){
      if ((timeLine-5) > i*246-16 && (timeLine-5)<i*246) {
          // console.log(timeLine);
        timeLine = i*246 + 5
      }
    }
    if (timeLine<=5){
      timeLine=5
    }else if(timeLine>=maxLength){
      timeLine = maxLength-28;
    }
    this.setState({
      timeLine : timeLine
    },()=>{
      const {timeLine} = _this.state;
      let currIndex = parseInt((timeLine-5) / 246);
      let currTime = (timeLine-5) % 246;
      this.setState({
        currVideo:currIndex
      },()=>{
        const {currVideo} = this.state;
        if (!dataLists[currVideo]){
          return
        }
        let w = dataLists[currVideo].width||_this.cw;
        let h = dataLists[currVideo].height||_this.ch;
        let {nw, nh} = _this.initVideoPosition(w,h);
        _this.video = this.refs['video'+currVideo];
        if (!_this.video){
          return
        }
        _this.refs.allvideo.style.zIndex=2;
        _this.video.style.width = nw + 'px';
        _this.video.style.height = nh + 'px';
        _this.refs.canvas.style.visibility = 'hidden';
        _this.video.style.visibility = 'visible';
        _this.video.style.zIndex = 1;
        $(_this.video).siblings('video').css({zIndex:-1,visibility:'hidden'});
        _this.video.currentTime = _this.length_to_time(currTime);
      });
    })
  };
  mouseUp=(e)=>{
    Tool.removeEventHandler(document.body, 'mousemove', this.timeLineMove);
    Tool.removeEventHandler(document.body, 'mouseup', this.mouseUp);
  };
  /**------------------**/
  /**转场**/
  showVip=()=>{

  };
  changeEffect=(val)=>{
    this.setState({
      changeVideo:val
    })
  };

  /**视频加载到本地**/
  blob_load = (src) => {
    let {currIndex ,dataLists} = this.state;
    var _this = this;
    this.req = new XMLHttpRequest();
    this.req.open('GET', src, true);
    this.req.responseType = 'blob';
    this.req.onload = function (e) {
      if (this.status === 200) {
        const videoBlob = this.response;
        const blobSrc = URL.createObjectURL(videoBlob); // IE10+
        Object.assign(dataLists[currIndex],{blobLink:blobSrc});
        _this.setState({
          dataLists
        })
        if (currIndex===_this.props.dataList.length-1||0){
          _this.setState({
            showOptimize:false
          })
        }
      }
    };
    this.req.onerror = function () {
      // Error
    };
    this.req.send();
    this.req.onprogress = function (e) {
      // let {currIndex,dataLists} = _this.state;

    }
  };
  /**视频画布位置***/
  initVideoPosition=(w, h)=>{
    let nw = w , nh= h ;
    if (w>this.cw){
      if (this.cw/w*h>this.ch) {
        nh = this.ch ;
        nw = this.ch/h *w
      }else {
        nh = this.cw/w * h;
        nw = this.cw
      }
    }else{
      if (h>this.ch) {
        nw = this.ch / h * w;
        nh = this.ch
      }
    }
    return {nw,nh}
  };
  /**初始canvas**/
  initCanvas=()=>{
    const {dataLists , currVideo ,timeLine} = this.state;
    let _this =this;
    if (!_this.video){
      return
    }
    _this.canvas = this.refs.canvas;
    let w = dataLists[currVideo].width||_this.cw;
    let h = dataLists[currVideo].height||_this.ch;
    let {nw, nh} = _this.initVideoPosition(w,h);
    _this.ctx = _this.canvas.getContext('2d');
    _this.ctx.fillStyle="#000000";
    _this.ctx.beginPath();
    _this.ctx.fillRect(0,0,_this.cw,_this.ch);
    _this.ctx.closePath();
    _this.video.addEventListener('pause',function(){
      _this.isplay = false;
      clearInterval(_this.t);
    });
    _this.video.addEventListener('play', function() {
      if (_this.isplay){
        return
      }
      _this.isplay = true;
      _this.t = setInterval(function() {
        _this.ctx.drawImage(_this.video, (_this.cw - nw)/2, (_this.ch - nh)/2, nw, nh);
        let currTime = _this.video.currentTime;
        let timeLeft = _this.time_to_length(currTime) + currVideo*246 + 5 ;
        // console.log(currTime)
        _this.setState({
          timeLine:timeLeft
        });
        // console.log(timeLeft)
        if(_this.video.ended){
          // console.log(currVideo,'123')
          if (currVideo+1 < dataLists.length) {
            _this.setState({
              currVideo:currVideo+1,
              timeLine : (currVideo+1)*246+5
            },()=>{
              _this.videoPlay();
            })
          }else {
            _this.isplay = false;
            clearInterval(_this.t);
            _this.setState({
              timeLine:5,
              currVideo:0,
            });
            _this.videoPuase()
          }
        }
      }, 10);
    }, false);
  };

  /**视频暂停**/
  videoPuase=()=>{
    let _this = this;
    this.setState({
      videoPlay:false
    });
    clearInterval(_this.t);
    _this.isplay = false;
    _this.pauseVideo();
  };
  /**视频播放**/
  videoPlay=()=>{
    let _this = this;
    _this.pauseVideo();
    _this.refs.allvideo.style.zIndex=-1;
    _this.refs.canvas.style.visibility = 'visible';

    const {timeLine} = this.state;
    let currIndex = parseInt((timeLine-5) / 246);
    let currTime = (timeLine-5) % 246;
    this.setState({
      currVideo:currIndex
    },()=>{
      const {currVideo} = this.state;
      _this.video = this.refs['video'+currVideo];
      if (!_this.video){
        return
      }
      _this.video.currentTime = _this.length_to_time(currTime);
      this.initCanvas();
      _this.video.play();
      this.setState({
        videoPlay:true
      })
    });
  }
  /****/

  /*******--------视频保存---------********/
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
  changefenbian=(index)=>{
    this.setState({
      currfenbian:index
    })
  };
  splicingVideo=()=>{
    const {dataLists,currfenbian} = this.state;
    if (!dataLists){
      return
    }
    let outWidth=0, outHeight = 0 ,data = [];
    if (currfenbian===0){
      outHeight =this.videoWidth*9/16;
      outWidth = this.videoWidth;
    }else if (currfenbian===1) {
      outHeight = this.videoWidth;
      outWidth = this.videoWidth;
    }else if (currfenbian===2){
      outHeight = this.videoWidth*3/4;
      outWidth = this.videoWidth;
    } else if (currfenbian===3) {
      outHeight = this.videoWidth;
      outWidth = this.videoWidth*9/16;
    }
    for (let i in dataLists){
      data.push({
        "inFileMd5":dataLists[i].md5,
        "token":dataLists[i].token,
        "outWidth":outWidth+'',
        "outHeight":outHeight+'',
        "outChannel":"2",
        "outSampleRate":"48000",
      })
    }
    this.setState({
      epStatus:true,
      outWidth:outWidth,
      outHeight:outHeight
    },()=>{
      this.transCodeAll(data)
    })
  };
  /**转码所有视频**/
  transCodeAll=(data)=>{
    let dataStr = JSON.stringify(data);
    this.setState({
      handleStatus:2
    });
    $.ajax({
      type:'GET',
      url:api.VideoConcat,
      data:{
        t_json:dataStr
      }
    }).done(res=>{
      if (res){
        this.setState({
          md5List:res
        },()=>{
          this.getTransStatus();
        })
      }else{
        messageBox(window.intl.get('拼接视频失败，请重试！'));
      }
    }).fail(res=>{
      messageBox(window.intl.get('内部服务器错误！'));
    })
  };
  /**获取转码进度***/
  getTransStatus=()=>{
    let _this = this;
    let t = setInterval(()=>{
      const {md5List,lastProgress,epStatus,isVip} = this.state;
      if (!epStatus){
        clearInterval(t);
        return
      }
      $.ajax({
        type:'GET',
        url:api.VideoConcatStatus,
        data:{
          lastProgress:lastProgress,
          md5_array:md5List
        }
      }).done(res=>{
        if (res){
          if (res*1<=100) {
            _this.setState({
              lastProgress:res,
              contactProgress:res*1
            })
          }else {
            // console.log(isVip,'isVip')
            _this.setState({
              outPutMd5:res
            },()=>{
              // const {isVip} = this.state;
              // console.log(isVip,'isVip222')
              // if (isVip){
                this.getTransUrl();
              // } else {
              //   this.addWaterPng();
              // }
            });
            clearInterval(t)
          }
        }else{
          messageBox(window.intl.get('拼接视频失败，请重试！'));
          clearInterval(t)
        }
      }).fail(res=>{
        messageBox(window.intl.get('内部服务器错误！'));
        clearInterval(t)
      })
    },1000)
  };
  getTransUrl=()=>{
    const {outPutMd5,epStatus} = this.state;
    if (!epStatus){
      return
    }
    $.ajax({
      type:'GET',
      url:api.GetConcatOutPath,
      data:{
        MD5:outPutMd5
      }
    }).done(res=>{
      if (res){
        // console.log(res,'拼接成功地址')
        this.setState({
          outPutLink:res,
          handleStatus:3,
          isShowWater:true
        },()=>{
          // this.getDownload();
        })
      } else {
        messageBox(window.intl.get('拼接视频失败，请重试！'))
      }
    }).fail(res=>{
      messageBox(window.intl.get('内部服务器错误！'));
    });
  };
  /**加水印**/
  addWaterPng=()=>{
    const {outPutMd5,outWidth,outHeight} = this.state;
    this.setState({
      contactProgress:0,
      addWarter:true
    });
    let data={
      inFileMd5:outPutMd5,
      outWidth:outWidth,
      outHeight:outHeight,
      layer:[
        {
          img_url:"https://foundao.enjoycut.com/data/default/enjoycut_watermark.png",
          width:"188",   // 压条的目标宽高
          height:"28",
          x:outWidth-196, // 坐标
          y:outHeight-34
        }
      ],
    }
    this.trans = transCode({
      transOptions:data,
      transSuccess:(val)=>{
        this.setState({
          outPutLink:val,
          handleStatus:3,
          isShowWater:true
        },()=>{
          // this.getDownload();
        })
      },
      transFail: (val)=>{
        messageBox(val)
      },
      transProgress:(val)=>{
        this.setState({
          contactProgress:val*1
        })
      }
    })
  };
  /**下载视频**/
  getDownload = ()=>{
    const {outPutLink,dataLists} = this.state;
    // const newWin = window.open();
    window.gtag&& window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'})
    let tokenlist=[];
    for (let i in dataLists){
      if (dataLists[i].token){
        tokenlist.push(dataLists[i].token)
      }
    }
    httpRequest({
      url : api.downloadVideo,
      dataType : 'json',
      type : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      data : {
        path : outPutLink,
        trans_type:2,
        up_token:tokenlist
      }
    }).done((res)=>{
      if(res.code /1 === 0){
        // newWin.location.href = res.data;
        window.location.href=res.data;
        this.setState({
          downLoadUrl: res.data
        })
        setTimeout(function () {
          // newWin.close()
        },4000)
      }else {
        // newWin.close()
      }
    }).fail(()=>{
      // newWin.close()
    })
  };
  closeWater=()=>{
    // console.log(123)
    this.setState({
      isShowWater:false
    })
  }
  /***成为Vip***/
  gotoMuliVip=()=>{
    this.props.history.push('/mulipay/muli');
  };
  /**取消合成***/
  cancalHandel=()=>{
    this.trans.stopTransCode();
    this.setState({
      handleStatus:1,
      addWarter:false,
      contactProgress:0,
      epStatus:false
    })
  };
  /***编辑另一个视频***/
  editOtherVideo=()=>{
    this.setState({
      showComfirm:true,
      ComfirmMsg:window.intl.get('开始编辑新的视频，请确认当前视频已保存！'),
    })
  };
  editOter=()=>{
    this.returnPage();
  };
  /**回到拼接首页**/
  returnPage=()=>{
    this.props.returnPage()
  };

  /***切换当前视频***/
  changeCurrVideo=(index)=>{
    // console.log(index)
    this.pauseVideo();
    let timeLine = 246*index + 5;
    this.setState({
      currVideo:index,
      timeLine,
      videoPlay:false
    })
  };
  /**上传成功后回调(埋点统计)**/
  uploadBack=(uptoken)=>{
    httpRequest({
      url:api.up_end,
      type:'POST',
      data:{
        trans_type:2,
        up_token:uptoken
      }
    }).done(res=>{}).fail(()=>{})
  }
  render() {
    const { isVip,dataLists ,status ,progress,timeLine ,videoPlay,showTips,currFormat,currpower,formatList,powerList,
      changeVideo ,showOptimize , handleStatus,currVideo,isShowWater,fenbian,currfenbian,contactProgress,showComfirm,
      ComfirmMsg , addWarter ,downLoadUrl
    } = this.state;
    // console.log(dataLists)
    return (
      <div className='splicing-box'>
        <div className='splicing-inner'>
          <div className='pagename'>
            <h2>{window.intl.get('喜拼接')}</h2>
            <h3>{window.intl.get('随时随地创作/编辑视频从未如此方便')}</h3>
          </div>
          <div className='pagegovip' onClick={this.gotoMuliVip}>
            <p>{window.intl.get('即刻了解喜+会员')}</p>
            <div className='line'> </div>
            <p>{window.intl.get('更多权益 等待你解锁')}</p>
          </div>
          <div className='splicing-main'>
            <div className='video-box'>
              {
                handleStatus===3&&!isVip&&isShowWater?
                  <div className='removeLogo_tips'>
                    <p>{window.intl.get('成为喜+会员，您可以解锁专享服务，轻松去水印')}</p>
                    <div className='remove_logo_right'>
                      <button onClick={this.gotoMuliVip}>{window.intl.get('去水印')}</button>
                      <div className='close_removeLogo' onClick={this.closeWater}> </div>
                    </div>
                  </div>
                  :''
              }
              <canvas width={this.cw} height={this.ch} ref="canvas" id='videoCanvas'> </canvas>
              <div className='allvideo' ref='allvideo'>
                {
                  dataLists.map((item,index)=>{
                    return <video src={item.blobLink||item.link} controls={false} ref={'video'+index} key ={item.md5+index}> </video>
                  })
                }
              </div>
              <div className='videoControlBtn'>
                {videoPlay ?
                  <button className='puasebtn' onClick={this.videoPuase}> </button>
                  :
                  <button className='playbtn' onClick={this.videoPlay}> </button>
                }
              </div>
              {
                handleStatus===3 && isVip===false?
                  <p className='water_logo'> </p>
                  :
                  <p className='totalTime'>{this.getTotalTime()}</p>
              }
            </div>
            {handleStatus===1?
            <Fragment>
              <div className='control-box'>
                <div className='control-inner'>
                  <div className='scroll-box' ref='scroll'>
                    <div className='scroll-inner' style={{width:246*dataLists.length+250+'px'}}>
                      {dataLists.map((item,i)=>{
                        return <SortableItem key={'videoItem'+i}
                                             data={item}
                                             index={i}
                                             onSortItems={this.onSortItems}
                                             items={dataLists} sortId={i}>
                          <span className='closeItem' onClick={this.delVideo.bind(this,i)}> </span>
                          <ul>
                            {item.video_cover_imgurl.map((bgitem,bgindex)=>{
                              return <li key={'bg'+bgindex} className='successItem' style={{background:`url(${bgitem.img_url}) no-repeat center / cover`}}> </li>
                            })}
                          </ul>
                          <div className='videoItem-info'>
                            <p>{Tool.timeModel_zhen(item.duration)}</p>
                          </div>
                          <div className={currVideo===i?'itemLine active':'itemLine'} onClick={this.changeCurrVideo.bind(this,i)}> </div>
                        </SortableItem>
                      })}
                      { isVip && dataLists.length<10 || !isVip && dataLists.length < 5?
                        <div className='upload-item'>
                          <div style={{display:status?'none':'block'}}>
                            <Upload
                              accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                              project='muliSplicing'
                              className='muli'
                              onChange={this.uploadChange}
                              autoUpload={true}
                              onProgress={this.uploadProgress}
                              onSuccess={this.uploadSuccess}
                              onTimeOut = {this.timeOut}
                            >
                              <p className='upload-tips' onClick={()=>{/*window.gtag&& window.gtag('event', 'click', {'event_category': 'upload','event_label': 'video'})*/}}><span>+</span>{isVip ? window.intl.get("最多支持十个视频") : window.intl.get("最多支持五个视频")}</p>
                            </Upload>
                          </div>

                          {
                            status?
                              <Fragment>
                                <p className='progress-number'>{progress}%</p>
                                <p className='progress-bar' style={{width:progress*230/100+'px'}}> </p>
                              </Fragment>
                              :''
                          }
                        </div>
                        : ""
                      }

                      {
                        dataLists.length<1?'':
                          <p className='timeLine' style={{left:timeLine+'px'}} onMouseDown={this.timeLineDown}> </p>
                      }
                    </div>
                  </div>
                </div>

              </div>
              {/*<div className='effct-box'>*/}
              {/*<ul>*/}
              {/*<li className={changeVideo===0?'active':'0'} onClick={this.changeEffect.bind(this,0)}>{window.intl.get('无')}</li>*/}
              {/*<li className={changeVideo===1?'active':'0'} onClick={this.changeEffect.bind(this,1)}>{window.intl.get('淡入淡出')}</li>*/}
              {/*<li className={isVip?(changeVideo===2?'active':'0'):'notVip'} onClick={isVip?this.changeEffect.bind(this,2):this.showVip}>{window.intl.get('擦除')}</li>*/}
              {/*<li className={isVip?(changeVideo===3?'active':'0'):'notVip'} onClick={isVip?this.changeEffect.bind(this,3):this.showVip}>{window.intl.get('渐变')}</li>*/}
              {/*<li className={isVip?(changeVideo===4?'active':'0'):'notVip'} onClick={isVip?this.changeEffect.bind(this,4):this.showVip}>{window.intl.get('圆圈')}</li>*/}
              {/*</ul>*/}
              {/*</div>*/}
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
                {/*<div className='power-box'>*/}
                  {/*<p><span>{currpower}</span></p>*/}
                  {/*<ul>*/}
                    {/*{powerList.map((item, index) => {*/}
                      {/*return <li className={currpower === item ? 'active' : ''}*/}
                                 {/*onClick={this.changePower.bind(this, item)}*/}
                                 {/*key={'powerList' + index}>{item}</li>*/}
                    {/*})}*/}
                  {/*</ul>*/}
                {/*</div>*/}
                <div className='power-box'>
                  <p><span>{fenbian[currfenbian]}</span></p>
                  <ul>
                    {fenbian.map((item, index) => {
                      return <li className={fenbian[currfenbian] === item ? 'active' : ''}
                                 onClick={this.changefenbian.bind(this, index)}
                                 key={'fenbian' + index}>{item}</li>
                    })}
                  </ul>
                </div>
                <button className='save-btn' onClick={this.splicingVideo}>{window.intl.get('合 并')}</button>
              </div>
            </Fragment>
            :handleStatus===2?
            <div className='trans_progress'>
              <p>{addWarter?"拼接中":"处理中"}</p>
              <div className='progress-out'>
                <div className='progress-inner' style={{width:contactProgress+'%'}}> </div>
              </div>
              <button onClick={this.cancalHandel}>{window.intl.get('取 消')}</button>
            </div>
                :
            <div className='download-box'>
              <a onClick={this.getDownload} className='download_btn'>{window.intl.get('下 载')}</a>
              <button className='editOther' onClick={this.editOtherVideo}>{window.intl.get('编辑另一个视频')}</button>
            </div>
            }
            {
              showOptimize?
                <div className='optimizeTips'>
                  <div className='loading-img'> </div>
                  <p>{window.intl.get('我们正在帮您优化视频，达到更流畅的播放效果')}</p>
                </div> :''
            }

          </div>
        </div>
        {showTips? <div className='splicing-tips' onClick={()=>{this.setState({showTips:false})}}> </div> : ""}
        {showComfirm ?
          <Comfirm
            okCallBack={this.editOter}
            cancelCallBack={()=>this.setState({showComfirm:false})}
            msg={ComfirmMsg}
          />:''}
      </div>
    );
  }
}

export default withRouter(Splicing);
