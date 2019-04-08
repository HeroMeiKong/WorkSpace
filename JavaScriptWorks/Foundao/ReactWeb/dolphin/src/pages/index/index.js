import React, { Component } from 'react'
import './index.scss'
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import DownloadLists from '@/components/DownloadLists/DownloadLists'
import BottomFold from '@/components/BottomFold/BottomFold'
import BottomContents from '@/components/BottomContents/BottomContents'
import BottomBar from '@/components/BottomBar/BottomBar'
import Upload from '@/components/Upload'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'

class Index extends Component {
  constructor () {
    super()
    this.state = {
      percent: 0,
      uploadStart: false,
      uploadSuccessList: [],
      videoInfo: {}
    }
  }
  uploadSuccess = (fileName, fileSize, fileMd5)=> {
    console.log('文件上传成功！')
    httpRequest({
      url: api.qureyMeidiaInfo,
      data: {
        // inFileName: fileName,
        MD5: fileMd5
      },
    }).done(response => {
      this.setState({
        videoInfo: response || {width: 0,height: 0}
      })
    })
    this.state.uploadSuccessList.unshift({
      fileName,
      fileSize,
      fileMd5,
    })
    this.setState({
      uploadSuccessList: this.state.uploadSuccessList
    })
  }
  uploadChange = () => {
    console.log('选择文件！')
    this.setState({
      uploadStart: true
    })
  }
  uploadProgress = (percent) => {
    console.log(percent)
    this.setState({
      percent
    })
  }
  render () {
    const { percent, uploadStart, uploadSuccessList, videoInfo } = this.state;
    return(
      <div className='wrapper'>
      <div className='backcolor' />
        <Header />
        <div className='wrapper_content'>
          <div className='content index_div'>
            <div className='content_inner'>
              <p className='content_header'>DOLPHIN MP4 CONVERTOR</p>
              <p className='content_title'>Convert ANYTHING to Mp4 seamlessly, smoothly and speedily!</p>
              {/* <DropFile start='ssss' /> */}
              <Upload disabled={false}
                      accept='*'
                      onChange={this.uploadChange}
                      onProgress={this.uploadProgress}
                      onSuccess={this.uploadSuccess}>
                <DropFile start={uploadStart} progress={percent} />
              </Upload>
              <DownloadLists uploadSuccessList={uploadSuccessList} videoInfo={videoInfo} />
            </div>
          </div>
          <BottomFold />
          <BottomContents />
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default Index