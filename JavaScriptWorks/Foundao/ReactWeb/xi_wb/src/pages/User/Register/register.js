import React, {Component} from 'react';
import './register.scss';
import {Link} from 'react-router-dom';
// import API from "../../../config/api";
import API from "../../../API/api";
// import $ from 'jquery';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {login} from './../../../redux/models/admin';
import {Message} from 'element-react';
import {sha512} from 'js-sha512';
import tool from '@/utils/tool'
const $ = window.jQuery;
/* eslint-disable */

@connect(
    state => ({admin: state.admin}),
    {login}
)

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errMsg: '',
            mobile: '',//手机号
            captcha: '',//图片验证码
            verify: '',//验证码
            code: '',//密码
            code_again: '',//再次输入密码
            showCountDown: false,//显示倒计时
            countDown: 0,//发送验证码倒计时
            isAgree: false,//同意协议
            mobile_valid: false,//手机是否有效（被注册）
            captcha_url: '',//验证码地址
            // 国外注册
            email: '',//国外注册
            code_f: '',
            code_again_f: '',
        };

        this.countDown_timer = null;
        this.getDynamicing = false;
        this.registering = false;

    }

    componentWillMount() {
        this.refresh_verify();
    }

    componentDidMount() {
        // var query = window.location.search;
        // var reg = query.substring(query.lastIndexOf('=') + 1, query.length);
        // console.log(reg)
        // if (reg) {
        //   this.setState({
        //     mobile: reg
        //   })
        // }
    }

    //刷新验证码
    refresh_verify() {
        $(this.refs.captcha_input).val('');
        this.setState({
            captcha: '',
            captcha_url: API.get_captcha + '?t=' + Date.parse(new Date())
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

    //注册
    register() {
        if (this.registering) {
            return
        }

        if (!this.isPhoneNum(this.state.mobile)) {
            this.setState({
                errMsg: '请输入正确的手机号',
            })
            return
        }
        if (!this.state.mobile_valid) {
            this.setState({
                errMsg: '此手机号已被注册',
            })
            return
        }

        if (!this.state.captcha) {
            this.setState({
                errMsg: '请输入图形验证码',
            })
            return
        }
        if ($.trim(this.state.verify) === '') {
            this.setState({
                errMsg: '请输入验证码',
            })
            return
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
        if (!this.state.isAgree) {
            this.setState({
                errMsg: '请阅读并同意条款',
            })
            return
        }
        this.registering = true
        $.ajax({
            dataType: 'json',
            type: 'post',
            url: API.mobile_register,
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            data: {
                mobile: this.state.mobile,
                password: sha512(this.state.code),
                re_password: sha512(this.state.code_again),
                mobile_code: this.state.verify,
                sid: this.props.admin.sid || '',
                pf: 'web',
            }
        }).done((res) => {
            this.registering = false
            if (parseInt(res.code) === 0) {
                localStorage.setItem('x_token', res.data.token);
                this.loginSuccess(res.data);
            } else {
                this.setState({
                    errMsg: res.msg,
                })
            }
        })

    }

    // 邮箱注册
    register_f() {
      if (this.registering) {
          return
      }
      if (!tool.isEmail(this.state.email)) {
          this.setState({
              errMsg: 'Incorrect Email format',
          })
          return
      }
      if ($.trim(this.state.code) === '') {
          this.setState({
              errMsg: 'Enter your password',
          })
          return
      }
      if (this.state.code !== this.state.code_again) {
          this.setState({
              errMsg: 'Password inconsistency',
          })
          return
      }

      this.registering = true
      window.gtag&&window.gtag('event', 'click', {'event_category': 'register', 'event_label': 'video'});
      $.ajax({
          dataType: 'json',
          type: 'post',
          url: API.email_register,
          // xhrFields: {
          //     withCredentials: true,
          // },
          // crossDomain: true,
          data: {
              user_account: this.state.email,
              user_passwd: sha512(this.state.code),
          }
      }).done((res) => {
          this.registering = false
          if (parseInt(res.code) === 0) {
              localStorage.setItem('x_token', res.data.token);
              this.loginSuccess(res.data);
          } else {
              this.setState({
                  errMsg: res.msg,
              })
          }
      })
    }

    //获取验证码
    getDynamic() {

        //入口控制
        if (this.getDynamicing) {
            return
        }

        if (!this.isPhoneNum(this.state.mobile)) {
            this.setState({
                errMsg: '请输入正确的手机号',
            })
            return
        }
        if (!this.state.mobile_valid) {
            this.setState({
                errMsg: '此手机号已被注册',
            })
            return
        }

        if (!this.state.captcha) {
            this.setState({
                errMsg: '请输入图形验证码',
            })
            return
        }

        this.getDynamicing = true;
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
            this.getDynamicing = false;
            if (parseInt(res.code) === 0) {
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
                this.refs.refresh_verify.click();
                this.setState({
                    errMsg: res.msg
                })
                // Message(res.msg);
            }
        })
    }

    //验证手机号码是否有效
    isPhoneNum(num) {
        var reg = /^1[345678]\d{9}$/;
        if (reg.test(num)) {
            return true
        } else {
            return false
        }
    }

    //判断手机是否已被注册
    is_register(num) {
        var _this = this;
        if (!this.isPhoneNum(num)) {
            this.setState({
                errMsg: num.length === 11 ? '此手机号无效' : '',
            })
            return
        }
        $.ajax({
            dataType: 'json',
            type: 'get',
            url: API.is_register,
            data: {
                mobile: num,
            }
        }).done(function (res) {
            if (parseInt(res.code) === 0) {
                if (parseInt(res.data.is_register) === 1) {//已注册
                    _this.setState({
                        errMsg: '此手机号已被注册',
                        mobile_valid: false
                    })
                } else {
                    _this.setState({
                        errMsg: '',
                        mobile_valid: true,
                    })
                }
            } else {
                Message(res.msg)
            }
        })
    }

    // 登录成功
    loginSuccess = (userInfo = {}) => {
        this.props.login(userInfo);
        const params = tool.getParams();
        // 未登录会重定向到登录页面，携带当前url
        const callback = params.callback;
        if (callback) {
            window.location.href = decodeURIComponent(callback);
        } else {
            this.props.history.push('/home');
        }
    };

    render() {
        const {isForeign} = this.props.admin;
        let search = '';
        if (this.props.location && this.props.location.search) {
            search = this.props.location.search;
        }
        return (
            <div className="out-box register">
                <div className="nav-box">
                    <Link className="nav" to={`/user/login${search}`}>
                        <div className="text">{window.intl.get("登录")}</div>
                        <div className="icon"></div>
                    </Link>
                    <div className="nav select">
                        <div className="text">{window.intl.get("注册")}</div>
                        <div className="icon"></div>
                    </div>
                </div>
                <div className="line"></div>
                {
                    isForeign ? (
                        <div>
                            {/*邮箱*/}
                            <div className="phone-box form-box">
                                <div className="title">Email</div>
                                <input type="email"
                                       autoComplete="off"
                                       id="userEmail"
                                       name="userEmail"
                                       maxLength={99}
                                       value={this.state.email}
                                       placeholder="Enter your Email"
                                       onChange={(event) => {
                                           // const email = event.target.value.replace(/[^\d]/g, '')
                                           this.setState({email: event.target.value})
                                       }}/>
                            </div>
                            {/*密码*/}
                            <div className="code-box form-box">
                                <div className="title">Password</div>
                                <input type="password"
                                       placeholder="Enter your password"
                                       maxLength={20}
                                       onChange={(event) => {
                                           this.setState({code: event.target.value})
                                       }}
                                       onKeyPress={(e) => {
                                           if (e.charCode === 13) {
                                               this.register_f();
                                           }
                                       }}
                                />
                            </div>
                            {/*确认密码*/}
                            <div className="codeMore-box form-box">
                                <div className="title">Confirm</div>
                                <input type="password"
                                       placeholder="Password confirmation"
                                       maxLength={20}
                                       onKeyPress={(e) => {
                                           if (e.charCode === 13) {
                                               this.register_f();
                                           }
                                       }}
                                       onChange={(event) => {
                                           this.setState({code_again: event.target.value})
                                       }}/>
                            </div>
                            {/*错误信息*/}
                            <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
                                <div className="icon"></div>
                                <div className="err">{this.state.errMsg}</div>
                            </div>
                            {/*注册*/}
                            <div className="regiter-btn" onClick={this.register_f.bind(this)}
                                 style={{marginBottom: '77px'}}>Sign up
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="phone-box form-box">
                                <div className="title">手机号码</div>
                                <input type="tel"
                                       autoComplete="off"
                                       id="username"
                                       name="username"
                                       maxLength={11}
                                       value={this.state.mobile}
                                       placeholder="请输入手机号码"
                                       onChange={(event) => {
                                           const mobile = event.target.value.replace(/[^\d]/g, '')
                                           this.setState({mobile: mobile})
                                           this.is_register(event.target.value);
                                       }}/>
                            </div>
                            <div className="verify-box">
                                <input type="text"
                                       ref="captcha_input"
                                       id="captcha_input"
                                       maxLength={6}
                                       placeholder="请输入右图中的验证码"
                                       onChange={(event) => {
                                           this.setState({captcha: event.target.value})
                                       }}
                                       onKeyPress={(e) => {
                                           if (e.charCode === 13) {
                                               this.getDynamic();
                                           }
                                       }}/>
                                <div className="img" style={{
                                    backgroundImage: `url(${this.state.captcha_url})`
                                }}></div>
                                <div className="refresh-btn" ref='refresh_verify'
                                     onClick={this.refresh_verify.bind(this)}></div>
                            </div>
                            <div className="dynamic-box form-box">
                                <div className="title">验证码</div>
                                <input type="text" placeholder="动态密码" maxLength={6} onChange={(event) => {
                                    this.setState({verify: event.target.value,})
                                }}/>
                                <div
                                    className={classNames('getDynamice-btn', {'valid': (this.isPhoneNum(this.state.mobile) && this.state.mobile_valid)})}
                                    style={this.state.showCountDown ? {display: 'none'} : {}}
                                    onClick={this.getDynamic.bind(this)}>获取验证码
                                </div>
                                <div className="countDown"
                                     style={this.state.showCountDown ? {} : {display: 'none'}}>{this.state.countDown}s后重发
                                </div>
                            </div>
                            <div className="code-box form-box">
                                <div className="title">设置密码</div>
                                <input type="password"
                                       placeholder="请输入6-20位密码"
                                       maxLength={20}
                                       onChange={(event) => {
                                           this.setState({code: event.target.value})
                                       }}
                                       onKeyPress={(e) => {
                                           if (e.charCode === 13) {
                                               this.register();
                                           }
                                       }}
                                />
                            </div>
                            <div className="codeMore-box form-box">
                                <div className="title">确认密码</div>
                                <input type="password"
                                       placeholder="请重复输入密码"
                                       maxLength={20}
                                       onKeyPress={(e) => {
                                           if (e.charCode === 13) {
                                               this.register();
                                           }
                                       }}
                                       onChange={(event) => {
                                           this.setState({code_again: event.target.value})
                                       }}/>
                            </div>
                            <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
                                <div className="icon"></div>
                                <div className="err">{this.state.errMsg}</div>
                            </div>
                            <div className="regiter-btn" onClick={this.register.bind(this)}>同意条款并注册</div>
                            <div className="info-box">
                                <div className={classNames('icon', {'select': this.state.isAgree})} onClick={() => {
                                    this.setState({
                                        isAgree: !this.state.isAgree
                                    })
                                }}/>
                                <div className="text">已经阅读并同意</div>
                                <div className="info-a" onClick={() => {
                                    this.props.history.push('/userTerms')
                                }}>《喜视频用户使用说明》
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default Register;