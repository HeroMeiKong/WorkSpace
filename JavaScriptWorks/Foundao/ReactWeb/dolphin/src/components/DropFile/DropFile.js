import React, { Component } from 'react'
import './DropFile.scss'
let path = ''
let pathsmall = ''
const path1 = require('@/assets/images/LOGO1.png')
const path1s = require('@/assets/images/LOGO1_small_icon.png')
const path2 = require('@/assets/images/LOGO2.png')
const path2s = require('@/assets/images/LOGO2_small_icon.png')
const path3 = require('@/assets/images/LOGO3.png')
const path3s = require('@/assets/images/LOGO3_small_icon.png')

class DropFile extends Component {
  render () {
    const { start, progress } = this.props
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
        <div className='dropfile_big dropfile' id='dropfile'>
          <div className='dolpin' style={{backgroundImage: 'url('+path+')'}}></div>
          {/* <div className='file'></div> */}
          <div className='droptips'>
            <p className='drop_tip'>Drop a file or click here to upload</p>
            <p className='drop_note'>convert 1 video file with max 50MB at once</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='dropfile_small dropfile' id='dropfile'>
          <div className='dolpin' style={{backgroundImage: 'url('+pathsmall+')'}}></div>
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