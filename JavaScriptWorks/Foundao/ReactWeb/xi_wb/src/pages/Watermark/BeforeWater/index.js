import React, {Component} from 'react'
import './index.scss'
import Upload from "../../../components/Upload";
import httpRequest from "../../../utils/httpRequest";
import API from "../../../API/api";
import messageBox from '@/utils/messageBox'
import transCode from '@/utils/transCode';
import tools from '@/utils/tool';
import Alert from "../../../components/Alert";


export default class BeforWater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpload: false, //是否上传视频
      isTrans: false, //是否转码
      isAlert: false,
      maxSize: 100,
      uploadPercent: 0, //上传进度
      transPercent: 0,//转码进度
      fileData: {},
      alertMsg: '当前仅支持500MB以内的文件，成为会员支持更大容量上传!',
    }
  }

  componentDidMount() {
    this.setState({
      alertMsg: window.intl.get('当前仅支持500MB以内的文件，成为会员支持更大容量上传!')
    })
  }

  //初始化上传
  initUpload = () => {
    this.setState({
      uploadPercent: 0,
      transPercent: 0,
      isUpload: false
    })
  }

  //文件上传成功回调
  uploadSuccess = (file_name, file_size, g_filemd5, upToken) => {
    this.setState({
      uploadPercent: 100
    }, () => {
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
            upToken: upToken,
            file_name: file_name
          }
          this.props.saveVideoInfo(videoInfo)
          this.setState({fileData: videoInfo}, () => {
            this.transVideo()
          })
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
    })
    httpRequest({
      url: API.up_end,
      data: {
        trans_type: 3,
        up_token: upToken
      }
    }).done((res) => {
    }).fail(() => {
      console.log('统计失败！')
    })
  }

  //文件上传进度回调
  uploadProgress = (percent) => {
    this.setState({
      uploadPercent: percent
    })
  }

  //文件上传失败回调
  uploadError = () => {
    this.setState({isAlert: true})
  }

  cancleAlert = () => {
    this.setState({isAlert: false})
    this.initUpload()
  }

  //文件改变回调
  uploadChange = () => {
    this.setState({
      isUpload: true
    })
  }

  //取消上传或者转码
  cancelUpload = () => {
    const {isTrans} = this.state
    if (isTrans) {  //取消转码
      this.trans.stopTransCode()
    } else { //取消上传
      this.refs.upload.stop_upload()
    }
    this.initUpload()
  }

  //单个视频转码
  transVideo = () => {
    const {fileData} = this.state
    var _this = this
    this.setState({
      isTrans: true
    }, () => {
      _this.trans = transCode({
        transOptions: {
          inFileName: fileData.file_name,
          inFileMd5: fileData.g_filemd5,
          outWidth: fileData.width,
          outHeight: fileData.height,
          token: fileData.upToken
        },
        transSuccess: _this.transSuccess,
        transFail: _this.transFail,
        transProgress: _this.transProgress
      })
    })
  }

  //转码成功回调
  transSuccess = (url) => {
    this.setState({
      transPercent: 100
    }, () => {
      this.props.successBefore(url)
    })
  }

  //转码进度
  transProgress = (percent) => {
    this.setState({transPercent: percent})
  }

  //转码失败
  transFail = (msg) => {
    messageBox(msg)
    this.initUpload()
  }

  goVip_btn = () => {
    window.open('/payPage')
  }

  render() {
    const {isUpload, isTrans, maxSize, uploadPercent, transPercent, isAlert, alertMsg} = this.state
    const { isForeign } = this.props
    return (
      <div className="wartermark_content">
        {isAlert ?
          <Alert cancelCallBack={this.cancleAlert} btnname={window.intl.get('我知道了')}
                 msg={alertMsg}/> : ''
        }
        <div className="wartermark_left">
          <h2 style={{fontSize:0,display:'none'}}>{window.intl.get('喜印')}</h2>
          <p style={{fontSize:0,display:'none'}}>{window.intl.get('为你的视频创作专属的独家印记！一款免费的视频水印处理在线编辑器，30X倍的上传速度，极速上传您的视频，依靠我们自身的云服务器，先进的水印处理技术，简介的交互形式，水印位置吸附功能和水印模版更好的支持您批量处理的需求 无需任何基础即可轻松快速地完成水印处理')}</p>
          <p style={{fontSize:0,display:'none'}}>{window.intl.get('便捷，将从您上传视频的那刻开')}</p>
          <div className={isForeign ? 'left_miaoshu_isForeign' : 'left_miaoshu'}></div>
          <div className="goVip_btn" onClick={this.goVip_btn}>{window.intl.get('想要更多强大功能')}</div>
        </div>

        <div className="warter_uploadBox">
          <Upload onSuccess={this.uploadSuccess}
                  onProgress={this.uploadProgress}
                  ref='upload'
                  onError={this.uploadError}
                  project='watermark'
                  maxSize={maxSize}
                  disabled={isUpload}
                  className={isUpload ? 'display_none' : ''}
                  onChange={this.uploadChange}
                  accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*">
            <div className="water_boforeBox" ref="water_boforeBox">
              {/* <div className="water_beforeIcon" onClick={()=>{window.gtag&& window.gtag('event', 'click',  {'event_category': 'upload','event_label': 'video'})}}></div> */}
              <div className="water_beforeIcon"></div>
              <p className="water_beforeTip">{window.intl.get('拖放或点击添加视频')}</p>
            </div>
          </Upload>
          {isUpload ?
            <div className="uploadingBox">
              <p className="uploading_percent">
                {isTrans ?
                  window.intl.get('转码中...')+`( ${transPercent}% )`
                  :
                  window.intl.get('载入中...')+`( ${uploadPercent}% )`}
              </p>
              <div className="uploading_perline">
                {isTrans ?
                  <div className="uploading_perlineing"
                       style={{width: `${(transPercent / 100) * 510}px`}}
                  ></div>
                  :
                  <div className="uploading_perlineing"
                       style={{width: `${(uploadPercent / 100) * 510}px`}}
                  ></div>
                }
              </div>
              <div className="uploading_cancelBtn"
                   onClick={this.cancelUpload}>
                {window.intl.get('取消')}
              </div>
            </div> : ''
          }
        </div>
      </div>
    )
  }
}