import React, { Component } from 'react';
import './PayCardNumbers.scss'

class PayCardNumbers extends Component {
  constructor () {
    super()
    this.state = {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
    }
  }
  handleChange = (key,e) => {
    this.setState({
      [key]: e.target.value
    })
  }
  render () {
    const { value1, value2, value3, value4 } = this.state
    return (
      <div className='paycard_number'>
        <p className='paycard_title'>CARD NUMBER</p>
        <div className='paycard_number_options'>
          <input type='number' maxLength='4' max='9999' value={value1} onChange={this.handleChange.bind(this,'value1')} />
          <input type='number' maxLength='4' max='9999' value={value2} onChange={this.handleChange.bind(this,'value2')} />
          <input type='number' maxLength='4' max='9999' value={value3} onChange={this.handleChange.bind(this,'value3')} />
          <input type='number' maxLength='4' max='9999' value={value4} onChange={this.handleChange.bind(this,'value4')} />
        </div>
      </div>
    )
  }
}

export default PayCardNumbers