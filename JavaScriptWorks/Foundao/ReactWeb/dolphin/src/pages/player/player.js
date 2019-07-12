import React, { Component } from 'react'
import './player.scss'
// const play_img = require('@/assets/images/player_images/5bofang.png')
// const control_img = require('@/assets/images/player_images/5huakuai.png')
// const fullscreen_img = require('@/assets/images/player_images/5quanping.png')
// const pause_img = require('@/assets/images/player_images/5zanting.png')
// const play_img1 = require('@/assets/images/player_images/play.png')
// var myVideo = ''

//测试页面
//测试页面
//测试页面
//测试页面
//测试页面
//测试页面

class Player extends Component {
  constructor () {
    super()
    this.state = {
      playOrPause: true,
      current_time: 0,
      total_time: 0,
      fullscreen: false,
      progress: -10,
      width: 0,
      startMove: false,
      startPosition: 0,
      oldPosition: 0,
      isPlay: false
    }
  }
  componentDidMount(){
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;
}
  playOrPause = () => {
    let myVideo = document.getElementById('myVideo');
    let isPlay = false
    if(this.state.playOrPause){
      myVideo.play()
      isPlay = true
    } else {
      myVideo.pause()
      isPlay = false
    }
    this.setState({
      playOrPause: !this.state.playOrPause,
      isPlay
    })
  }
  standardTime (time) {
    // return parseInt(time/3600)+':'+parseInt(time%3600/60)+':'+Math.ceil(time%60)
    let h = Math.floor(time/3600);
    let m = Math.floor(time%3600/60);
    let s = Math.ceil(time%60);
    h = h >= 10 ? h : "0" +h;
    m = m >= 10 ? m : "0" +m;
    s = s >= 10 ? s : "0" +s;
    return h + ":" + m + ":" + s;
  }
  setVideoInfo = () => {
    if(this.state.total_time === 0){
      const myVideo = document.getElementById('myVideo');
      this.setState({
        current_time: this.standardTime(myVideo.currentTime),
        total_time: this.standardTime(myVideo.duration),
      })
    }
  }
  currentTime = () => {
    if(!this.state.startMove){
      const myVideo = document.getElementById('myVideo');
      const progress = document.getElementById('progress');
      const width = progress.clientWidth
      const percent = myVideo.currentTime/myVideo.duration
      this.setState({
        current_time: this.standardTime(myVideo.currentTime),
        progress: (width*percent)-10,
        width: width*percent
      })
    }
  }
  gotoHere = (el) => {
    if(!this.state.startMove && el.target.className !== 'control'){
      const myVideo = document.getElementById('myVideo');
      const progress = document.getElementById('progress');
      const width = progress.clientWidth
      let e = window.event
      let scrollX = el.target.getBoundingClientRect().x
      let x = e.pageX-scrollX || e.clientX-scrollX
      const percent = x/width
      myVideo.currentTime = myVideo.duration*percent
      if(this.state.isPlay){
        myVideo.play()
      } else {
        myVideo.pause()
      }
      this.setState({
        progress: x,
        current_time: this.standardTime(myVideo.currentTime),
      })
    }
  }
  startWork = (el) => {
    let e = window.event
    let x = e.pageX || e.clientX
    this.setState({
      startMove: true,
      startPosition: x,
      oldPosition: this.state.progress
    })
  }
  startMove = (el) => {
    if(this.state.startMove){
      const myVideo = document.getElementById('myVideo');
      const progress = document.getElementById('progress');
      const width = progress.clientWidth
      let e = window.event
      let x = e.pageX || e.clientX
      let s = x - this.state.startPosition + this.state.oldPosition
      const percent = s/width
      myVideo.currentTime = myVideo.duration*percent
      if(s > width-10) {
        s = width-10
      } else if(s < -10) {
        s = -10
      }
      if(this.state.isPlay){
        myVideo.play()
      } else {
        myVideo.pause()
      }
      this.setState({
        progress: s,
        width: s,
        current_time: this.standardTime(myVideo.currentTime),
      })
    }
  }
  overMove = () => {
    if(this.state.startMove){
      this.setState({
        startMove: false
      })
    }
  }
  smallOrFull = (e) => {
    const myVideo = document.getElementById('myVideo');
    if(e.target.className === 'smallscreen'){
      myVideo.webkitCancelFullScreen()
    } else {
      myVideo.webkitRequestFullScreen()
    }
  }

  render () {
    const { playOrPause, current_time, total_time, fullscreen, progress, width } = this.state
    return (
      <div className='player'>
        <video id='myVideo' src="http://cdn1-jper.foundao.com/jper/app/video/2019/04/11/b76d42361056d2003b7f5fd608a294b4.mp4" onClick={this.playOrPause} onLoadedMetadata={this.setVideoInfo}
        onTimeUpdate={this.currentTime}></video>
        <div className="controls">
          {playOrPause ? <div className="play" onClick={this.playOrPause}></div> : <div className="pause" onClick={this.playOrPause}></div>}
          <div className="current_time">{current_time}</div>
          <div className="progressbar" onClick={this.gotoHere}>
            <div id='progress' className="progress">
              <div className="line" style={{width: width}}></div>
            </div>
            <div className="control" style={{transform: 'translate('+progress+'px,-8px)'}} onMouseDown={this.startWork} ></div>
          </div>
          <div className="total_time">{total_time}</div>
          {fullscreen ? <div className="smallscreen"  onClick={this.smallOrFull}></div> : <div className="fullscreen" onClick={this.smallOrFull}></div>}
        </div>
      </div>
    )
  }
}

export default Player