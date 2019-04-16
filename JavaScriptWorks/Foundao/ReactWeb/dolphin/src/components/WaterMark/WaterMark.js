import React, { Component } from 'react'
import './WaterMark.scss'

class WaterMark extends Component {
  constructor () {
    super()
    this.state = {
      picUrl: '',
      upload: false,
      marquee: false,
    }
  }
  uploadClick = () => {
    this.refs.input.click()
  }
  inputChange = (e) => {
    const files = e.target.files;
    console.log(files)
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      console.log(e.target.result)
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
  render () {
    const { src, screen } = this.props
    console.log('screen',screen)
    const { picUrl, upload, marquee } = this.state
    return (
      <div className='watermark'>
        <div className="myvideo">
          <video src={src} onLoadedMetadata={this.setVideoInfo}></video>
          <div className="mask" style={{width: screen.width,height: screen.height}}>
            {upload ? <div className="markpic" style={{backgroundImage: 'url('+picUrl+')'}}>
              <div className="scalepic"></div>
            </div> : ''}
            {marquee ? <div className="removepic">
              <div className="scalepic"></div>
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