import React, { Component } from 'react'
import './PayBottomContent.scss'

class PayBottomContent extends Component {
  render () {
    const { title, price, illustrate } = this.props
    return(
      <div className='pay_bottom_content'>
        <div className='pay_bottom_content_icon'></div>
        <h1>{title}</h1>
        <div className='pay_bottom_content_price'>
          <p>{price}</p>
          <p className="pay_bottom_content_currency">USD</p>
        </div>
        <p className='pay_bottom_content_per'>Per month</p>
        <p className='pay_bottom_content_illustrate'>{illustrate}</p>
        <div className='pay_bottom_content_button'>STAR TRIAL</div>
      </div>
    )
  }
}

export default PayBottomContent