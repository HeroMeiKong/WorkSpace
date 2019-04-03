import React, { Component } from 'react'
import './HeaderOption.scss'

class HeaderOption extends Component {
  triggerFather = () => {
    this.props.callBack()
  } 
  render () {
    const { title } = this.props
    return (
      <div className='header_option' onClick={this.triggerFather}>{title}</div>
    )
  }
}

export default HeaderOption