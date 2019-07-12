import React, { Component } from 'react'
import './MasterNote.scss'

class MasterNote extends Component {
  static defaultProps = {
    data: {
      add_time: '',
      text: ''
    }
  }

  render () {
    const { data } = this.props
    return (
      <div className='masternote'>
        <div className="masternote_line"></div>
        <div className="masternote_latertime">
          <div className='masternote_clock'></div><p>{data.add_time}</p>
        </div>
        <div className="masternote_inner">
          <div className="masternote_text">
            <div className="icon1"></div>
            <div className="icon2"></div>
            {data.text}
          </div>
        </div>
      </div>
    )
  }
}

export default MasterNote