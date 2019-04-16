import React, { Component } from 'react'
import './SignUpOrLogin.scss'
import SignUpOrLoginCard from './SignUpOrLoginCard/SignUpOrLoginCard'
// import { generateKeyPair } from 'crypto';
const facebook = require('@/assets/images/facebook_icon@2x.png')
const twitter = require('@/assets/images/twitter_icon@2x.png')
const gapi = window.gapi
let auth2 = {}

class SignUpOrLogin extends Component {
  triggerFather = (e) => {
    this.props.callBack(e)
  }
  glogin = () => {
    let that = this
				gapi.load('auth2', function(){
				auth2 = gapi.auth2.init({
          // client_id: '1020121596969-fs820cldgmpbmalampuh8skkri0dehb8.apps.googleusercontent.com',//本地
          client_id: '1020121596969-fr04mgi91l2fa0ksoe39a236cbfe3ne6.apps.googleusercontent.com',//线上
					cookiepolicy: 'single_host_origin',
				})
				that.attachSignin(document.getElementById('login_google'));
				});
  }
  attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function onSignIn(googleUser) {
           //获取用户信息
            var profile = googleUser.getBasicProfile();
            console.log(profile);           
        }, function (error) {
            console.log(JSON.stringify(error, undefined, 2));
        }
    );
  }
  // checkLoginState = () => {
  //   window.FB.getLoginStatus(function(response) {
  //     this.statusChangeCallback(response);
  //   });
  // }
  // statusChangeCallback (response) {
  //   if (response.status === 'connected') {  //登陆状态已连接
  //     window.fbToken = response.authResponse.accessToken;
  //     this.getUserInfo();
  //   } else if (response.status === 'not_authorized') { //未经授权
  //     console.log('facebook未经授权');
  //   } else {
  //     console.log('不是登陆到Facebook;不知道是否授权');
  //   }
  // }
  // getUserInfo() {
  //   window.FB.api('/me', function(response) {
  //     console.log('Successful login for: ' + response.name);
  //     window.self.location= '/home/login.fbLogin.do?accessToken='+window.fbToken;
  //   });
  // }
  

  render () {
    const { show } = this.props
    if(show){
      return (
        <div className='sol_wrapper' onClick={this.triggerFather}>
          <div className='sol_inner'>
            <div className="sol_top">
              <div className="sol_top_img"></div>
              <div className="sol_top_title">MP4·DOLPHIN</div>
            </div>
            <SignUpOrLoginCard sol={show} />
            <div className="sol_bottom">
              <div className="sol_bottom_title">Or login with:</div>
              <img alt='facebook' src={facebook} className="sol_bottom_img"></img>
              <img alt='twitter' src={twitter} className="sol_bottom_img"></img>
              <div id='login_google' data-onsuccess="onSignIn" onClick={this.glogin}>google</div>
              {/* <button onlogin="checkLoginState();">Facebook</button> */}
            </div>
          </div>
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
}

export default SignUpOrLogin