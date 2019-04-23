import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Avatar.scss'
import tools from '@/utils/tools'
const avatar = require('@/assets/images/touxiang_icon@2x.png')
const avatar_arrow = require('@/assets/images/down_yellow_icon@2x.png')
let userInfo = {}

class Avatar extends Component {
  constructor () {
    super()
    this.state = {
      showUserInfo: false,
    }
  }

  componentDidMount () {
    document.addEventListener('click',this.hiddenAvatar)
  }

  componentWillUnmount () {
    document.removeEventListener('click',this.hiddenAvatar)
  }

  hiddenAvatar = (e) => {
    const avatar = e.target.getAttribute('data-avatar')
    if(avatar !== 'avatar' && e.target.alt !== 'avatar' && e.target.className !== 'avatar_inner'){
      this.setState({
        showUserInfo: false
      })
    }
  }

  showUserInfo = (e) => {
    console.log('showUserInfo')
    if(e.target.alt === 'avatar' || e.target.className === 'avatar_inner'){
      this.setState({
        showUserInfo: !this.state.showUserInfo
      })
    }
  }

  signOut = () => {
    this.props.callBack()
  }
  
  render () {
    const { showUserInfo } = this.state
    userInfo = tools.getUserData_storage()
    return (
      <div className='avatar'>
        <div className="avatar_top" onClick={this.showUserInfo}>
          <div className="avatar_inner">
            <img alt='avatar' src={userInfo.user_avatar || avatar}></img>
            <img alt='avatar_arrow' src={avatar_arrow}></img>
          </div>
        </div>
        {showUserInfo ? <div className="avatar_bottom" data-avatar='avatar'>
            <div className="avatar_bottom_box" data-avatar='avatar'>
              <div className="big_avatar" data-avatar='avatar'>
                <img alt='avatar' src={userInfo.user_avatar || avatar} data-avatar='avatar'></img>
              </div>
              <div className="avatar_bottom_introduce" data-avatar='avatar'>
                <p data-avatar='avatar'>{userInfo.user_nickname}</p>
                <p data-avatar='avatar'>{userInfo.user_nickname}</p>
              </div>
            </div>
            <Link to='./user'>
              <div className="avatar_bottom_Membership" data-avatar='avatar'>
                <div data-avatar='avatar'>Membership Capacity</div>
                <div className="avatar_bottom_Capacity" data-avatar='avatar'>
                  <p data-avatar='avatar'>38 / 50G</p>
                  <div className="avatar_bottom_line" data-avatar='avatar'>
                    <div data-avatar='avatar'></div>
                  </div>
                </div>
              </div>
            </Link>
            <div className="sign_out_box" data-avatar='avatar'>
              <div className="sign_out_img" data-avatar='avatar'></div>
              <div className="sign_out" onClick={this.signOut} data-avatar='avatar'>Sign out</div>
            </div>
          </div> : ''}
      </div>
    )
  }
}

export default Avatar