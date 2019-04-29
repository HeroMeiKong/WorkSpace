import React, { Component } from 'react';
import './Version.scss'
import tools from '@/utils/tools'
import api from '@/config/api'
import PropTypes from 'prop-types'

class Version extends Component {
  static contextTypes = {
    showPay: PropTypes.bool
  }
  triggerFather = () => {
    if(tools.getUserData_storage().token){
      this.props.callBack()
    } else {
      alert('您还没有登录！请先登录！')
      setTimeout(() => {
        // window.location.href = 'http://localhost:3000/#/'
        // window.location.href = 'https://cd.foundao.com:10081/foundao/dolphin/#/'
        window.location.href = 'https://www.convert-mp4.com/react_prj/#/'
      },1000)
    }
  } 
  render () {
    const { version, price, capacity, duration } = this.props
    return (
      <div className='version'>
        <div className='purchase_version'>{version}</div>
        <div className='purchase_price'>$<strong>{price}</strong><div>.99</div></div>
        <p className='purchase_text'><strong>data limit</strong> for <br/>convertible videos</p>
        <div className='purchase_capacity'>{capacity}</div>
        <p className='purchase_text'><strong>time limit</strong> for reserving<br/> converted videos </p>
        <div className='purchase_duration'>{duration}</div>
        <div className='purchase_apply' onClick={this.triggerFather}>APPLY</div>
      </div>
    )
  }
}

export default Version