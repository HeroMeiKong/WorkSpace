import React, { Component } from 'react';
import './PayCardMethods.scss'
// import PayCardMethod from './PayCardMethod/PayCardMethod'
const img1 = require('@/assets/images/visa_icon@2x.png')
const img2 = require('@/assets/images/master_icon@2x.png')
const img3 = require('@/assets/images/Paypal_icon@2x.png')

class PayCardMethods extends Component {
  render () {
    return (
      <div className='paycard_method'>
        <p className='paycard_title'>PAYMENT MEYHOD</p>
        <div className="paycard_method_options">
          <div className="paycard_method_option">
            <img alt='method' src={img1}></img>
          </div>
          <div className="paycard_method_option">
            <img alt='method' src={img2}></img>
          </div>
          <div className="paycard_method_option">
            <img alt='method' src={img3}></img>
          </div>
          {/* <PayCardMethod name='visa_icon@2x.png' />
          <PayCardMethod name='master_icon@2x.png' />
          <PayCardMethod name='Paypal_icon@2x.png' /> */}
        </div>
      </div>
    )
  }
}

export default PayCardMethods