import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BottomBar.scss'

class BottomBar extends Component {
  sendEmail = () => {
    var who = 'kefu@foundao.com'
    // var what = prompt("输入主题: ", "none");
    if (window.confirm("您确定要向" + who + "发送邮件么?") === true) {
        window.location.href = 'mailto:' + who + '?subject='
    }
  }
  render () {
    return (
      <div className='bottombar'>
        <Link to='./about_us'><div className='BottomButton'>About Us</div></Link>
        <Link to='./users_terms_and_conditions'><div className='BottomButton'>Terms of Service</div></Link>
        <Link to='./website_privacy_policy'><div className='BottomButton'>Privacy Policy</div></Link>
        <div className='BottomButton' onClick={this.sendEmail}>Contact Us</div>
        {/* <div className='BottomButton'>Forum</div> */}
      </div>
    )
  }
}

export default BottomBar