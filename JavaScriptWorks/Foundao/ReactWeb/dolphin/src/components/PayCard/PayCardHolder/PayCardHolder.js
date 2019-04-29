import React, { Component } from 'react';
import './PayCardHolder.scss'

class PayCardHolder extends Component {
  render () {
    return (
      <div className='paycard_holder'>
        <p className='paycard_title'>CARD HOLDER</p>
        <select>
          <option value="Dimitri Abernathy" defaultValue>Dimitri Abernathy</option>
          <option value="China Merchants Bank">China Merchants Bank</option>
          <option value="China Bank">China Bank</option>
          <option value="China Construction Bank">China Construction Bank</option>
        </select>
      </div>
    )
  }
}

export default PayCardHolder