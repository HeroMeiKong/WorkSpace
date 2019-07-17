/* eslint-disable */
import React, {Component , Fragment} from 'react';
import httpRequest from  '@/utils/httpRequest';
import {Link} from 'react-router-dom';
import Upload from '@/components/Upload/index';
import Alert from '@/components/Alert/index';
import './index.scss';
import transCode  from  '@/utils/transCode';
import api from  '@/API/api';
import {Message} from "element-react";
import muliword from '@/assets/images/muliword.png';
import muliWord_en from '@/assets/images/enjoymerge.png'
import {connect} from 'react-redux';
import CONST from "../../../config/const";
@connect(
  state => ({admin: state.admin}),
)
class PreMuli extends Component {
  constructor (props) {
    super(props);
    this.state={
      uploadProgress:0,//当前上传进度
      isUploading:false,//是否在上传中
      isTransCoding:false,//是否是在转码
      currUrl:'',
      haveVideo:false,//上传还未转码
      alertDialog:false,
      alertMsg:'',
    }
  }
  /**当前进度换算成长度**/
  uploadChange=(val)=>{
    if (val.size/1024/1024>100){
      this.setState({
        haveVideo:false,
      })
    } else {
      this.setState({
        haveVideo:true,
      })
    }
  };
  cancelAlert=()=>{
    this.setState({
      alertDialog:false
    })
  }
  /**获取视频链接**/
  getVideoUrl=(md5,val,token)=>{
    httpRequest({
      url:api.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      this.props.uploadSuccess(res,val,md5,token);
    }).fail(()=>{
      this.setState({
        alertDialog:true,
        alertMsg : window.intl.get('获取视频链接失败！')
      })
    })
  }
  uploadProgress=(val)=>{
    if (val*1===100){
      this.setState({
        haveVideo:false,
      });
      return
    }
    this.setState({
      isUploading:true,
      uploadProgress:val*1
    })
  };

  uploadSuccess=(val , dd , md5,token)=>{
    this.uploadBack(token)
    let _this = this;
    this.setState({
      currVideo:val,
      currMd5:md5,
      currToken:token
    });
    /**判断是否需要转码**/
    let format =val.slice(val.lastIndexOf('.')+1);
    if (format==='mp4'){
      _this.getVideoUrl(md5,val,token);
    } else{
      /**开始转码***/
      transCode({
        transOptions:{
          inFileName:val,
          inFileMd5:md5
        },
        transSuccess:_this.transSuccess,
        transFail: _this.transFail,
        transProgress:_this.transProgress
      })
    }
  };
  transSuccess=(res)=>{
    const { currVideo,currMd5,currToken } = this.state;
    this.setState({
      uploadProgress:0,//当前上传进度
      isUploading:false,//是否在上传中
      // isTransCoding:false,//是否是在转码
    });
    this.props.uploadSuccess(res,currVideo,currMd5,currToken); //上传成功后回调
  };
  transFail=(res)=>{
    Message.error(res)
  };
  transProgress=(progress)=>{
    // console.log(progress,'进度')
    this.setState({
      isTransCoding:true,
      isUploading:false,
      uploadProgress:progress*1
    });
  };
  /***-取消上传***/
  cancelExport=()=>{
    this.setState({
      isUploading:false,//是否在上传中
      isTransCoding:false,//是否是在转码
    })
  };
  /**上传超时**/
  timeOut=()=>{
    this.setState({
      haveVideo:false,
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
    const { language } = this.props.admin;
    const {isUploading , uploadProgress ,isTransCoding , haveVideo,
      alertDialog , alertMsg
    } = this.state;
    var is_ZH = language === CONST.LANGUAGE.ZH ? true : false
    return (
      <div className='PreMuli-box'>
        <div className='boxInner'>
          <div className='beforeCut-info'>
            <h2 style={{display:'none',fontSize:0}}>{window.intl.get('喜拼接')}</h2>
            <h3 style={{display:'none',fontSize:0}}>{window.intl.get('喜+会员，重磅上线')}</h3>
            <p style={{display:'none',fontSize:0}}>{window.intl.get('你的视频，你做主，用视频讲述你的故事，一款最佳的单段视频在线剪辑器，依靠我们自身的云服务器，独特的交互形式，您无需任何基础即可轻松快速的完成剪辑和剪切视频到任意长度，甚至完成镜像，旋转，翻转等效果的实现，重要的是它还能够将多种视频格式或清晰度的视频导出。')}</p>
            <p style={{display:'none',fontSize:0}}>{window.intl.get('简单，将从您上传视频那刻开始。')}</p>
            <img src={ is_ZH ? muliword : muliWord_en } className='muliword' alt={window.intl.get('喜拼接')+window.intl.get('喜+会员，重磅上线')+window.intl.get('你的视频，你做主，用视频讲述你的故事，一款最佳的单段视频在线剪辑器，依靠我们自身的云服务器，独特的交互形式，您无需任何基础即可轻松快速的完成剪辑和剪切视频到任意长度，甚至完成镜像，旋转，翻转等效果的实现，重要的是它还能够将多种视频格式或清晰度的视频导出。')+window.intl.get('简单，将从您上传视频那刻开始。')}/>
            <div className='gotonext'>
            <Link to='/mulipay/muli'>{window.intl.get("了解喜+会员")}</Link>
            </div>
          </div>
          <div className='uploads-box' onClick={()=>{/*window.gtag&& window.gtag('event', 'click', {'event_category': 'upload','event_label': 'video'})*/}}>
            { isUploading || isTransCoding ?
              <div className='progress-box'>
                <p className='tips'>{isTransCoding ? window.intl.get("转码中...") : window.intl.get("载入中...") }（{uploadProgress} %）</p>
                <div className='progress-out'>
                  <p className='progress-inner' style={{width:uploadProgress*510/100 + 'px'}}> </p>
                </div>
                {/*{isUploading ?*/}
                {/*<button className='quxiaoBtn' onClick={this.cancelExport}>取消</button>*/}
                {/*:*/}
                {/*""*/}
                {/*}*/}
              </div>
              :
              <Fragment>
                <Upload
                  accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                  project='muliSplicing'
                  className='singlecut'
                  onChange={this.uploadChange}
                  autoUpload={true}
                  onProgress={this.uploadProgress}
                  onSuccess={this.uploadSuccess}
                  onTimeOut = {this.timeOut}
                >
                  <p className='upload-imgBtn' > </p>
                  <p className='upload-tips'>{window.intl.get("拖放或点击添加视频")}</p>
                </Upload>
                {haveVideo ?
                  <div className='chuli-box'>
                    <p className="chuli"></p>
                    <p>{window.intl.get("正在和服务器建立连接……")}</p>
                  </div>
                  :
                  " "
                }
              </Fragment>

            }
          </div>
        </div>
        {
          alertDialog?
            <Alert
              cancelCallBack={this.cancelAlert}
              msg={alertMsg}
            />
            :''
        }
      </div>
    );
  }
}

export default PreMuli;
