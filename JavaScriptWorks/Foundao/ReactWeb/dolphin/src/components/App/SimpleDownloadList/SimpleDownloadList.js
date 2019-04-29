import React, { Component, Fragment } from 'react';
import './SimpleDownloadList.scss'

class DownloadList extends Component {
  constructor () {
    super()
    this.state = {
      isTransing: false, // 是否开始转码
      progress: 0,
      active_outoption: '',
      customize: false,
      video_url: '',
      useProps: true, //使用props传过来的值
    }
  }

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

  downloadVideo = () => {
    const {video_url} = this.state
    if(video_url){
      window.open('about:blank').location.href=video_url
    }
  }

  deleteMe = () => {
    this.props.callBack()
  }

  convertSuccess = () => {
    const {progress} = this.state
    return <Fragment>
            <div className="download_list_line">{progress >= 100 ? '' : <div className='progress_bar'><div style={{width: progress+'%'}} className='progress_bar_inner'></div></div>}</div>
                {progress >= 100 ? <div className="download_list_download" onClick={this.downloadVideo}></div> : <div className="download_list_progress">{progress}%</div>}
            {progress >= 100 ? <div className="download_list_delete" onClick={this.deleteMe}></div> : ''}
          </Fragment>
  }

  cancel = () => {
    this.setState({
      customize: false,
    })
  }

  render () {
    const { fileName } = this.props.data;
    const { isTransing } = this.state
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return (
      <div className='simple_download_list'>
        <div className='download_list_title'>{shortFileName}</div>
        {isTransing ? '' : this.isCovertVideo()}
      </div>
    )
  }
}

export default DownloadList