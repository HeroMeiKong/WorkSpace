import React, { Component } from 'react'
import './BottomButton.scss'

class BottomButton extends Component {
  render () {
    return (
      <div className='BottomButton'>{this.props.content}</div>
    )
  }
}

export default BottomButton