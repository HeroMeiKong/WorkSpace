import React, { Component, Fragment } from 'react';
import './../Register/register.scss';
import './login.scss';
import {Link} from 'react-router-dom';
import API from "../../../API/api";
import $ from 'jquery';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {login, show_loading, hide_loading} from './../../../redux/models/admin';
import tool from '@/utils/tool';
import {sha512} from 'js-sha512';
import facebook from './../../../assets/facebook_icon@2x.png';
import google from './../../../assets/google@2x.png';
import {Message} from 'element-react';

let authWin = '';

/* eslint-disable */
@connect(
    state => ({admin: state.admin}),
    {login, show_loading, hide_loading}
)


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMsg: '',
            mobile: '',
            password: '',
            autoLogin: false,
            type: 0,
            codeOrPassword: false,
            canISend: true, //能发送验证码吗？
            codeText: '60s',
            dymicCode: '',//动态验证码
        };
    }

    componentDidMount() {
        var _this = this
        window.getUserInfo = function (password, type) {
            if (authWin) {
                authWin.close()
            }
            _this.props.show_loading()
            $.ajax({
                url: API.login,
                dataType: 'json',
                type: 'POST',
                data: {
                    user_from: type,
                    code: password,
                    redirect_url: API.return_url
                }
            }).done((res) => {
                _this.props.hide_loading()
                if (res.code / 1 === 0) {
                    // 保存用户信息
                    tool.setUserData_storage(res.data);
                    // 登录
                    _this.loginSuccess(res.data);

                } else {
                    Message(res.msg)
                }
            }).fail(() => {
                Message( window.intl.get('内部服务器错误！'))
            })
        }
    }

    //登录
    login() {
        if(this.state.codeOrPassword){
            if ($.trim(this.state.password) === '') {
                this.setState({
                    errMsg: window.intl.get('请输入密码')
                })
                return
            }
            if ($.trim(this.state.mobile) === '') {
                this.setState({
                    errMsg: this.props.admin.isForeign ?  window.intl.get('请输入邮箱') :  window.intl.get('请输入手机号')
                })
                return
            }
            this.props.show_loading()
            $.ajax({
                dataType: 'json',
                type: 'post',
                url: API.login,
                data: {
                    user_from: this.props.admin.isForeign ? 4 : 3,
                    user_account: this.state.mobile,
                    user_passwd: sha512(this.state.password)
                }
            }).done((res) => {
                this.props.hide_loading()
                if (res.code == 0) {
                    this.loginSuccess(res.data);
                } else {
                    this.setState({
                        errMsg: res.msg
                    })
                }
            })
        } else {
            if ($.trim(this.state.dymicCode) === '') {
                this.setState({
                    errMsg: '请输入动态验证码'
                })
                return
            }
            if ($.trim(this.state.mobile) === '') {
                this.setState({
                    errMsg: this.props.admin.isForeign ?  window.intl.get('请输入邮箱') :  window.intl.get('请输入手机号')
                })
                return
            }
            this.props.show_loading()
            $.ajax({
                dataType: 'json',
                type: 'post',
                url: API.login,
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    user_from: this.props.admin.isForeign ? 4 : 3,
                    user_account: this.state.mobile,
                    user_passwd: this.state.dymicCode,
                    is_captcha: 1
                }
            }).done((res) => {
                this.props.hide_loading()
                if (res.code == 0) {
                    this.loginSuccess(res.data);
                } else {
                    this.setState({
                        errMsg: res.msg
                    })
                }
            })
        }
    }

    //前往二维码登录
    qrcode() {
        this.props.history.push('./qrcode')
    }

    // 登录成功
    loginSuccess = (userInfo = {}) => {
        this.props.login(userInfo);
        const params = tool.getParams();
        // 未登录会重定向到登录页面，携带当前url
        const callback = params.callback;
        if (callback) {
            if(localStorage.getItem('pay_page')){
                // this.props.history.push(localStorage.getItem('pay_page'))
                window.location.href = localStorage.getItem('pay_page')
            }  else {
                window.location.href = decodeURIComponent(callback)
            }
        } else {
            if(localStorage.getItem('pay_page')){
                // this.props.history.push(localStorage.getItem('pay_page'))
                window.location.href = localStorage.getItem('pay_page')
            } else {
                this.props.history.push('/home')
                window.location.reload()
            }
            
        }
        localStorage.removeItem('pay_page')
    }

    glogin(type) {
        this.setState({
            type: type,
        }, () => {
            authWin = window.open('', 'newWindow', "height=500, width=650, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=nom,left=100px,top=200px")
            //获取地址
            this.props.show_loading();
            $.ajax({
                url: API.get_auth_url,
                type: 'POST',
                dataType: 'json',
                data: {
                    user_from: type ? type : '', //4邮箱 5facebook 6google
                    redirect_url: API.return_url
                }
            }).done((res) => {
                this.props.hide_loading()
                if (res.code / 1 === 0) {
                    const url = res.data  //呼起的授权地址
                    authWin.location = url
                } else {
                    Message(res.msg)
                }
            }).fail(() => {
                Message( window.intl.get('内部服务器错误！'))
            })
        })
    }

    changeBox = (text) => {
        let codeOrPassword = 'code'
        if(text === 'code'){
            codeOrPassword = false
        } else {
            codeOrPassword = true
        }
        this.setState({codeOrPassword})
    }

    checkPhone = () => {
        const { canISend } = this.state
        let time = null
        if(canISend){
            const phone = this.state.mobile
            if(!(/^1[3456789]\d{9}$/.test(phone))){ 
                alert("手机号码有误，请重填");  
                this.setState({canISend: true})
            } else {
                let times = 60
                time = setInterval(() => {
                    times--
                    console.log(times)
                    console.log(typeof times)
                    if(times < 1){
                        clearInterval(time)
                        this.setState({
                            codeText: '60s',
                            canISend: true
                        })
                    } else {
                        this.setState({codeText: times+'s'})
                    }
                }, 1000);
                $.ajax({
                    dataType: 'json',
                    url: API.send_mobile_code,
                    xhrFields: {
                        withCredentials: true,
                    },
                    crossDomain: true,
                    data: {
                        mobile: this.state.mobile,
                    }
                }).done((res) => {
                    console.log(res)
                    if(res.code === '0'){
                        alert('发送验证码成功')
                    } else {
                        alert('发送验证码失败')
                    }
                }).fail((res) => {
                    console.log('fail')
                })
                this.setState({canISend: false})
            }
        }
    }

    render() {
        const { errMsg, codeOrPassword, codeText, canISend, password, dymicCode } = this.state
        const {isForeign} = this.props.admin

        let search = '';
        // console.log(this.props.location)
        if (this.props.location && this.props.location.search) {
            search = this.props.location.search;
        }
        return (
            <div className="out-box register">
                <div className="nav-box">
                    <div className={codeOrPassword ? 'nav' : 'nav select'}>
                        <div className="text" onClick={this.changeBox.bind(this,'code')}>{window.intl.get("快捷登录")}</div>
                        <div className="icon"></div>
                    </div>
                    <div className={codeOrPassword ? 'nav select' : 'nav'}>
                        <div className="text" onClick={this.changeBox.bind(this,'password')}>{window.intl.get("密码登录")}</div>
                        <div className="icon"></div>
                    </div>
                </div>
                <div className="line line-login"></div>
                <div className="phone-box form-box">
                    <div className="title">{window.intl.get(isForeign ? "邮箱" : "手机号码")}</div>
                    <input type="tel"
                           maxLength={isForeign ? 99 : 11}
                           placeholder={window.intl.get(isForeign ? "请输入邮箱" : "请输入手机号码")}
                           value={this.state.mobile}
                           onChange={(event) => {
                               var mobile = ''
                               if (!isForeign) {
                                   mobile = event.target.value.replace(/[^\d]/g, '')
                               } else {
                                   mobile = event.target.value
                               }
                               this.setState({mobile: mobile})
                           }}
                           onKeyPress={(e) => {
                               if (e.charCode === 13) {
                                   this.login();
                               }
                           }}/>
                </div>
                {codeOrPassword
                ?   <div className="code-box form-box">
                        <div className="title">密码</div>
                        <input type="password"
                            maxLength={20}
                            placeholder={'请输入密码'}
                            value={password}
                            onChange={(event) => {
                                this.setState({password: event.target.value})
                            }}
                            onKeyPress={(e) => {
                                if (e.charCode === 13) {
                                    this.login();
                                }
                            }}/>
                    </div>
                :   <Fragment>
                        <p className='login_tips'>未注册的手机号验证后自动创建喜视频账号</p>
                        <div className="code-box form-box">
                            <div className="title">动态验证</div>
                            <input className='dymic' type="password"
                                maxLength={20}
                                placeholder={'动态验证码'}
                                value={dymicCode}
                                onChange={(event) => {
                                    this.setState({dymicCode: event.target.value})
                                }}
                                onKeyPress={(e) => {
                                    if (e.charCode === 13) {
                                        this.login();
                                    }
                                }}/>
                            <div className='dymic_code' onClick={this.checkPhone}>{canISend ? '获取验证码' : codeText}</div>
                        </div>
                    </Fragment>
                }
                <div className="err-box" style={errMsg === '' ? {visibility: 'hidden'} : {}}>
                    <div className="icon"></div>
                    <div className="err">{errMsg === '' ? '' : errMsg}</div>
                </div>
                <div className="regiter-btn" onClick={this.login.bind(this)}>{window.intl.get("登录")}</div>
                {codeOrPassword
                ?   <div className="assset-box">
                        {/*<div className="auto-box">*/}
                        {/*<div className={classNames('icon', {'select': this.state.autoLogin})} onClick={() => {*/}
                        {/*this.setState({*/}
                        {/*autoLogin: !this.state.autoLogin*/}
                        {/*})*/}
                        {/*}}/>*/}
                        {/*<div className="text">{window.intl.get("自动登录")}</div>*/}
                        {/*</div>*/}
                        <Link className="forget" to={isForeign ? `/user/reset_f${search}` : `/user/reset${search}`}>{window.intl.get("忘记密码 ？")}</Link>
                    </div>
                :   <div className="assset-box">
                        {/*<div className="auto-box">*/}
                        {/*<div className={classNames('icon', {'select': this.state.autoLogin})} onClick={() => {*/}
                        {/*this.setState({*/}
                        {/*autoLogin: !this.state.autoLogin*/}
                        {/*})*/}
                        {/*}}/>*/}
                        {/*<div className="text">{window.intl.get("自动登录")}</div>*/}
                        {/*</div>*/}
                        <p>登录即默认已经阅读并同意<a href='/userTerms' target="_blank">《喜视频用户使用说明》</a></p>
                    </div>
                }
                {/*扫码登录*/}
                {/*<div className="qrcode-box-new">*/}
                {/*<div className="qrcode-icon" onClick={this.qrcode.bind(this)}></div>*/}
                {/*</div>*/}
                {/*<div className="qrcode-box">*/}
                {/*<div className="qrcode-btn" onClick={this.qrcode.bind(this)}>扫码登入</div>*/}
                {/*</div>*/}
                {
                    isForeign ? (
                        <div className="sol_bottom">
                            <div className="sol_bottom_title">Or signin with:</div>
                            <div className="sol_bottom_img_facebook"
                                 onClick={this.glogin.bind(this, 5)}></div>
                            <div className="sol_bottom_img_google"
                                 onClick={this.glogin.bind(this, 6)}></div>
                        </div>
                    ) : ('')
                }
            </div>
        );
    }
}

export default Login;