import React, { Component, Fragment } from 'react'
import './WaterMark.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import transCode from '@/utils/transCode'
import $ from 'jquery'
// import classNames from 'classnames'

class WaterMark extends Component {
  static defaultProps = {
    src: '',
    screen: {width: '480px', height: '270px'}
  }
  constructor () {
    super()
    this.state = {
      picUrl: '',//本地图片
      upload: false,//是否上传水印图片
      marquee: false,//是否点击去去水印
      markpic: false,//激活水印
      removepic: false,//激活去水印
      scalepic: false,//激活放大缩小图片
      oldMarkpic_pos: {x: 0, y: 0},//记录前一次水印的位置
      oldRemovepic_pos: {x: 0, y: 0},//记录前一次去水印的位置
      oldMarkpic_size: {width: 0, height: 0},//记录前一次水印的大小
      oldRemovepic_size: {width: 0, height: 0},//记录前一次去水印的大小
      markpic_pos: {x: 0, y: 0},//开始点击水印都位置
      removepic_pos: {x: 0, y: 0},//开始点击去水印都位置
      watermark: {width: 40, height: 40, x: 0, y: 0},//水印图片最终信息
      img_url: '',//水印图片
      removewater: {width: 40, height: 40, x: 0, y: 0},//去水印图片最终信息
      isSuccess: false,//是否开始视频制作
      progress: 0,//视频进度
      video_url: '',//视频地址
      percent: {x_p: 0,y_p: 0},//视频/实框比例
    }
  }

  componentDidMount() {
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;

    const  { screen, videoInfo } = this.props
    const width = screen.width.substring(screen.width.length - 2,-screen.width.length)
    const height = screen.height.substring(screen.height.length - 2,-screen.height.length)
    const percent = {x_p: (videoInfo.width-0)/(width-0),y_p: (videoInfo.height-0)/(height-0)}
    this.setState({
      percent
    })
    // document.addEventListener('onmousemove',this.startMove)
    // document.addEventListener('onmouseup',this.overMove)
  }

  componentWillUnmount() {
    // document.removeEventListener('onmousemove',this.startMove)
    // document.removeEventListener('onmouseup',this.overMove)
  }

  // 开始点击
  startMove = () => {
    if(this.state.scalepic){
      if(this.state.markpic){
        this.ScalePic('watermark')
      } else if(this.state.removepic){
        this.ScalePic('removewater')
      }
    } else {
      if(this.state.markpic){
        this.moveMarkPic('watermark')
      } else if(this.state.removepic){
        this.moveMarkPic('removewater')
      }
    }
  }

  // 结束点击
  overMove = () => {
    this.setState({
      markpic: false,
      removepic: false,
      scalepic: false,
    })
  }

  // 添加水印
  clickMarkPic = () => {
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      markpic: true,
      markpic_pos: {x,y},
      oldMarkpic_pos: {x: this.state.watermark.x, y: this.state.watermark.y}
    })
  }

  // 添加去水印
  clickRemovePic = () => {
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      removepic: true,
      removepic_pos: {x,y},
      oldRemovepic_pos: {x: this.state.removewater.x, y: this.state.removewater.y}
    })
  }

  // 点击水印，记录坐标
  clickScaleMarkPic = () => {
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      markpic: true,
      scalepic: true,
      markpic_pos: {x,y},
      oldMarkpic_size: {width: this.state.watermark.width, height: this.state.watermark.height}
    })
  }

  // 点击去水印，记录坐标
  clickScaleRemovePic = () => {
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      removepic: true,
      scalepic: true,
      removepic_pos: {x,y},
      oldRemovepic_size: {width: this.state.removewater.width, height: this.state.removewater.height}
    })
  }

  // 移动图片
  moveMarkPic = (name) => {
    const e = window.event
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let x = 0
    let y = 0
    if(name === 'watermark'){
      x = newX - this.state.markpic_pos.x + this.state.oldMarkpic_pos.x
      y = newY - this.state.markpic_pos.y + this.state.oldMarkpic_pos.y
    } else {
      x = newX - this.state.removepic_pos.x + this.state.oldRemovepic_pos.x
      y = newY - this.state.removepic_pos.y + this.state.oldRemovepic_pos.y
    }
    const strW = this.props.screen.width
    const strH = this.props.screen.height
    const screenWidth = strW.substring(strW.length-2,-strW.length)
    const screenHeight = strH.substring(strH.length-2,-strH.length)
    if(0 <= x && x <= screenWidth - this.state[name].width){
      if(0 <= y && y <= screenHeight - this.state[name].height){
        this.setState({
          // watermark: {width: 40, height: 40, x, y},
          [name]: {width: this.state[name].width, height: this.state[name].height, x, y},
        })
      } else if(0 > y){
        this.setState({
          // watermark: {width: 40, height: 40, x, y: 0},
          [name]: {width: this.state[name].width, height: this.state[name].height, x, y: 0},
        })
      } else {
        this.setState({
          // watermark: {width: 40, height: 40, x, y: screenHeight - this.state.watermark.height},
          [name]: {width: this.state[name].width, height: this.state[name].height, x, y: screenHeight - this.state[name].height},
        })
      }
    } else if(0 > x){
      if(0 <= y && y <= screenHeight - this.state[name].height){
        this.setState({
          // watermark: {width: 40, height: 40, x: 0, y},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: 0, y},
        })
      } else if(0 > y){
        this.setState({
          // watermark: {width: 40, height: 40, x: 0, y:0},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: 0, y:0},
        })
      } else {
        this.setState({
          // watermark: {width: 40, height: 40, x: 0, y: screenHeight - this.state.watermark.height},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: 0, y: screenHeight - this.state[name].height},
        })
      }
    } else {
      if(0 <= y && y <= screenHeight - this.state[name].height){
        this.setState({
          // watermark: {width: 40, height: 40, x: screenWidth - this.state.watermark.width, y},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: screenWidth - this.state[name].width, y},
        })
      } else if(0 > y){
        this.setState({
          // watermark: {width: 40, height: 40, x: screenWidth - this.state.watermark.width, y: 0},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: screenWidth - this.state[name].width, y: 0},
        })
      } else {
        this.setState({
          // watermark: {width: 40, height: 40, x: screenWidth - this.state.watermark.width, y: this.props.screen.height-this.state.watermark.height},
          [name]: {width: this.state[name].width, height: this.state[name].height, x: screenWidth - this.state[name].width, y: screenHeight - this.state[name].height},
        })
      }
    }
  }
  // moveRemovePic = () => {
  //   const e = window.event
  //   const newX = e.pageX || e.clientX
  //   const newY = e.pageY || e.clientY
  //   let x = newX - this.state.removepic_pos.x + this.state.oldRemovepic_pos.x
  //   let y = newY - this.state.removepic_pos.y + this.state.oldRemovepic_pos.y
  //   this.setState({
  //     removewater: {width: 80, height: 50, x, y},
  //   })
  // }

  // 缩放图片
  ScalePic = (name) => {
    const e = window.event
    const minSize = {width: 40, height: 40}
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let width = 0
    let height = 0
    if(name === 'watermark'){
      width = newX - this.state.markpic_pos.x + this.state.oldMarkpic_size.width
      height = newY - this.state.markpic_pos.y + this.state.oldMarkpic_size.height
    } else {
      width = newX - this.state.removepic_pos.x + this.state.oldRemovepic_size.width
      height = newY - this.state.removepic_pos.y + this.state.oldRemovepic_size.height
    }
    const strW = this.props.screen.width
    const strH = this.props.screen.height
    const screenWidth = strW.substring(strW.length-2,-strW.length)
    const screenHeight = strH.substring(strH.length-2,-strH.length)
    if(width >= minSize.width && width <= screenWidth - this.state[name].x){
      if(height >= minSize.height && height <= screenHeight - this.state[name].y){
        this.setState({
          [name]: {width, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        this.setState({
          [name]: {width, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        this.setState({
          [name]: {width, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= screenHeight - this.state[name].y){
        this.setState({
          [name]: {width: minSize.width, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        this.setState({
          [name]: {width: minSize.width, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        this.setState({
          [name]: {width: minSize.width, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    } else {
      if(height >= minSize.height && height <= screenHeight - this.state[name].y){
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    }
  }

  uploadClick = () => {
    this.refs.input.click()
  }

  // 获取本地图片地址
  inputChange = (el) => {
    const files = el.target.files;
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      this.setState({
        upload: true,
        picUrl: e.target.result
      })
    }
    this.getImgUrl(el)
  }

  // 获取图片url
  getImgUrl = (el) => {
    const that = this
    let formData = new FormData()
    formData.append('file',el.target.files[0])
    $.ajax({
      type: 'POST',
      url: api.uploadPic,
      data: formData,
      contentType: false,
      processData: false,
      mimeType: "multipart/form-data",
      success: (response) => {
        const {data} = JSON.parse(response)
        that.setState({
          img_url: data.file_url
        })
      },
      fail: (e) => {
        this.showToast('Upload failure,Please try again!')
      }
    })
  }

  // 添加去水印
  addMarquee = () => {
    this.setState({
      marquee: !this.state.marquee,
    })
  }

  // 重新上传
  reupload = () => {
    this.props.reupload()
  }

  // 开始转码
  startTransCode (inFileMd5) {
    const { watermark, removewater, img_url, percent } = this.state
    const waterPic = {
      img_url,
      width: '' + Math.round(this.state.upload ? watermark.width * percent.x_p : 0),
      height: '' + Math.round(this.state.upload ? watermark.height * percent.y_p : 0),
      x: '' + Math.round(watermark.x * percent.x_p),
      y: '' + Math.round(watermark.y * percent.y_p)
    }
    const delogo = {
      left: '' + Math.round(removewater.x * percent.x_p),
      right: '' + Math.round((removewater.x * percent.x_p) + (this.state.marquee ? (removewater.width * percent.x_p) : 0)),
      top: '' + Math.round(removewater.y * percent.y_p),
      bottom: '' + Math.round((removewater.y * percent.y_p) + (this.state.marquee ? (removewater.height * percent.y_p) : 0))
    }
    const transOptions = {
      inFileMd5: inFileMd5.substring(0,32),    // 文件md5
      layer: [waterPic],
      delogo
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

  // 转码成功
  transSuccess = (url) => {
    this.props.startCovert(100)//转码成功
    this.setState({
      video_url: url || ''
    })
  };

  // 转码失败
  transFail = (msg) => {
    console.log('转码失败:-->', msg);
    this.showToast('Oops!encoding failure...Please try again sometime later!')
    this.props.startCovert(-2)//转码失败
    // this.setState({
    //   isTransing: false
    // })
  };

  // 转码过程
  transProgress = (msg) => {
    console.log('转码中--》' + msg);
    this.setState({
      progress: parseInt(msg)
    })
  };

  // 下载视频
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

  deleteMe = () => {
    this.props.callBack()
  }

  // 渲染转码成功页面
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

  // 规范化命名
  resizeName = (fileName) => {
    let shortFileName = fileName
    if(fileName.length > 9){
      shortFileName = fileName.substring(0,3)+'…'+fileName.substring(fileName.length-6)
    }
    return shortFileName
  }

  showToast = (text) => {
    this.props.showToast(text)
  }

  // 渲染下载列表
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

  // 渲染水印操作UI
  renderWaterMark = (startTransCode) => {
    const { src, screen } = this.props
    const { picUrl, upload, marquee, watermark, removewater } = this.state
    return (
      <div className='watermark'>
        <div className="myvideo">
          <video src={src} onLoadedMetadata={this.setVideoInfo}></video>
          <div className="mask" style={{width: screen.width,height: screen.height}}>
            {upload ? <div className="markpic" onMouseDown={this.clickMarkPic} style={{backgroundImage: 'url('+picUrl+')',
            width: watermark.width, height: watermark.height,
            transform: 'translate('+watermark.x+'px,'+watermark.y+'px)'}}>
              <div className="scalepic" onMouseDown={this.clickScaleMarkPic}></div>
            </div> : ''}
            {marquee ? <div className="removepic" onMouseDown={this.clickRemovePic}
            style={{width: removewater.width, height: removewater.height,
            transform: 'translate('+removewater.x+'px,'+removewater.y+'px)'}}>
              <div className="scalepic" onMouseDown={this.clickScaleRemovePic}></div>
            </div> : ''}
          </div>
        </div>
        <div className="watermark_option">
          <div className="watermark_box">
            <div className="watermark_left">
              <div className="watermark_title">ADD WATERMARK</div>
              <div className="watermark_text">Upload a picture as a watermark recommend png picture</div>
            </div>
            <div className="watermark_right">
              <div className="watermark_button" onClick={this.uploadClick}>{upload ? 'REUPLOAD' : 'UPLOAD'}<input type='file' ref="input" hidden accept='image/*' onChange={this.inputChange.bind(this)} /></div>
            </div>
          </div>
          <div className="watermark_line"></div>
          <div className="watermark_box">
            <div className="watermark_left">
              <div className="watermark_title">REMOVE WATERMARK</div>
              <div className="watermark_text">Use the marquee to select the location ,where you want to remove the watermark.</div>
            </div>
            <div className="watermark_right">
              <div className="watermark_button" onClick={this.addMarquee}>{marquee ? 'MARQUEE ON' : 'MARQUEE'}</div>
            </div>
          </div>
          <div className="watermark_box">
            <div className="watermark_button" onClick={this.startTransCode.bind(this,startTransCode)}>START</div>
            <div className="watermark_button" onClick={this.reupload}>REUPLOAD</div>
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
        {isSuccess ? this.renderLists(fileName) : this.renderWaterMark(fileMd5)}
      </Fragment>
    )
  }
}

export default WaterMark