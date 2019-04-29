import React, { Component } from 'react';
import './Loading.scss'

class Loading extends Component{
  render () {
    return (
      <div className='loading'>
        <div className='loading_box'>
          <div className="loading_img"></div>
          <p className="loading_text">Loading……</p>
        </div>
      </div>
    )
  }
}

export default Loading