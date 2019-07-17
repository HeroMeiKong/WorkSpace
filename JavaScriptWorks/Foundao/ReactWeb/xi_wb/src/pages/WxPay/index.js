import React, {Component} from 'react'
import './index.scss'
import messageBox from '@/utils/messageBox'
import httpRequest from "@/utils/httpRequest";
import API from '@/API/api'
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";

@connect(
  state => ({admin: state.admin}),
  {login}
)


export default class WxPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_id: '',
      dateTime: '',
      pay_data: {}, //支付详情
      isOrder: true, //订单是否存在
      isOut: false, //订单是否过期
      isSuccess: false, //订单是否支付成功
    }
    this.time = 5
  }

  componentDidMount() {
    window.scrollTo(0,0)
    const params = this.props.match.params
    this.setState({
      order_id: params.id
    }, () => {
      this.payMent()
    })
    // console.log(sessionStorage.getItem('muli'))
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.queryTimer)
    clearInterval(this.countTimer)
  }

  //查询订单状态
  queryOrder = () => {
    const {order_id} = this.state
    const user_info = this.props.admin
    var _this = this
    httpRequest({
      url: API.query_order,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token,
        pay_type: 'wxpay',
        out_trade_no: order_id
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        if (res.data.pay_status === 'success') { //支付成功
          this.setState({isSuccess: true}, () => {
            clearInterval(this.queryTimer)
            _this.countTimer = setInterval(function () {
              _this.time = _this.time - 1
              _this.forceUpdate()
              if (_this.time === 0) {
                if(sessionStorage.getItem('muli')){
                  sessionStorage.removeItem('muli')
                  _this.props.history.push('/merge?wxpay&out_trade_no='+order_id)
                } else if(sessionStorage.getItem('watermark')){
                  sessionStorage.removeItem('watermark')
                  _this.props.history.push('/watermark?wxpay&out_trade_no='+order_id)
                } else if(sessionStorage.getItem('remove')){
                  sessionStorage.removeItem('remove')
                  _this.props.history.push('/remove?wxpay&out_trade_no='+order_id)
                }else if(sessionStorage.getItem('converter')){
                  sessionStorage.removeItem('converter')
                  _this.props.history.push('/converter?wxpay&out_trade_no='+order_id)
                } else {
                  _this.props.history.push('/convert?wxpay&out_trade_no='+order_id)
                }
              }
            }, 1000)
          })
        } else { //未失败
          this.setState({isSuccess: false})
        }
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.setInterval.get('内部服务器错误！'))
    })
  }

  //调用支付接口
  payMent = () => {
    const {order_id} = this.state
    const user_info = this.props.admin
    var _this = this
    httpRequest({
      url: API.payment,
      dataType: 'json',
      type: 'POST',
      data: {
        order_id: order_id,
        token: user_info.token,
        pay_type: 'wxpay',
        return_url: ''
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        this.setState({
          pay_data: res.data,
          isOrder: true
        }, () => {
          //每隔60s减少一分钟倒计时
          _this.timer = setInterval(function () {
            const {pay_data} = _this.state
            if (pay_data.pay_time_expire <= 0) {  //订单过期
              _this.setState({isOut: true})
            } else {
              pay_data.pay_time_expire -= 60
              _this.setState({pay_data})
            }
          }, 60000)

          //每2秒轮询订单结果
          _this.queryTimer = setInterval(function () {
            _this.queryOrder()
          }, 2000)

          this.createQR(res.data.pay_url)
        })
      } else {
        messageBox(res.msg)
        this.setState({isOrder: false})
      }
    }).fail(() => {
      messageBox(window.setInterval.get('内部服务器错误！'))
    })
  }

  //生成二维码
  createQR = (url) => {
    new window.QRCode(document.getElementById("qrcode"), {
      text: url,
      width: 224,
      height: 224,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });
  }


  render() {
    const {isOrder, pay_data, order_id, isOut, isSuccess} = this.state
    return (
      <div className="wx_pay_bg">
        <div className="wx_pay_box">
          <div className="wx_pay_head">
            <div className="wx_pay_icon"></div>
            <p className="wx_pay_tit">微信支付 | 收银台</p>
          </div>
          {isOrder && !isOut && !isSuccess ?
            <div className="wx_pay_content">
              <div className="wx_pay_QR">
                <h2 className="wx_pay_time">
                  订单将在{parseInt(pay_data.pay_time_expire / 60,0) || 30}分钟后关闭，请及时付款</h2>
                <div className="qrcode" id="qrcode"></div>
                <p className="qrcode_tip">请使用微信扫一扫完成支付</p>
              </div>
              <div className="qrcode_line"></div>
              <div className="wx_pay_main">
                <p className="pay_main_tit">VIP服务订单</p>
                <div className="pay_main_price">{pay_data.price}</div>
                <p className="pay_main_detail">
                  <span className="pay_detail_left">收款方</span>
                  天脉拓道（北京）科技有限公司
                </p>
                <p className="pay_main_detail">
                  <span className="pay_detail_left">下单时间</span>
                  {pay_data.gmt_create || ''}
                </p>
                <p className="pay_main_detail">
                  <span className="pay_detail_left">订单号</span>
                  {pay_data.order_id}
                </p>
              </div>
            </div>
            :
            <div className="wx_pay_error">
              <div className={isSuccess ? "order_success_icon" : "order_error_icon"}></div>
              <p className="order_error_tip">
                {isOut ? '您的订单已过期' : isSuccess ? '恭喜您支付成功' : '请求参数错误'}
              </p>
              <p className="order_error_id">订单号：{order_id || ''}</p>
              {isSuccess ?
                <p className="order_daojishi">
                  页面将于<span style={{fontWeight: 'bold'}}>{this.time}s</span>后跳转
                </p> : ''
              }
            </div>
          }
        </div>
      </div>
    )
  }
}