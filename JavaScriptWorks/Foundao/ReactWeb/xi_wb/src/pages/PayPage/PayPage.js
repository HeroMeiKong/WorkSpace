import React, { Component } from 'react'
import './PayPage.scss'
import _tool from '@/utils/tool'
// import CONST from '@/config/const'
import HttpRequest from "@/utils/httpRequest";
import _api from "@/API/api";
import messageBox from '@/utils/messageBox'
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
import SetMeal from './SetMeal/SetMeal'

class PayPage extends Component {
  constructor() {
    super()
    this.state = {
      order_data: {}, //订单详情
      pay_data: {}, //支付详情
      pay_type: 'alipay', //支付类型
      isSelect: false, //选择支付方式弹框
      goods_id: '', //套餐id
      packageData: [],//所有套餐
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0)
    this.getPackage()
  }

  //查询用户是否开通套餐
  getPackage = () => {
    HttpRequest({
      url: _api.getWatermarkMeal,
      dataType: 'json',
    }).done((res) => {
      if (res.code / 1 === 0) {
        this.setState({packageData: res.data})
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //点击购买套餐
  payVip = (id) => {
    // window.gtag && window.gtag('event', 'click', {'event_category': 'pay', 'event_label': 'video'}) //统计购买
    const user_info = this.props.admin
      if (!id) {
        return
      }
      if(user_info.isForeign){
        this.setState({
          pay_type: 'paypal',
          goods_id: id,
        }, () => {
          this.createOrder(id)
        })
      } else {
        this.setState({
          goods_id: id,
          isSelect: true
        })
      }
  }

  //选择支付方式
  selectPay = (pay_type) => {  //pay_type   1为支付宝 2为微信
    const {goods_id} = this.state
    if (!goods_id) {
      return
    }
    this.setState({
      pay_type: pay_type,
      isSelect: false
    }, () => {
      this.createOrder(goods_id)
    })
  }

  //创建订单
  createOrder = (goods_id) => {
    const {pay_type} = this.state
    const user_info = this.props.admin
    HttpRequest({
      url: _api.create_order,
      dataType: 'json',
      type: 'POST',
      data: {
        goods_id: goods_id || '',
        token: user_info.token || '',
        order_type: 'watermark'
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const order_data = res.data
        const order_ids = []
        order_ids.push(order_data.order_id)
        localStorage.setItem('order_ids', JSON.stringify(order_ids))//订单信息
        localStorage.setItem('order_success', 'success')//订单字符成功
        localStorage.setItem('order_content', JSON.stringify(res.data))//订单全部信息
        this.setState({
          order_data: order_data
        }, () => {
          localStorage.setItem('pay_page','/watermark')//记录支付的产品
          if (pay_type === 'wxpay') {  //微信支付
            sessionStorage.setItem('watermark',true)
            this.props.history.push('/wxPay/' + order_data.order_id)
          } else if (pay_type === 'alipay') { //支付宝支付
            this.payJump()
          } else {
            this.paypalJump()
          }
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //跳转支付宝支付
  /**/
  payJump = () => {
    const {order_data} = this.state
    const user_info = this.props.admin
    const return_url = window.location.origin + '/watermark'
    HttpRequest({
      url: _api.payment,
      dataType: 'json',
      type: 'POST',
      data: {
        order_id: order_data.order_id,
        token: user_info.token,
        pay_type: 'alipay',
        return_url: return_url
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const pay_data = res.data
        this.setState({
          pay_data: pay_data
        }, () => {
          window.location.href = pay_data.pay_url
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //跳转Paypal支付
  /**/
  paypalJump = () => {
    const {order_data} = this.state
    const user_info = this.props.admin
    const return_url = window.location.origin + '/watermark'
    HttpRequest({
      url: _api.payment,
      dataType: 'json',
      type: 'POST',
      data: {
        order_id: order_data.order_id,
        token: user_info.token,
        pay_type: 'paypal',
        return_url: return_url
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const pay_data = res.data
        this.setState({
          pay_data: pay_data
        }, () => {
          window.location.href = pay_data
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  render () {
    const { isSelect, packageData } = this.state
    const { isForeign } = this.props.admin
    return (
      <div className='paypage'>
        <div className="paypage_inner">
          <div className="paypage_top">
            <h1>{window.intl.get('水印 VIP 服务计划')}</h1>
            <h2>{window.intl.get('为视频个性化创造极致的即决方案，享受更好的服务和功能')}</h2>
          </div>
          <div className="paypage_bottom">
            {packageData.map((meal,i) => <SetMeal isForeign={isForeign} key={i} data={meal} callBack={this.payVip} />)}
          </div>
        </div>
        {isSelect ?
          <div className="pay_full_box">
            <div className="pay_select_box pay_confirm_box">
              <span className="pay_select_close"
                    onClick={() => this.setState({isSelect: false})}
              ></span>
              <h2 className="pay_full_box_tit">
                {window.intl.get('请选择您的支付方式')}</h2>
              <div className="zfb_wx_box" onClick={this.selectPay.bind(this, 'alipay')}>
                <div className="zhifu_icon zhifubao_icon"></div>
                <p className="zfb_wx_name">{window.intl.get('支付宝')}</p>
              </div>
              <div className="zfb_wx_box" onClick={this.selectPay.bind(this, 'wxpay')}>
                <div className="zhifu_icon wx_zhifu_icon"></div>
                <p className="zfb_wx_name">{window.intl.get('微信')}</p>
              </div>
            </div>
          </div> : ''
        }
      </div>
    )
  }
}

// export default PayPage

// @connect(
//   state => ({admin: state.admin}),
//   {login}
// )

export default connect(state => ({
  admin: state.admin
}),{
  login
})(PayPage);