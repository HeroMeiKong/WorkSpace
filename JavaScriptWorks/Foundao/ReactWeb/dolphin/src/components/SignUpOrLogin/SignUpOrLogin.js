import React, {Component} from 'react'
import './SignUpOrLogin.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import SignUpOrLoginCard from './SignUpOrLoginCard/SignUpOrLoginCard'
import $ from 'jquery'
import { connect } from 'react-redux';
import { login } from '@/redux/models/admin'
import Loading from '@/components/Loading/Loading'

// import { generateKeyPair } from 'crypto';
const facebook = require('@/assets/images/facebook_icon@2x.png')
// const twitter = require('@/assets/images/twitter_icon@2x.png')
const google = require('@/assets/images/google@2x.png')
let authWin = ''

class SignUpOrLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      protocol: '',
      type: ''
    }
  }

  componentWillMount() {
    this.setState({
      protocol: window.location.protocol, //http还是https
    })
  }

  componentDidMount() {
    var _this = this
    window.getUserInfo = function (code) {
      const {protocol, type} = _this.state
      if (authWin) {
        authWin.close()
      }
      $.ajax({
        url: protocol === 'https:' ? '//cd.foundao.com:10081/foundao_api/login/dologin' : '//cd.foundao.com:10080/foundao_api/login/dologin',
        dataType: 'json',
        type: 'POST',
        data: {
          user_from: type,
          code: code,
          redirect_url: 'https://cd.foundao.com:10081/foundao/dolphin/return.html'
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          _this.props.isLoginSuccess()
          tools.setUserData_storage(res.data);
          _this.getUserStorage(res.data)
        } else {
          console.log(res.msg)
        }
      }).fail(() => {
        console.log('内部服务器错误！')
      })
    }
  }

  getUserStorage = (data) => {
    console.log('getUserStorage',tools.getUserData_storage())
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
        console.log(res)
        if(res.code === '0'){
          tools.setCapacity_storage(res.data)
          this.props.login({
            userInfo: data,
            version: res.data
          })
        } else {
          this.props.callBack()
        }
      })
    }
  }

  triggerFather = (el) => {
    //登录成功触发父类方法
    this.props.callBack(el)
  }

  loginSuccess = () => {
    this.props.isLoginSuccess()
    this.setState({
      isLoading: false
    })
  }

  glogin = (type) => {
    const {protocol} = this.state
    this.setState({
      type: type,
    },() => {
      authWin = window.open('', 'newWindow', "height=500, width=650, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=nom,left=100px,top=200px")
      //获取地址
      $.ajax({
        url: protocol === 'https:' ? '//cd.foundao.com:10081/foundao_api/login/get_auth_url' : '//cd.foundao.com:10080/foundao_api/login/get_auth_url',
        type: 'POST',
        dataType: 'json',
        data: {
          user_from: type ? type : '', //4邮箱 5facebook 6google
          redirect_url: 'https://cd.foundao.com:10081/foundao/dolphin/return.html'   //回调地址，目前google只能是http://cd.foundao.com
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          const url = res.data  //呼起的授权地址
          authWin.location = url
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
  changeLoading = (el) => {
    console.log(el)
    this.setState({
      isLoading: el
    })
  }

  render() {
    const {show} = this.props
    const {isLoading} = this.state
    if (show) {
      return (
        <div className='sol_wrapper' onClick={this.triggerFather}>
          {isLoading ? <Loading/> : ''}
          <div className='sol_inner'>
            <div className="sol_top">
              <div className="sol_top_img"></div>
              <div className="sol_top_title">MP4·DOLPHIN</div>
            </div>
            <SignUpOrLoginCard sol={show} callBack={this.loginSuccess} loading={this.changeLoading} getUserStorage={this.getUserStorage}/>
            <div className="sol_bottom">
              <div className="sol_bottom_title">Or login with:</div>
              <img alt='facebook' src={facebook} className="sol_bottom_img" onClick={this.glogin.bind(this, 5)}></img>
              {/* <img alt='twitter' src={twitter} className="sol_bottom_img"></img> */}
              <img alt='google' src={google} className="sol_bottom_img" onClick={this.glogin.bind(this, 6)}></img>
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

export default connect(state => ({
  userInfos: state.admin
}),{
  login
})(SignUpOrLogin);