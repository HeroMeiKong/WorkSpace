import React, { Component } from 'react'
import './BottomBar.scss'
import BottomButton from './BottomButton/BottomButton'

class BottomBar extends Component {
  render () {
    return (
      <div className='bottombar'>
        <BottomButton content='About Us' />
        <BottomButton content='Terms of Service' />
        <BottomButton content='Privacy Policy' />
        <BottomButton content='Contact Us' />
        <BottomButton content='Forum' />
      </div>
    )
  }
}

export default BottomBar