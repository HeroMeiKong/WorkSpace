import React, {Component} from 'react'
import './index.scss'
import MoreTools from "../../components/MoreTools";
import {NavLink} from "react-router-dom";
import UploadBox from "./UploadBox";
import httpRequest from "../../utils/httpRequest";
import API from '../../API/api'
import transCode from '@/utils/transCode';
import messageBox from '@/utils/messageBox'
// import $ from 'jquery'
import tools from '@/utils/tool';
import {login} from '@/redux/models/admin';
import {connect} from 'react-redux';
// import Alert from "../../components/Alert";
import Ad from '../../components/Ad'
import RadarPopup from '../../components/RadarPopup/index'
// import MessageBoard from '../../components/MessageBoard/messageBoard'
import SupportUrl from '@/components/SupportUrl/SupportUrl'
import Grade from '../../components/Grade'
const $ = window.jQuery;
/* eslint-disable */

const transArr = []

@connect(
  state => ({admin: state.admin}),
  {login}
)

export default class Trans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file_list: [],  //选择的文件
      isLogin: false,  //是否登录
      isDrop : false,
      isClick: false,  //是否点击最初的视频框
      isSelect: false, //是否点击选择分辨率下拉框
      isMoreTrans: false, //是否显示超过转码数提示
      isTransMore: false, //是否显示超过同时转码数提示
      isDelete: false,  //是否删除文件提示框
      deleteIndex: '', //删除的文件位置
      resolveIndex: '', //选择分辨率的位置
      maxSize: 500,  //最大上传大小 MB
      is_bind : false, //是否弹出绑定账号弹窗
      randomText: '查看了解更多强大功能',//随机出现的文字内容
      arr: [],//视频上传数组
      showStar: false, //显示打分
      startToken: '',//上传文件token
    }
  }

  componentDidMount() {
    sessionStorage.setItem('page','trans')
    //去掉支付宝跳转回来的多余的参数
    // if (window.location.href.indexOf('?') !== -1) {
    //   window.location.href = window.location.href.split('?')[0]
    // }
    window.scrollTo(0,0)
    this.createRandomText()//产生随机文字
    this.whichIDo()//该走那个逻辑
    const dropbox = this.refs['trans-controller'];
    dropbox.addEventListener("dragenter", this.dragenter, false);
    dropbox.addEventListener("dragover", this.dragover, false);
    dropbox.addEventListener("dragleave", this.dragleave, false);
    dropbox.addEventListener("drop", this.drop, false);
    this.isVip()
    this.setState({arr: []})
  }

  dragenter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  dragleave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({isDrop:false})
  }

  dragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({isDrop:true})
  };

  drop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({isDrop:false})

    const dt = e.dataTransfer;
    const files = dt.files;
    const fileType = files[0].type;
    if(fileType.indexOf('video')!==-1){
      this.setState({
        isClick: true
      }, () => {
        this.addUploadBox(true, files)
      })
    }else{
      messageBox('更多格式的转换功能即将上线，敬请期待')
    }
  };

  //该走那个逻辑
  whichIDo = () => {
    const href = window.location.href
    if(href !== window.location.origin + '/convert'){
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
          if(res.code /1 === 0){
            if(localStorage.getItem('order_success')){
              //payWay方便支付成功时查询已那种方式支付，payId支付订单号，两个都必须传
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

  //判断是否购买了套餐
  isVip = () => {
    let isVip = false
    const user_info = this.props.admin
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
            let maxSize = 100
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
    }
    return isVip
  }

  //检查是否有该文件，控制不能在同一时间上传同一个文件
  checkFile = (file) => {
    const arr = this.state.arr
    const length = arr.length
    for(let i=0;i<length;i++){
      if(arr[i].name === file.name && arr[i].size === file.size){
        return true
      }
    }
    return false
  }

  //将添加的视频加入判断数组
  addFile = (file) => {
    const arr = this.state.arr
    arr.push({name: file.name, size: file.size})
    this.setState({arr})
  }

  //从判断数组中删除记录
  deleteFileArr = (name,size) => {
    const arr = this.state.arr
    const length = this.state.arr.length
    for(let i=0;i<length;i++){
      if(arr[i].name === name && arr[i].size === size){
        arr.splice(i,1)
      }
    }
    this.setState({arr})
  }

  //上传改变
  uploadChange = (index, fileItem, files) => {
    if(this.checkFile(fileItem)){
      messageBox(window.intl.get('此视频正在上传，请勿重复上传'))
    } else {
      this.state.arr.push(fileItem)
      this.setState({arr: this.state.arr})
      const {file_list} = this.state
      if (!this.checkTransMore()) {
        file_list.splice(index, 1)
        this.setState({isTransMore: true})
        // this.goToPay()
      } else {
        file_list[index] = {
          file: fileItem,
          file_name: fileItem.name,
          file_size: fileItem.size,
          file_w: '',
          file_h: '',
          successLoad: false,
          failLoad: false,
          successTrans: false,
          failTrans: false,
          transing: false,
          percent: 0,
          duration: '',
          width: '',
          height: '',
          g_filemd5: '',
          video_url: '',
          upToken: ''
        }
      }
      this.setState({file_list, isClick: true})
    }
  }

  //上传成功回调
  uploadSuccess = (index, file_name, file_size, g_filemd5, upToken) => {
    const {file_list} = this.state
    this.deleteFileArr(file_name,file_size)
    if (file_list[index].file_name !== file_name) { //取消上传时如果成功回调了  return
      return
    }
    this.setState({startToken: upToken})//上传成功传入uptoken，方便知道打分情况
    httpRequest({
      url: API.qureyMeidiaInfo,
      data: {
        MD5: g_filemd5
      }
    }).done((res) => {
      if (res.status / 1 === 0) {
        file_list[index].width = res.width
        file_list[index].file_w = res.width
        file_list[index].height = res.height
        file_list[index].file_h = res.height
        file_list[index].duration = res.duration
        file_list[index].successLoad = true
        file_list[index].g_filemd5 = g_filemd5
        file_list[index].upToken = upToken
        file_list[index].waiting = false //是否在上传与转码过度之间等待


        this.setState({file_list}, () => {
          // this.transVideo()
          this.transSingle(file_list[index], index)
        })
      } else {
        file_list[index].failLoad = true
        this.setState({file_list})
      }
    }).fail(() => {
      file_list[index].failLoad = true
      this.setState({file_list})
    })
    httpRequest({
      url: API.up_end,
      data: {
        trans_type: 1,
        up_token: upToken
      }
    }).done((res) => {
    }).fail(() => {
      console.log('统计失败！')
    })
  }

  //转码成功回调
  transSuccess = (index, url) => {
    const {file_list} = this.state
    file_list[index].successTrans = true
    file_list[index].transing = false
    file_list[index].video_url = url
    this.saveTransRecode()
    if (this.checkTransRecord()) {
      this.setState({isMoreTrans: true})
    }
    this.setState({showStar: true})
    httpRequest({
      url: API.starTimes,
      data: {
        trans_type: '1',
        up_token: this.state.startToken
      }
    }).done((res) => {
      console.log('打星记录成功')
    })
  }

  //localStorage存转码记录
  saveTransRecode = () => {
    const transRecord_str = localStorage.getItem('transRecord') //localstorage的obj记录
    const date = new Date()
    const ymd = date.toLocaleDateString() //当前年月日的string
    if (!transRecord_str) { //如果没有记录
      const transRocord = {
        [ymd]: 1
      }
      localStorage.setItem('transRecord', JSON.stringify(transRocord))
    } else {
      const transRocord = JSON.parse(transRecord_str)
      if (transRocord[ymd]) {  //如果当天有值
        transRocord[ymd]++
      } else {
        transRocord[ymd] = 1
      }
      localStorage.setItem('transRecord', JSON.stringify(transRocord))
    }
  }

  //校验转码记录当天是否超过3个视频
  checkTransRecord = () => {
    let checkTransrecord = false
    if (this.isVip() !== false) {  //是vip
      checkTransrecord = false
    } else {
      const transRecord_str = localStorage.getItem('transRecord') //localstorage的obj记录
      const date = new Date()
      const ymd = date.toLocaleDateString() //当前年月日的string
      if (!transRecord_str) { //如果没有记录
        checkTransrecord = false
      } else {
        const transRocord = JSON.parse(transRecord_str)
        if (transRocord[ymd] && transRocord[ymd] >= 3) {  //如果当天有值并且大于等于三个
          checkTransrecord = true
        } else {
          checkTransrecord = false
        }
      }
    }
    return checkTransrecord
  }

  //用户同时转码多个视频判断
  checkTransMore = () => {
    const {file_list} = this.state
    let wait_trans_num = 0
    let checkTransmore = false
    file_list.forEach((item, index) => {
      if (!item.successTrans && item.file_name) { //上传成功并且未转码
        wait_trans_num++
      }
    })
    if (this.isVip() !== false) {
      if (this.vip_type === 4) {
        checkTransmore = true
      } else if (this.vip_type === 1 && wait_trans_num >= 5) {  //套餐一最多同时5个
        checkTransmore = false
      } else if (this.vip_type === 2 && wait_trans_num >= 25) { //套餐二最多同时25个
        checkTransmore = false
      } else if (this.vip_type === 3 && wait_trans_num >= 50) { //套餐三最多同时50个
        checkTransmore = false
      } else {
        checkTransmore = true
      }
    } else {
      if (wait_trans_num >= 2) { //未登录或非套餐，同时只能转码两个视频
        checkTransmore = false
      } else {
        checkTransmore = true
      }
    }
    // console.log('checkTransmore: ',checkTransmore)
    // console.log('wait_trans_num: ',wait_trans_num)
    return checkTransmore
  }

  //上传进度
  uploadProgress = (index, percent) => {
    const {file_list} = this.state
    file_list[index].percent = percent
    if((percent-0) > 98){
      file_list[index].successLoad = true
      file_list[index].waiting = false
    }
    this.setState({file_list})
  }

  //转码进度
  transProgress = (index, percent) => {
    const {file_list} = this.state;
    if(percent > 0){
      file_list[index].waiting = true
    }
    file_list[index].percent = percent;
    this.setState({file_list})
  }

  //上传失败
  uploadError = (index, option) => {
    const {file_list} = this.state
    if (option && option.code === 1) {  //文件大小过大
      this.uploadMoreSize(index)
      // this.goToPay(file_list[index].file_size)
    } else {
      file_list[index].failLoad = true
      this.setState({file_list})
    }
  }

  //上传文件过大
  uploadMoreSize = (index) => {
    const {file_list} = this.state
    this.setState({isMoreSize: true}, () => {
      file_list.splice(index, 1)
      this.setState({file_list})
    })
  }

  //转码失败
  transFail = (index, msg) => {
    messageBox(msg)
    const {file_list} = this.state
    file_list[index].failTrans = true
    this.setState({file_list})
  }

  //点击选择视频框
  clickVideoBox = () => {
    window.gtag && window.gtag('event', 'click', {'event_category': 'upload','event_label': 'video'}) //统计上传
    this.setState({
      isClick: true
    }, () => {
      this.addUploadBox()
    })
  }

  //新增一个upload组件
  addUploadBox = (isFirst, files) => {
    const {file_list} = this.state
    if (isFirst === true) {
      file_list.push({
        file: files[0],
        file_name: files[0].name,
        file_size: files[0].size,
        file_w: '',
        file_h: '',
        successLoad: false,
        failLoad: false,
        successTrans: false,
        failTrans: false,
        transing: false,
        percent: 0,
        duration: '',
        width: '',
        height: '',
        g_filemd5: '',
        video_url: '',
      })
    } else {
      file_list.push({})
    }
    this.setState({
      file_list,
      isFirst: isFirst === true ? isFirst : false
    })
  }

  //点击删除文件按钮
  deleteFile = (index) => {
    this.setState({
      deleteIndex: index,
      isDelete: true
    })
  }

  //取消删除文件
  cancleDelete = () => {
    this.setState({
      isDelete: false
    })
  }

  //确认删除文件
  confirm_delete = () => {
    this.cancleDelete()
    const {file_list, deleteIndex} = this.state
    file_list.splice(deleteIndex, 1)
    if (file_list.length === 0) {
      this.setState({isClick: false})
    }
    this.setState({file_list})
  }

  //点击分辨率按钮
  selectResolve = (index) => {
    const {file_list, isSelect} = this.state
    if (isSelect) {
      this.setState({isSelect: false})
    } else {
      this.setState({
        resolveIndex: index,
        file_list,
        isSelect: true
      })
    }
  }

  //选择分辨率
  clickResolve = (index, fblItem) => {
    const {file_list} = this.state
    if (fblItem.w && fblItem.h) {  //默认里面的有数值选项
      if (file_list[index].width < fblItem.w && file_list[index].height < fblItem.h) {
        return
      } else {
        file_list[index].file_w = fblItem.w
        file_list[index].file_h = fblItem.h
      }
    } else {
      if (fblItem.label) {  //选择原始分辨率
        file_list[index].file_w = file_list[index].width
        file_list[index].file_h = file_list[index].height
      } else {
        if (file_list[index].file_w % 2 !== 0) {
          file_list[index].file_w++
        }
        if (file_list[index].file_h % 2 !== 0) {
          file_list[index].file_h++
        }
        if (file_list[index].file_w / 1 < 120) {
          file_list[index].file_w = 120
        }
        if (file_list[index].file_h / 1 < 160) {
          file_list[index].file_h = 160
        }
      }
    }
    this.setState({file_list, isSelect: false})
  }

  //手动输入分辨率
  changeFbl = (index, direction, e) => {
    const {file_list} = this.state
    if ((e.target.value / 1 > file_list[index].width / 1) && direction === 'file_w') {
      //宽超过自身宽度
      file_list[index][direction] = file_list[index].width
      this.setState({file_list})
      return
    }
    if ((e.target.value / 1 > file_list[index].height / 1) && direction === 'file_h') {
      //高超过自身高度
      file_list[index][direction] = file_list[index].width
      this.setState({file_list})
      return
    }
    if (e.target.value / 1 < 0) {
      return
    }
    file_list[index][direction] = e.target.value
    this.setState({file_list})
  }

  //转码
  transVideo = () => {
    const {file_list} = this.state
    file_list.forEach((item, index) => {
      this.transSingle(item, index)
    })
  }

  //单个视频转码
  transSingle = (item, index) => {
    const {file_list} = this.state
    var _this = this
    if (!item.file_name) {
      file_list.splice(index, 1)
    } else if (!item.successTrans) {  //只对未转码的视频进行转码
      item.transing = true
      item.percent = 0
      const trans = transCode({
        transOptions: {
          inFileName: item.file_name,
          inFileMd5: item.g_filemd5,
          outWidth: item.file_w,
          outHeight: item.file_h,
          token: item.upToken
        },
        transSuccess: _this.transSuccess.bind(this, index),
        transFail: _this.transFail.bind(this, index),
        transProgress: _this.transProgress.bind(this, index),
      })
      transArr.push(trans)
    }
  }

  //停止查询转码
  stopTrans = (index) => {
    transArr[index].stopTransCode()
    transArr.splice(index, 1)
  }

  //重新转码或者上传
  retry_this = (index) => {
    const {file_list} = this.state
    if (file_list[index].failLoad) {
      file_list[index].failLoad = false
      this.setState({file_list})
    } else if (file_list[index].failTrans) {
      file_list[index].failTrans = false
      this.setState({file_list}, () => {
        this.transSingle(file_list[index], index)
      })
    } else {
      return
    }
  }

  //前往支付页
  goToPay = (file_size) => {
    let size = ''
    if (typeof file_size === "number" && file_size / 1024 / 1024 / 1024 >= 10) {
      size = `?file_size=${file_size}`
    }
    this.cancleToPay()
    const location = window.location;
    const path = `${location.protocol}//${location.host}`;
    // 新开窗口 (window.open 会被大部分浏览器拦截)
    var a = $('<a href="' + `${path}/pay${size}` + '" target="_blank"></a>')[0];
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
  }

  //取消去往支付页的弹框
  cancleToPay = () => {
    this.setState({isMoreTrans: false, isMoreSize: false, isTransMore: false})
  }

  //前往登录页
  goLogin = () => {
    const current_url = encodeURIComponent(window.location.href);
    this.props.history.push(`./user/login?callback=${current_url}`);
  }

  //生成随机文字
  createRandomText = () => {
    const arr = ['1G文件转码', '30X倍速转码', '10个文件同时转码']
    // setInterval(() => {
      // const a = parseInt(Math.random()*(2+1),10)
      const which = Math.floor(Math.random()*(2+1))
      this.setState({
        randomText: arr[which]
      })
    // })
  }

  render() {
    const { isDelete, file_list, isMoreTrans, isMoreSize, isTransMore,isDrop,
      maxSize, is_bind, randomText, showStar, startToken } = this.state
    const { isForeign } = this.props.admin
    return (
      <div className="trans-box">
        {/* {is_bind  ?
          <Alert cancelCallBack={this.goLogin}
                 btn="立即绑定"
                 msg="当前临时账号存在风险，建议您绑定实体账号操作更加安全"/> : ''
        } */}
        {is_bind  ? <RadarPopup CallBack={this.goLogin} /> : ''}
        {isDrop ?
          <div className="drag_bg"></div>  : ''}
        {isDelete ?  //删除文件
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
              {window.intl.get('确认要取消此文件么？')}</h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box"
                    onClick={this.confirm_delete}>
                  {window.intl.get('取消')}
                </div>
                <div className="cancle_btn_box"
                    onClick={this.cancleDelete}>
                  {window.intl.get('不取消')}
                </div>
              </div>
            </div>
          </div> : ''
        }
        {isMoreTrans ?  //超出三个视频
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
              {window.intl.get('尝试批量转换为您节省更多时间1')}</h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box"
                    onClick={this.cancleToPay}>
                  {window.intl.get('残忍拒绝')}
                </div>
                <div className="cancle_btn_box"
                    onClick={this.goToPay}>
                  {window.intl.get('马上查看')}
                </div>
              </div>
            </div>
          </div> : ''
        }
        {isMoreSize ?  //超出视频最大大小
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
                {maxSize / 1 === 500 ? window.intl.get('您的视频超过500M，我们为您推荐更加快捷的转码服务') : window.intl.get('您的视频超过10G，建议升级至终极版套餐享受极速转码')}</h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box"
                    onClick={this.cancleToPay}>
                  {window.intl.get('我再想想')}
                </div>
                <div className="cancle_btn_box"
                    onClick={this.goToPay.bind(this, maxSize)}>
                  {window.intl.get('查看推荐')}
                </div>
              </div>
            </div>
          </div> : ''
        }
        {/* {isTransMore ?  //超出同时转码数最大大小
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
                {this.vip_type === 0 ? window.intl.get('尝试批量转换为您节省更多时间') : window.intl.get('升级会员') + window.intl.get('，试试一次转码更多视频')}</h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box" onClick={this.cancleToPay}>{window.intl.get('残忍拒绝')}</div>
                <div className="cancle_btn_box" onClick={this.goToPay}>
                  {this.vip_type === 0 ? window.intl.get('马上查看') : window.intl.get('升级会员')}
                </div>
              </div>
            </div>
          </div> : ''
        } */}
        {isTransMore ?  //超出同时转码数最大大小
          <div className="full_box">
            <div className="confirm_box">
              <h2 className="full_box_tit">
                {window.intl.get('尝试批量转换为您节省更多时间2')}</h2>
              <div className="wrapper_btn_box">
                <div className="confirm_btn_box" onClick={this.cancleToPay}>{window.intl.get('残忍拒绝')}</div>
                <div className="cancle_btn_box" onClick={this.goToPay}>
                  {window.intl.get('马上查看')}
                </div>
              </div>
            </div>
          </div> : ''
        }
        <div className="transBox">
          <div className="trans-main">
            <div className="trans-left">
              <h2 className="trans-left-tit">{window.intl.get('免费MP4在线转换器')}</h2>
              <h3 className="trans-left-tip">{window.intl.get('任意视频格式转换为MP4')}</h3>
              {this.state.isClick ?
                <UploadBox file_list={file_list}
                           deleteFile={this.deleteFile}
                           uploadChange={this.uploadChange}
                           uploadSuccess={this.uploadSuccess}
                           uploadProgress={this.uploadProgress}
                           uploadError={this.uploadError}
                           selectResolve={this.selectResolve}
                           addUploadBox={this.addUploadBox}
                           resolveIndex={this.state.resolveIndex}
                           clickResolve={this.clickResolve}
                           changeFbl={this.changeFbl}
                           isFirst={this.state.isFirst}
                           isSelect={this.state.isSelect}
                           // transVideo={this.transVideo}
                           retry_this={this.retry_this}
                           stopTrans={this.stopTrans}
                           maxSize={this.state.maxSize}
                />
                :
                <div className="trans-controller"
                     ref="trans-controller"
                     onClick={this.clickVideoBox}>
                  <div className="controller-bg"></div>
                  <div className="controller-main">
                    <div className="controller-icon"></div>
                    <p className="controller-tip">{window.intl.get('点击或拖拽添加您的视频文件')}</p>
                  </div>
                </div>
              }
            </div>
            <div className="trans-right">
              <h2 className="trans-right-tit">{window.intl.get('高效智能视频在线转码工具')}</h2>
              <h3 className="trans-right-tip" dangerouslySetInnerHTML={{__html: window.intl.get('它的快速转换时间，高质量输出和额外功能使其成为视频转换器软件的完美选择')}}></h3>
              <NavLink to='/pay' className="toPay-btn" target="_blank">
              {window.intl.get(randomText)}</NavLink>
              <ul className="trans-right-box">
                <li className="right-box-list">
                  <span className="right-list-icon right-list-icon1"></span>
                  <h3 className="right-list-tit">{window.intl.get('在线格式转换')}</h3>
                  <p className="right-list-content">{window.intl.get('让您在浏览器中更改视频分辨率和大小')}</p>
                </li>
                {/* <li className="right-box-list">//6-3
                  <span className="right-list-icon right-list-icon2"></span>
                  <h3 className="right-list-tit">{window.intl.get('轻松在线访问')}</h3>
                  <p className="right-list-content">{window.intl.get('只需在浏览器中点击几下您的文件就准备好了')}</p>
                </li>
                <li className="right-box-list">
                  <span className="right-list-icon right-list-icon3"></span>
                  <h3 className="right-list-tit">{window.intl.get('30X高速转码')}</h3>
                  <p className="right-list-content">{window.intl.get('转换速度要比您使用自己的计算机快30X倍')}</p>
                </li>
                <li className="right-box-list">
                  <span className="right-list-icon right-list-icon4"></span>
                  <h3 className="right-list-tit">{window.intl.get('多文件同时转换')}</h3>
                  <p className="right-list-content">{window.intl.get('支持多视频文件同时转换，有效提高转换效率')}</p>
                </li> */}
                <li className="right-box-list">
                  <span className="right-list-icon right-list-icon5"></span>
                  <h3 className="right-list-tit">{window.intl.get('安全可靠')}</h3>
                  <p className="right-list-content">{window.intl.get('转码后的文件为您存储在云服务器上，更加安全可靠')}</p>
                </li>
                <li className="right-box-list">
                  <span className="right-list-icon right-list-icon6"></span>
                  <h3 className="right-list-tit">{window.intl.get('先进的技术支持')}</h3>
                  <p className="right-list-content">{window.intl.get('高质量codec能够提高低劣源源文件的视觉质量')}</p>
                </li>
              </ul>
            </div>
          </div>
          {isForeign? <Ad classNames='transAd'/>:""}
        </div>
        <SupportUrl />
        <MoreTools type="trans"/>
          {/* {
              isForeign ? ( <MessageBoard id="2"/>) : ('')
          } */}
        {showStar ? <Grade token={startToken} /> : ''}
      </div>
    )
  }
}