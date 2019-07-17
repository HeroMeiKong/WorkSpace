import React, { Component } from 'react'
import './index.scss'

class RadarPopup extends Component {
  componentDidMount () {
    var animation = window.bodymovin.loadAnimation({
      container: document.getElementById('bm'), // Required
      path: '_data.json', // Required
      renderer: 'svg/canvas/html', // Required
      loop: true, // Optional
      autoplay: true, // Optional
    })
  }

  //前往登录页
  goLogin = () => {
    const current_url = encodeURIComponent(window.location.href);
    this.props.CallBack(`./user/login?callback=${current_url}`);
  }

  render () {
    return (
      <div className='radar_popup'>
        <div className='radar_popup_inner'>
          <div id="bm"></div>
          <div className='radar_popup_text'>{window.intl.get('检测到您已购买套餐却并未绑定 建议您绑定实体账号操作更加安全')}</div>
          <div className='radar_popup_button' onClick={this.goLogin}>{window.intl.get('立即绑定')}</div>
        </div>
      </div>
    )
  }
}

export default RadarPopup