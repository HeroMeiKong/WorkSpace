import React, { Component, Fragment } from 'react'
import './ControllerVideo.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import transCode from '@/utils/transCode'
// import $ from 'jquery'

class ControllerVideo extends Component {
  constructor () {
    super()
    this.state = {
      startTime: 0,//开始时间
      endTime: 0,//结束时间
      duration: 0,//视频时长
      proportion: 0,//视频时长/控制条宽度
      startMove: false,//
      startPosition: 0,//开始的坐标，
      oldLeftPosition: 0,//左边的位置
      oldRightPosition: 0,//右边的位置
      leftWidth: 0,//左边的宽度
      rightWidth: 0,//右边的宽度
      flag: false,//false：点击左边进度条，true：点击右边进度条
      isSuccess: false,//是否开始视频制作
      progress: 0,//视频进度
    }
  }

  componentDidMount(){
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;
  }

  //标准化时间
  standardTime (time) {
    let h = Math.floor(time/3600);
    let m = Math.floor(time%3600/60);
    let s = Math.ceil(time%60);
    h = h >= 10 ? h : "0" +h;
    m = m >= 10 ? m : "0" +m;
    s = s >= 10 ? s : "0" +s;
    return h + ":" + m + ":" + s;
  }

  //设置视频信息
  setVideoInfo = () => {
    if(this.state.endTime === 0){
      const myVideo = document.getElementById('myVideo');
      this.setState({
        // src: this.props.uploadSuccessList[0].name,
        endTime: myVideo.duration,
        duration: myVideo.duration,
        proportion: myVideo.duration/556 //556是进度条宽度
      })
    }
  }

  //获取当前拖动条的位置
  startWork = (el) => {
    let e = window.event
    let x = e.pageX || e.clientX
    this.setState({
      startMove: true,
      startPosition: x,
    })
    if(el.target.className === 'controller_startpos'){
      this.setState({
        oldLeftPosition: this.state.leftWidth,
        flag: false
      })
    } else if(el.target.className === 'controller_endpos') {
      this.setState({
        oldRightPosition: this.state.rightWidth,
        flag: true
      })
    }
  }

  //限定拖拽区域及设置剪接时间段
  startMove = (el) => {
    if(this.state.startMove){
      const myVideo = document.getElementById('myVideo');
      let e = window.event
      let x = e.pageX || e.clientX
      let leftPos = x - this.state.startPosition + this.state.oldLeftPosition
      let rightPos = this.state.startPosition - x + this.state.oldRightPosition
      const width = this.state.leftWidth + this.state.rightWidth
      leftPos = (leftPos < 0 ? 0 : leftPos)
      rightPos = (rightPos < 0 ? 0 : rightPos)
      //556-20为左右空格最大宽度，为了保留视频有可剪接区域，而不是重叠在一个点，例如：2:11-2:13
      if(width < 536){
        if(!this.state.flag){
          myVideo.currentTime = this.state.proportion*leftPos
          this.setState({
            leftWidth: leftPos,
            startTime: this.state.proportion*leftPos
          })
        } else {
          myVideo.currentTime = this.state.duration - this.state.proportion*rightPos
          this.setState({
            rightWidth: rightPos,
            endTime: this.state.duration - this.state.proportion*rightPos
          })
        }
      } else if(width >= 536){
        if(!this.state.flag){
          if((x - this.state.startPosition) <= 0){
            myVideo.currentTime = this.state.proportion*leftPos
            this.setState({
              leftWidth: leftPos,
              startTime: this.state.proportion*leftPos
            })
          } else {
            myVideo.currentTime = this.state.proportion*leftPos
            this.setState({
              leftWidth: this.state.leftWidth,
              startTime: this.state.proportion*leftPos
            })
          }
        } else {
          if((x - this.state.startPosition) <= 0){
            myVideo.currentTime = this.state.duration - this.state.proportion*rightPos
            this.setState({
              rightWidth: this.state.rightWidth,
              endTime: this.state.duration - this.state.proportion*rightPos
            })
          } else {
            myVideo.currentTime = this.state.duration - this.state.proportion*rightPos
            this.setState({
              rightWidth: rightPos,
              endTime: this.state.duration - this.state.proportion*rightPos
            })
          }
        }
      }
    }
  }

  //停止移动
  overMove = () => {
    if(this.state.startMove){
      this.setState({
        startMove: false
      })
    }
  }

  //重新上传
  reupload = () => {
    this.props.reupload()
  }

  //设置好剪切时间，开始剪切
  startTransCode (inFileMd5) {
    let cut_time = []
    if(this.state.startTime === 0){
      cut_time.push({'start': Math.round(this.state.endTime*1000000)+'','end': Math.round(this.state.duration*1000000)+''})
    } else if(this.state.endTime === this.state.duration){
      cut_time.push({'start': '0','end': Math.round(this.state.startTime*1000000)+''})
    } else {
      cut_time = [{'start': '0','end': Math.round(this.state.startTime*1000000)+''},{'start': Math.round(this.state.endTime*1000000)+'','end': Math.round(this.state.duration*1000000)+''}]
    }
    const transOptions = {
      inFileMd5: inFileMd5.substring(0,32),    // 文件md5
      cut_time
    }
    transCode({
      transOptions,
      transSuccess: this.transSuccess,    // 转码成功 回调
      transFail: this.transFail,       // 转码失败 回调
      transProgress: this.transProgress,    // 转码中 回调
    });
    this.props.isSuccess()
    this.props.startCovert(0)//转码开始
    this.setState({
      // isTransing: true,
      waterMark: false,
      isSuccess: true
    })
  };

  //剪切视频成功
  transSuccess = (url) => {
    this.props.startCovert(100)//转码成功
    this.setState({
      video_url: url || ''
    })
  };

  //剪切视频失败
  transFail = (msg) => {
    console.log('转码失败:-->', msg);
    this.showToast('Oops!encoding failure...Please try again sometime later!')
    this.props.startCovert(-2)//转码失败
    // this.setState({
    //   isTransing: false
    // })
  };

  //剪切视频过程中
  transProgress = (msg) => {
    console.log('转码中--》' + msg);
    this.setState({
      progress: parseInt(msg)
    })
  };

  //下载视频
  downloadVideo = () => {
    window.gtag && window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'}) //统计下载
    const {video_url} = this.state
    const type = tools.deviceType()
    if(video_url){
      // window.open('about:blank').location.href=video_url
      let openedWindow = window.open('','_self')
      httpRequest({
        type: 'POST',
        url: api.downloadFile,
        data: {
          path: video_url
        }
      }).done(res => {
        if(type === 'iphone'){
          //ios不支持
          this.showToast('Sorry, iOS does not support downloading right now. Please open it on PC',video_url)
        } else {
          if(res.code === '0'){
            openedWindow.location.href=res.data
          }
        }
      }).fail(resp => {
        this.showToast(resp)
      })
    }
  }

  //删除视频
  deleteMe = () => {
    this.props.callBack()
  }

  //渲染转码成功UI
  convertSuccess = (isTransing) => {
    const {progress} = this.state
    if(isTransing === -2){
      return <Fragment>
                <div className="download_list_download" onClick={this.deleteMe}></div>
            </Fragment>
    } else {
      return <Fragment>
              <div className="download_list_line">{isTransing === 100 ? '' : <div className='progress_bar'><div style={{width: progress+'%'}} className='progress_bar_inner'></div></div>}</div>
                  {isTransing === 100 ? <div className="download_list_download" onClick={this.downloadVideo}></div> : <div className="download_list_progress">{progress}%</div>}
              {isTransing === 100 ? <div className="download_list_delete" onClick={this.deleteMe}></div> : ''}
            </Fragment>
    }
  }

  //重新定义名字
  resizeName = (fileName) => {
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return shortFileName
  }

  //显示提示
  showToast = (text) => {
    this.props.showToast(text)
  }

  //渲染下载列表
  renderLists = (fileName) => {
    const { isTransing } = this.props.data
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return (
      <div className='download_list'>
        <div className='download_list_title'>{shortFileName}</div>
        {isTransing >= 0 ? this.convertSuccess(isTransing) : ''}
      </div>
    )
  }

  //渲染操作转码视频UI
  renderControllerVideo = (fileMd5) => {
    const { src } = this.props
    const { startTime, endTime, leftWidth, rightWidth } = this.state
    return (
      <div className='controller_video'>
        <video id='myVideo' src={src} className="" onLoadedMetadata={this.setVideoInfo}></video>
        <div className="controller_option">
          <div className="controller_box">
            <div className="controller_bar">
              <div className="controller_nouse" style={{width:leftWidth}}>
                <div className="controller_startpos" onMouseDown={this.startWork}></div>
              </div>
              <div className="controller_use"></div>
              <div className="controller_nouse" style={{width:rightWidth}}>
                <div className="controller_endpos" onMouseDown={this.startWork}></div>
              </div>
            </div>
          </div>
          <div className="controller_box">
            <div className="controller_time">{this.standardTime(startTime)}</div>
            <div className="controller_time">{this.standardTime(endTime)}</div>
          </div>
          <div className="controller_box">
            <div className="controller_button" onClick={this.startTransCode.bind(this,fileMd5)}>START</div>
            <div className="controller_button" onClick={this.reupload}>REUPLOAD</div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { isSuccess } = this.state
    const { fileMd5, fileName } = this.props.data
    return (
      <Fragment>
        {isSuccess ? this.renderLists(fileName) : this.renderControllerVideo(fileMd5)}
      </Fragment>
    )
  }
}

export default ControllerVideo