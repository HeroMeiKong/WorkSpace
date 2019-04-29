import React, { Component } from 'react';
import './OutOption.scss'

class OutOption extends Component {
  constructor () {
    super()
    this.state = {
      videoWidth: 720,
      videoHeight: 480
    }
  }
  covertVideo = () => {
    this.props.callBack()
  }
  render () {
    const { videoWidth, videoHeight } = this.state
    const { fileName } = this.props
    return (
      <div className='download_list'>
        <div className='download_list_title'>{fileName}</div>
        <div className="download_list_outoptions">
          <div className="download_list_outoption">
            <div className="download_list_outoption_box outoption_topbox">
              <div className="outoption_customize">4K</div>
              <div className="outoption_customize">1080P</div>
              <div className="outoption_customize">720P</div>
              <div className="outoption_customize">480P</div>
            </div>
            <div className="download_list_outoption_box outoption_bottombox">
              <div className="outoption_customize">Customize</div>
              <div>
                <label>W:</label><input type='number' defaultValue={videoWidth}></input>
              </div>
              <div>
                <label>H:</label><input type='number' defaultValue={videoHeight}></input>
              </div>
            </div>
          </div>
          <div className="start_outoption" onClick={this.covertVideo}>START</div>
        </div>
      </div>
    )
  }
}

export default OutOption