import React, { Component } from 'react'
import './takePhoto.scss'


// 测试页面
// 测试页面
// 测试页面
// 测试页面

class TakePhoto extends Component {
  getMedia = () => {
    let constraints = {
        video: true,
        audio: true
    };
    let video = document.getElementById("video");
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    let playAudioPromise = video.play()
    if(playAudioPromise !== undefined) {
      playAudioPromise.then(() => {
        console.error("play audio promise success");
      }).catch( error => {
        console.error("play audio promise error:", error);
      })
    }
    promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
    });
  }
  takePhoto = () => {
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 500, 500);
  }
  render () {
    return (
      <div>
        <input type="button" title="开启摄像头" value="开启摄像头" onClick={this.getMedia} />
        <video id="video" width="500px" height="500px" playsInline></video>
        <canvas id="canvas" width="500px" height="500px"></canvas>
      </div>
    )
  }
}

export default TakePhoto