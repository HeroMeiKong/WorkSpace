import React, { Component } from 'react'
import HeaderOption from '@/components/HeaderOption/HeaderOption'
import './Header.scss'
import SignUpOrLogin from '@/components/SignUpOrLogin/SignUpOrLogin'
import Avatar from '@/components/Avatar/Avatar'

class Header extends Component {
  constructor () {
    super()
    this.state = {
      showSignUpOrLogin: false,
      isLogin: false
    }
  }
  purchase = () => {
    
  }
  showLogin = () => {
    console.log('showLogin')
    this.setState({
      showSignUpOrLogin: true
    })
  }
  hiddenLogin = (e) => {
    if(e.target.className === 'sol_wrapper'){
      //如果点击外面就隐藏
      this.setState({
        showSignUpOrLogin: false
      })
    }
  }
  render () {
    const { showSignUpOrLogin, isLogin } = this.state
    return(
      <div className='header'>
        <div className='content'>
          <div className='logo'></div>
          <div className='header_web'>MP4 CONVERTOR</div>
          <div className='header_web'>VIDEO CUTTER</div>
          <div className='header_web'>WATERMARK</div>
          <div className='header_menu'>
            <HeaderOption title={'PRICING'} callBack={this.purchase} />
            {isLogin ? <div><HeaderOption /> <Avatar /></div> : <HeaderOption title={'SIGN IN'} callBack={this.showLogin} />}
          </div>
        </div>
        <SignUpOrLogin show={showSignUpOrLogin} callBack={this.hiddenLogin} />
      </div>
    )
  }
}

export default Header