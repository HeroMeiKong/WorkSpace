import React, { Component } from 'react'
import './waterMark.scss'
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import WaterMark from '@/components/WaterMark/WaterMark'
import DownloadLists from '@/components/DownloadLists/DownloadLists'
import Upload from '@/components/Upload'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'

class Index extends Component {
  constructor () {
    super()
    this.state = {
      index: 0,
      percent: 0,
      uploadStart: false,
      isType: false,
      uploadSuccessList: [],
      size: 0,
      waterMark: false,
      src: 'https://s-js.sports.cctv.com/host/transCodeV5/2019/03/20/15530650994946.mp4',
      screen: {}
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
          fileMd5: fileMd5+this.state.index,
          videoInfo: response || {width: 0,height: 0},
        })
        const percent = response.width/response.height
        if(percent === 16/9){
          console.log('合适')
          this.setState({
            screen: {width: '480px',height: '270px'}
          })
        } else if(percent > 16/9){
          console.log('横屏')
          let height = 480/percent+'px'
          this.setState({
            screen: {width: '480px',height}
          })
        } else {
          console.log('竖屏')
          let width = 480*percent+'px'
          this.setState({
            screen: {width,height: '270px'}
          })
        }
        this.setState({
          index: this.state.index+1,
          uploadSuccessList: this.state.uploadSuccessList,
          waterMark: true,
          src: 'http://192.168.100.3/org/%E6%97%A0%E8%80%BB%E5%AE%B6%E5%BA%AD.Shameless.US.S09E13.720p-%E5%A4%A9%E5%A4%A9%E7%BE%8E%E5%89%A7%E5%AD%97%E5%B9%95%E7%BB%84.mp4',
        })
        console.log('arr',this.state.uploadSuccessList)
      })
    } else {
      console.log('文件未上传！')
    }
  }
  uploadChange = (e) => {
    console.log('选择文件！')
    const size = (e.size/(1024*1024)).toFixed(2)
    const arr = e.name.split('.')
    const type = arr[arr.length-1]
    if(type === 'MP4' || type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'ASF' || type === 'wmv'){
      this.setState({
        uploadStart: true,
        isType: true,
        size
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
      if(arr[i].fileMd5 === el){
        arr.splice(i,1)
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }
  reupload = () => {
    console.log('reupload')
    this.setState({
      waterMark: false,
    })
  }
  render () {
    const { percent, uploadStart, uploadSuccessList, screen, waterMark, src } = this.state;
    return(
      <div className='wrapper'>
      <div className='backcolor' />
        <Header />
        <div className='wrapper_content'>
          <div className='content index_div'>
          {waterMark ? <div className='content_inner'><WaterMark src={src} uploadSuccessList={uploadSuccessList} reupload={this.reupload} screen={screen} /></div> : 
            <div className='content_inner'>
              <p className='content_header'>DOLPHIN WATERMARK</p>
              <p className='content_title'>Convert ANYTHING to Mp4 seamlessly, smoothly and speedily!</p>
                <Upload disabled={false}
                        accept='video/*'
                        onChange={this.uploadChange}
                        onProgress={this.uploadProgress}
                        onSuccess={this.uploadSuccess}>
                  <DropFile start={uploadStart} progress={percent} src={'path3'} />
                </Upload>
              {/* <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord} /> */}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Index