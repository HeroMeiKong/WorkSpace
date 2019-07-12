import React, {Component} from 'react';
import './../Register/register.scss';
import './QRLogin.scss';
import API from "../../../config/api";
// import $ from 'jquery';
import {connect} from 'react-redux';
import {login} from './../../../redux/models/admin';
import tool from '@/utils/tool'
/* eslint-disable */
const $ = window.jQuery;
@connect(
  state => ({admin: state.admin}),
  {login}
)

class QRLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: '',
      mobile: '',
      code: '',
      autoLogin: false,
      qrCode_img: '',//二维码图片
      gid: '',
    };
    this.ws = null;
  }

  componentWillMount() {
    this.getQRData()
  }

  componentDidMount() {
    this.openWebSocket();
  }

  componentWillUnmount() {
    this.ws.close();
    this.ws = null;
  }

  //前往密码登录
  go() {
    this.props.history.push('./login')
  }

  //////////////// websocket相关//////////////////
  openWebSocket() {
    this.ws = new WebSocket(API.wsURL);
    this.ws.onmessage = (evt) => {
      this.onMessage(evt);
    };
    this.ws.onopen = (evt) => {
      this.onOpen(evt);
    };
    this.ws.onclose = (evt) => {
      this.onClose(evt);
      if (this.ws !== null) {
        this.openWebSocket();
      }

    };
    this.ws.onerror = (evt) => {
      this.onError(evt);
    };
  }

  onOpen(evt) {
    console.log("connected");
  }

  onClose(evt) {
    console.log("连接关闭");
  }

  onError(evt) {
    console.log("链接失败");
  }

  onMessage(evt) {
    var data = JSON.parse(evt.data);
    switch (data["cmd"]) {
      case "connected":
//                alert("开始绑定global_id")
        console.log(data);
        var msg = {
          "cmd": "qrcode_prepare_login",
          "global_id": this.state.gid,
          "client_id": data.data.client_id
        };
        this.ws.send(JSON.stringify(msg));
        break;
      case "login":
        console.log(data);
        if (data.data.token) {
          //登录
          localStorage.setItem('x_token', data.data.token);
          this.loginSuccess(data.data)
        }
        break;
      case "exception":
        console.log(data.msg);
        break;
      default:
        break;
    }
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
      this.props.history.push('./');
    }
  };

  render() {
    return (
      <div className="out-box register">
        <div className="qrLogin-box">
          <div className="title">使用喜Live APP扫码登录</div>
          {/*<div className="qrPic" style={{*/}
          {/*backgroundImage: 'url(' + API.URL.login_qrcode + ')'*/}
          {/*}}></div>*/}
          <img className="qrPic" src={this.state.qrCode_img} alt=""/>
          {/*<div className="go-box">*/}
          {/*<div className="btn" onClick={this.go.bind(this)}>账号登入</div>*/}
          {/*</div>*/}
          <div className="qrcode-box-new">
            <div className="qrcode-code" onClick={this.go.bind(this)}></div>
          </div>
        </div>
      </div>
    );
  }

  //获取二维码相关数据:二维码图片地址、gid(用于ws连接时使用)
  getQRData() {
    $.ajax({
      dataType: 'json',
      async: false,
      type: 'get',
      url: API.URL.login_qrcode,
      data: {},
    }).done((res) => {
      if (parseInt(res.code) === 0) {
        this.setState({
          qrCode_img: 'data:image/png;base64,' + res.data.image_data,
          gid: res.data.gid,
        })
      }
    })
  }
}

export default QRLogin;