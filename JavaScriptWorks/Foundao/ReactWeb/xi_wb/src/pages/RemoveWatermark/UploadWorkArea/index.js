import React, { Component } from 'react'

import {Button} from 'element-react'
import Upload from "@/components/Upload";
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import transCode  from  '@/utils/transCode';
// import api from  '@/API/api';
import tools from '@/utils/tool';
import messageBox from '@/utils/messageBox'
import Alert from "@/components/Alert";
import './index.scss'
import Comfirm from '@/components/Comfirm/index';
import {connect} from "react-redux";
@connect(
  state => ({admin: state.admin}), {}
)
export default class index extends Component {
  constructor(props){
    super(props)
    this.state = {
      isUpload: false, //是否上传视频
      isTrans: false, //是否转码
      isVip:false,
      // isAlert: false,
      maxSize: 100,
      uploadPercent: 0, //上传进度
      // transPercent: 0,//转码进度
      fileData: {},
      alertMsg: window.intl.get('请重新选择文件！'),
      isnot:false,//判断是否能传
      comformMsg:'',
      comformDialog:false
    }
  }
  componentWillMount() {
    const {admin} = this.props;
    this.setState({
      isVip:admin.isRemoveVip
    })
    const {isRemoveVip} = this.props.admin;
    let times = localStorage.getItem('times')*1;
    if (times===0&&!isRemoveVip){
      this.setState({
        isnot:true,
      })
    }
    if (isRemoveVip){
      this.setState({
        isnot:false
      })
    }
  }

  //初始化上传
  initUpload = () => {
    this.setState({
      uploadPercent: 0,
      isTrans:false,
      transPercent: 0,
      isUpload: false,
      isnot:false
    })
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
  //文件上传成功回调
  uploadSuccess = (file_name, file_size, g_filemd5, upToken) => {
    this.uploadBack(upToken)
    let _this = this;
    this.setState({
      uploadPercent: 100
    }, () => {
      let format =file_name.slice(file_name.lastIndexOf('.')+1);
      if (format==='mp4'){
        _this.getVideoUrl(g_filemd5,file_name,upToken);
      } else{
        /**开始转码***/
        _this.setState({
          isTrans:true,
          uploadPercent:0
        })
        transCode({
          transOptions:{
            inFileName:file_name,
            inFileMd5:g_filemd5
          },
          transSuccess:(res)=>{
            _this.getVideoInfo(g_filemd5,file_name,res,upToken);
          },
          transFail: ()=>{
            _this.initUpload();
          },
          transProgress:(progress)=>{
            this.setState({
              isTrans:true,
              uploadPercent:progress*1
            });
          }
        })
      }
    })
  }

  /**获取视频信息**/
  getVideoInfo = (g_filemd5,file_name,url,token)=>{
    httpRequest({
      url: API.qureyMeidiaInfo,
      data: {
        MD5: g_filemd5
      }
    }).done((res) => {
      if (res.status / 1 === 0) {
        const videoInfo = {
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
          token:token
        }
        this.props.saveVideoInfo(videoInfo)
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
  /**获取视频链接**/
  getVideoUrl=(md5,file_name,token)=>{
    httpRequest({
      url:API.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      this.getVideoInfo(md5,file_name,res,token);
    }).fail(()=>{
      this.setState({
        isAlert:true,
        alertMsg : window.intl.get('获取视频链接失败！')
      })
    })
  }
  //文件上传进度回调
  uploadProgress = (percent) => {
    this.setState({
      uploadPercent: percent
    })
  }

  //文件上传失败回调
  // uploadError = (err) => {
  //   this.setState({
  //     isAlert: true,
  //     alertMsg:err,
  //     isUpload: false
  //   })
  // }
   //文件改变回调
   uploadChange = (files) => {
     const {isRemoveVip} = this.props.admin;
     let times = localStorage.getItem('times')*1;
     if (times===0&&!isRemoveVip){
       this.setState({
         isnot:true,
         comformMsg:window.intl.get('免费次数已经用完啦，开通会员解锁更多权限。'),
         comformDialog:true
       })
       return
     }
     if (files){
       if (isRemoveVip){
         if (files.size&&files.size/1024/1024/1024<=1){
           // console.log(1221212)
           this.setState({
             isUpload: true,
             isnot:false
           },()=>{
             this.props.startUpload()
           });
         } else {
           this.setState({
             isUpload: false
           });
         }
       } else {
         if (files&&files.size&&files.size/1024/1024<=100){
           if (times===0){
             this.setState({
               isnot:true,
               comformMsg:window.intl.get('免费次数已经用完啦，开通会员解锁更多权限。'),
               comformDialog:true
             })
             return
           }else {
             this.setState({
               isUpload: true,
               isnot:false
             });
             this.props.startUpload()
           }
         } else {
           this.setState({
             isUpload: false,
           })
         }
       }
     }


  }

  //文件上传失败回调
  uploadError = (err) => {
    this.setState({
      isAlert: true,
      alertMsg:err.msg||'',
    })
    this.initUpload()
  }

  cancleAlert = () => {
    this.setState({isAlert: false})
    this.initUpload()
  }
  timeOut=()=>{
    this.initUpload();
  }
  failfunc=(msg)=>{
    // console.log(msg)
    this.setState({
      comformDialog:true,
      comformMsg:msg
    })
  }
  render() {
    const {maxSize,isUpload,uploadPercent,isAlert,alertMsg,isTrans ,isnot,
      comformMsg,comformDialog} = this.state
    const {isRemoveVip} = this.props.admin;
    return (
      <div style={{padding:"0 30px",background:"white"}}>
        <div className='UploadWorkArea'>
          {isAlert ?
            <Alert cancelCallBack={this.cancleAlert} btnname={window.intl.get('我知道了')}
                   msg={alertMsg}/> : ''
          }
          <Upload onSuccess={this.uploadSuccess}
                  onProgress={this.uploadProgress}
                  ref='upload'
                  onError={this.uploadError}
                  project='rewatermark'
                  disabled={isUpload}
                  isremove='isremove'
                  failfunc = {this.failfunc}
                  className={isUpload ? 'display_none' : ''}
                  onChange={this.uploadChange}
                  onTimeOut = {this.timeOut}
                  not={isRemoveVip?false:isnot}
                  accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*">
            <div className='add' onClick={()=>{window.gtag&& window.gtag('event', 'click', {'event_category': 'remove_upload','event_label': 'remove'})}}></div>
            <p className='upload-tips'>{window.intl.get('拖放或点击添加视频')}</p>
          </Upload>
          {isUpload ?
            <div className="uploadingBox">
              <p className="uploading_percent">
                {isTrans ? window.intl.get('转码中...'):window.intl.get('载入中...')+`( ${uploadPercent}% )`}
              </p>
              <div className="uploading_perline">

                <div className="uploading_perlineing"
                     style={{width: `${(uploadPercent / 100) * 1013}px`}}
                ></div>

              </div>
              {/*<div className="uploading_cancelBtn"*/}
              {/*onClick={this.cancelUpload}>*/}
              {/*{window.intl.get('取消')}*/}
              {/*</div>*/}
            </div> : ''
          }
        </div>
        {comformDialog?
          <Comfirm
            msg={comformMsg}
            okbtnName={window.intl.get('取消')}
            cancelBtnName={window.intl.get('去了解')}
            cancelCallBack={()=>{window.open('/mulipay/remove')}}
            okCallBack={()=>{this.setState({comformDialog:false})}}
          />
          :""}

      </div>

    )
  }
}
