import React, { Component } from 'react';
import './BottomFold.scss'

class BottomFold extends Component {
  render () {
    return (
      <div className='bottom_fold'>
        <div className='bottom_circle'>
          <img alt='down' src={require('../../assets/images/down_icon@2x.png')}></img>
        </div>
        <div>
          <div className='bottom_rect'></div>
        </div>
      </div>
    )
  }
}

export default BottomFold