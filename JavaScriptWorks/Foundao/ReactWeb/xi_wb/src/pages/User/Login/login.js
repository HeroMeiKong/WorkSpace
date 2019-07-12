import React, {Component} from 'react';
import './../Register/register.scss';
import './login.scss';
import {Link} from 'react-router-dom';
import API from "../../../API/api";
// import $ from 'jquery';
import {connect} from 'react-redux';
// import classNames from 'classnames';
import {login, show_loading, hide_loading} from './../../../redux/models/admin';
import tool from '@/utils/tool';
import {sha512} from 'js-sha512';
// import facebook from './../../../assets/facebook_icon@2x.png';
// import google from './../../../assets/google@2x.png';
import {Message} from 'element-react';

const $ = window.jQuery;
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
            code: '',
            autoLogin: false,
            type: 0,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        var _this = this
        window.getUserInfo = function (code, type) {
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
                    code: code,
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
        if ($.trim(this.state.code) === '') {
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
            // url: 'http://cd.foundao.com:10080/foundao_api_zh/login/dologin',
            data: {
                user_from: this.props.admin.isForeign ? 4 : 3,
                user_account: this.state.mobile,
                user_passwd: sha512(this.state.code),
                // mobile: this.state.mobile,
                // password: sha512(this.state.code),
                // password: this.state.code,
                // auto_login: this.state.autoLogin ? 1 : 0,
                // sid: this.props.admin.sid || '',
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
    };

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

    render() {
        const {errMsg} = this.state
        const {isForeign} = this.props.admin

        let search = '';
        // console.log(this.props.location)
        if (this.props.location && this.props.location.search) {
            search = this.props.location.search;
        }
        return (
            <div className="out-box register">

                <div className="nav-box">
                    <div className="nav select">
                        <div className="text">{window.intl.get("登录")}</div>
                        <div className="icon"></div>
                    </div>
                    <Link className="nav" to={`/user/register${search}`}>
                        <div className="text">{window.intl.get("注册")}</div>
                        <div className="icon"></div>
                    </Link>
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
                <div className="code-box form-box">
                    <div className="title">{window.intl.get("密码")}</div>
                    <input type="password"
                           maxLength={20}
                           placeholder={window.intl.get("请输入密码")}
                           value={this.state.code}
                           onChange={(event) => {
                               this.setState({code: event.target.value})
                           }}
                           onKeyPress={(e) => {
                               if (e.charCode === 13) {
                                   this.login();
                               }
                           }}/>
                </div>
                <div className="err-box" style={errMsg === '' ? {visibility: 'hidden'} : {}}>
                    <div className="icon"></div>
                    <div className="err">{errMsg === '' ? '' : errMsg}</div>
                </div>
                <div className="regiter-btn" onClick={this.login.bind(this)}>{window.intl.get("登录")}</div>
                <div className="assset-box">
                    {/*<div className="auto-box">*/}
                    {/*<div className={classNames('icon', {'select': this.state.autoLogin})} onClick={() => {*/}
                    {/*this.setState({*/}
                    {/*autoLogin: !this.state.autoLogin*/}
                    {/*})*/}
                    {/*}}/>*/}
                    {/*<div className="text">{window.intl.get("自动登录")}</div>*/}
                    {/*</div>*/}
                    <Link className="forget"
                          to={isForeign ? `/user/reset_f${search}` : `/user/reset${search}`}>{window.intl.get("忘记密码 ？")}</Link>
                </div>
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