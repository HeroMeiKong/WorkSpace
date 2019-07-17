import React, {Component, Fragment} from 'react';
import {
  withRouter,Link
} from 'react-router-dom';
import './Header.scss';
import logo from '@/assets/logo2@2x.png';
import logo_f from '@/assets/logo_f.png';
import {connect} from 'react-redux';
import {logout, not_muli_vip, is_muli_vip, is_remove_vip, not_remove_vip} from '@/redux/models/admin';
// import CONST from '@/config/const';
import defaultHeader from '../../assets/default-header.png';
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import messageBox from '@/utils/messageBox'
import clip_icon from '../../assets/pop_icon_clip@2x.png'
import water_icon from '../../assets/pop_icon_watermark@2x.png'
import tools from '../../utils/tool'
// import splice_icon from '../../assets/pop_icon_splice@2x.png'
import splice_icon from '../../assets/images/pinjie_icon@2x.png'
import trans_icon from '../../assets/pop_icon_Transcoding@2x.png'
import removeIcom from '../../assets/removewatermark/qushuiyin.png'
// import $ from "jquery";
import intl from 'react-intl-universal';
import locales from './../../locales/index';
import CONST from './../../config/const';

const $  = window.jQuery;
/* eslint-disable */

@connect(
  state => ({admin: state.admin}),
  {logout, not_muli_vip, is_muli_vip, is_remove_vip, not_remove_vip}
)
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      user_info: {},
      rest_time: 0,
      isSingleCut: false,//是否是单段剪辑页面
      isMuliSplice: false,//是否是多段拼接界面
      isTrans: false,//是否是在线转码界面
      isWatermark: false,//是否是在线水印界面
      isWatermarkVip: false,//是否是在线水印VIP
      watermarkDay: 0,//在线水印VIP剩余天数
      isRemovePage: false,
      isRemoveVip: false,
      project_list: [
        {
          icon: clip_icon,
          value: '单段剪辑1',
          url: '/trim',
          onlineRoute: '//trim.enjoycut.com',
        },
        {
          icon: trans_icon,
          value: '在线转码5',
          url: '/convert',
          onlineRoute: '//convert.enjoycut.com',
        },
        {
          icon: water_icon,
          value: '在线水印6',
          url: '/watermark',
          onlineRoute: '//watermark.enjoycut.com',
        },
        {
          icon: splice_icon,
          value: '多段拼接3',
          url: '/merge',
          onlineRoute: '//merge.enjoycut.com',
        },
        {
          icon: removeIcom,
          value: '去水印4',
          url: '/remove',
          onlineRoute : '//remove.enjoycut.com',
        },
      ],
      ismuliVip: false,
      muliVip: '',
      removeVip: ''
    };

  }

  componentDidMount() {
    // const user_info = this.props.admin
    // if (user_info.isLogin) { //已登录
    //   this.getNowPackage()
    // }
    this.handel_pv();
    let hrefs = window.location.href;
    if (hrefs.indexOf('merge') !== -1 || hrefs.indexOf('mulipay/muli') !== -1) {
      this.setState({isMuliSplice: true,});
    }
    else {
      this.setState({isMuliSplice: false,});
    }
    if ((hrefs.indexOf('convert') !== -1)|| hrefs.indexOf('/pay') !== -1||hrefs.indexOf('pay/ct')!==-1) {
      this.setState({isTrans: true,});
    }
    else {
      this.setState({isTrans: false,});
    }
    if (hrefs.indexOf('watermark') !== -1 || hrefs.indexOf('payPage') !== -1) {
      this.setState({isWatermark: true,});
    }
    else {
      this.setState({isWatermark: false,});
    }
    if (hrefs.indexOf('trim') !== -1) {
      this.setState({isSingleCut: true,});
    }
    else {
      this.setState({isSingleCut: false,});
    }
    if (hrefs.indexOf('remove') !== -1 || hrefs.indexOf('mulipay/remove') !== -1) {
      this.setState({isRemovePage: true,});
    }
    else {
      this.setState({isRemovePage: false,});
    }

    // this.setState({
    //     isSingleCut: this.props.location.pathname === '/trim',
    //     isMuliSplice: this.props.location.pathname === '/merge' || this.props.location.pathname === '/mulipay/muli',
    //     isTrans: this.props.location.pathname === '/convert' || this.props.location.pathname === '/pay',
    //     isWatermark: this.props.location.pathname === '/watermark' || this.props.location.pathname === '/payPage',
    // });

    this.loadLocales();
    const user_info = this.props.admin;
    if (user_info.isLogin) { //已登录
      this.getNowPackage()
      this.getMuliPackage()
      this.getVipForwatermark();
      this.getVipRemove();
    }
  }

  // 判断是否h5的包装项目
  check_is_h5package = () => {
    if (window.location.href.indexOf('h5Package') > -1 || window.location.href.indexOf('h5Intro') > -1) {
      return true;
    }
    return false;
  };

  // pv统计
  handel_pv = () => {
    let hrefs = window.location.href;
    let api_url = API.pv_tj;
    if (this.check_is_h5package()) { // h5直播包装统计
      api_url = API.pv_tj_h5package;
    }
    if (hrefs.indexOf('converter')!==-1){ //在线转码
      api_url = API.convertPv_tj;
    }
    const script_dom = '<script async id="tj_id" src="' + api_url + '" type="text/javascript"></script>';
    const tj_id = $('#tj_id');
    if (tj_id) {
      tj_id.remove()
    }
    $('body').append(script_dom);
  };

  loadLocales() {
    intl.init({
      currentLocale: this.props.admin.language,
      locales,
    }).then(() => {
      this.setState({initDone: true});
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.handel_pv();
    let hrefs = window.location.href;
    if (hrefs.indexOf('merge') !== -1 || hrefs.indexOf('mulipay/muli') !== -1) {
      this.setState({isMuliSplice: true,});
    }
    else {
      this.setState({isMuliSplice: false,});
    }
    if (hrefs.indexOf('convert') !== -1 || hrefs.indexOf('/pay') !== -1||hrefs.indexOf('pay/ct')!==-1) {
      this.setState({isTrans: true,});
    }
    else {
      this.setState({isTrans: false,});
    }
    if (hrefs.indexOf('watermark') !== -1 || hrefs.indexOf('payPage') !== -1) {
      this.setState({isWatermark: true,});
    }
    else {
      this.setState({isWatermark: false,});
    }
    if (hrefs.indexOf('trim') !== -1) {
      this.setState({isSingleCut: true,});
    }
    else {
      this.setState({isSingleCut: false,});
    }
    if (hrefs.indexOf('remove') !== -1 || hrefs.indexOf('mulipay/remove') !== -1) {
      this.setState({isRemovePage: true,});
    }
    else {
      this.setState({isRemovePage: false,});
    }
    // this.setState({
    //     isSingleCut: nextProps.location.pathname === '/trim',
    //     isMuliSplice: nextProps.location.pathname === '/merge' || nextProps.location.pathname === '/mulipay/muli',
    //     isTrans: nextProps.location.pathname === '/convert' || nextProps.location.pathname === '/pay',
    // });
    const user_info = nextProps.admin;
    if (user_info.isLogin) { //已登录
      this.getNowPackage()
      this.getMuliPackage()
      this.getVipForwatermark()
      this.getVipRemove();
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //获取转码当前套餐信息
  getNowPackage = () => {
    const user_info = this.props.admin;
    if (!user_info.isLogin) {
      return
    }
    let hrefs = window.location.href;
    if (hrefs.indexOf('convert') !== -1 || window.location.pathname === '/pay'||hrefs.indexOf('pay/ct')!==-1) {
    } else {
      return
    }
    httpRequest({
      url: API.get_now_package,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        let rest_time = 0
        if (!res.data) {  //未开通套餐
          rest_time = 0
        } else {  //已购买套餐
          if (res.data.goods_id / 1 === 4) {  //终生VIP
            rest_time = -1
          } else {
            const s = res.data.expires_in
            const m = s / 60
            const h = m / 60
            const d = h / 24
            if (h < 24) {
              if (h >= 1) {
                rest_time = parseInt(h) + intl.get('小时')
              } else {
                if (m >= 1) {
                  rest_time = parseInt(m) + intl.get('分钟')
                } else {
                  rest_time = parseInt(s) + intl.get('秒')
                }
              }
            } else {
              rest_time = parseInt(d) + '天'
            }
          }
        }
        this.setState({rest_time: rest_time})
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(intl.get('内部服务器错误！'))
    })
  };

  /**获取多段拼接会员**/
  getMuliPackage = () => {
    const user_info = this.props.admin;
    if (!user_info.isLogin) {
      return
    }
    let hrefs = window.location.href;
    if (hrefs.indexOf('merge') !== -1 || hrefs.indexOf('mulipay/muli') !== -1) {
    } else {
      return
    }
    httpRequest({
      url: API.muli_get_vip_info,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        let endDate = res.data.endtime || '';
        let serverTime = res.data.server_time || '';
        let vipDateLen = new Date(endDate.replace(' ', 'T')) - new Date(serverTime.replace(' ', 'T'));
        if (vipDateLen > 0) {
          let dayLen = parseInt(vipDateLen / (60 * 60 * 24 * 1000));
          let hour = parseInt((vipDateLen / (60 * 60 * 1000)) % 24);
          // console.log(this.props.admin.isMuliVip);
          if (!this.props.admin.isMuliVip) {
            this.props.is_muli_vip();
          }
          this.setState({
            ismuliVip: true,
            muliVip: dayLen + intl.get('天')
          })
        } else {
          if (this.props.admin.isMuliVip) {
            this.props.not_muli_vip();
          }
          this.setState({
            ismuliVip: false,
            muliVip: ''
          })
        }

      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(intl.get('内部服务器错误！'))
    })
  }

  //获取水印会员
  getVipForwatermark = () => {
    const user_info = this.props.admin
    if (!user_info.isLogin) {
      return
    }
    let hrefs = window.location.href;
    if (hrefs.indexOf('watermark') !== -1 || hrefs.indexOf('payPage') !== -1) {
    } else {
      return
    }
    httpRequest({
      url: API.getVipForwatermark,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
    }).done((res) => {
      // console.log(res)
      if (res.data && res.data.goods_id && res.data.startime) {
        const day = this.resetDate(res.data.startime, res.data.endtime)
        this.setState({
          isWatermarkVip: true,
          watermarkDay: day
        })
      } else {
        this.setState({
          isWatermarkVip: false
        })
      }
    }).fail(() => {
      messageBox(intl.get('内部服务器错误！'))
    })
  }

  //获取去水印会员
  getVipRemove = () => {
    const user_info = this.props.admin;
    if (!user_info.isLogin) {return}
    let hrefs = window.location.href;
    if (hrefs.indexOf('remove') !== -1 || hrefs.indexOf('mulipay/remove') !== -1) {
    } else {return}
    if (sessionStorage.getItem('vf') && sessionStorage.getItem('vfc')) {
      let dayLenh= sessionStorage.getItem('vfc') || '';
      this.setState({
        isRemoveVip: true,
        removeVip:dayLenh + intl.get('天')
      })
      if (!this.props.admin.isRemoveVip) {
        this.props.is_remove_vip();
      }
    }
    httpRequest({
      url: API.removeGetVipInfo,
      dataType: 'json',
      type: 'POST',
      data: {
        token: user_info.token
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        let endDate = res.data.endtime || '';
        let serverTime = res.data.server_time || '';
        let vipDateLen = new Date(endDate.replace(' ', 'T')) - new Date(serverTime.replace(' ', 'T'));
        if (vipDateLen > 0) {
          let dayLen = parseInt(vipDateLen / (60 * 60 * 24 * 1000));
          let hour = parseInt((vipDateLen / (60 * 60 * 1000)) % 24);
          // console.log(this.props.admin.isMuliVip);
          if (!this.props.admin.isRemoveVip) {
            this.props.is_remove_vip();
          }
          this.setState({
            isRemoveVip: true,
            removeVip: dayLen + intl.get('天')
          })
          sessionStorage.setItem('vf','vf');
          sessionStorage.setItem('vfc',dayLen);
        } else {
          sessionStorage.removeItem('vf');
          sessionStorage.removeItem('vfc')
          if (this.props.admin.isRemoveVip) {
            this.props.not_remove_vip();
          }
          this.setState({
            isRemoveVip: false,
            removeVip: ''
          })
        }

      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(intl.get('内部服务器错误！'))
    })
  }
  resetDate = (startime, endtime) => {
    if (startime && endtime) {
      const start = startime.split(' ')
      const end = endtime.split(' ')
      const startArr = start[0].split('-')
      const endArr = end[0].split('-')
      const years = endArr[0] - startArr[0]
      const months = endArr[1] - startArr[1]
      const days = endArr[2] - startArr[2]
      return years * 365 + months * 30 + days + window.intl.get('天')
    } else {
      return 0 + window.intl.get('天')
    }
  }

  loginOut = () => {
    httpRequest({
      url: API.loginOut,
      dataType: 'json',
      type: 'POST',
      data: {
        token: this.state.user_info.token
      }
    }).done(() => {
      this.props.logout();
      window.location.reload()
    }).fail(() => {
      this.props.logout();
      window.location.reload()
    })
    if (this.props.admin.isMuliVip) {
      this.props.not_muli_vip();
    }
    sessionStorage.removeItem('vf');
    sessionStorage.removeItem('vfc')
  }

  goLogin = () => {
    // const _hostname = window.location.hostname;
    const current_url = encodeURIComponent(window.location.href);
    window.open(`/user/login?callback=${current_url}`);
    // if (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com') {
    //   window.open(`//www.enjoycut.com/user/login?callback=${current_url}`);
    // }else{
    //   window.open(`/user/login?callback=${current_url}`);
    // }
  }

  register = () => {
    // const _hostname = window.location.hostname;
    const current_url = encodeURIComponent(window.location.href);
    window.open(`/user/register?callback=${current_url}`);
    // if (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com') {
    //   window.open(`//www.enjoycut.com/user/register?callback=${current_url}`);
    // }else{
    //   window.open(`/user/register?callback=${current_url}`);
    // }
  }

  //跳转套餐页
  goToPay = () => {
    const {isMuliSplice} = this.state;
    if (isMuliSplice) {
      window.open('/mulipay/muli')
    } else {
      let href = window.location.href;
      if (href.indexOf('converter')!==-1){
        window.open('/pay/c2')
      }
      window.open('/pay')
    }
  }

  goTomuliPay = () => {
    window.open('/mulipay/muli')
  }

  goToPayPage = () => {
    window.open('/payPage')
  }

  //返回首页
  goToHome = () => {
    if (window.location.href.indexOf('/home') !== -1) {
      window.location.reload()
    } else {
      // this.props.history.push('/home')
      window.open('/home', '_blank')
    }
  }

  jumpPage = (item) => {
    const _hostname = window.location.hostname;
    if (item.url) {
      window.open(item.url)
    }
    // if (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com') {
    //   window.open(item.onlineRoute||item.url)
    // }else {
    //   window.open(item.url)
    // }
  }

  render() {
    const {isLogin, user_avatar, user_nickname, language, isForeign} = this.props.admin;
    const {
      rest_time, project_list, isSingleCut, ismuliVip, muliVip,
      isMuliSplice, isTrans, isWatermark, isWatermarkVip, watermarkDay,
      isRemovePage, removeVip, isRemoveVip
    } = this.state;
    var is_ZH = language === CONST.LANGUAGE.ZH ? true : false;
    let hrefs = window.location.href;
    let isct = false;//判断是否是 converter
    if (hrefs.indexOf('converter')!==-1||hrefs.indexOf('pay/ct')!==-1){
      isct = true
    }
    let page = sessionStorage.getItem('page');
    return (
      <div className='header-box limit-box clear-float'>
        <div className='logo-box'>
          <div onClick={this.goToHome}>
            <img src={is_ZH ? logo : logo_f} style={!is_ZH ? {height: '40px'} : {}} alt="喜视频"/>
          </div>
        </div>
        {isLogin ?
          <div className='user-Image'>
            <div className="user_headBg">
              <img className="user_headImg" src={user_avatar || defaultHeader}/>
            </div>
            <div className="user_nickName">{user_nickname}</div>
            <div className="user_img_xiala"></div>
            <ul className="xiala_box" style={is_ZH ? {} : {width: '216px'}}>
              {!isTrans ? '' :
                <Fragment>
                  {rest_time !== 0 ?
                    <li className="xiala_detail time">
                      <div className="xiala_detail_icon"></div>
                      <div>
                        {rest_time === -1 ?
                          intl.get('终身VIP') : ( intl.get('剩余时长') + ':' + rest_time)
                        }
                      </div>
                    </li> : ''
                  }
                  {/*<li className="xiala_detail setting">*/}
                  {/*<div className="xiala_detail_icon"></div>*/}
                  {/*<div>{intl.get("账户设置")}</div>*/}
                  {/*</li>*/}
                  <li className="xiala_detail vip">
                    {isct ?
                      <Link to='/pay/ct' target='_blank'/>
                      :
                      <Link to='/pay' target='_blank'/>
                    }
                    <div className="xiala_detail_icon"></div>
                    <div>{intl.get("升级VIP")}</div>
                  </li>
                </Fragment>
              }
              {isMuliSplice ?
                <Fragment>
                  {!ismuliVip ?
                    <li className="xiala_detail muliVip">
                      <Link to='/mulipay/muli' target='_blank'/>
                      <div className="xiala_detail_icon"></div>
                      <div>
                        {intl.get("升级VIP")}
                      </div>
                    </li> :
                    <li className="xiala_detail time">
                      <div className="xiala_detail_icon"></div>
                      <div>
                        {intl.get("剩余")}：{muliVip}
                      </div>
                    </li>
                  }
                </Fragment>
                : ""
              }
              {isWatermark ?
                <Fragment>
                  {isWatermarkVip
                    ?
                    <li className="xiala_detail time">
                      <div className="xiala_detail_icon"></div>
                      <div>{intl.get('剩余时长') + ':' + watermarkDay}</div>
                    </li>
                    : ''
                  }
                  <li className="xiala_detail muliVip">
                    <Link to='/payPage' target='_blank'/>
                    <div className="xiala_detail_icon"></div>
                    <div>{intl.get("升级VIP")}</div>
                  </li>
                </Fragment>
                : ""
              }
              {isRemovePage ?
                <Fragment>
                  {!isRemoveVip ?
                    <li className="xiala_detail muliVip">
                      <Link to='/mulipay/remove' target='_blank'/>
                      <div className="xiala_detail_icon"></div>
                      <div>
                        {intl.get("升级VIP")}
                      </div>
                    </li> :
                    <li className="xiala_detail time">
                      <div className="xiala_detail_icon"></div>
                      <div>
                        {intl.get("剩余")}：{removeVip}
                      </div>
                    </li>
                  }
                </Fragment>
                : ""
              }
              <li className="xiala_detail login-out" onClick={this.loginOut}>
                <div className="xiala_detail_icon"></div>
                <div>{intl.get("退出登录")}</div>
              </li>
            </ul>
          </div>
          :
          <div className='user-box'>
            <ul>
              {/*<li className='login-btn' onClick={this.goLogin}>{intl.get("登录")}</li>*/}
              <li className='register-btn' onClick={this.register}>{intl.get("立即注册")}</li>
            </ul>
          </div>
        }
        <div className='header-nav'>
          <ul>
            <li className='project-nav'>
              <div className="project_head">{intl.get("产品")}</div>
              <div className="header-projects" style={!is_ZH ? {width: '220px'} : {}}>
                <ul className='snd-nav'>
                  {project_list.map((item, index) => {
                    if (item.url==='/convert'&&page==='converter') {
                      item.url='/converter'
                    }
                    return <li className="snd-detail"
                               key={index}>
                      <Link to={item.url||''} target='_blank'>{intl.get(item.value)}</Link>
                        <img src={item.icon} alt={item.value}/>
                        <div className={item.url ? "snd-detail-name" : 'snd-not-name'}
                        >{intl.get(item.value)}</div>
                    </li>
                  })}
                </ul>
              </div>
            </li>
            {
              isForeign ? (
                <li className="head-nav-item"><a href="//www.enjoycut.com/bbs/guestbook/lists/1.html">Guest Book</a></li>
              ) : ('')
            }
            {
              isForeign ? (
                <li className="head-nav-item"><a href="//www.enjoycut.com/faq_blog/FAQ.html" target='_blank'>FAQ</a></li>
              ) : ('')
            }
            {
              isForeign ? (
                <li className="head-nav-item"><a href="//www.enjoycut.com/faq_blog/Blog/blogList.html" target='_blank'>Blog</a></li>
              ) : ('')
            }
            {
              isForeign ? (
                <li className="head-nav-item"><a href="javascript:void(0)" onClick={() => {
                  window.open('/about')
                }}>About Us</a></li>
              ) : ('')
            }
            {/*<li><a href="javascript:void(0)">服务案例</a></li>*/}
            {/*<li><a href="javascript:void(0)">在线客服</a></li>*/}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
