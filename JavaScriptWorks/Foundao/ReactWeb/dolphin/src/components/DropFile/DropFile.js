import React, { Component } from 'react'
import './DropFile.scss'

class DropFile extends Component {
  render () {
    const { start, progress } = this.props
    if(!start){
      return (
        <div className='dropfile_big dropfile' id='dropfile'>
          <div className='dolpin'></div>
          <div className='file'></div>
          <div className='droptips'>
            <p className='drop_tip'>Drop a file or click here to upload</p>
            <p className='drop_note'>convert 1 video file with max 50MB at once</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='dropfile_small dropfile' id='dropfile'>
          <div className='dolpin'></div>
          <div className='file'></div>
          <div className='droptips'>
            <p className='drop_waiting'>Uploading… {progress}%</p>
          </div>
        </div>
      )
    }
  }
}

export default DropFile