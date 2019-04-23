import React, { Component } from 'react';
import './Version.scss'
import PropTypes from 'prop-types'

class Version extends Component {
  static contextTypes = {
    showPay: PropTypes.bool
  }
  triggerFather = () => {
    this.props.callBack()
  } 
  render () {
    const { version, price, capacity, duration } = this.props
    return (
      <div className='version'>
        <div className='purchase_version'>{version}</div>
        <div className='purchase_price'>$<strong>{price}</strong><div>.99</div></div>
        <p className='purchase_text'><strong>data limit</strong> for convertible videos</p>
        <div className='purchase_capacity'>{capacity}</div>
        <p className='purchase_text'><strong>time limit</strong> for reserving converted videos </p>
        <div className='purchase_duration'>{duration}</div>
        <div className='purchase_apply' onClick={this.triggerFather}>APPLY</div>
      </div>
    )
  }
}

export default Version