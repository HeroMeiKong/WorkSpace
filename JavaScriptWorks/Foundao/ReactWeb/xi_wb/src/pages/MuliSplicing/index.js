/* eslint-disable */
import React, {Component} from 'react';
import {} from 'react-router-dom';
import './index.scss';
import MoreTools from '@/components/MoreTools/index';
import CutStep from '@/components/CutStep/CutStep';
import CutList from '@/components/CutList/CutList';
import PreMuli from './PreMuli/index';
import MuliUpload from './MuliUpload/index';
import Splicing from './Splicing/index';
import messageBox from '@/utils/messageBox';
import tools from '@/utils/tool';
import httpRequest from "@/utils/httpRequest";
import api from "@/API/api";
import RadarPopup from '../../components/RadarPopup/index';
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
import MessageBoard from '@/components/MessageBoard/messageBoard';
@connect(
  state => ({admin: state.admin}),
  {login}
)
class MuliSplicing extends Component {
  constructor (props) {
    super(props);
    this.state={
      status:1,//是否已经有上传文件
      ininitList:[],
      is_bind:false,
      dataList:[
        // {
        //   link:'http://foundao.f3322.net:18080/org/fe31cc0d6830f949c07ba8dcf8eba451.mp4',
        //   name: 'SampleVideo_720x480_2mb.mp4',
        //   md5:'fe31cc0d6830f949c07ba8dcf8eba451',
        // },
        // {
        //   link:'http://foundao.f3322.net:18080/org/fe31cc0d6830f949c07ba8dcf8eba451.mp4',
        //   name: '123',
        //   md5:'fe31cc0d6830f949c07ba8dcf8eba451',
        // },
        // {
        //   link:'http://foundao.f3322.net:18080/org/a9efb96f941a9b6c23d3e89e88f9f7af.mp4',
        //   name: '3.mp4',
        //   md5:'a9efb96f941a9b6c23d3e89e88f9f7af',
        // },
      ],
    }
  }
  componentDidMount() {
    window.scrollTo(0,0);
    // const order_ids = localStorage.getItem('muliorder_ids');
    // if(order_ids){  //有订单号,查询支付是否成功
    //   this.getOrdersStatus(order_ids)
    // }
    this.whichIDo()//该走那个逻辑
  }

  //该走那个逻辑
  whichIDo = () => {
    const href = window.location.href
    if(href !== window.location.origin + '/merge'){
      const href = window.location.href
      const { payId, payWay } = this.DistinguishPayWay(href)
      this.getThisOrdersStatus(payId,payWay)
    } else {
      const order_ids = localStorage.getItem('muliorder_ids')
      if(order_ids){  //有订单号,查询支付是否成功
        this.getOrdersStatus(order_ids)
      }
    }
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

  //查询当前订单是否已支付
  getThisOrdersStatus = (payId,payWay) => {
    httpRequest({
      url: api.query_order,
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
              localStorage.removeItem('muliorder_ids')
            }
          }
        }
      }
    })
  }

  /***查询多个订单是否已支付***/
  getOrdersStatus = (orderIds)=>{
    const order_ids = JSON.parse(orderIds);
    httpRequest({
      url : api.get_orders_state,
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
        }else {
          localStorage.removeItem('muliorder_ids')
        }
      }else {
        messageBox(res.msg)
      }
    }).fail(()=>{
      messageBox(window.intl.get('内部服务器错误！'));
    })
  }

  /***绑定订单***/
  bindOrder = (payId,payWay)=>{
    if(payId){
      const user_info = this.props.admin
      const arr = []
      arr.push(payId)
      if(arr){
        const order_ids = JSON.parse(arr)
        httpRequest({
          url : api.bind_order,
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
            localStorage.removeItem('muliorder_ids');
            localStorage.removeItem('order_success');
            localStorage.removeItem('order_content');
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
      const orderIds = localStorage.getItem('muliorder_ids');
      if(orderIds){
        const order_ids = JSON.parse(orderIds);
        httpRequest({
          url : api.bind_order,
          dataType : 'json',
          type : 'POST',
          data : {
            token : user_info.token,
            order_ids : order_ids
          }
        }).done((res)=>{
          if(res.code /1 === 0){
            localStorage.removeItem('muliorder_ids');
            localStorage.removeItem('order_success');
            localStorage.removeItem('order_content');
            // console.log('绑定成功')
          }else {
            messageBox(res.msg)
          }
        }).fail(()=>{
          messageBox(window.intl.get('内部服务器错误！'));
        })
      }
    }
  }

  //执行paypal支付操作
  paypalPuy = (parameter) => {
    if(parameter){
      const arr = this.changeToObject(parameter)
      httpRequest({
        type: 'POST',
        url: api.pay,
        data: {
          success: arr[0],
          out_trade_no: arr[1],
          paymentId: arr[2],
          token: tools.getUserData_storage().token,
          PayerID: arr[4]
        }
      }).done(res => {
        if(res.code === '0'){
          window.location.href = window.location.origin+'/successPay/'+ 'paypal'+ '_' +arr[1]
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

  goLogin = ()=>{
    const current_url = encodeURIComponent(window.location.href);
    this.props.history.push(`./user/login?callback=${current_url}`);
  };

  successCallback=(link,name,md5,token)=>{
    let initList = [];
    initList[0]={
      link:link,
      name:name,
      md5:md5,
      token:token
    } ;
    this.setState({
      status:2,
      initList:initList
    })
  };
  
  muliUploadCallback=(dataList)=> {
    this.setState({
      status:3,
      dataList:dataList||[]
    })
  };

  /**返回拼接首页**/
  returnPage=()=>{
    this.setState({
      status:1,//是否已经有上传文件
      ininitList:[],
      is_bind:false,
      dataList:[],
    })
  }
  render() {
    const { status ,initList ,dataList ,is_bind} = this.state;
    return (
      <div className='MuliSplice-box'>
        {status===1?<PreMuli uploadSuccess={this.successCallback}/>
          :
          status===2? <MuliUpload initList={initList} muliUploadCallback={this.muliUploadCallback}/>
            :
          <Splicing dataList={dataList} returnPage={this.returnPage}/>
        }
        <CutStep type='muliSolicing'/>
        <CutList type = 'muliSpelicing'/>
        <MoreTools type='muliSplicing'/>
        {is_bind  ? <RadarPopup CallBack={this.goLogin} /> : ''}
        {
          this.props.admin.isForeign ? ( <MessageBoard id="4"/>) : ('')
        }
      </div>
    );
  }
}

export default MuliSplicing;
