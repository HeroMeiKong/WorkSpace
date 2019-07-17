import React, {Component} from 'react'
import './index.scss'
import Tool from '@/utils/tool'
// import CONST from '@/config/const'
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import messageBox from '@/utils/messageBox'
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
const imgchs = require('@/assets/payPage/imgchs.png')
/* eslint-disable */

@connect(
  state => ({admin: state.admin}),
  {login}
)

export default class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: '',
      order_data: {}, //订单详情
      pay_data: {}, //支付详情
      pay_type: 'alipay', //支付类型
      // isForever: false, //永久用户弹窗
      isSelect: false, //选择支付方式弹框
      goods_id: '', //套餐id
      packageData: {
        cur_package: {}, //用户当前套餐
        discount_price: 0, //折扣价
        goods: [], //商品列表
      },
      isct:false//是否是转码二
    }
  }
  componentWillMount() {
    let pathName = this.props.location.pathname
    console.log(this.props.location.pathname)
    if (pathName==='/pay/ct') {
      this.setState({
        isct:true
      })
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    const url = window.location.href
    const file_size = Tool.getParams(url).file_size
    let size = ''
    if (file_size) {
      size = (file_size / 1024 / 1024 / 1024).toFixed(1)
    }
    this.setState({size}, () => {
      this.getPackage()
    })
  }

  //查询用户是否开通套餐
  getPackage = () => {
    const user_info = this.props.admin
    httpRequest({
      url: API.userPackage,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
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
  payVip = (item) => {
    const {isct} = this.state;
    console.log(isct)
    if (isct){
      window.gtag && window.gtag('event', 'click', {'event_category': 'transcoding_pay', 'event_label': 'transcoding'})
    } else {
      window.gtag && window.gtag('event', 'click', {'event_category': 'pay', 'event_label': 'video'}) //统计购买
    }
    const {packageData} = this.state
    const user_info = this.props.admin
    // if (!user_info.isLogin) { //未登录状态会跳转到登录页面
    //   const current_url = encodeURIComponent(window.location.href);
    //   this.props.history.push(`./user/login?callback=${current_url}`);
    // } else {
    if (this.packageContrast(item) === 2) { //当前套餐大于列表套餐  不允许购买
      return
    } else if (packageData.cur_package && packageData.cur_package.goods_id / 1 === 4) {
      return
    } else {
      const goods_id = item.id
      if (!goods_id) {
        return
      }
      if(user_info.isForeign){
        this.setState({
          pay_type: 'paypal',
          goods_id: item.id,
        }, () => {
          this.createOrder(goods_id)
        })
      } else {
        this.setState({
          goods_id: item.id,
          isSelect: true
        })
      }
    }
    // }
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
    const {pay_type ,isct } = this.state
    const user_info = this.props.admin
    httpRequest({
      url: API.create_order,
      dataType: 'json',
      type: 'POST',
      data: {
        goods_id: goods_id || '',
        token: user_info.token || ''
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const order_data = res.data
        const order_ids = []
        order_ids.push(order_data.order_id)
        localStorage.setItem('order_ids', JSON.stringify(order_ids))
        localStorage.setItem('order_success', 'success')
        localStorage.setItem('order_content', JSON.stringify(res.data))
        this.setState({
          order_data: order_data
        }, () => {
          if (isct){
            localStorage.setItem('pay_page','/converter')//记录支付的产品
          } else {
            localStorage.setItem('pay_page','/convert')//记录支付的产品
          }
          if (pay_type === 'wxpay') {  //微信支付
            // const jump_url = '/#/wxPay?order_id=' + order_data.order_id
            // window.location.href = jump_url
            if (isct){
              sessionStorage.setItem('converter','true')
            }
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
    const {order_data,isct} = this.state
    const user_info = this.props.admin
    // const return_url = window.location.href.split('?')[0]
    let return_url=''
    if (isct){
      return_url = window.location.origin + '/converter'
    } else {
      return_url = window.location.origin + '/convert'
    }
    httpRequest({
      url: API.payment,
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
          // this.pay_url.location = pay_data.pay_url
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
    const {order_data ,isct} = this.state
    const user_info = this.props.admin
    // const return_url = window.location.href.split('?')[0]
    let return_url = ''
    if (isct){
      return_url = window.location.origin + '/converter'
    } else {
      return_url = window.location.origin + '/convert'
    }
    httpRequest({
      url: API.payment,
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

  //判断当前套餐与列表套餐的关系
  packageContrast = (item) => {
    const {packageData} = this.state
    if (!packageData.cur_package) {  //当前无套餐
      return 0
    }
    if (packageData.cur_package.goods_id / 1 === item.id / 1) { //套餐相同
      return 1
    }
    if (packageData.cur_package.goods_id / 1 > item.id / 1) { //当前套餐高于列表套餐
      return 2
    }
    if (packageData.cur_package.goods_id / 1 < item.id / 1) {//当前套餐低于列表套餐
      return 3
    }
  }

  //删除vip
  deleteVip = () => {
    httpRequest({
      url: API.delete_vip,
      dataType: 'json',
      type: 'GET',
      data: {
        k: 'foundao@2018',
        mobile: 18783884573
      }
    })
  }

  render() {
    const {size, isSelect, packageData} = this.state
    const { isForeign } = this.props.admin
    return (
      <div className="pay-box">
        {/*{isForever ?*/}
        {/*<div className="pay_full_box">*/}
        {/*<div className="pay_confirm_box">*/}
        {/*<h2 className="pay_full_box_tit">*/}
        {/*您已拥有<span className="pay_red_title">VIP终极版</span>服务计划</h2>*/}
        {/*<div className="pay_full_btn"*/}
        {/*onClick={() => this.setState({isForever: false})}>*/}
        {/*确认*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*</div> : ''*/}
        {/*}*/}
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
        <h2 className="pay-title">{window.intl.get('VIP 服务计划')}</h2>
        <p className="pay-tip">{window.intl.get('为视频编辑创造极致的解决方案，享受更好的服务和功能')}</p>
        <div style={{width: '100%', textAlign: 'center'}}>
          <ul className="pay-main">
            {packageData.goods.length > 0 ?
              packageData.goods.map((item, index) => {
                return <li className="pay-list" key={index}>
                  {index === 3 && size ?
                    <div className="pay-zhongji">{window.intl.get('这一计划适合您')}{size}{window.intl.get('G的文件')}</div> : ''
                  }
                  {index === 2 ?
                    <div className="pay-icon" style={isForeign ? {backgroundImage: 'url('+imgchs+')'} : {}}></div> : ''
                  }
                  <p className="list-tit">{window.intl.get(item.title)}</p>
                  <div className={this.packageContrast(item) === 3 && item.id / 1 !== 3 ?
                    "list-value more_value" : 'list-value'}>
                    <div className={isForeign ? "list-value-icon isForeign" : "list-value-icon"}></div>
                    {this.packageContrast(item) === 3 ? (item.price - packageData.discount_price).toFixed(2) : item.price}
                  </div>
                  <div className="list-tip">
                    {this.packageContrast(item) === 3 ?
                      <div className="discount_price_box"
                           style={item.id / 1 === 3 ? {color: '#EFEFEF'} : {}}
                      >
                      <span
                        className={item.id / 1 === 3 ? 'discount_price_icon discount_baise_icon' : "discount_price_icon"}></span>
                        {item.price}
                      </div> : ''
                    }
                    {index === 0 ? <div dangerouslySetInnerHTML={{__html: window.intl.get('有效期为24小时无自动续费')}}></div> : index === 3 ? window.intl.get('终生') : index === 1 ? window.intl.get('月') : window.intl.get('/年')}<br/>
                    {index === 0 ? '' : index === 3 ? window.intl.get('一次费用') : window.intl.get('可随时取消')}
                  </div>
                  <ul className="list-content" style={isForeign ? {marginLeft: '20px'} : {}}>
                    <li className="list-cont">
                      <span className="cont-bold">{item.capacity / 1 === 0 ? window.intl.get('无限') : (item.capacity + window.intl.get('GB最大'))}</span>{window.intl.get('文件大小')}
                    </li>
                    <li className="list-cont">{window.intl.get('每日')}<span className="cont-bold">{window.intl.get('无限')}</span>{window.intl.get('文件转换')}</li>
                    <li className="list-cont">
                      <span className="cont-bold">{item.process / 1 === 0 ? window.intl.get('无限') : item.process}</span>{window.intl.get('个并行转换')}
                    </li>
                    <li className="list-cont"><span
                      className="cont-bold">{item.level / 1 === 1 ? window.intl.get('普通1') : item.level / 1 === 2 ? window.intl.get('高1') : item.level / 1 === 3 ? window.intl.get('更高1') : item.level / 1 === 4 ? window.intl.get('最高1') : ''}</span>{window.intl.get('优先级1')}
                    </li>
                    <li className="list-cont">{window.intl.get('无广告页')}</li>
                  </ul>
                  <div
                    className={this.packageContrast(item) === 2 || (packageData.cur_package && packageData.cur_package.goods_id / 1 === 4) ? "list-btn cantClick" : 'list-btn'}
                    onClick={this.payVip.bind(this, item)}>
                    {this.packageContrast(item) === 1 ? window.intl.get('立即续费') : window.intl.get('即刻享有')}
                  </div>
                  {this.packageContrast(item) === 3 && packageData.discount_price / 1 !== 0 ?
                    <p className="dikou_content"
                       style={index === 2 ? {color: '#FFFFFF'} : {}}>{window.intl.get('已抵扣')}{packageData.discount_price}{window.intl.get('为您')}</p> : ''}
                </li>
              }) : ''
            }
          </ul>
        </div>
      </div>
    )
  }
}