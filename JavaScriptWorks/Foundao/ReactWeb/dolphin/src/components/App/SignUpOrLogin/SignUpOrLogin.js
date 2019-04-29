import React, {Component} from 'react'
import './SignUpOrLogin.scss'
import SignUpOrLoginCard from './SignUpOrLoginCard/SignUpOrLoginCard'
import $ from 'jquery'

// import { generateKeyPair } from 'crypto';
const facebook = require('@/assets/images/facebook_icon@2x.png')
// const twitter = require('@/assets/images/twitter_icon@2x.png')
const google = require('@/assets/images/google_small_icon@2x.png')
let authWin = ''

class SignUpOrLogin extends Component {
  constructor(props){
    super(props);
    this.state = {
      protocol : '',
      type : ''
    }
  }

  componentWillMount() {
    this.setState({
      protocol : window.location.protocol, //http还是https
    })
  }

  componentDidMount(){

  }

  triggerFather = (e) => {
    this.props.callBack(e)
  }

  loginSuccess = () => {
    this.props.isLoginSuccess()
  }

  glogin = (type) => {
    const {protocol} = this.state
    this.setState({
      type : type
    },()=>{
      //获取地址
      $.ajax({
        url: protocol === 'https:' ? '//cd.foundao.com:10081/foundao_api/login/get_auth_url':'//cd.foundao.com:10080/foundao_api/login/get_auth_url',
        type: 'POST',
        dataType: 'json',
        data: {
          user_from: type ? type : '', //4邮箱 5facebook 6google
          redirect_url: 'https://cd.foundao.com:10081/foundao/dolphin/return.html'   //回调地址，目前google只能是http://cd.foundao.com
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          const url = res.data  //呼起的授权地址
          authWin = window.open(url, 'newWindow', "height=500, width=650, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=nom,left=100px,top=200px")
        } else {
          console.log(res.msg)
        }
      }).fail(() => {
        console.log('内部服务器错误！')
      })
    })
  }
  // glogin = () => {
  //   let that = this
  // 			gapi.load('auth2', function(){
  // 			auth2 = gapi.auth2.init({
  //         client_id: '1020121596969-fs820cldgmpbmalampuh8skkri0dehb8.apps.googleusercontent.com',//本地
  //         // client_id: '1020121596969-fr04mgi91l2fa0ksoe39a236cbfe3ne6.apps.googleusercontent.com',//线上
  // 				cookiepolicy: 'single_host_origin',
  // 			})
  // 			that.attachSignin(document.getElementById('login_google'));
  // 			});
  // }
  // attachSignin(element) {
  //   auth2.attachClickHandler(element, {},
  //     function onSignIn(googleUser) {
  //       //获取用户信息
  //       var profile = googleUser.getBasicProfile();
  //       console.log(profile);
  //     }, function (error) {
  //       console.log(JSON.stringify(error, undefined, 2));
  //     }
  //   );
  // }

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


  render() {
    const {show} = this.props
    if (show) {
      return (
        <div className='sol_wrapper' onClick={this.triggerFather}>
          <div className='app_sol_inner'>
            <div className="app_sol_top">
              <div className="sol_top_img"></div>
              <div className="sol_top_title">MP4·DOLPHIN</div>
            </div>
            <SignUpOrLoginCard sol={show} callBack={this.loginSuccess} />
            <div className="sol_bottom">
              <div className="sol_bottom_title">Or login with:</div>
              <img alt='facebook' src={facebook} className="sol_bottom_img" onClick={this.glogin.bind(this,5)}></img>
              {/* <img alt='twitter' src={twitter} className="sol_bottom_img"></img> */}
              <img alt='google' src={google} className="sol_bottom_img" onClick={this.glogin.bind(this,6)}></img>
              {/* <div id='login_google' data-onsuccess="onSignIn" onClick={this.glogin.bind(this,6)}>google</div> */}
              {/* <button onlogin="checkLoginState();">Facebook</button> */}
            </div>
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default SignUpOrLogin