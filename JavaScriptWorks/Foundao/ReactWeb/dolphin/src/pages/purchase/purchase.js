import React, { Component } from 'react'
import './purchase.scss'
import { Link } from 'react-router-dom'
import Versions from './Versions/Versions'
import Pay from '@/components/Pay/Pay'

class Purchase extends Component {
  constructor () {
    super()
    this.state = {
      showPay: false
    }
  }
  showPay = () => {
    console.log('showLogin')
    this.setState({
      showPay: true
    })
  }
  hiddenPay = (e) => {
    if(e.target.className === 'pay_wrapper'){
      //如果点击外面就隐藏
      this.setState({
        showPay: false
      })
    }
  }
  render () {
    const { showPay } = this.state
    return(
      <div className='purchase'>
        <div className='purchase_content'>
          <h1>Want to convert more videos?<br/>Or beyond the 50MB limit?</h1>
          <div className='purchase_tip'>RECOMMANDED</div>
          <Versions callBack={this.showPay} />
          <p className='purchase_notes'>Need something custom? <Link to='' >Contact us.</Link></p>
          <p className='purchase_notes'>We also have additional plan provide more than 2T capacity.</p>
        </div>
        {showPay ? <Pay callBack={this.hiddenPay} /> : ''}
      </div>
    )
  }
}

export default Purchase