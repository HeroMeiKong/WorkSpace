import React, { Component } from 'react';
import './PayCardDate.scss'
const mouth = require('@/assets/images/xia_icon@2x.png')
const year = require('@/assets/images/xia_icon@2x.png')

class PayCardDate extends Component {
  render () {
    return (
      <div className='paycard_date'>
        <div className='paycard_date_left'>
          <p className='paycard_title'>EXPIRATION DATE</p>
          <div className='paycard_date_contents'>
            <div className='paycard_date_content'>
              <div>December</div>
              <img alt='mouth' src={mouth}></img>
            </div>
            <div className='paycard_date_content'>
              <div>2017</div>
              <img alt='year' src={year}></img>
            </div>
          </div>
        </div>
        <div className='paycard_date_right'>
          <p className='paycard_title'>CVV</p>
          <div className='paycard_date_content'>24</div>
        </div>
      </div>
    )
  }
}

export default PayCardDate