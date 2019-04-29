import React, { Component } from 'react';
import './PayCardMethod.scss'

class PayCardMethod extends Component {
  render () {
    const { name } = this.props
    return (
      <div className="paycard_method_option">
        <img alt='method' src={require(`../../../../../assets/images/`+name)}></img>
      </div>
    )
  }
}

export default PayCardMethod