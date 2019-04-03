import React, {Component} from 'react';
import {Link ,withRouter} from 'react-router-dom';
import logo from '../../assets/logo.png';
import $ from "jquery";
import api from "../../API/api";
import tool from "../../tool";
import './index.scss';
class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      pagedata:{},
      userInfo:{},
      isSubed:false
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    // console.log(this.props)
    if ( this.props.location.pathname==='/recommend'||this.props.location.pathname==='/'){
      window.sessionStorage.setItem('top', 0)
    }else {
      window.sessionStorage.setItem('top',$(document).scrollTop())
    }
  }

  // componentWillUpdate(nextProps, nextState, nextContext) {
  //   console.log(window.sessionStorage.getItem('top'));
  //
  // }
  componentWillMount() {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    }else {
      /**
       * PC地址 **/
      window.location.href="http://tv.cctv.com/lm/duihua/?spm=C28340.PSfu2aQvxDti.EYGi0YaFIj8C.264";
    }
    this.getyshInfo();
    this.getRecommendData();
    let _this = this;
    window.setPageHeader=function (resp) {
      _this.setState({
        data:resp.data
      },()=> {
        _this.shareWx();
          const {data} = _this.state;
          // console.log(data);

      })
    }
    window.setData=function(resp){
        $('title').html(resp.data.pushListUrl);
      _this.setState({
        pagedata:resp.data
      },function () {
        const {pagedata} = this.state;
        sessionStorage.setItem('firstNav', JSON.stringify(pagedata));
      })
    }
  }
  componentDidMount() {
    let _this = this;
    if (tool.is_shici()){
      let isSub = sessionStorage.getItem('isSubed');
      if (isSub / 1){
        this.setState({
          isSubed  : 1
        })
      } else {
        this.setState({
          isSubed  : 0
        })
      }
    }
    window.fellowCB = function (resp) {
      // console.log(resp.data)
      if (resp.data==='OK'){
        _this.setState({
          isSubed:true
        })
        sessionStorage.setItem('isSubed',1);
      }else if (resp.data==='Subed') {
        _this.setState({
          isSubed:true
        })
        sessionStorage.setItem('isSubed',1);
      }else {
        window.location.href='login://app.cctv.cn';
      }
      
    }
    window.unSubCB = function (resp) {
      if (resp.data==='OK'){
        _this.setState({
          isSubed:false
        })

        sessionStorage.setItem('isSubed',0);
      }else if (resp.data==='unSub') {
        _this.setState({
          isSubed:false
        })
        sessionStorage.setItem('isSubed',0);

      }else {
        window.location.href='login://app.cctv.cn';
      }
    }

  }
  /*wxShare*/
  shareWx = ()=>{
    const { data } = this.state;
    let t ,_this=this;
    t=setInterval(function () {
      if (data.mediaName){
        _this.getConfigInfo(data);
        clearInterval(t)
      }else {
        return false
      }
    },500)
  }
  /*获取央视号头部*/
  getyshInfo = ()=>{
    $.ajax({
      type:'GET',
      dataType: "jsonp",
      url:api.pageHeader + 'setPageHeader',
      data:{},
    })
  };
  /*获取推荐的数据*/
  getRecommendData=()=>{
    $.ajax({
      type:'GET',
      dataType: "jsonp",
      url:api.recommendList + 'setData',
      data:{},
    })
  };
  /*获取wxconfig信息*/
  getConfigInfo = ( data )=>{
    $.ajax({
      dataType:"jsonp",
      type:'GET',
      url:'http://appms.app.cntvwb.cn/appms/wxjs/getsign.do',
      timeout: 10000,
      jsonp:'cb',
      jsonpCallback:'wx_sign_cb',
      data:{
        appid : "wx6736e1ee7f82ba26",
        url: window.location.href.split('#')[0],
        f:"jsonp"
      },
      success:function success(resp) {
        window.wx.config({
          debug: false,
          appId: "wx6736e1ee7f82ba26",
          timestamp: resp.data.timestamp,
          nonceStr: resp.data.nonceStr,
          signature: resp.data.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
          ]
        });
        window.wx.ready(function () {
          window.wx.onMenuShareAppMessage({
            title : data.mediaName,
            desc : data.biref,  // 分享描述
            link: window.location.href,
            imgUrl:data.logoImg||'',
            success: function (res) {  // 设置成功
              console.log('微信分享成功')
            },
            cancel: function (res) {
            },
            fail: function (result) {
              console.log(result)
            }
          });
          // “分享到朋友圈”及“分享到QQ空间”  无描述
          window.wx.onMenuShareTimeline({
            title : data.mediaName,
            link: window.location.href,
            imgUrl:data.logoImg||'',
            success: function () {
              // 设置成功
              console.log('微信分享成功')
            }
          });

        });
      }
    });
  };
  /*点击关注*/
  fellowSC=()=>{
    let mid = '17aQfAjy0815';
    if(tool.is_wxBrowser()){
      tool.jumpToApp('23', mid);
    }else if (tool.is_shici()){
      if (window.localStorage.getItem("user_info")){
        let user_info = JSON.parse(window.localStorage.getItem('user_info'));
        if (user_info.userId.length<1){
          window.location.href='login://app.cctv.cn';
        }else {
          // alert('点击了关注按钮');
          $.ajax({
            type:'GET',
            dataType:"jsonp",
            url:api.sub+'&cb=fellowCB',
            data:{
              uid:user_info.userId,
            }
          });
        }
      }else {
        window.location.href='login://app.cctv.cn';
      }
    } else {
      tool.jumpToApp('23', mid);
    }
  };
  /*取消关注*/
  unSubed=()=>{
    let mid = '17aQfAjy0815';
    if(tool.is_wxBrowser()){
      tool.jumpToApp('23', mid);
    }else if (tool.is_shici()){
      // alert('环境：客户端');
      if (window.localStorage.getItem("user_info")){
        let user_info = JSON.parse(window.localStorage.getItem('user_info'));
        // console.log(user_info);
        if (user_info.userId.length<1){
          window.location.href='login://app.cctv.cn';
          return false
        }
        // alert('点击了取消关注');
        $.ajax({
          dataType:"jsonp",
          type:'GET',
          url:api.unsub + '&cb=unSubCB',
          data:{
            mid:"17aQfAjy0815",
            uid:user_info.userId,
          },
        });
      }else {
        window.location.href='login://cctv.cn';
      }
    } else {
      tool.jumpToApp('23', mid);
    }
  };
  render() {
    const {data,isSubed,pagedata} = this.state;
    console.log(data.bgImg);
    let categoryList = pagedata.categoryList ? pagedata.categoryList : [];
    return (
      <div className='page-header'>
        <div className='page-info' style={{backgroundImage:'url('+data.bgImg+')'}}>
          <h1 className='limit-line1'>{data.mediaName}</h1>
          <div className='fellow-box'>
            <p><span>{data.besubscribed}</span> 粉丝</p>
            {isSubed?
              <a onClick={this.unSubed} style={{background:'rgba(222,222,222,.3)'}}>已关注</a>
              :
              <a onClick={this.fellowSC}>+关注</a>
            }
          </div>
          <h2>{data.biref}</h2>
          <div className='palywhere'>
            <p>{data.tvChName}</p>
            <p>{pagedata.liveCategoryControl}</p>
          </div>
          <div className='logobox'>
            <img src={ data.logoImg || ''} alt="logo"/>
          </div>
        </div>
        <ul className='page-nav'>
          <li
            className={this.props.location.pathname==='/recommend'||this.props.location.pathname==='/'?"on":""}
            key='recommend'>
            <a href='#/recommend'>推荐</a>
          </li>
          {categoryList.map(item=>{
            if (item.category/1===1){
              return (
                <li
                  className={this.props.location.pathname==='/recommend/'+item.sign ?"on":""}
                  key={item.sign}>
                  <Link to={'#/recommend/'+item.sign}>{item.title}</Link>
                </li>
              )
            }else if(item.category/1===2){
              return(
                <li
                  className={this.props.location.pathname==='/talkingPoetry/'+item.sign?"on":""}
                  key={item.sign}>
                  <Link to={'/talkingPoetry/'+item.sign}>{item.title}</Link>
                </li>
              )
            }else if(item.category/1===3){
              return(
                <li
                  className={this.props.location.pathname==='/lookPoetry/'+item.sign?"on":""}
                  key={item.sign}>
                  <Link to={'/lookPoetry/'+item.sign}>{item.title}</Link>
                </li>
              )
            }else if(item.category/1===4){
              return(
                <li
                  className={this.props.location.pathname==='/lookPoetry2/'+item.sign?"on":""}
                  key={item.sign}>
                  <Link to={'/lookPoetry2/'+item.sign}>{item.title}</Link>
                </li>
              )
            }else if(item.category/1===5){
              return(
                <li
                  className={this.props.location.pathname==='/PopularityList/'+item.sign?"on":""}
                  key={item.sign}>
                  <Link to={'/PopularityList/'+item.sign}>{item.title}</Link>
                </li>
              )
            }
          })}
        </ul>
      </div>
    )
  }
}
export default withRouter(Recommend)