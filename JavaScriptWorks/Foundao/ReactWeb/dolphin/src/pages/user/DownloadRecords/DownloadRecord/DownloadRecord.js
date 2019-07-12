import React, { Component } from 'react';
import './DownloadRecord.scss'
import tools from '@/utils/tools'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
const mp4 = require('@/assets/images/MP4_icon@2x.png')
const download = require('@/assets/images/download_icon@2x.png')

class DownloadRecord extends Component {

  downloadVideo = () => {
    window.gtag && window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'}) //统计下载
    const video_url = this.props.data.out_file_url
    const type = tools.deviceType()
    if(video_url){
      let openedWindow = window.open('','_self')
      httpRequest({
        type: 'POST',
        url: api.downloadFile,
        data: {
          path: video_url
        }
      }).done(res => {
        if(type === 'iphone'){
          this.props.showToast('Sorry, iOS does not support downloading right now. Please open it on PC',video_url)
        } else {
          if(res.code === '0'){
            openedWindow.location.href=res.data
          }
        }
      })
    }
  }

  limitString = (str) => {
    if(str){
      const length = str.length
      if(length > 10){
        return str.substring(0,10)+'…'
      } else {
        return str
      }
    } else {
      return 'illegal user'
    }
  }

  render () {
    const { out_file_name } = this.props.data
    return (
      <div className='download_record'>
        <div className='download_record_inner' onClick={this.downloadVideo}>
          <div className='download_record_content'>
            <img alt='mp4' src={mp4}></img>
            <div>{this.limitString(out_file_name)}</div>
          </div>
          <div className='download_record_download'>
            <img alt='download' src={download}></img>
          </div>
        </div>
      </div>
    )
  }
}

export default DownloadRecord