import React, { Component, Fragment } from 'react'
import './waterMark.scss'
import { Link } from 'react-router-dom'
import transCode from '@/utils/transCode'
import classNames from 'classnames'
//pc端组件
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import WaterMark from '@/components/WaterMark/WaterMark'
import DownloadLists from '@/components/DownloadLists/DownloadLists'
import Upload from '@/components/Upload'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
//app端组件
import Menu from '@/components/App/Menu/Menu'

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
      screen: {},
      isTransing: false, // 是否开始转码
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
          waterMark: false,
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
    const type = arr[arr.length-1].toLowerCase()
    if(type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'wmv'){
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

  startCovert = (start) => {
    console.log('开始转码视频！2')
      this.setState({
        showOutOption: false
      })
    this.state.downloadList.push(this.props.file)
  }

  deleteDownloadRecord (el) {
    this.props.callBack(el)
  }

  startTransCode = () => {
    const { fileName, fileSize, fileMd5 } = this.props.data;
    const { width, height } = this.props.videoInfo
    const { videoWidth, videoHeight, useProps } = this.state;
    console.log((useProps ? width : videoWidth),'原视频宽度')
    console.log((useProps ? width : videoWidth),'原视频高度')
    if(videoWidth > width || videoHeight > height){
      alert(width+'是最大宽度！'+height+'是最大高度！')
    } else {
      const transOptions = {
        inFileName: fileName,  // 文件名
        inFileSize: fileSize,  // 文件大小
        inFileMd5: fileMd5.substring(0,32),    // 文件md5
        outWidth: (useProps ? width : videoWidth),     // 导出视频宽度
        outHeight: (useProps ? height : videoHeight),    // 导出视频高度
      }
      transCode({
        transOptions,
        transSuccess: this.transSuccess,    // 转码成功 回调
        transFail: this.transFail,       // 转码失败 回调
        transProgress: this.transProgress,    // 转码中 回调
      });
      this.setState({
        isTransing: true
      })
    }
  };

  transSuccess = (url) => {
    console.log('transSuccess');
    this.setState({
      video_url: url || ''
    })
  };

  transFail = (msg) => {
    console.log('转码失败:-->', msg);
    alert('转码失败！请待会儿重试！')
    this.setState({
      isTransing: false
    })
  };

  transProgress = (msg) => {
    console.log('转码中--》' + msg);
    this.setState({
      progress: parseInt(msg)
    })
  };

  downloadVideo = () => {
    const {video_url} = this.state
    console.log(video_url,'111')
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
            </Fragment>
  }

  resizeName = (fileName) => {
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return shortFileName
  }

  render () {
    const { percent, uploadStart, uploadSuccessList, screen, waterMark, src, isTransing } = this.state;
    return(
      <div id='wrapper' className='wrapper'>
      <div className='backcolor' />
        <Header />
        <Menu />
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
              <div className='download_lists'>
                { uploadSuccessList.length < 1 ? 
                    <div className='download_lists_inner'>
                      <p className='download_lists_tip'>Want to convent more videos? Or beyond the 50MB limit?</p>
                      <Link to='./purchase'>GO PRO</Link>
                    </div>
                  :
                    <div className='download_lists_inner'>
                      {uploadSuccessList.filter((curr,index) => index<5).map((item, index) => {
                        // return <DownloadList key={item.fileMd5} data={item} videoInfo={item.videoInfo} callBack={this.deleteDownloadRecord.bind(this,item.fileMd5)} />
                        return <div className='download_list'>
                                <div className='download_list_title'>{this.resizeName(item.fileName)}</div>
                                {isTransing ? this.convertSuccess() : this.isCovertVideo()}
                              </div>
                      })}
                      {uploadSuccessList.length > 5 ? <div className='download_lists_button'>MY FILES</div> : ''}
                    </div>
                }
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Index