import React, { Component } from 'react';
import './Version.scss'
import tools from '@/utils/tools'
// import api from '@/config/api'
import PropTypes from 'prop-types'

class Version extends Component {
  static contextTypes = {
    showPay: PropTypes.bool
  }

  triggerFather = () => {
    if(tools.getUserData_storage().token){
      this.props.callBack('islogin')
    } else {
      this.props.showSigin()
      this.props.callBackWay()
      // this.props.showToast('Please login!')
      // setTimeout(() => {
      //   // window.location.href = 'http://localhost:3000/#/'
      //   window.location.href = api.return_url + '#/'
      //   // window.location.href = 'https://www.convert-mp4.com/react_prj/#/'
      // },1000)
    }
  }
  
  render () {
    const { version, price, capacity, duration } = this.props
    return (
      <div className='version'>
        <div className='purchase_version'>{version}</div>
        <div className='purchase_price'>$<strong>{price}</strong><div>.99</div></div>
        <p className='purchase_text'>Capacity for all<br/>CONVERTED files</p>
        <div className='purchase_capacity'>{capacity}</div>
        <p className='purchase_text'>converted videos stored<br/>in the cloud expires in</p>
        <div className='purchase_duration'>{duration}</div>
        <div className='purchase_apply' onClick={this.triggerFather}>APPLY</div>
      </div>
    )
  }
}

export default Version