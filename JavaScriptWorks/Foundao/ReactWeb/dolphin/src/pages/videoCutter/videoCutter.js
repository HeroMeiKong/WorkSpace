import React, { Component } from 'react'
import './videoCutter.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import $ from 'jquery'
//pc端组件
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import ControllerVideo from '@/components/ControllerVideo/ControllerVideo'
// import DownloadLists from '@/components/DownloadLists/DownloadLists'
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
      size: 0,
      cutterVideo: false,
      src: ''
    }
  }

  uploadSuccess = (fileName, fileSize, fileMd5)=> {
    if(this.state.isType){
      httpRequest({
        url: api.GetInFilePath,
        dataType: 'text',
        data: {
          MD5: fileMd5
        },
      }).done(res => {
        this.setState({
          src: res
        })
        httpRequest({
          url: api.qureyMeidiaInfo,
          data: {
            MD5: fileMd5
          },
        }).done(response => {
          this.state.uploadSuccessList.unshift({
            fileName,
            fileSize,
            fileMd5: fileMd5+this.state.index,
            videoInfo: response || {width: 0,height: 0},
          })
          if(this.state.src === ''){
            this.showToast('Upload failure,please try again!')
          } else {
            this.setState({
              index: this.state.index+1,
              uploadSuccessList: this.state.uploadSuccessList,
              cutterVideo: true,
            })
          }
        }).fail(resp => {
          this.showToast(resp)
        })
      }).fail(resp => {
        this.showToast(resp)
      })
    } else {
      this.showToast('文件未上传！')
    }
  }

  uploadChange = (e) => {
    const size = (e.size/(1024*1024)).toFixed(2)
    const arr = e.name.split('.')
    const type = arr[arr.length-1].toLowerCase()
    if(type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'wmv'){
      this.setState({
        uploadStart: true,
        isType: true,
        size
      })
    } else {
      this.showToast('This media format is not supported!Yon can use mp4、ts、avi、mkv、rmvb、mov、flv、3gp、asf、wmv!')
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
    this.setState({
      cutterVideo: false,
    })
  }

  showToast = (toast_text) => {
    this.setState({
      isToast: true,
      toast_text
    })
  }

  hiddenToast = () => {
    this.setState({
      isToast: false
    })
  }

  render () {
    const { percent, uploadStart, uploadSuccessList, size, cutterVideo, src, isLoading, isToast, toast_text } = this.state;
    return(
      <div id='wrapper' className='wrapper'>
      <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} />
        <div className='wrapper_content'>
          <div className='content index_div'>
          {cutterVideo ? <div className='content_inner'><ControllerVideo src={src} uploadSuccessList={uploadSuccessList} reupload={this.reupload} /></div> : 
            <div className='content_inner'>
              <h1 className='content_header'>DOLPHIN VIEDEO CUTTER</h1>
              <h2 className='content_title'>Convert ANYTHING to Mp4 seamlessly, smoothly and speedily!</h2>
                <Upload disabled={false}
                        accept='video/*'
                        onChange={this.uploadChange}
                        onProgress={this.uploadProgress}
                        onSuccess={this.uploadSuccess}>
                  <DropFile start={uploadStart} progress={percent} src={'path2'} />
                </Upload>
                {uploadStart ? 
                <div className='videoCutter_bottom'>
                  <div className="videoCutter_bottom_notice">The video you uploaded is 1:00:00,{size}MB, After uploading, you can cut your video.</div>
                  <div className="videoCutter_bottom_recommand">
                    <div className="recommand_top">
                      <div className="recommand_top_text">RECOMMAND</div>
                      <div className="recommand_top_line"></div>
                    </div>
                    <div className="recommand_bottom">
                      <div className="recommand_img"></div>
                      <div className="recommand_text">The video you uploaded is 1:00:00,30MB, After uploading, you can cut your video.</div>
                    </div>
                  </div>
                </div>
                : ''}
              {/* <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord} /> */}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Index