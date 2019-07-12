import React, {Component} from 'react';
import './reset.scss';
import {Link} from 'react-router-dom';
// import API from "../../../config/api";
import API from "../../../API/api";
// import $ from 'jquery';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Message} from 'element-react';
import {sha512} from 'js-sha512';
/* eslint-disable */
const $ = window.jQuery;
@connect(
  state => ({admin: state.admin}),
)

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      mobile_code: '',
      captcha: '',//图形验证码
      captcha_url: '',
      mobile_valid: false,
      showCountDown: false,//显示倒计时
      countDown: 0,//发送验证码倒计时
      errMsg: '',
      step: 0,
      code: '',
      code_again: '',
      auth_sign: ''
    };

    this.countDown_timer = null;
    this.getDynamicing = null;
  }

  componentWillMount() {
    this.refresh_verify();
  }

  componentWillUnmount() {
    if (this.countDown_timer === null) {
      return
    }
    clearInterval(this.countDown_timer)
    this.countDown_timer = null
  }

  //刷新验证码
  refresh_verify() {
    this.setState({
      captcha_url: API.get_captcha + '?t=' + Date.parse(new Date())
    })
  }

  //验证手机号码是否有效
  isPhoneNum(num) {
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(num)) {
      return true
    } else {
      return false
    }
  }

  //获取验证码
  getDynamic() {
    if (this.getDynamicing) {
      return
    }
    if (!this.isPhoneNum(this.state.mobile)) {
      this.setState({
        errMsg: '手机号格式不正确'
      })
      return
    }
    if (!this.state.captcha) {
      this.setState({
        errMsg: '请输入图形验证码'
      })
      return
    }

    this.getDynamicing = true
    $.ajax({
      dataType: 'json',
      type: 'get',
      url: API.send_mobile_code,
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        mobile: this.state.mobile,
        captcha_code: this.state.captcha
      }
    }).done((res) => {
      this.getDynamicing = false
      if (res.code == 0) {
        this.setState({
          showCountDown: true,
          countDown: 60,
          errMsg: ''
        })
        if (this.countDown_timer === null) {
          this.countDown_timer = setInterval(() => {
            if (this.state.countDown === 1) {//倒计时结束
              clearInterval(this.countDown_timer);
              this.countDown_timer = null;
              this.setState({
                showCountDown: false,
              })
            }
            this.setState({
              countDown: --this.state.countDown,
            })
          }, 1000)
        }
      } else {
        this.setState({
          errMsg: res.msg
        }, () => {
          this.refresh_verify()
        })
        // Message(res.msg);
      }
    })
  }

  is_register(num) {
    if (!this.isPhoneNum(num)) {
      return
    }
    $.ajax({
      dataType: 'json',
      type: 'get',
      url: API.is_register,
      data: {
        mobile: num,
      }
    }).done((res) => {
      if (parseInt(res.code) === 0) {
        if (parseInt(res.data.is_register) === 1) {     //已注册
          this.setState({
            errMsg: '',
            mobile_valid: true,
          })
        } else {                                        //未注册
          this.setState({
            errMsg: '此手机号未注册',
            mobile_valid: false,
          })
        }
      } else {
        Message(res.msg)
      }
    })
  }

  ensure() {
    if (!this.isPhoneNum(this.state.mobile)) {
      this.setState({
        errMsg: '手机号格式不正确'
      })
      return
    }
    if (!this.state.mobile_valid) {
      this.setState({
        errMsg: '此手机号未注册'
      })
      return
    }
    if (!this.state.captcha) {
      this.setState({
        errMsg: '请输入图形验证码'
      })
      return
    }
    if (!this.state.mobile_code) {
      this.setState({
        errMsg: '请输入动态密码'
      })
      return
    }
    $.ajax({
      dataType: 'json',
      type: 'post',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      url: API.check_mobile,
      data: {
        step: 1,
        mobile: this.state.mobile,
        mobile_code: this.state.mobile_code,
      }
    }).done((res) => {
      if (parseInt(res.code) === 0) {
        this.setState({
          auth_sign: res.data.auth_sign,
          step: 1,
        })
      } else {
        this.setState({
          errMsg: res.msg
        })
      }
    })

  }

  validatePassword(password) {
    if (!/^.{6,20}$/.test(password)) {
      Message('密码6～20位,大写字母、小写字母、数字、特殊字符4种类型必须包含2种,特殊字符只支持!@#$%^&*()');
      return false;
    }
    var matchNum = 0;
    if (/\d+/.test(password)) {
      matchNum++;
    }
    if (/[A-Z]+/.test(password)) {
      matchNum++;
    }
    if (/[a-z]+/.test(password)) {
      matchNum++;
    }
    if (/[\\!@#\\$\\%\\^\\&\\*\\(\\)]+/.test(password)) {
      matchNum++;
    }
    if (matchNum < 2) {
      Message('密码6～20位,大写字母、小写字母、数字、特殊字符4种类型必须包含2种,特殊字符只支持!@#$%^&*()');
      return false;
    }
    return true;
  }

  reset() {
    let search = '';
    if (this.props.location && this.props.location.search) {
      search = this.props.location.search;
    }
    if ($.trim(this.state.code) === '') {
      this.setState({
        errMsg: '请设置密码',
      })
      return
    }
    if (!this.validatePassword(this.state.code)) {
      return
    }
    if (this.state.code !== this.state.code_again) {
      this.setState({
        errMsg: '密码不一致',
      })
      return
    }
    $.ajax({
      dataType: 'json',
      type: 'post',
      url: API.check_mobile,
      data: {
        step: 2,
        auth_sign: this.state.auth_sign,
        password: sha512(this.state.code),
        re_password: sha512(this.state.code_again),
      }
    }).done((res) => {
      if (res.code == 0) {
        //跳转到登录界面
        Message('重置成功')
        this.props.history.push(`/user/login${search}`);
      } else {
        this.setState({
          errMsg: res.msg,
        })
      }
    })
  }

  render() {
    let search = '';
    if (this.props.location && this.props.location.search) {
      search = this.props.location.search;
    }
    return this.state.step === 0 ? (
      <div className="out-box reset">
        <div className="title-box">重置密码</div>
        <div className="info-box">
          请输入您注册时使用的手机号码，以便验证信息无误后，为您重置密码<br/>
          无误后，为您重置密码！
        </div>
        <div className="phone-box form-box">
          <div className="title">手机号码</div>
          <input type="tel"
                 value={this.state.mobile}
                 maxLength={11}
                 placeholder="请输入手机号码"
                 onChange={(event) => {
                   this.setState({mobile: event.target.value})
                   this.is_register(event.target.value);
                 }}/>
        </div>
        <div className="verify-box">
          <input type="text"
                 value={this.state.captcha}
                 maxLength={6}
                 placeholder="请输入右图中的验证码"
                 onChange={(event) => {
                   this.setState({captcha: event.target.value})
                 }}
                 onKeyPress={(e) => {
                   if (e.charCode === 13) {
                     this.getDynamic();
                   }
                 }}
          />
          <div className="img" style={{
            backgroundImage: `url(${this.state.captcha_url})`
          }}></div>
          <div className="refresh-btn" onClick={this.refresh_verify.bind(this)}></div>
        </div>
        <div className="dynamic-box form-box">
          <div className="title">验证码</div>
          <input type="text"
                 placeholder="动态密码"
                 value={this.state.mobile_code}
                 maxLength={6}
                 onChange={(event) => {
                   this.setState({mobile_code: event.target.value,})
                 }}
                 onKeyPress={(e) => {
                   if (e.charCode === 13) {
                     this.ensure();
                   }
                 }}/>
          <div
            className={classNames('getDynamice-btn', {'valid': (this.isPhoneNum(this.state.mobile) && this.state.mobile_valid) && this.state.captcha})}
            style={this.state.showCountDown ? {display: 'none'} : {}}
            onClick={this.getDynamic.bind(this)}>获取验证码
          </div>
          <div className="countDown"
               style={this.state.showCountDown ? {} : {display: 'none'}}>{this.state.countDown}s后重发
          </div>
        </div>
        <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
          <div className="icon"></div>
          <div className="err">{this.state.errMsg}</div>
        </div>
        <div className="regiter-btn" onClick={this.ensure.bind(this)}>验证手机</div>
        <Link to={`/user/login${search}`} className="back">返回登录</Link>
      </div>
    ) : (
      <div className="out-box reset">
        <div className="title-box">重置密码</div>
        <div className="info-box">
          请输入您注册时使用的手机号码，以便验证信息无误后，为您重置密码<br/>
          无误后，为您重置密码！
        </div>
        <div className="code-box form-box">
          <div className="title">设置密码</div>
          <input type="password"
                 placeholder="请输入6-20位密码"
                 value={this.state.code}
                 maxLength={20}
                 onChange={(event) => {
                   this.setState({code: event.target.value.replace(/[^\w]/g, '')})
                 }}
                 onKeyPress={(e) => {
                   if (e.charCode === 32) {
                     Message('密码不能包含空格')
                   }
                   if (e.charCode === 13) {
                     this.reset()
                   }
                 }}/>
        </div>
        <div className="codeMore-box form-box">
          <div className="title">确认密码</div>
          <input type="password"
                 placeholder="请重复输入密码"
                 value={this.state.code_again}
                 maxLength={20}
                 onChange={(event) => {
                   this.setState({code_again: event.target.value})
                 }}
                 onKeyPress={(e) => {
                   if (e.charCode === 32) {
                     Message('密码不能包含空格')
                   }
                   if (e.charCode === 13) {
                     this.reset()
                   }
                 }}/>
        </div>
        <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
          <div className="icon"></div>
          <div className="err">{this.state.errMsg}</div>
        </div>
        <div className="regiter-btn reset-btn" onClick={this.reset.bind(this)}>重置密码</div>
        <div className="back" onClick={() => {
          this.setState({
            step: 0
          })
        }}>上一步
        </div>
      </div>
    );
  }
}

export default Reset;