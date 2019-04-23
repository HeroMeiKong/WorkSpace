import React, { Component } from 'react'
import './WaterMark.scss'

class WaterMark extends Component {
  static defaultProps = {
    src: '',
    screen: {width: '480px', height: '270px'}
  }
  constructor () {
    super()
    this.state = {
      picUrl: '',
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
      removewater: {width: 40, height: 40, x: 0, y: 0},//去水印图片最终信息
    }
  }

  componentDidMount() {
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;
    // document.addEventListener('onmousemove',this.startMove)
    // document.addEventListener('onmouseup',this.overMove)
  }

  componentWillUnmount() {
    // document.removeEventListener('onmousemove',this.startMove)
    // document.removeEventListener('onmouseup',this.overMove)
  }

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

  overMove = () => {
    console.log('overMove')
    this.setState({
      markpic: false,
      removepic: false,
      scalepic: false,
    })
  }

  clickMarkPic = () => {
    console.log('clickMarkPic')
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      markpic: true,
      markpic_pos: {x,y},
      oldMarkpic_pos: {x: this.state.watermark.x, y: this.state.watermark.y}
    })
  }

  clickRemovePic = () => {
    console.log('clickRemovePic')
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      removepic: true,
      removepic_pos: {x,y},
      oldRemovepic_pos: {x: this.state.removewater.x, y: this.state.removewater.y}
    })
  }

  clickScaleMarkPic = () => {
    console.log('clickScaleMarkPic')
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

  clickScaleRemovePic = () => {
    console.log('clickScaleRemovePic')
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
        console.log('1')
        this.setState({
          [name]: {width, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        console.log('2')
        this.setState({
          [name]: {width, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        console.log('3')
        this.setState({
          [name]: {width, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= screenHeight - this.state[name].y){
        console.log('4')
        this.setState({
          [name]: {width: minSize.width, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        console.log('5')
        this.setState({
          [name]: {width: minSize.width, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        console.log('6')
        this.setState({
          [name]: {width: minSize.width, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    } else {
      if(height >= minSize.height && height <= screenHeight - this.state[name].y){
        console.log('7')
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height, x: this.state[name].x, y: this.state[name].y},
        })
      } else if(height < minSize.height){
        console.log('8')
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height: minSize.height, x: this.state[name].x, y: this.state[name].y},
        })
      } else {
        console.log('9')
        this.setState({
          [name]: {width: screenWidth - this.state[name].x, height: screenHeight - this.state[name].y, x: this.state[name].x, y: this.state[name].y},
        })
      }
    }
  }

  uploadClick = () => {
    this.refs.input.click()
  }

  inputChange = (e) => {
    const files = e.target.files;
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      this.setState({
        upload: true,
        picUrl: e.target.result
      })
    }
  }

  addMarquee = () => {
    this.setState({
      marquee: !this.state.marquee,
    })
  }


  reupload = () => {
    this.props.reupload()
  }

  render () {
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
            <div className="watermark_button">START</div>
            <div className="watermark_button" onClick={this.reupload}>REUPLOAD</div>
          </div>
        </div>
      </div>
    )
  }
}

export default WaterMark