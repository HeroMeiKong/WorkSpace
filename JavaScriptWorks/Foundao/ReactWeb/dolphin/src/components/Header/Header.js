import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.scss'
import tools from '@/utils/tools'
import { connect } from 'react-redux';
import { signOut } from '@/redux/models/admin'
import HeaderOption from '@/components/HeaderOption/HeaderOption'
import SignUpOrLogin from '@/components/SignUpOrLogin/SignUpOrLogin'
import Avatar from '@/components/Avatar/Avatar'
const defaultAvatar = require('@/assets/images/touxiang_icon@2x.png')

class Header extends Component {
  constructor () {
    super()
    this.state = {
      showMenu: false,//显示隐藏侧边栏
      showSignUpOrLogin: false,
    }
  }


  purchase = () => {
    //待使用
  }

  showMenu = (e) => {
    if(e.target.className === 'menu_cover' || e.target.className === 'menu'){
      this.setState({
        showMenu: !this.state.showMenu,
      })
    }
  }

  showLogin = (el) => {
    this.setState({
      showSignUpOrLogin: true
    })
  }

  hiddenLogin = (e) => {
    if(e.target && e.target.className && (e.target.className === 'sol_wrapper' || e.target.className === 'sol_content_create')){
      //如果点击外面或者登录成功就隐藏
      this.setState({
        showSignUpOrLogin: false
      })
    }
  }

  loginSuccess = () => {
    this.setState({
      showSignUpOrLogin: false,
    })
  }

  signOut = () => {
    tools.removeUserData_storage()//删除用户信息
    tools.removeCapacity_storage()//删除用户存储信息
    //删除用户上传记录
    this.props.signOut()
    this.setState({
      showMenu: false,
      showSignUpOrLogin: false,
    })
  }

  getUserInfo = () => {
    let info
    if(this.props.userInfos.userInfo){
      info = this.props.userInfos.userInfo || tools.getUserData_storage()
      return info
    } else {
      if(tools.getUserData_storage().token) {
        info = tools.getUserData_storage()
        return info
      } else {
        return false
      }
    }
  }

  render () {
    const { showSignUpOrLogin, showMenu } = this.state
    let info = this.getUserInfo()
    return(
      <div className='header'>
        <div id='header' className='content'>
          <div className='logo'></div>
          {/* <div className='header_web'><Link to='/'>MP4 CONVERTOR</Link></div>
          <div className='header_web'><Link to='/videoCutter'>VIDEO CUTTER</Link></div>
          <div className='header_web'><Link to='/waterMark'>WATERMARK</Link></div> */}
          <div className='header_menu'>
            <Link to='/purchase'><HeaderOption title={'PRICING'} callBack={this.purchase} /></Link>
            {info ? <div><HeaderOption /> <Avatar callBack={this.signOut} /></div> : <HeaderOption title={'SIGN IN'} callBack={this.showLogin} />}
          </div>
        </div>
        <div id='app_menu' className='content'>
          <div className='logo'></div>
          <div className="menu"  onClick={this.showMenu}></div>
          <div className="menu_cover" onClick={this.showMenu} style={{display: showMenu?'flex':'none'}}>
            <div className="menu_content">
              {info ? <div className="user_info">
                          <div className="user_avatar user_avatar_border" style={{backgroundImage: 'url('+ info.user_avatar +')'}}></div>
                          <div className="username">{info.user_nickname}</div>
                          <div className="email">{info.user_nickname}</div>
                        </div>
              :  <div className="user_info">
                  <div className="user_avatar" style={{backgroundImage: 'url('+ defaultAvatar +')'}}></div>
                  <div className="user_login" onClick={this.showLogin} >SIGN IN</div>
                </div>}
              <div className="more_info">
                {/* <div className="app_web"><Link to='/'>MP4 CONVERTOR</Link></div>
                <div className="app_web"><Link to='/videoCutter'>VIEDEO CUTTER</Link></div>
                <div className="app_web"><Link to='/waterMark'>WATERMARK</Link></div> */}
                <div className="app_web"><Link to='/purchase' target='_blank'>PRICING</Link></div>
                <div className="app_web"><Link to='/user'>My FILES</Link></div>
                <div className="app_web" onClick={this.logOut}>LOGOUT</div>
              </div>
            </div>
          </div>
        </div>
        <SignUpOrLogin show={showSignUpOrLogin} callBack={this.hiddenLogin} isLoginSuccess={this.loginSuccess} />
      </div>
    )
  }
}

export default connect(state => ({
  userInfos: state.admin
}),{
  signOut
})(Header);