import React, { Component } from 'react'
import './Avatar.scss'
const avatar = require('@/assets/images/LOGO1_small.png')
const avatar_arrow = require('@/assets/images/down_yellow_icon@2x.png')

class Avatar extends Component {
  constructor () {
    super()
    this.state = {
      showUserInfo: false
    }
  }
  showUserInfo = () => {
    console.log('showUserInfo')
    this.setState({
      showUserInfo: !this.state.showUserInfo
    })
  }
  render () {
    const { showUserInfo } = this.state
    return (
      <div className='avatar'>
        <div className="avatar_top" onClick={this.showUserInfo}>
          <div className="avatar_inner">
            <img alt='avatar' src={avatar}></img>
            <img alt='avatar_arrow' src={avatar_arrow}></img>
          </div>
        </div>
        {showUserInfo ? <div className="avatar_bottom">
          <div className="avatar_bottom_box">
            <div className="big_avatar">
              <img alt='avatar' src={avatar}></img>
            </div>
            <div className="avatar_bottom_introduce">
              <p>Edward Harris</p>
              <p>t.rbhsp@gmail.com</p>
            </div>
          </div>
          <div className="avatar_bottom_Membership">
            <div>Membership Capacity</div>
            <div className="avatar_bottom_Capacity">
              <p>38 / 50G</p>
              <div className="avatar_bottom_line">
                <div></div>
              </div>
            </div>
          </div>
          <div className="sign_up">
            <div className="sign_up_img"></div>
            <div className="sign_out">Sign out</div>
          </div>
        </div> : ''}
      </div>
    )
  }
}

export default Avatar