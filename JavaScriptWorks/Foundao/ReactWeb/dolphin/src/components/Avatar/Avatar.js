import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Avatar.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import { connect } from 'react-redux';
import { updateUserInfo } from '@/redux/models/admin'
const avatar = require('@/assets/images/touxiang_icon@2x.png')
const avatar_arrow = require('@/assets/images/down_yellow_icon@2x.png')

class Avatar extends Component {
  constructor () {
    super()
    this.state = {
      showUserInfo: false,
    }
  }

  componentDidMount() {
    document.addEventListener('click',this.hiddenAvatar)
    this.getUserStorage()
  }

  componentDidUpdate() {
    this.getUserStorage()
  }

  componentWillUnmount() {
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
    if(e.target.alt === 'avatar' || e.target.className === 'avatar_inner'){
      this.props.updateUserInfo({
        userInfo: tools.getUserData_storage(),
        version: tools.getCapacity_storage()
      })
      this.setState({
        showUserInfo: !this.state.showUserInfo
      })
    }
  }

  signOut = () => {
    this.props.callBack()
  }

  getUserStorage = () => {
    if(!tools.getUserData_storage().token){
      console.log('no user')
    } else {
      httpRequest({
        type: 'POST',
        url: api.get_storage_size,
        data: {
          token: tools.getUserData_storage().token,
        }
      }).done(res => {
        if(res.code === '0'){
          tools.setCapacity_storage(res.data)
        } else {
          this.props.callBack()
        }
      })
    }
  }

  updateCapacity = () => {
    let capacity = tools.getCapacity_storage().capacity/(1024*1024*1024) || 0
    let used_capacity = tools.getCapacity_storage().used_capacity/(1024*1024*1024) || 0
    const isZero = used_capacity
    let percent = 0
    if(used_capacity === 0){
      percent = 0
    } else {
      percent = used_capacity/capacity
    }
    switch (capacity>=1024) {
      case true:
        capacity = (capacity/1024).toFixed(1) + 'T'
        break;
      default:
        capacity = capacity.toFixed(1) + 'G'
        break;
    }
    switch (used_capacity>=1024) {
      case true:
      used_capacity = (used_capacity/1024).toFixed(1) + 'T'
        break;
      default:
      used_capacity = used_capacity.toFixed(1) + 'G'
        break;
    }
    if(isZero === 0) {used_capacity = '0G'}
    return {capacity ,used_capacity, percent}
  }

  limitString = (str) => {
    if(str){
      const length = str.length
      if(length > 10){
        return str.substring(0,10)+'…'
      } else {
        return str
      }
    } else {
      return 'illegal user'
    }
  }
  
  render () {
    const { showUserInfo } = this.state
    const {capacity ,used_capacity, percent} = this.updateCapacity()
    const userInfo = tools.getUserData_storage()
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
                <p data-avatar='avatar'>{this.limitString(userInfo.user_nickname)}</p>
                <p data-avatar='avatar'>{this.limitString(userInfo.user_nickname)}</p>
              </div>
            </div>
            {capacity !== '0.0G' ? <Link to='./user'>
              <div className="avatar_bottom_Membership" data-avatar='avatar'>
                <div data-avatar='avatar'>Membership Capacity</div>
                <div className="avatar_bottom_Capacity" data-avatar='avatar'>
                  <p data-avatar='avatar'>{used_capacity} / {capacity}</p>
                  <div className="avatar_bottom_line" data-avatar='avatar'>
                    <div data-avatar='avatar' style={{width: percent+'%'}}></div>
                  </div>
                </div>
              </div>
            </Link> : ''}
            <div className="sign_out_box" data-avatar='avatar'>
              <div className="sign_out_img" data-avatar='avatar'></div>
              <div className="sign_out" onClick={this.signOut} data-avatar='avatar'>Sign out</div>
            </div>
          </div> : ''}
      </div>
    )
  }
}

export default connect(state => ({
  userInfos: state.admin
}),{
  updateUserInfo
})(Avatar);