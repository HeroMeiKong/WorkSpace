import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BottomBar.scss'
import BottomButton from './BottomButton/BottomButton'

class BottomBar extends Component {
  render () {
    return (
      <div className='bottombar'>
        <BottomButton content='About Us' />
        <BottomButton content='Terms of Service' />
        <Link to='./website_privacy_policy'><BottomButton content='Privacy Policy' /></Link>
        <BottomButton content='Contact Us' />
        <BottomButton content='Forum' />
      </div>
    )
  }
}

export default BottomBar