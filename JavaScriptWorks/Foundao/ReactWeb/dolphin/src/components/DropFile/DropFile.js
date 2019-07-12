import React, { Component } from 'react'
import './DropFile.scss'
let path = ''
let pathsmall = ''
// let fileupload = ''
// let fileuploadsmall = ''
const path1 = require('@/assets/images/convert_icon@2x.png')
const path1s = require('@/assets/images/convertor_small_icon@2x.png')
const fileupload = require('@/assets/images/fileupload.png')
const path2 = require('@/assets/images/cutter_icon@2x.png')
const path2s = require('@/assets/images/cutter_small_icon@2x.png')
const path3 = require('@/assets/images/watermark_icon@2x.png')
const path3s = require('@/assets/images/watermark_small_icon@2x.png')

class DropFile extends Component {

  componentDidMount() {
    //让海豚转圈
    const dolpin = document.getElementById('dolphin')
    dolpin.setAttribute('class','dolpin active_dolpin')
    let time = setTimeout(() => {
      dolpin.setAttribute('class','dolpin deactive_dolpin')
      clearTimeout(time)
    },1000)
  }

  render () {
    const { start, progress } = this.props
    //根据src判断海豚的图片是哪一个
    if(this.props.src === 'path1'){
      path = path1
      pathsmall = path1s
    } else if(this.props.src === 'path2'){
      path = path2
      pathsmall = path2s
    } else if(this.props.src === 'path3'){
      path = path3
      pathsmall = path3s
    }
    if(!start){
      return (
        <div className='dropfile_big dropfile'>
          <div id='dolphin' className='dolpin' style={{backgroundImage: 'url('+path+')'}}></div>
          <div className='file' style={{backgroundImage: 'url('+fileupload+')'}}></div>
          <div className='droptips'>
            <p className='drop_tip'>Drag your file here or click here to upload</p>
            <p className='app_drop_tip'> click here to upload</p>
            <p className='drop_note'>convert 1 video file with max 50MB at once</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='dropfile_small dropfile'>
          <div id='dolpin' className='dolpin' style={{backgroundImage: 'url('+pathsmall+')'}}></div>
          {/* <div className='file'></div> */}
          <div className='droptips'>
            {progress/1 === 100 ? <p className='drop_waiting'>upload successfully！</p> : <p className='drop_waiting'>Uploading… {(progress/1).toFixed(1)}%</p>}
          </div>
        </div>
      )
    }
  }
}

export default DropFile