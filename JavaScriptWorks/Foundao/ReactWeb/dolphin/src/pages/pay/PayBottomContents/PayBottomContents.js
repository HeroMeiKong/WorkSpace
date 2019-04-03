import React, { Component } from 'react'
import './PayBottomContents.scss'
import PayBottomContent from './PayBottomContent/PayBottomContent'

class PayBottomContents extends Component {
  render () {
    return(
      <div className='pay_bottom_contents'>
        <PayBottomContent title='Monthly' price='8' illustrate='billed monthly' />
        <PayBottomContent title='Annually' price='6' illustrate='USD 72 billed yearly' />
      </div>
    )
  }
}

export default PayBottomContents