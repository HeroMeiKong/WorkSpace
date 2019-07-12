import React, { Component } from 'react'
import './waterMark.scss'
import { Link } from 'react-router-dom'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'

//pc端组件
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import WaterMark from '@/components/WaterMark/WaterMark'
import Upload from '@/components/Upload'
import Loading from '@/components/Loading/Loading'
import Toast from '@/components/Toast/Toast'
// import MyFileRecords from '@/components/MyFileRecords/MyFileRecords'

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
      openedWindow: null,//打开新窗口
      newRecords: [],
      records: [],//转码记录，一天计算
      open_myfile: false,//是否打开myfile
      fileMd5: 0,
      size: 0,
      waterMark: false,
      src: '',
      screen: {},
    }
  }

  uploadSuccess = (fileName, fileSize, fileMd5, token)=> {
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
          if(response.status >= 0){
            this.state.uploadSuccessList.unshift({
              fileName,
              fileSize,
              fileMd5: fileMd5+this.state.index,
              token,
              videoInfo: response || {width: 0,height: 0},
              isTransing: -1,//100:转码成功,0等待转码，-1初始，-2失败
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
              let width = 270*percent+'px'
              this.setState({
                screen: {width,height: '270px'}
              })
            }
            if(this.state.src === ''){
              this.showToast('Upload failure,please try again!')
            } else {
              this.setState({
                index: this.state.index+1,
                uploadSuccessList: this.state.uploadSuccessList,
                waterMark: true,
                fileMd5
              })
            }
          } else {
            this.showToast(response.err_str)
          }
        }).fail(resp => {
          this.showToast('connect server fail, please try to upload again!')
          this.setState({
            uploadStart: false,
            isType: false,
          })
        })
      }).fail(resp => {
        this.showToast(resp)
      })
    } else {
      this.showToast('File upload failed!')
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

  reupload = () => {
    this.state.uploadSuccessList.shift()
    this.setState({
      waterMark: false,
      uploadSuccessList: this.state.uploadSuccessList,
      uploadStart: false
    })
  }

  showWaterMark = () => {
    this.setState({
      waterMark: false
    })
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

  change_myfile = () => {
    this.setState({
      open_myfile: !this.state.open_myfile
    })
  }

  moreFile = () => {
    if(tools.getCapacity_storage().capacity > 0){
      window.location.href = api.return_url_user
    } else {
      if (window.confirm("Non-member users can't view the record, please recharge it!") === true) {
        window.location.href = api.return_url_purchase
      }
    }
  }

  render () {
    const { percent, uploadStart, uploadSuccessList, screen, waterMark, src, isLoading, isToast, toast_text, } = this.state;
    return(
      <div id='wrapper' className='wrapper'>
      <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} />
        <div className='wrapper_content'>
          <div className='content index_div'>
            <div className='content_inner' style={{display: waterMark?'none':'flex'}}>
              <h1 className='content_header'>DOLPHIN WATERMARK</h1>
              <h2 className='content_title'>Convert ANYTHING to Mp4 seamlessly, smoothly and speedily!</h2>
                <Upload disabled={false}
                        accept='video/mp4,video/x-m4v,video/*'
                        onChange={this.uploadChange}
                        onProgress={this.uploadProgress}
                        onSuccess={this.uploadSuccess}
                        onError={this.uploadError}>
                  <DropFile start={uploadStart} progress={percent} src={'path3'} />
                </Upload>
              {/* <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord} /> */}
            </div>
            <div className='content_inner'>
              <div className='download_lists'>
                { uploadSuccessList.length < 1 ? 
                    <div className='download_lists_inner'>
                      <p className='download_lists_tip'>Want to convert more videos? Or beyond the 50MB limit?</p>
                      <Link to='./purchase'>GO PRO</Link>
                    </div>
                  :
                    <div className='download_lists_inner'>
                      {uploadSuccessList.filter((curr,index) => index<5).map((item, index) => {
                        // return <DownloadList key={item.fileMd5} data={item} videoInfo={item.videoInfo} callBack={this.deleteDownloadRecord.bind(this,item.fileMd5)} />
                        return <WaterMark key={item.fileMd5} data={item} videoInfo={item.videoInfo} 
                        callBack={this.deleteDownloadRecord.bind(this,item.fileMd5)} src={src} 
                        reupload={this.reupload} screen={screen} isSuccess={this.showWaterMark}
                        startCovert={this.startCovert.bind(this,item.fileMd5)}
                        isTransing={item.isTransing} showToast={this.showToast} />
                      })}
                      {uploadSuccessList.length > 5 ? <div className='download_lists_button' onClick={this.moreFile}>MY FILES</div> : ''}
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index