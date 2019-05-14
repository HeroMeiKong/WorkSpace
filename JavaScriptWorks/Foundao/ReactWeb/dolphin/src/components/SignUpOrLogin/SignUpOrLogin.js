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
import Toast from '@/components/Toast/Toast'

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
      isToast: false,
      toast_text: 'Error!',
      type: ''
    }
  }

  componentDidMount() {
    var _this = this
    window.getUserInfo = function (code,type) {
      if (authWin) {
        authWin.close()
      }
      $.ajax({
        url: api.login,
        dataType: 'json',
        type: 'POST',
        data: {
          user_from: type,
          code: code,
          redirect_url: api.return_url+'return.html'
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          _this.props.isLoginSuccess()
          tools.setUserData_storage(res.data);
          _this.getUserStorage(res.data)
        } else {
          _this.showToast(res.msg)
        }
      }).fail(() => {
        _this.showToast('内部服务器错误！')
      })
    }
  }

  getUserStorage = (data) => {
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
          this.props.login({
            userInfo: data,
            version: res.data
          })
        } else {
          this.props.callBack()
        }
      }).fail(resp => {
        this.showToast(resp)
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
    this.setState({
      type: type,
    },() => {
      authWin = window.open('', 'newWindow', "height=500, width=650, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=nom,left=100px,top=200px")
      //获取地址
      $.ajax({
        url: api.get_auth_url,
        type: 'POST',
        dataType: 'json',
        data: {
          user_from: type ? type : '', //4邮箱 5facebook 6google
          redirect_url: api.return_url+'return.html'
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          const url = res.data  //呼起的授权地址
          authWin.location = url
        } else {
          this.showToast(res.msg)
        }
      }).fail(() => {
        this.showToast('内部服务器错误！')
      })
    })
  }
  changeLoading = (el) => {
    this.setState({
      isLoading: el
    })
  }

  showToast = (toast_text) => {
    this.setState({
      isToast: true,
      toast_text
    })
  }

  hiddenToast = () => {
    this.setState({
      isToast: false
    })
  }

  render() {
    const { show } = this.props
    const { isLoading, isToast, toast_text } = this.state
    if (show) {
      return (
        <div className='sol_wrapper' onClick={this.triggerFather}>
          {isLoading ? <Loading/> : ''}
          {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
          <div className='sol_inner'>
            <div className="sol_top">
              <div className="sol_top_img"></div>
              <div className="sol_top_title">MP4·DOLPHIN</div>
            </div>
            <SignUpOrLoginCard sol={show} callBack={this.loginSuccess} loading={this.changeLoading} 
            getUserStorage={this.getUserStorage} showToast={this.showToast} />
            <div className="sol_bottom">
              <div className="sol_bottom_title">Or signin with:</div>
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
      return ('')
    }
  }
}

export default connect(state => ({
  userInfos: state.admin
}),{
  login
})(SignUpOrLogin);