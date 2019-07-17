import React, { Component, Fragment } from 'react'
import './SuccessPay.scss'
import _tool from '@/utils/tool'
import HttpRequest from "@/utils/httpRequest";
import _api from '@/API/api'

class SuccessPay extends Component {
  constructor () {
    super()
    this.state = {
      order: {},
      hasUser: false
    }
  }

  componentWillMount () {
    this.renderData()//查询订单详情
    if(_tool.getUserData_storage().token){
      // window.location.href = window.location.origin
      this.setState({hasUser: true})
    } else {
      this.setState({hasUser: false})
      if(localStorage.getItem('order_content') && localStorage.getItem('order_success')){
        const order = this.state.order || JSON.parse(localStorage.getItem('order_content'))
        // const unit = Tool.isForeign() ? 'USD' : 'CNY'
        // window.gtag && window.gtag('event', 'purchase', {'event_category': 'pay_succeed'},
        //   {
        //     'transaction_id': order.order_id,
        //     'value': order.price,
        //     'currency': unit,
        //     'quantity': 1,
        //     'shipping': 0
        //   }) //统计支付成功
        const payPage = localStorage.getItem('pay_page')
        if(payPage === '/convert'){//判断是否是转码页面支付，是的话就统计支付成功
          window.gtag && window.gtag('event', 'click', {'event_category': 'pay_succeed','event_label': 'video','value': order.price})
        }else if(payPage==='/remove'){
          window.gtag && window.gtag('event', 'click', {'event_category': 'remove_pay_succeed','event_label': 'remove','value': order.price})
        }
        // this.setState({order})
      } else {
        // window.location.href = window.location.origin
      }
    }
    localStorage.removeItem('order_success')
  }

  //前往登录页
  goLogin = () => {
    const current_url = encodeURIComponent(window.location.href);
    this.props.history.push(`/user/login?callback=${current_url}`);
  }

  //继续使用
  backPage = () => {
    const page = localStorage.getItem('pay_page')
    this.props.history.push(page || '/');
  }

  resetTime = (str) => {
    if(str){
      const arr = str.split(' ')
      return arr
    } else {
      return str
    }
  }

  resetString = (str) => {
    if(str){
      const arr = str.split('_')
      return { payId: arr[1], payWay: arr[0] }
    } else {
      return str
    }
  }

  //查询订单详情
  renderData = () => {
    if(this.props.match.params && this.props.match.params.id){
      const obj = this.props.match.params.id
      const { payId, payWay } = this.resetString(obj)
      HttpRequest({
        url: _api.query_order,
        dataType: 'json',
        type: 'POST',
        data: {
          out_trade_no: payId,
          pay_type: payWay,
        }
      }).done((res) => {
        if(res.code === '0'){
          this.setState({order: res.data})
        } else {
          console.log(res.data)
        }
      })
    } else {
      window.location.href = window.location.origin
    }
  }

  render () {
    const { order, hasUser } = this.state
    const arr = this.resetTime(order ? order.gmt_create : '') || [0,0]
    return (
      <div className='success_pay'>
        <div className='success_pay_inner'>
          <div className='success_pay_pic'></div>
          <h1>{window.intl.get('恭喜您，支付成功！')}</h1>
          {hasUser
          ? <Fragment>
              <div className='success_pay_text' dangerouslySetInnerHTML={{__html: window.intl.get('亲爱的用户您已成为喜视频·在线转码VIP会员，立刻享受高速快捷的转码通道，我们为您提供24小时在线咨询付费，您的账号已被升级为最高安全级别')}} />
              <div className='success_pay_button' onClick={this.backPage}>{window.intl.get('继续使用')}</div>
            </Fragment>
          : <Fragment>
              <div className='success_pay_text' dangerouslySetInnerHTML={{__html: window.intl.get('亲爱的用户在您未登录状态下，我们已为您生成临时账户，为了您的账户安全，为避免账户丢失，请您点击“立刻绑定”按钮前去登录或注账户！')}} />
              <div className='success_pay_button' onClick={this.goLogin}>{window.intl.get('立即绑定')}</div>
            </Fragment>
          }
          <div className='success_pay_form'>
            <div className='left_form'>
              <div className='success_pay_title'>{window.intl.get('订单号码')}</div>
              <div className='form_number'>{order.order_id || ''}</div>
              <div className='success_pay_title'>{window.intl.get('购买项目')}</div>
              <div className='form_name'>{order.title || ''}</div>
            </div>
            <div className='right_form'>
              <div className='right_form_inner'>
                <p>{window.intl.get('姓名：')}{order.uid || ''}</p>
                <p>{window.intl.get('具体购买时间：')}{arr[0] || ''}</p>
                <p>{arr[1] || ''}</p>
              </div>
              <div className='success_pay_title'>{window.intl.get('价格')}</div>
              <div className='form_price'>{order.price || ''}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SuccessPay