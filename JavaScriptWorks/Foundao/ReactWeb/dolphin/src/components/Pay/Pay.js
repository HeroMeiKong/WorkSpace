import React, { Component } from 'react';
import './Pay.scss'
import PayCard from './PayCard/PayCard'

class Pay extends Component {
  triggerFather = (e) => {
    this.props.callBack(e)
  }
  render () {
    return (
      <div className='pay_wrapper' onClick={this.triggerFather}>
        <div className='pay_inner'>
          <PayCard />
        </div>
      </div>
    )
  }
}

export default Pay