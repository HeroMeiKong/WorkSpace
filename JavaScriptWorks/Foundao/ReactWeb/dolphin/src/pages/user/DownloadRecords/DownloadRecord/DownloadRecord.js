import React, { Component } from 'react';
import './DownloadRecord.scss'
const mp4 = require('@/assets/images/MP4_icon@2x.png')
const download = require('@/assets/images/download_icon@2x.png')

class DownloadRecord extends Component {
  render () {
    const { fileName } = this.props
    return (
      <div className='download_record'>
        <div className='download_record_inner'>
          <div className='download_record_content'>
            <img alt='mp4' src={mp4}></img>
            <div>{fileName}</div>
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