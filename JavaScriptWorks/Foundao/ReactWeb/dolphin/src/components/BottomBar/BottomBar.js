import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BottomBar.scss'

class BottomBar extends Component {
  //发送邮件
  sendEmail = () => {
    var who = 'kefu@foundao.com'
    // var what = prompt("输入主题: ", "none");
    if (window.confirm("Do you want to send " + who + " an email?") === true) {
        window.location.href = 'mailto:' + who + '?subject='
    }
  }
  scrollTop = () => {
    window.scrollTo(0,0)
  }

  render () {
    return (
      <div className='bottombar'>
        <Link target='_blank' to='./about_us'><div className='BottomButton' onClick={this.scrollTop}>About Us</div></Link>
        <Link target='_blank' to='./users_terms_and_conditions'><div className='BottomButton' onClick={this.scrollTop}>Terms of Service</div></Link>
        <Link target='_blank' to='./website_privacy_policy'><div className='BottomButton' onClick={this.scrollTop}>Privacy Policy</div></Link>
        <div className='BottomButton' onClick={this.sendEmail}>Contact Us</div>
        {/* <div className='BottomButton'>Forum</div> */}
      </div>
    )
  }
}

export default BottomBar