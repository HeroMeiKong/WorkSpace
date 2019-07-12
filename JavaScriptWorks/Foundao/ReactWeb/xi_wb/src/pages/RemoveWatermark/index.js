import React, { Component ,Fragment } from 'react'
import {withRouter} from 'react-router-dom'
import {Button} from 'element-react'
import FunctionInformation from './FunctionInformation/';
import UploadWorkArea from './UploadWorkArea/';
import SingleRemove from './SingleRemove/';
import UploadMuli from './UploadMuli/index';
import './index.scss'
import messageBox from '@/utils/messageBox';
import tools from '@/utils/tool';
import {connect} from "react-redux";
import httpRequest from "@/utils/httpRequest";
import api from "@/API/api";
import RadarPopup from '@/components/RadarPopup/index'
import intl from "react-intl-universal";
import {logout, not_muli_vip, is_muli_vip ,is_remove_vip , not_remove_vip} from '@/redux/models/admin';

@connect(
  state => ({admin: state.admin}),
  {logout, not_muli_vip, is_muli_vip,is_remove_vip,not_remove_vip}
)
class RemoveWarte extends Component {
  constructor(props){
    super(props)
    this.state = {
      isVip:false,
      isBefore : true,
      videoInfo:[
        // {
        //   boxheight: 100,
        //   boxwidth: 100,
        //   duration: "107",
        //   file_name: "4792682711280773871.mp4",
        //   g_filemd5: "c05b4cb355aa30d2d117c46bfb67a5e0",
        //   height: "576",
        //   left: 0,
        //   top: 0,
        //   url: "http://cd.foundao.com:10080/acl/org/c05b4cb355aa30d2d117c46bfb67a5e0.mp4",
        //   width: "1024"
        // }
      ],
      seemuli:true,//批量上传是否可见
      isMuliUpload:false,//是否是进行多视频上传
      chooseFiles:[],//多选文件
      is_bind:false,
    }
  }

  componentWillMount() {
    var lastDate = localStorage.getItem('Date');
    var date = new Date(),
      d = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    if (d!==lastDate){
      localStorage.setItem('times','3');
      localStorage.setItem('Date',d);
    }

  }

  componentDidMount() {
    const {isRemoveVip} = this.props.admin
    this.setState({
      isVip:isRemoveVip
    })
    // const order_ids = localStorage.getItem('muliorder_ids');
    // if(order_ids){  //有订单号,查询支付是否成功
    //   this.getOrdersStatus(order_ids)
    // }
    this.whichIDo()//该走那个逻辑
  }

  //该走那个逻辑
  whichIDo = () => {
    const href = window.location.href
    if(href !== window.location.origin + '/remove'){
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
          } else {
            this.setState({is_bind:true})
          }
        } else {
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

  gobindUser = ()=>{
    const current_url = encodeURIComponent(window.location.href);
    this.props.history.push(`/user/login?callback=${current_url}`);
  };

  /**去水印会员**/
  getVipRemove = ()=>{
    const user_info = this.props.admin;
    if (!user_info.isLogin){return}
    let hrefs = window.location.href;
    if (hrefs.indexOf('remove')!==-1 || hrefs.indexOf('mulipay/remove')!==-1 ) {}else {return}
    httpRequest({
      url: api.removeGetVipInfo,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
          if (!this.props.admin.isRemoveVip) {
            this.props.is_remove_vip();
          }
        } else {
          if (this.props.admin.isRemoveVip) {
            this.props.not_remove_vip();
          }
        }
    }).fail(() => {
      messageBox(intl.get('内部服务器错误！'))
    })
  }
  //上传单个视频完成后回调
  saveVideoInfo = (data)=>{
    let videoInfo = [];
    videoInfo.push(data)
    this.setState({
      videoInfo : videoInfo,
      isBefore : false,
      seemuli:true
    })
  }
  startUpload=()=>{
    this.setState({
      seemuli:false
    })
  }
  /**批量上传**/
  muliUpload=()=>{
    const {isRemoveVip} = this.props.admin;
    if (isRemoveVip){
      window.gtag&& window.gtag('event', 'click', {'event_category': 'remove_upload','event_label': 'remove'})
      this.refs.home_upload.click();
    } else {
      this.props.history.push('./mulipay/remove');
    }
  }
  filesChange=(e)=>{
    if (e.target.files.length<1){
      messageBox(window.intl.get('请选择文件'));
      return
    }
    let chooseFiles =[];
    for (let i=0 ; i < e.target.files.length;i++){
      chooseFiles.push(e.target.files[i])
    }
    // console.log( e.target.files)
    // return
    this.setState({
      chooseFiles,
      isMuliUpload:true
    })
  }
  getMuliFile = (chooseFiles)=>{
    // console.log(chooseFiles)
    this.setState({
      chooseFiles,
      isMuliUpload:true,
      isBefore : true,
    })
  }
  /**回到去水印首页**/
  goPre=()=>{
    this.setState({
      isMuliUpload:false,
      isBefore:true,
      videoInfo:[],
      is_bind:false,
    })
  }
  successMuli=(data)=>{
    this.setState({
      isMuliUpload:false,
      videoInfo:data,
      isBefore:false
    })
  }
  render() {
    const {isBefore,seemuli,isMuliUpload , chooseFiles,videoInfo ,isVip ,is_bind} = this.state
    const {isRemoveVip} = this.props.admin
    return (
      <div className='removeWatermark_wrapper'>
        {/* 顶部header */}
        {isBefore?
          <div className='header'>
            <div className='leftDiv'>
              <div className='logo'></div>
              <div className='functionText'>
                <p className='functionName'>{window.intl.get('去水印3')}</p>
                <p className='functionDesc'>{window.intl.get('随时随地创作/编辑视频从未如此方便')}</p>
              </div>
            </div>
            {
              seemuli && !isMuliUpload?
                <Fragment>
                  <Button className='batchProcessBtn' onClick={this.muliUpload}>
                    <div className='muliUpload-tips'>{window.intl.get('多选文件（按住Ctrl或Command）')}</div>
                    {window.intl.get('批量处理')}
                  </Button>
                  <input type="file" accept='video/mp4,video/x-m4v,video/*' multiple={true} ref='home_upload' style={{display:'none'}} onChange={this.filesChange}/>
                </Fragment>
                :""
            }

          </div>
        :''}
        {
          !isMuliUpload ?
            <Fragment>
              {/* 单视频上传区域 */}
              {isBefore ?
                <UploadWorkArea saveVideoInfo={this.saveVideoInfo}
                                successBefore={this.successBefore}
                                startUpload={this.startUpload}/>
                : ''
              }
            </Fragment>
            :
            <Fragment>
              {/**多视频上传**/}
              <UploadMuli chooseFiles={chooseFiles}
                          goPre={this.goPre}
                          successMuli={this.successMuli}
              />
            </Fragment>
        }


        {!isBefore?
          <SingleRemove
            goPre={this.goPre}
            getMuliFile = { this.getMuliFile }
            videoInfo={this.state.videoInfo}/>
        :''}              
        {/* 下方功能信息 */}
        {
          isBefore||(!isRemoveVip&&videoInfo.length>0) ||(isRemoveVip&&videoInfo.length<=1)?
          <FunctionInformation /> : ""
        }
        {is_bind  ? <RadarPopup CallBack={this.gobindUser} /> : ''}
      </div>
    )
  }
}
export default withRouter(RemoveWarte)