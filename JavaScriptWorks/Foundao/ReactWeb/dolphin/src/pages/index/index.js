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
      isType: false,
      uploadSuccessList: [],
    }
  }
  uploadSuccess = (fileName, fileSize, fileMd5)=> {
    if(this.state.isType){
      console.log('文件上传成功！')
      httpRequest({
        url: api.qureyMeidiaInfo,
        data: {
          // inFileName: fileName,
          MD5: fileMd5
        },
      }).done(response => {
        this.state.uploadSuccessList.unshift({
          fileName,
          fileSize,
          fileMd5,
          videoInfo: response || {width: 0,height: 0},
        })
        this.setState({
          uploadSuccessList: this.state.uploadSuccessList
        })
      })
    } else {
      console.log('文件未上传！')
    }
  }
  uploadChange = (e) => {
    console.log('选择文件！')
    const arr = e.name.split('.')
    const type = arr[arr.length-1]
    if(type === 'MP4' || type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'wmv'){
      this.setState({
        uploadStart: true,
        isType: true,
      })
    } else {
      alert('目前支持的视频格式为：mp4、ts、avi、mkv、rmvb、mov、flv、3gp、asf、wmv、MP4，请上传知道格式的视频文件！')
      this.setState({
        isType: false,
      })
    }
  }
  uploadProgress = (percent) => {
    this.setState({
      percent
    })
  }
  deleteDownloadRecord = (el) => {
    const arr = this.state.uploadSuccessList
    for(let i=0;i<this.state.uploadSuccessList.length;i++){
      console.log(i)
      if(arr[i].fileMd5 === el){
        arr.splice(i,1)
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }
  render () {
    const { percent, uploadStart, uploadSuccessList } = this.state;
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
                      accept='video/*'
                      onChange={this.uploadChange}
                      onProgress={this.uploadProgress}
                      onSuccess={this.uploadSuccess}>
                <DropFile start={uploadStart} progress={percent} />
              </Upload>
              <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord} />
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