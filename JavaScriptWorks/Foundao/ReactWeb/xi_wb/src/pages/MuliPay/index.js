/* eslint-disable */

import React, {Component} from 'react';
import './index.scss'
import Tool from '@/utils/tool'
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import messageBox from '@/utils/messageBox';
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
import CONST from './../../config/const';
@connect(
  state => ({admin: state.admin}),
  {login}
)
class MuliPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:"",
      pageTips:[],
      order_data:{},
      isSelect:false,
      goods_id:'',
      packageData:[],
    }
  }

  componentWillMount() {
    // console.log(this.props)
    let type = this.props.match.params.type;
    if (type==='remove'){
      this.setState({
        type:'remove',
        pageTips:[
          {
            title:window.intl.get('无限次数'),
            desc:window.intl.get('无限次去水印，满足你的高频需要')
          },
          {
            title:window.intl.get('1GB超大文件'),
            desc:window.intl.get('文件上传提升至最大支持1GB超大文件上传')
          },
          {
            title:window.intl.get('批量处理3'),
            desc:window.intl.get('解锁去水印批量处理，简单方便又快捷')
          },
          {
            title:window.intl.get('视频同时上传'),
            desc:window.intl.get('支持所有视频同时上传，拒绝等待')
          },
          {
            title:window.intl.get('高速通道'),
            desc:window.intl.get('视频编辑高速通道，提升速度，省时省力')
          }
        ]
      })
    } else{
      this.setState({
        type:'muli',
        pageTips:[
          {
            title:window.intl.get('视频同时上传'),
            desc:window.intl.get('喜拼接支持所有的视频同时上传')
          },
          {
            title:window.intl.get('1GB超大文件上传'),
            desc:window.intl.get('100MB提升至1GB超大文件上传')
          },
          {
            title:window.intl.get('去水印2'),
            desc:window.intl.get('导出无水印视频，你的视频你做主')
          },
          {
            title:window.intl.get('高速通道'),
            desc:window.intl.get('视频编辑高速通道，提升速度，省时省力')
          },
          {
            title:window.intl.get('无广告'),
            desc:window.intl.get('编辑视频无广告，专注你的视频')
          }
        ]
      })
    }
    this.getPackage();
  }
  /**获取套餐详情**/
  getPackage = () => {
    let type = this.props.match.params.type;
    let api=''
    if (type==='remove'){
      api = API.removePage
    } else {
      api = API.getMuliPackage
    }
    httpRequest({
      url: api,
      dataType: 'json',
      type: 'GET',
    }).done((res) => {
      if (res.code / 1 === 0) {
        this.setState({packageData: res.data||[]})
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'));
    })
  };

  /**绑定套餐**/
  buyVip=(id)=>{
    const user_info = this.props.admin;
    let type = this.props.match.params.type;
    if (type==='remove'){;
      window.gtag && window.gtag('event', 'click', {'event_category': 'remove_pay','event_label': 'remove'})
    } else {}
    if (!id){return;}
    if(user_info.isForeign){
      this.setState({
        pay_type: 'paypal',
        goods_id: id,
      }, () => {
        this.createOrder(id)
      })
    }else {
      this.setState({
        isSelect:true,
        goods_id:id
      })
    }
  };

  /**选择支付方式**/
  selectPay = (pay_type) => {  //pay_type   1为支付宝 2为微信
    const {goods_id} = this.state;
    if (!goods_id) {return}
    this.setState({
      pay_type: pay_type,
      isSelect: false
    }, () => {
      const {goods_id} = this.state;
      this.createOrder(goods_id)
    })
  };
  /**创建订单***/
  createOrder = (goods_id) => {
    const {pay_type} = this.state;
    const user_info = this.props.admin;
    // console.log(user_info.token.token,'token');
    let type = this.props.match.params.type;
    let order_type=''
    if (type==='remove'){
      order_type = 'rewatermark';
    } else {
      order_type = 'mulisplicing'
    }
    httpRequest({
      url: API.create_order,
      dataType: 'json',
      type: 'POST',
      data: {
        goods_id: goods_id || '',
        token: user_info.token || '',
        order_type:order_type
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const order_data = res.data;
        const order_ids = [];
        order_ids.push(order_data.order_id);
        if (type==='remove') {
          localStorage.setItem('pay_page','/remove')//记录支付的产品
          sessionStorage.setItem('remove', 'remove');
        } else {
          sessionStorage.setItem('muli', 'muli');
          localStorage.setItem('pay_page','/merge')//记录支付的产品
        }
        localStorage.setItem('muliorder_ids', JSON.stringify(order_ids));
        localStorage.setItem('order_success', 'success')
        localStorage.setItem('order_content', JSON.stringify(res.data));

        this.setState({
          order_data: order_data
        }, () => {
          if (pay_type === 'wxpay') {  //微信支付
            // const jump_url = '/#/wxPay?order_id=' + order_data.order_id
            // window.location.href = jump_url
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
      messageBox(window.intl.get('内部服务器错误！'));
    })
  }
  /**跳转支付宝支付**/
  payJump = () => {
    const {order_data} = this.state;
    const user_info = this.props.admin;
    let type = this.props.match.params.type;
    let return_url=''
    if (type==='remove'){
      return_url = window.location.origin + '/remove';
    }else {
      return_url = window.location.origin + '/merge';
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
        const pay_data = res.data;
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
      messageBox(window.intl.get('内部服务器错误！'));
    })
  };
  /**跳转Paypal支付**/
  paypalJump = () => {
    const {order_data} = this.state;
    const user_info = this.props.admin;
    // const return_url = window.location.href.split('?')[0]
    let type = this.props.match.params.type;
    let return_url=''
    if (type==='remove'){
      return_url = window.location.origin + '/remove';
    }else {
      return_url = window.location.origin + '/merge';
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
        const pay_data = res.data;
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
  };
  render() {
    const {language} = this.props.admin;
    const {isSelect,packageData,pageTips,type} = this.state;
    var is_ZH = language === CONST.LANGUAGE.ZH ? true : false;
    return (
      <div className='mulipay'>
        <div className='mulipay-top'>
          <h2>{window.intl.get('VIP 服务计划')}</h2>
          <h3>{window.intl.get('看得见的优惠，用得上的特权，享受更好的服务和功能')}</h3>
          <ul className= {type ==='remove'?'vip-server remove':'vip-server'}>
            {pageTips.map((item,index)=>{
              return <li className='server-item' key={index}>
                <div className='server-icon'> </div>
                <h4 className='server-title'>{item.title}</h4>
                <p className='server-desc'>{item.desc}</p>
              </li>
            })}
          </ul>
        </div>
        <div className='mulipay-bottom'>
          <div>
            {packageData.map((item,index)=>{
                return  <div className={index===0?'onemonth':is_ZH?'oneYear':'oneYear isEnglish'} key={'package'+index}>
                  <h2>{window.intl.get(item.title)}</h2>
                  <p className='price'>{window.intl.get('￥')}{item.price}
                    {item.ori_price&&item.ori_price!==item.price?
                      <span className='oldprice'>{window.intl.get('￥')}{item.ori_price}</span>:""
                    }
                  </p>
                  {type==='remove' ?
                    <p className='desc'>{index===0 ? window.intl.get('/月') : window.intl.get('/年')}<br/>{index===0 ? window.intl.get('每天不到1元') : window.intl.get('每天不到0.3元')}</p>
                    :type==='muli'?
                      <p className='desc'>{index===0 ? window.intl.get('/月') : window.intl.get('/年')}<br/>{index===0 ? window.intl.get('每天不到4分钱') : window.intl.get('每天不到2分钱')}</p>
                      :""}
                  <button onClick={this.buyVip.bind(this,item.id)} >{window.intl.get('即可享有')}</button>
                  <p className='tips'> </p>
                </div>
              })
            }
          </div>
        </div>

        {isSelect ?
          <div className="pay_full_box">
            <div className="pay_select_box pay_confirm_box">
              <span className="pay_select_close"
                    onClick={() => this.setState({isSelect: false})}
              > </span>
              <h2 className="pay_full_box_tit">{window.intl.get('请选择您的支付方式')}</h2>
              <div className="zfb_wx_box" onClick={this.selectPay.bind(this, 'alipay')}>
                <div className="zhifu_icon zhifubao_icon"></div>
                <p className="zfb_wx_name">支付宝</p>
              </div>
              <div className="zfb_wx_box" onClick={this.selectPay.bind(this, 'wxpay')}>
                <div className="zhifu_icon wx_zhifu_icon"></div>
                <p className="zfb_wx_name">微信</p>
              </div>
            </div>
          </div> : ''
        }
      </div>
    );
  }
}

export default MuliPay;
