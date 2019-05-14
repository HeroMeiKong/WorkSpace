import React, { Component } from 'react'
import './index.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
//pc端组件
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import DownloadLists from '@/components/DownloadLists/DownloadLists'
// import BottomFold from '@/components/BottomFold/BottomFold'
import BottomContents from '@/components/BottomContents/BottomContents'
import BottomBar from '@/components/BottomBar/BottomBar'
import Upload from '@/components/Upload'
import Loading from '@/components/Loading/Loading'
import Toast from '@/components/Toast/Toast'

class Index extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      isToast: false,
      toast_text: 'Error!',
      index: 0,
      percent: 0,
      uploadStart: false,
      isType: false,
      uploadSuccessList: [],
      openedWindow: null
    }
  }

  uploadSuccess = (fileName, fileSize, fileMd5, token)=> {
    if(this.state.isType){
      httpRequest({
        url: api.qureyMeidiaInfo,
        data: {
          MD5: fileMd5
        },
      }).done(response => {
        if(response.status >= 0){
          this.state.uploadSuccessList.unshift({
            fileName,
            fileSize,
            fileMd5: fileMd5+this.state.index,
            token,
            videoInfo: response || {width: 0,height: 0},
            isTransing: -1,//100:转码成功,0等待转码，-1初始，-2失败
          })
          this.setState({
            index: this.state.index+1,
            uploadSuccessList: this.state.uploadSuccessList
          })
        } else {
          this.showToast(response.err_str)
        }
      }).fail(res => {
        this.showToast('connect server fail, please try to upload again!')
        this.setState({
          uploadStart: false,
          isType: false,
        })
      })
    } else {
      this.showToast('File upload failed!')
    }
  }

  uploadChange = (e) => {
    const arr = e.name.split('.')
    const type = arr[arr.length-1].toLowerCase()
    if(type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'wmv'){
      this.setState({
        uploadStart: true,
        isType: true,
      })
      return true
    } else {
      // this.showToast('This media format is not supported!Yon can use mp4、ts、avi、mkv、rmvb、mov、flv、3gp、asf、wmv!')
      this.setState({
        uploadStart: false,
        isType: false,
      })
      return false
    }
  }

  uploadError = (msg) => {
    this.showToast(msg)
    this.setState({
      uploadStart: false,
      isType: false,
    })
  }

  uploadProgress = (percent) => {
    this.setState({
      percent
    })
    if(percent/1 === 100){
      let time = setTimeout(() => {
        this.setState({
          uploadStart: false
        })
        clearTimeout(time)
      },5000)
    }
  }

  deleteDownloadRecord = (el) => {
    const arr = this.state.uploadSuccessList
    for(let i=0;i<this.state.uploadSuccessList.length;i++){
      if(arr[i].fileMd5 === el){
        arr.splice(i,1)
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }

  startCovert = (el,state) => {
    const arr = this.state.uploadSuccessList
    for(let i=0;i<this.state.uploadSuccessList.length;i++){
      if(arr[i].fileMd5 === el){
        arr[i].isTransing = state
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }

  showToast = (toast_text,openedWindow) => {
    this.setState({
      isToast: true,
      toast_text,
      openedWindow
    })
  }

  hiddenToast = () => {
    this.setState({
      isToast: false,
      openedWindow: null
    })
    if(this.state.openedWindow){
      window.open('about:blank').location.href = this.state.openedWindow
    }
  }

  render () {
    const { percent, uploadStart, uploadSuccessList, isLoading, isToast, toast_text } = this.state;
    return(
      <div id='wrapper' className='wrapper'>
        <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} />
        <div className='wrapper_content'>
          <div className='content index_div padding_inner'>
            <div className='content_inner'>
              <h1 className='content_header'>DOLPHIN MP4 CONVERTOR</h1>
              <h2 className='content_title'>Convert ANYTHING to Mp4 seamlessly,<br/>smoothly and speedily!</h2>
              <Upload disabled={false}
                      accept='video/*'
                      onChange={this.uploadChange}
                      onProgress={this.uploadProgress}
                      onSuccess={this.uploadSuccess}
                      onError={this.uploadError}>
                <DropFile start={uploadStart} progress={percent} src={'path1'} />
              </Upload>
              <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord}
              startCovert={this.startCovert} showToast={this.showToast} />
              {/* <AppDownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord} /> */}
            </div>
          </div>
          {/* <BottomFold /> */}
          <BottomContents />
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default Index