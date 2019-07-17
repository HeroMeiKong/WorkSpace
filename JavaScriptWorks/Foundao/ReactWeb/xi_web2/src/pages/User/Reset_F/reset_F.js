import React, {Component} from 'react';
import './reset_F.scss';
import {Link} from 'react-router-dom';
// import API from "../../../config/api";
import API from "../../../API/api";
import Tool from "../../../utils/tool";
import $ from 'jquery';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Message} from 'element-react';
import {sha512} from 'js-sha512';

/* eslint-disable */

@connect(
    state => ({admin: state.admin}),
)

class Reset_F extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            email_code: '',
            errMsg: '',
            step: 0,
            code: '',
            code_again: '',
            auth_sign: ''
        };
    }

    componentWillMount() {
    }

    componentWillUnmount() {

    }

    //获取验证码
    getDynamic() {
        if (!Tool.isEmail(this.state.email)) {
            this.setState({
                errMsg: 'Incorrect Email format'
            })
            return
        }

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
                    // this.refresh_verify()
                })
                // Message(res.msg);
            }
        })
    }

    is_register(num) {
        if (!Tool.isEmail(num)) {
            return
        }
        $.ajax({
            dataType: 'json',
            type: 'get',
            url: API.is_register,
            data: {
                user_account: num,
                user_type: 4,
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
        $.ajax({
            dataType: 'json',
            type: 'post',

            url: API.check_mobile,
            data: {
                user_account: this.state.email,
                step: 1,
                user_type: 4,
            }
        }).done((res) => {
            if (parseInt(res.code) === 0) {
                this.setState({
                    step: 1,
                    errMsg: ''
                })
            } else {
                this.setState({
                    errMsg: res.msg
                })
            }
        })
    }

    ensure_code() {
        $.ajax({
            dataType: 'json',
            type: 'post',
            url: API.check_mobile,
            data: {
                user_account: this.state.email,
                step: 2,
                code: this.state.email_code,
                user_type: 4,
            }
        }).done((res) => {
            if (parseInt(res.code) === 0) {
                this.setState({
                    step: 2,
                    errMsg: ''
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
            // Message('Password 6 ~ 20 bits, capital letters, lowercase letters, Numbers, special characters 4 types must contain 2, special characters only support! @ # $% ^ & * ()');
            this.setState({errMsg: 'Password 6 ~ 20 bits, capital letters, lowercase letters, Numbers, special characters 4 types must contain 2, special characters only support! @ # $% ^ & * ()'});
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
            this.setState({errMsg: 'Password 6 ~ 20 bits, capital letters, lowercase letters, Numbers, special characters 4 types must contain 2, special characters only support! @ # $% ^ & * ()'});
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
                errMsg: 'Enter your password',
            })
            return
        }
        if (!this.validatePassword(this.state.code)) {
            return
        }
        if (this.state.code !== this.state.code_again) {
            this.setState({
                errMsg: 'Password inconsistency',
            })
            return
        }
        $.ajax({
            dataType: 'json',
            type: 'post',
            url: API.check_mobile,
            data: {
                user_account: this.state.email,
                step: 3,
                code: this.state.email_code,
                user_passwd: sha512(this.state.code),
                user_type: 4
            }
        }).done((res) => {
            if (res.code == 0) {
                //跳转到登录界面
                Message('Reset successfully')
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
                <div className="title-box">RESET PASSWORD</div>
                {/*<div className="info-box">*/}
                {/*请输入您注册时使用的手机号码，以便验证信息无误后，为您重置密码<br/>*/}
                {/*无误后，为您重置密码！*/}
                {/*</div>*/}
                <div className="phone-box form-box" style={{marginTop: '39px'}}>
                    <div className="title">Email</div>
                    <input type="tel"
                           value={this.state.email}
                           maxLength={99}
                           placeholder="Enter email address"
                           onChange={(event) => {
                               this.setState({email: event.target.value})
                               // this.is_register(event.target.value);
                           }}/>
                </div>
                <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
                    <div className="icon"></div>
                    <div className="err">{this.state.errMsg}</div>
                </div>
                <div className="regiter-btn" onClick={this.ensure.bind(this)}>NEXT STEP</div>
                <Link to={`/user/login${search}`} className="back">Back to login</Link>
            </div>
        ) : (
            this.state.step === 1 ? (
                <div className="out-box reset">
                    <div className="title-box">RESET PASSWORD</div>
                    <div className="phone-box form-box" style={{marginTop: '39px'}}>
                        <div className="title">Code</div>
                        <input type="tel"
                               value={this.state.email_code}
                               maxLength={99}
                               placeholder="Enter verification code"
                               onChange={(event) => {
                                   this.setState({email_code: event.target.value})
                                   // this.is_register(event.target.value);
                               }}/>
                    </div>
                    <div className="info-box"
                         style={{width: '414px', height: 'auto', marginTop: '20px', textAlign: 'left'}}>
                        Please check your email to find the vertification code we've sent to you
                    </div>
                    <div className="err-box" style={this.state.errMsg === '' ? {visibility: 'hidden'} : {}}>
                        <div className="icon"></div>
                        <div className="err">{this.state.errMsg}</div>
                    </div>
                    <div className="regiter-btn" style={{marginTop: '0'}} onClick={this.ensure_code.bind(this)}>NEXT
                        STEP
                    </div>
                    <Link to={`/user/login${search}`} className="back">Back to login</Link>
                </div>
            ) : ( <div className="out-box reset">
                <div className="title-box">RESET PASSWORD</div>
                <div className="code-box form-box">
                    <div className="title">Password</div>
                    <input type="password"
                           placeholder="6-20 digit password"
                           style={{padding: '0 70px'}}
                           value={this.state.code}
                           maxLength={20}
                           onChange={(event) => {
                               this.setState({code: event.target.value.replace(/[^\w]/g, '')})
                           }}
                           onKeyPress={(e) => {
                               if (e.charCode === 32) {
                                   Message('Password cannot contain spaces')
                               }
                               if (e.charCode === 13) {
                                   this.reset()
                               }
                           }}/>
                </div>
                <div className="codeMore-box form-box">
                    <div className="title">Confirm</div>
                    <input type="password"
                           style={{padding: '0 70px'}}
                           placeholder="Password confirmation"
                           value={this.state.code_again}
                           maxLength={20}
                           onChange={(event) => {
                               this.setState({code_again: event.target.value})
                           }}
                           onKeyPress={(e) => {
                               if (e.charCode === 32) {
                                   Message('Password cannot contain spaces')
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
                <div className="regiter-btn reset-btn" onClick={this.reset.bind(this)}>RESET</div>
                <Link to={`/user/login${search}`} className="back">Back to login</Link>
            </div>)

        );
    }
}

export default Reset_F;