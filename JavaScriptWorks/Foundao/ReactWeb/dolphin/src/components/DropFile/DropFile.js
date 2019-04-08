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
            {progress/1 === 100 ? <p className='drop_waiting'>upload successfully！</p> : <p className='drop_waiting'>Uploading… {(progress/1).toFixed(1)}%</p>}
          </div>
        </div>
      )
    }
  }
}

export default DropFile