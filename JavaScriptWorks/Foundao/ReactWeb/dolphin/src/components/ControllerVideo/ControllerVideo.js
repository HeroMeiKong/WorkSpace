import React, { Component } from 'react'
import './ControllerVideo.scss'

class ControllerVideo extends Component {
  constructor () {
    super()
    this.state = {
      startTime: 0,
      endTime: 0,
      duration: 0,
      proportion: 0,//视频时长/控制条宽度
      startMove: false,
      startPosition: 0,
      oldLeftPosition: 0,
      oldRightPosition: 0,
      leftWidth: 0,
      rightWidth: 0,
      flag: false,//false：点击左边进度条，true：点击右边进度条
    }
  }
  componentDidMount(){
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;
  }
  standardTime (time) {
    let h = Math.floor(time/3600);
    let m = Math.floor(time%3600/60);
    let s = Math.ceil(time%60);
    h = h >= 10 ? h : "0" +h;
    m = m >= 10 ? m : "0" +m;
    s = s >= 10 ? s : "0" +s;
    return h + ":" + m + ":" + s;
  }
  setVideoInfo = () => {
    if(this.state.endTime === 0){
      const myVideo = document.getElementById('myVideo');
      this.setState({
        // src: this.props.uploadSuccessList[0].name,
        endTime: myVideo.duration,
        duration: myVideo.duration,
        proportion: myVideo.duration/556
      })
    }
  }
  startWork = (el) => {
    console.log('startWork')
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
  overMove = () => {
    if(this.state.startMove){
      this.setState({
        startMove: false
      })
    }
  }
  reupload = () => {
    this.props.reupload()
  }
  render () {
    const { src, uploadSuccessList } = this.props
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
            <div className="controller_button">START</div>
            <div className="controller_button" onClick={this.reupload}>REUPLOAD</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ControllerVideo