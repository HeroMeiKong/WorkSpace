import React, {Component} from 'react'
import './index.scss'
import BeforeConvert from './beforeConvert/index';
import ConvertTips from './ConvertTips/index';
import SupportUrl from '@/components/SupportUrl/SupportUrl'
import MoreTools from "../../components/MoreTools";
import ConventDeal from './ConvertDeal/index';
import httpRequest from "../../utils/httpRequest";
import API from "../../API/api";
import messageBox from '@/utils/messageBox';
import RadarPopup from '../../components/RadarPopup/index';
import tools from '@/utils/tool';
import {connect} from "react-redux";
@connect(
  state => ({admin: state.admin}),
  {}
)
export default class Convert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList:[],
      vip_type:0,
      tipsList:[
        'VIP convert channel, upload speed exceeds 95% of other users.',
        'Improved 63% of your video quality.',
        'Lossless compression 51% of video size to save your storage.',
        'Video names and content are under the highest security protect.',
        'Only $0.19 per day, unlimited  high-speed video convert.'
      ],
      currMsg:'',
      is_bind:false
    }
  }
  componentWillMount() {
    this.getIsVip();
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.initTips()
    this.whichIDo();
    sessionStorage.setItem('page','converter')
  }
  initTips=()=>{
    const {tipsList} = this.state;
    let number = Math.ceil(Math.random()*5)-1;
    this.setState({
      currMsg:tipsList[number]
    })
  }
  //该走那个逻辑
  whichIDo = () => {
    const href = window.location.href
    if(href !== window.location.origin + '/converter'){
      const href = window.location.href
      const { payId, payWay } = this.DistinguishPayWay(href)
      this.getThisOrdersStatus(payId,payWay)
    } else {
      const order_ids = localStorage.getItem('order_ids')
      if(order_ids){  //有订单号,查询支付是否成功
        this.getOrdersStatus(order_ids)
      }
    }
  }

  //查询当前订单是否已支付
  getThisOrdersStatus = (payId,payWay) => {
    httpRequest({
      url: API.query_order,
      dataType: 'json',
      type: 'POST',
      data: {
        pay_type: payWay,
        out_trade_no: payId
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        if (res.data.pay_status === 'success') { //支付成功
          const user_info = this.props.admin
          if (user_info.isLogin) {   //已登录,绑定
            this.bindOrder(payId,payWay)
          }
          if(localStorage.getItem('order_success')){
            //payWay方便支付成功时查询已那种方式支付，payId支付订单号，两个都必须传
            window.location.href = window.location.origin+'/successPay/' + payWay + '_' + payId
          }
        } else {
          if(payWay === 'paypal'){
            const parameter = this.props.location.search
            if(parameter.indexOf('paymentId') > -1){
              this.paypalPuy(parameter)
            } else {
              localStorage.removeItem('order_ids')
            }
          }
        }
      }
    })
  }

  //查询多个订单是否已支付
  getOrdersStatus = (orderIds)=>{
    const order_ids = JSON.parse(orderIds)
    httpRequest({
      url : API.get_orders_state,
      dataType : 'json',
      type : 'POST',
      data : {
        order_ids : order_ids
      }
    }).done((res)=>{
      if(res.code /1 === 0){
        if(res.data.succ_num/1 > 0){ //大于0时候表示有订单是支付成功的
          const user_info = this.props.admin
          if (user_info.isLogin) {   //已登录,绑定
            this.bindOrder()
          } else {
            this.setState({is_bind:true})
          }
        } else {
          localStorage.removeItem('order_ids')
        }
        // else {//paypal需要确认支付，所以此时未支付
        //   const parameter = this.props.location.search
        //   if(parameter.indexOf('paymentId') > -1){
        //     this.paypalPuy(parameter)
        //   } else {
        //     localStorage.removeItem('order_ids')
        //   }
        // }
      }else {
        messageBox(res.msg)
      }
    }).fail(()=>{
      messageBox(window.setInterval.get('内部服务器错误！'))
    })
  }

  //执行paypal支付操作
  paypalPuy = (parameter) => {
    if(parameter){
      const arr = this.changeToObject(parameter)
      httpRequest({
        type: 'POST',
        url: API.pay,
        data: {
          success: arr[0],
          out_trade_no: arr[1],
          paymentId: arr[2],
          token: tools.getUserData_storage().token,
          PayerID: arr[4]
        }
      }).done(res => {
        if(res.code === '0'){
          //请看140行注释
          window.location.href = window.location.origin+'/successPay/'+ 'paypal'+ '_' + arr[1]
        } else {
          messageBox(res.msg)
        }
      }).fail(res => {
        messageBox(res)
      })
    } else {
      // console.log('还未支付！')
    }
  }

  //规范化paypal参数
  changeToObject = (str) => {
    const arr = str.split('&')
    const length = arr.length
    let newArr = []
    for(let i=0;i<length;i++){
      newArr[i] = arr[i].split('=')[1]
    }
    return newArr
  }

  //识别支付方式
  DistinguishPayWay = (href) => {
    if(href && href.indexOf('out_trade_no') > 0){
      let payWay = 'alipay'
      if(tools.isForeign()){
        payWay = 'paypal'
      } else if(href.indexOf('alipay') > 0){
        payWay = 'alipay'
      } else if(href.indexOf('wxpay') > 0){
        payWay = 'wxpay'
      }
      const arr = href.split('&')
      const value = arr[1].split('=')
      return { payId: value[1], payWay }
    } else {
      return href
    }
  }

  //绑定订单
  bindOrder = (payId,payWay) => {
    if(payId){
      //单笔支付
      const user_info = this.props.admin
      const arr = []
      arr.push(payId)
      if(arr){
        const order_ids = JSON.parse(arr)
        httpRequest({
          url : API.bind_order,
          dataType : 'json',
          type : 'POST',
          data : {
            token : user_info.token,
            order_ids : order_ids
          }
        }).done((res)=>{
          this.getIsVip();
          if(res.code /1 === 0){
            if(localStorage.getItem('order_success')){
              //payWay方便支付成功时查询已那种方式支付，payId支付订单号，两个都必须传
              window.location.href = window.location.origin+'/successPay/' + payWay + '_' + payId
            }
            localStorage.removeItem('order_ids')
            localStorage.removeItem('order_success')
            localStorage.removeItem('order_content')
          }else {
            messageBox(res.msg)
          }
        }).fail(()=>{
          messageBox(window.setInterval.get('内部服务器错误！'))
        })
      }
    } else {
      //多笔支付，隐式绑定
      const user_info = this.props.admin
      const orderIds = localStorage.getItem('order_ids')
      if(orderIds){
        const order_ids = JSON.parse(orderIds)
        httpRequest({
          url : API.bind_order,
          dataType : 'json',
          type : 'POST',
          data : {
            token : user_info.token,
            order_ids : order_ids
          }
        }).done((res)=>{
          this.getIsVip();
          if(res.code /1 === 0){
            localStorage.removeItem('order_ids')
            localStorage.removeItem('order_success')
            localStorage.removeItem('order_content')
          }else {
            messageBox(res.msg)
          }
        }).fail(()=>{
          messageBox(window.setInterval.get('内部服务器错误！'))
        })
      }
    }
  }


  /**获取是否是会员**/
  getIsVip=()=>{
    let isVip = false
    const user_info = this.props.admin
    // console.log(this.props);
    // return
    if (user_info.isLogin) {   //已登录
      httpRequest({
        url: API.get_now_package,
        dataType: 'json',
        type: 'POST',
        async: false, //同步
        data: {
          token: user_info.token || ''
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          if (!res.data) {  //未购买套餐
            this.vip_type = 0
          } else {
            this.vip_type = res.data.goods_id / 1
            let maxSize = 500
            this.setState({
              vip_type : res.data.level*1||0
            })
            if (this.vip_type !== 4) {
              maxSize = 10 * 1024
            } else {
              maxSize = 0
            }
            this.setState({maxSize})
            isVip  = true
          }
        } else {
          messageBox(res.msg)
        }
      }).fail(() => {
        messageBox(window.setInterval.get('内部服务器错误！'))
      })
    } else {
      this.vip_type = 0
      this.setState({
        vip_type : 0
      })
    }
    return isVip
  }

  //前往登录页
  goLogin = () => {
    const current_url = encodeURIComponent(window.location.href);
    this.props.history.push(`./user/login?callback=${current_url}`);
  }
  /**成功选择文件回调函数**/
  SuccessUpload=(val)=>{
    this.setState({
      videoList:val,
    })
  }
  /**回到初始页面**/
  backPage=()=>{
    this.setState({
      videoList:[]
    })
  }
  render() {
    const {videoList , vip_type ,is_bind ,currMsg} = this.state;
    // console.log(currMsg)
    return (
      <div className="convert">
        {is_bind  ? <RadarPopup CallBack={this.goLogin} /> : ''}
        {videoList.length>0 ?
          <ConventDeal videoList={videoList} vip_type={vip_type} backPage={this.backPage}/>
          :
          <BeforeConvert SuccessUpload={this.SuccessUpload} vip_type={vip_type}/>
        }
        <ConvertTips showWhat={videoList.length>0?true:false} currMsg={currMsg}/>
        <SupportUrl project='testProject'/>
        <MoreTools type="trans"/>
      </div>
    )
  }
}