import React, { Component, Fragment } from 'react';
import './DownloadList.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
// import tools from '@/utils/tools'
import transCode from '@/utils/transCode'
import classNames from 'classnames'


class DownloadList extends Component {
  constructor () {
    super()
    this.state = {
      progress: 0,
      videoWidth: 0,
      videoHeight: 0,
      outoption_options: [{name:'4K', width: 3840,height: 2160},
                          {name:'1080P', width: 1920,height: 1080},
                          {name:'720P', width: 1280,height: 720},
                          {name:'480P', width: 720,height: 480}],
      active_outoption: '',
      customize: false,
      video_url: '',
      useProps: true, //使用props传过来的值
    }
  }

  startTransCode = () => {
    const { fileName, fileSize, fileMd5, token } = this.props.data;
    const { width, height } = this.props.videoInfo
    const { videoWidth, videoHeight, useProps } = this.state;
    if((videoWidth-0) > (width-0) || (videoHeight-0) > (height-0)){
      this.showToast('out of the width:'+width+'/height:'+height+' limit, please enter again!')
    } else if((videoWidth-0)%2 === 1  || (videoHeight-0)%2 === 1){
      this.showToast('out of the width or height limit even, please enter again!')
    } else {
      const transOptions = {
        inFileName: fileName,  // 文件名
        inFileSize: fileSize,  // 文件大小
        inFileMd5: fileMd5.substring(0,32),    // 文件md5
        outWidth: (useProps ? width : videoWidth),     // 导出视频宽度
        outHeight: (useProps ? height : videoHeight),    // 导出视频高度
        token,
      }
      transCode({
        transOptions,
        transSuccess: this.transSuccess,    // 转码成功 回调
        transFail: this.transFail,       // 转码失败 回调
        transProgress: this.transProgress,    // 转码中 回调
      });
      this.props.startCovert(0)//转码开始
    }
  };

  transSuccess = (url) => {
    console.log('transSuccess');
    this.props.startCovert(100)//转码成功
    this.setState({
      video_url: url || ''
    })
  };

  transFail = (msg) => {
    console.log('转码失败:-->', msg);
    this.showToast('Oops!encoding failure...please try again sometime later!')
    this.props.startCovert(-2)//转码失败
  };

  transProgress = (msg) => {
    console.log('转码中--》' + msg);
    this.setState({
      progress: parseInt(msg)
    })
  };

  handleChange = (key,e) => {
    this.setState({
      [key]: e.target.value
    })
  }

  changeDPI ({width,height},i,e) {
    this.setState({
      videoWidth: width,
      videoHeight: height,
      active_outoption: i,
      customize: false,
      useProps: false
    })
  }

  changeCustomize = () => {
    const { width, height } = this.props.videoInfo
    this.setState({
      customize: true,
      active_outoption: '',
      useProps: false,
      videoWidth: width,
      videoHeight: height,
    })
  }

  downloadVideo = () => {
    const {video_url} = this.state
    if(video_url){
      // window.open('about:blank').location.href=video_url
      let openedWindow = window.open('','_self')
      httpRequest({
        type: 'POST',
        url: api.downloadFile,
        data: {
          path: video_url
        }
      }).done(res => {
        if(res.code === '0'){
          openedWindow.location.href=res.data
        }
      }).fail(resp => {
        this.showToast(resp)
      })
    }
  }

  deleteMe = () => {
    this.props.callBack()
  }

  convertSuccess = (isTransing) => {
    const {progress} = this.state
    if(isTransing === -2){
      return <Fragment>
                <div className="download_list_download" onClick={this.deleteMe}></div>
            </Fragment>
    } else {
      return <Fragment>
              <div className="download_list_line">{isTransing === 100 ? '' : <div className='progress_bar'><div style={{width: progress+'%'}} className='progress_bar_inner'></div></div>}</div>
                  {isTransing === 100 ? <div className="download_list_download" onClick={this.downloadVideo}></div> : <div className="download_list_progress">{progress}%</div>}
              {isTransing === 100 ? <div className="download_list_delete" onClick={this.deleteMe}></div> : ''}
            </Fragment>
    }
  }

  cancel = () => {
    this.setState({
      customize: false,
    })
  }

  showToast = (text) => {
    this.props.showToast(text)
  }

  isCovertVideo = () => {
    const { width, height } = this.props.videoInfo
    const { videoWidth, videoHeight, outoption_options, active_outoption, customize, useProps } = this.state
    return  <Fragment>
              <div className="download_list_outoptions">
                <div className="download_list_outoption">
                  <div className="download_list_outoption_box outoption_topbox">
                    {outoption_options.map( (value,i) => 
                    ((value.width<=width) && (value.height<=height) ?
                      <div key={i}
                      className={classNames('outoption_customize',{active: active_outoption === i})}
                      onClick={this.changeDPI.bind(this,value,i)}>{value.name}</div> : '')
                    )}
                  </div>
                  <div className="download_list_outoption_box outoption_bottombox">
                    <div className={classNames('outoption_customize',{active: customize})}
                    onClick={this.changeCustomize}>Customize</div>
                    {customize ?
                      <div className='outoption_bottombox_input'>
                        <div>
                          <label>W:</label><input type='number' value={useProps ? width : videoWidth} onChange={this.handleChange.bind(this,'videoWidth')} />
                        </div>
                        <div>
                          <label>H:</label><input type='number' value={useProps ? height : videoHeight} onChange={this.handleChange.bind(this,'videoHeight')} />
                        </div>
                      </div> : ''}
                  </div>
                </div>
                <div className="start_outoption" onClick={this.startTransCode}>START</div>
              </div>
              <div className="app_download_list_outoptions">
                {customize ? <div className='outoption_bottombox_input'>
                              <div>
                                <label>Width:</label>
                                <input type='number' value={useProps ? width : videoWidth} onChange={this.handleChange.bind(this,'videoWidth')} />
                              </div>
                              <div>
                                <label>Height:</label>
                                <input type='number' value={useProps ? height : videoHeight} onChange={this.handleChange.bind(this,'videoHeight')} />
                              </div>
                              <div>
                                <label>Bitrate:</label>
                                <input type='number' value={useProps ? height : videoHeight} onChange={this.handleChange.bind(this,'videoHeight')} />
                              </div>
                              <div className='cancel' onClick={this.cancel}>Cancel</div>
                            </div>
                :<div className="download_list_outoption">
                  <div className="download_list_outoption_box outoption_topbox">
                    {outoption_options.map( (value,i) => 
                    ((value.width<=width) && (value.height<=height) ?
                      <div key={i}
                      className={classNames('outoption_customize',{active: active_outoption === i})}
                      onClick={this.changeDPI.bind(this,value,i)}>{value.name}</div> : '')
                    )}
                  </div>
                  <div className="download_list_outoption_box outoption_bottombox">
                    <div className={classNames('outoption_customize',{active: customize})}
                    onClick={this.changeCustomize}>Customize</div>
                  </div>
                </div>}
                <div className="start_outoption" onClick={this.startTransCode}>START</div>
              </div>
            </Fragment>
  }
  
  render () {
    const { fileName,isTransing } = this.props.data;
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return (
      <div className='download_list'>
        <div className='download_list_title'>{shortFileName}</div>
        {isTransing >=0 ? this.convertSuccess(isTransing) : this.isCovertVideo()}
      </div>
    )
  }
}

export default DownloadList