import React,{Component} from 'react'
import './index.scss'
import BeforWater from "./BeforeWater";
import MoreTools from "../../components/MoreTools";
import MakeWater from "./MakeWater";
import WaterList from "./WaterList";
import CutStep from '@/components/CutStep/CutStep';
import $ from 'jquery'
import HttpRequest from "../../utils/httpRequest";
import _api from '../../API/api'
import messageBox from '@/utils/messageBox'
import _tool from '@/utils/tool';
import {connect} from 'react-redux';
import RadarPopup from '../../components/RadarPopup/index'
import MessageBoard from '../../components/MessageBoard/messageBoard'
// import OtherProduct from '@/components/OtherProduct/OtherProduct'

@connect(
    state => ({admin: state.admin}),
    {}
)

export default class Watermark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBefore : true, //处理文件之前
      video_url : '', //视频地址
      videoInfo : {}, //视频信息
      water_list : [],
      is_bind : false, //是否弹出绑定账号弹窗
    }
  }

  componentWillMount() {
    const waterData = sessionStorage.getItem('waterData')
    if(waterData){
      this.setState({
        isBefore : false,
        video_url : JSON.parse(waterData).video_url,
        videoInfo : JSON.parse(waterData).videoInfo,
        water_list : JSON.parse(waterData).water_list
      },()=>{
        sessionStorage.removeItem('waterData')
      })
    }
  }

  componentDidMount() {
    window.scrollTo(0,0)
    // const order_ids = localStorage.getItem('order_ids')
    // if(order_ids){  //有订单号,查询支付是否成功
    //   this.getOrdersStatus(order_ids)
    // }
    this.whichIDo()//该走那个逻辑
  }

  //该走那个逻辑
  whichIDo = () => {
    const href = window.location.href
    if(href !== window.location.origin + '/watermark'){
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
    HttpRequest({
      url: _api.query_order,
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
    HttpRequest({
      url : _api.get_orders_state,
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
          }else {
            this.setState({is_bind:true})
          }
        } else {
          localStorage.removeItem('order_ids')
        }
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
      HttpRequest({
        type: 'POST',
        url: _api.pay,
        data: {
          success: arr[0],
          out_trade_no: arr[1],
          paymentId: arr[2],
          token: _tool.getUserData_storage().token,
          PayerID: arr[4]
        }
      }).done(res => {
        if(res.code === '0'){
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
      if(_tool.isForeign()){
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
  bindOrder = (payId,payWay)=>{
    if(payId){
      const user_info = this.props.admin
      const arr = []
      arr.push(payId)
      if(arr){
        const order_ids = JSON.parse(arr)
        HttpRequest({
          url : _api.bind_order,
          dataType : 'json',
          type : 'POST',
          data : {
            token : user_info.token,
            order_ids : order_ids
          }
        }).done((res)=>{
          if(res.code /1 === 0){
            if(localStorage.getItem('order_success')){
              window.location.href = window.location.origin+'/successPay/' + payWay + '_' + payId
            }
            localStorage.removeItem('order_ids')
            localStorage.removeItem('order_success')
            localStorage.removeItem('order_content')
            console.log('绑定成功')
          }else {
            messageBox(res.msg)
          }
        }).fail(()=>{
          messageBox(window.setInterval.get('内部服务器错误！'))
        })
      }
    } else {
      const user_info = this.props.admin
      const orderIds = localStorage.getItem('order_ids')
      if(orderIds){
        const order_ids = JSON.parse(orderIds)
        HttpRequest({
          url : _api.bind_order,
          dataType : 'json',
          type : 'POST',
          data : {
            token : user_info.token,
            order_ids : order_ids
          }
        }).done((res)=>{
          if(res.code /1 === 0){
            localStorage.removeItem('order_ids')
            localStorage.removeItem('order_success')
            localStorage.removeItem('order_content')
            console.log('绑定成功')
          }else {
            messageBox(res.msg)
          }
        }).fail(()=>{
          messageBox(window.setInterval.get('内部服务器错误！'))
        })
      }
    }
  }

  //上传转码完成后回调
  successBefore = (url)=>{
    this.setState({
      video_url : url,
      isBefore : false
    })
  }

  //保存视频信息
  saveVideoInfo = (data)=>{
    this.setState({
      videoInfo : data
    })
  }

  //点击页面
  clickPage = ()=>{
    if($('#guides_tip')){
      $('#guides_tip').fadeOut()
    }
    if($('#moudleTip')){
      $('#moudleTip').fadeOut()
    }
  }

  //前往登录页
  goLogin = () => {
    const current_url = encodeURIComponent(window.location.href)
    this.props.history.push(`./user/login?callback=${current_url}`)
  }

  render() {
    const { isBefore, video_url, videoInfo, water_list, is_bind} = this.state
    const { isForeign } = this.props.admin
    return (
      <div className="wartermark_page" onClick={this.clickPage}>
        <div className="wartermark_box">
          {is_bind  ? <RadarPopup CallBack={this.goLogin} /> : ''}
          {isBefore ?
            <BeforWater successBefore={this.successBefore}
                        saveVideoInfo={this.saveVideoInfo}
                        isForeign={isForeign}
            />
             :
            <MakeWater video_url={video_url}
                       videoInfo={videoInfo}
                       water_list={water_list}
            />
          }
        </div>
        {/* <div className="water_stepsBox">
          <h2 className="water_stepsTitle">如何通过简单的步骤在线添加视频水印？</h2>
          <ul className="water_steps">
            <li className="water_stepDetail">添加视频</li>
            <li className="water_stepLine"></li>
            <li className="water_stepDetail">上传您的水印图片</li>
            <li className="water_stepLine"></li>
            <li className="water_stepDetail">保存并下载</li>
          </ul>
        </div> */}
        {/* <div className="cutStep-box" style={{marginTop: isBefore ? '118px' : '434px'}}>
          <h3>{window.intl.get('如何通过简单的步骤在线添加视频水印？')}</h3>
          <ul>
            <li><span>1</span><p>{window.intl.get('添加视频')}</p></li>
            <li className="line"></li>
            <li><span>2</span><p>{window.intl.get('上传您的水印图片')}</p></li>
            <li className="line"></li>
            <li><span>3</span><p>{window.intl.get('保存并下载')}</p></li>
          </ul>
        </div> */}
        {/* <OtherProduct /> */}
        <div style={{marginTop: isBefore ? '118px' : '434px'}}>
          <CutStep type='watermark'/>
        </div>
        <WaterList/>
        <MoreTools type="watermark"/>
          {
              this.props.admin.isForeign ? ( <MessageBoard id="5"/>) : ('')
          }
      </div>
    )
  }
}