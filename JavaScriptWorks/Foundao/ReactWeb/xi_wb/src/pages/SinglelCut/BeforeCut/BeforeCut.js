/* eslint-disable */
import React, {Component , Fragment} from 'react';
import httpRequest from  '@/utils/httpRequest';
import {} from 'react-router-dom';
import Upload from '@/components/Upload/index';
import Alert from '@/components/Alert/index';
import './BeforeCut.scss';
import transCode  from  '@/utils/transCode';
import api from  '@/API/api';
import {Message} from "element-react";
import singleWord from '@/assets/images/singleWord.png';
import singleWord_en from '@/assets/images/singleCut_en.png';
import {connect} from 'react-redux';
import CONST from "../../../config/const";
import $ from "jquery";
@connect(
  state => ({admin: state.admin}),
)
class BeforeCut extends Component {
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
      currToken:""
    }
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
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
  getVideoUrl=(md5)=>{
    const {currToken} = this.state;
    httpRequest({
      url:api.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      this.props.uploadSuccess(res,'',md5,currToken);
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
    let _this = this;
    this.uploadBack(token)
    this.setState({
      currVideo:val,
      currMd5:md5,
      currToken:token
    },()=>{
      let format =val.slice(val.lastIndexOf('.')+1);
      if (format==='mp4'){
        _this.getVideoUrl(md5);
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
    });
  };
  transSuccess=(res)=>{
    const { currVideo,currMd5 ,currToken } = this.state;
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
        trans_type:4,
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
    // console.log(is_ZH,'is_ZH')
    // console.log(isTransCoding,'isTransCoding')
    return (
      <div className='beforeCut-box'>
        <div className='boxInner'>
          <div className='beforeCut-info'>
            <h2 style={{fontSize:0,display:'none'}}>{window.intl.get('喜剪')}</h2>
            <h3 style={{fontSize:0,display:'none'}}>{window.intl.get('免费！不收费！')}</h3>
            <p style={{fontSize:0,display:'none'}}>{window.intl.get('你的视频，你做主，用视频讲述你的故事，一款最佳的单段视频在线剪辑器，依靠我们自身的云服务器，独特的交互形式，您无需任何基础即可轻松快速地完成剪辑和剪切视频到任意长度，甚至完成镜像，旋转，翻转等效果的实现，重要的是它还能够将多种视频格式或清晰度的视频导出。')}</p>
            <p style={{fontSize:0,display:'none'}}> {window.intl.get('简单，将从您上传视频那刻开始。')}</p>
            <img src={is_ZH ? singleWord : singleWord_en} className='singleword' alt={window.intl.get('喜剪')+window.intl.get('免费！不收费！')+window.intl.get('你的视频，你做主，用视频讲述你的故事，一款最佳的单段视频在线剪辑器，依靠我们自身的云服务器，独特的交互形式，您无需任何基础即可轻松快速地完成剪辑和剪切视频到任意长度，甚至完成镜像，旋转，翻转等效果的实现，重要的是它还能够将多种视频格式或清晰度的视频导出。')+window.intl.get('简单，将从您上传视频那刻开始。')}/>
            {/*<div className='gotonext'>*/}
              {/*<a>一站式视频包装神器</a>*/}
            {/*</div>*/}
          </div>
          <div className='uploads-box'>
            { isUploading || isTransCoding ?
              <div className='progress-box'>
                <p className='tips'>{isTransCoding?window.intl.get("转码中..."):window.intl.get("载入中...")}（{uploadProgress} %）</p>
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
                  project='singleCut'
                  className='singlecut'
                  onChange={this.uploadChange}
                  autoUpload={true}
                  onProgress={this.uploadProgress}
                  onSuccess={this.uploadSuccess}
                  onTimeOut = {this.timeOut}
                >
                  <p className='upload-imgBtn'
                     onClick={()=>{/*window.gtag&& window.gtag('event', 'click', {'event_category': 'upload','event_label': 'video'})*/}}
                  > </p>
                  <p className='upload-tips'>{window.intl.get('拖放或点击添加视频')}</p>
                </Upload>
                {haveVideo ?
                  <div className='chuli-box'>
                    <p className="chuli"> </p>
                    <p>{window.intl.get('正在和服务器建立连接……')}</p>
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

export default BeforeCut;
