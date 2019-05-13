import React, { Component } from 'react';
import './Version.scss'
import tools from '@/utils/tools'

class Version extends Component {

  triggerFather = () => {
    if(tools.getUserData_storage().token){
      this.props.callBack('islogin')
    } else {
      this.props.showSigin()
      this.props.callBackWay()
    }
  }
  
  render () {
    const { which, version, price, pricesmall, capacity, duration } = this.props
    return (
      which === 2 
      ?  <div className='version best_version' onClick={this.triggerFather}>
          <div className='best_value'></div>
          <div className='purchase_version'>{version}</div>
          <div className='purchase_price'>$<strong>{price}</strong><div>{pricesmall-0 > 0 ? '.'+pricesmall : ''}</div></div>
          <p className='purchase_text'>Capacity for all<br/>CONVERTED files</p>
          <div className='purchase_capacity'>{capacity}</div>
          <p className='purchase_text'>converted videos stored<br/>in the cloud expires in</p>
          <div className='purchase_duration'>{duration}</div>
          <div className='purchase_apply'>APPLY</div>
        </div>
      : <div className='version' onClick={this.triggerFather}>
          <div className='purchase_version'>{version}</div>
          <div className='purchase_price'>$<strong>{price}</strong><div>{pricesmall-0 > 0 ? '.'+pricesmall : ''}</div></div>
          <p className='purchase_text'>Capacity for all<br/>CONVERTED files</p>
          <div className='purchase_capacity'>{capacity}</div>
          <p className='purchase_text'>converted videos stored<br/>in the cloud expires in</p>
          <div className='purchase_duration'>{duration}</div>
          <div className='purchase_apply'>APPLY</div>
        </div>
    )
  }
}

export default Version