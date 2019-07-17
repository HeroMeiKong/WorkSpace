import React, {Component} from 'react';
import './home.scss';
import {connect} from 'react-redux';
import $ from 'jquery';
import {Link} from "react-router-dom";
// import classNames from 'classnames';
// import {login} from './../../redux/models/admin';
// import {Message} from 'element-react';
// import {sha512} from 'js-sha512';
// import Public from './../../utils/public';
import icon_Clip from './../../assets/home/icon_Clip@2x.png';
import icon_stitching from './../../assets/home/icon_stitching@2x.png';
import icon_Transcoding from './../../assets/home/icon_Transcoding@2x.png';
import icon_watermark from './../../assets/home/icon_watermark@2x.png';
import xi_icon from './../../assets/xi_icon@2x.png'
import jp_icon from './../../assets/jiaopianApp_icon@2x.png'
import xi_img from './../../assets/xi_img@2x.png'
import jp_img from './../../assets/jiaopianApp_img@2x.png'
import icon_package from './../../assets/icon_package@2x(2).png'
import icon_record from './../../assets/icon_watermark@2x(2).png'
import removeIcom from '../../assets/removewatermark/qushuiyin.png'
import demo from './../../assets/home/demo.png';
import API from '@/API/api';
import CONST from './../../config/const';
import httpRequest from "../../utils/httpRequest";
import MessageBoard from "./../../components/MessageBoard/messageBoard";
import intl from 'react-intl-universal';
import locales from './../../locales/index';
import tool from '@/utils/tool';
import HomeEn from './Home_en'

@connect(
  state => ({admin: state.admin}),
)


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      list: [
        {
          title: '单段剪辑',
          desc: '轻松快速地完成剪辑和剪切视频到任意长度',
          img: icon_Clip,
          route: '/trim'
        },
        // {
        //     title: '在线非编',
        //     desc: '在线对视频进行非线性编辑',
        //     img: icon_dadian,
        //     url: 'http://cdn-live-ori.foundao.com/xi_edit/#/user'
        // },
        {
          title: '多段拼接',
          desc: '将多个视频进行拼接，还可以添加视频转场的特效',
          img: icon_stitching,
          route: '/merge'
        },
        {
          title: '在线转码',
          desc: '将任意格式的视频在线转为MP4',
          img: icon_Transcoding,
          route: '/convert',
        },
        // {
        //     title: '一键包装',
        //     desc: '一键对视频进行处理',
        //     img: icon_package,
        // },
        {
          title: '在线水印',
          desc: '在线为视频添加个性化水印',
          img: icon_watermark,
          route: '/watermark'
        },
        {
          title: '视频去水印',
          desc: '在线轻松去除视频水印',
          img: removeIcom,
          route: '/remove'
        },
      ],
      list_live: [
        {
          title: 'H5直播包装',
          desc: '一键对直播进行包装处理',
          img: icon_package,
          route: '/h5Intro'
        },
        {
          title: '直播收录',
          desc: '直播进行收录功能',
          img: icon_record,
        },

      ],
      swiper_list: [
        {
          tit1: '喜视频',
          tit2: '一键视频包装',
          tips: '极简vlog制作利器 移动视频生活必备助手',
          download_url: "https://itunes.apple.com/cn/app/%E5%96%9C%E8%A7%86%E9%A2%91-%E6%9E%81%E7%AE%80%E7%9F%AD%E8%A7%86%E9%A2%91%E6%8B%8D%E6%91%84%E7%BC%96%E8%BE%91%E5%88%B6%E4%BD%9C/id1369648773?mt=8",
          icon: xi_icon,
          img: xi_img
        },
        {
          tit1: '蕉片',
          tit2: '移动视频专业助手',
          tips: '专业移动端视频剪辑 高质量短视频社区互动',
          download_url: "https://itunes.apple.com/cn/app/%E8%95%89%E7%89%87-%E7%9F%AD%E8%A7%86%E9%A2%91%E6%8B%8D%E6%91%84%E5%89%AA%E8%BE%91%E5%87%BA%E7%94%B5%E5%BD%B1%E5%A4%A7%E7%89%87/id1235972800?mt=8",
          icon: jp_icon,
          img: jp_img
        }
      ],
      transNum: 10000,
      curSwiperIndex: 0, //当前swiper的index
    }
  }

  componentWillMount() {
    //去掉支付宝跳转回来的多余的参数
    if (window.location.href.indexOf('?') !== -1) {
      window.location.href = window.location.href.split('?')[0]
    }
    if (document.domain.indexOf('enjoycut.cn') > 0) {
      $('body').append("<script type='text/javascript' src='//www.365webcall.com/IMMe1.aspx?settings=mw7mwN7N6P0m7Pz3A7bwNNz3Amw6bb6z3AX6mmP6'></script>")
    }
  }

  componentDidMount() {
    this.loadLocales();
    this.getTransNum()
    this.initSwiper()
  }

  loadLocales() {
    intl.init({
      currentLocale: this.props.admin.language,
      locales,
    }).then(() => {
      this.setState({initDone: true});
    });
  }


  //初始化轮播
  initSwiper = () => {
    var _this = this;
    this.homeMoerApp = new window.Swiper('#home-moerApp', {
      direction: 'horizontal',
      loop: true,
      initialSlide: 0,
      // touchMoveStopPropagation: true,
      // preventClicksPropagation: true,
      slidesPerView: 'auto',
      freeMode: false,
      autoplay: true,
      delay: 3000,

      // 如果需要前进后退按钮
      // navigation: {
      //     nextEl: '.swiper-button-next',
      //     prevEl: '.swiper-button-prev',
      // },

      on: {
        slideChangeTransitionEnd: function () {
          _this.setState({
            curSwiperIndex: this.realIndex//切换结束时，告诉我现在是第几个slide
          })
        },
      },
    })
  }


  //获取处理业务次数
  getTransNum = () => {
    clearTimeout(this.timer);
    httpRequest({
      url: API.trans_num,
      dataType: 'json',
      type: 'GET',
      async: false,
      data: {}
    }).done((res) => {
      if (res.code / 1 === 0) {
        this.setState({
          transNum: res.data
        }, () => {
          this.initNum(true)
        })
      }
    })
  }

  //初始化数字翻页
  initNum = (isFirst) => {
    const {transNum} = this.state
    var _this = this
    const time1 = (Math.random() * (7 - 2) + 2) * 1000
    this.initDataStatisc(transNum, isFirst, time1)
    this.setState({transNum: transNum + 1}, () => {
      this.timer = setTimeout(function () {
        clearTimeout(_this.timer)
        _this.initNum(false)
      }, time1)
    })
    // const num = 99999999999
  }

  //初始化插件
  initDataStatisc = (transNum, isFirst, time) => {
    const len = transNum.toString().length
    window.jQuery('.dataStatistics').dataStatistics(
      {
        min: transNum,
        max: transNum + 1,
        time: time,
        len: len,
        isFirst: isFirst
      }
    )
  }

  //swiper切换
  changeSwiper = (index) => {
    this.homeMoerApp.slideToLoop(index)
  }

  //根据num数值来渲染
  showNum = () => {
    const {transNum} = this.state
    const len = transNum.toString().length
    let div = []
    for (let i = 0; i < len; i++) {
      if (i === len - 1) {
        div.push(<div className="digit_set set_last" key={i}></div>)
      } else {
        div.push(<div className="digit_set" key={i}></div>)
      }
    }
    return div
  }

  render() {
    const {swiper_list, list, curSwiperIndex} = this.state
    const {language,isForeign} = this.props.admin

    var is_ZH = (language === CONST.LANGUAGE.ZH) ? true : false
    if (!isForeign){
      return (
        <div className='home-page'>
          <div className="home-topBg" style={!is_ZH ? {paddingTop: '119px'} : {}}>
            {
              is_ZH ? (
                <h2 className="home-bg-tit">喜视频 | 最专业的视频编辑分发平台</h2>
              ) : (
                <div>
                  <h2 className="home-bg-tit">Enjoy Cut</h2>
                  <h2 className="home-bg-tit" style={{fontSize: '35px'}}>The most professional video
                    editing and distribution
                    platform</h2>
                </div>
              )
            }

            <h3 className="home-bg-tip">
              {intl.get("喜视频已为全世界用户完成")}
              <div className="dataStatistics">
                {this.showNum()}
              </div>
              {intl.get("次视频编辑服务")}
            </h3>
          </div>
          {/*视频区域*/}
          {/*<video className="home-video"*/}
          {/*ref='video'*/}
          {/*loop*/}
          {/*muted="muted"*/}
          {/*preload='auto'>*/}
          {/*<source id="videoSource" ref="videoSource" src=""></source>*/}
          {/*</video>*/}
          {/*功能列表*/}
          <div className="home-main-box">
            <div className="home-list-box">
              <div className="hot-box">
                <div className="hot-t-0">{intl.get("喜视频在线转码")}</div>
                <div className="hot-t-1"
                     style={is_ZH ? {} : {width: '540px'}}>{intl.get("支持200多种视频格式转换，完全免费！")}</div>
                <div className="hot-list">
                  <div className="hot-item"
                       style={is_ZH ? {} : {marginRight: '20px'}}>{intl.get("一键操作")}</div>
                  <div className="hot-item"
                       style={is_ZH ? {} : {marginRight: '20px'}}>{intl.get("超快速度")}</div>
                  <div className="hot-item"
                       style={is_ZH ? {} : {marginRight: '20px'}}>{intl.get("无损转换")}</div>
                </div>
                <button className="hot-go-btn">
                  <Link to='/convert' target='_blank'>{intl.get("立即使用")}</Link>
                </button>
                <img src={demo} alt="" className="demo-png"></img>
              </div>
              <div className="t-0">{intl.get("在线视频编辑功能")}</div>
              <div className="t-1">{intl.get("无需下载，您即可在线使用各类工具编辑视频")}</div>
              <div className="home-list">
                {
                  list.map((item, index) => {
                    return (
                      <div key={index} className="home-item"
                           style={{backgroundImage: 'url(' + item.img + ')'}}>
                        <div className="item-t-0">{intl.get(item.title)}</div>
                        <div className="item-t-1">{intl.get(item.desc)}</div>
                        {item.url || item.route ? (
                          <button className="item-go-btn" style={!is_ZH ? {width: '110px'} : {}}>
                            <Link to={item.url||item.route} target='_blank'>{intl.get("立即使用")}</Link>
                          </button>
                        ) : (
                          <div className="waiting-btn">{intl.get("敬请期待")}</div>
                        )}

                      </div>
                    )
                  })
                }
              </div>
              {
                is_ZH ? (
                  <div style={{width: '100%'}}>
                    <div className="t-0">在线直播编辑功能</div>
                    <div className="t-1">您可在线使用各类工具直播编辑功能</div>
                    <div className="home-list">
                      {
                        this.state.list_live.map((item, index) => {
                          return (
                            <div key={index} className="home-item"
                                 style={{backgroundImage: 'url(' + item.img + ')'}}>
                              <div className="item-t-0">{item.title}</div>
                              <div className="item-t-1">{item.desc}</div>
                              {item.url || item.route ? (
                                <button className="item-go-btn"
                                        style={!is_ZH ? {width: '110px'} : {}}>
                                  <Link to={item.url||item.route} target='_blank'>{intl.get("立即使用")}</Link></button>
                              ) : (
                                <div className="waiting-btn">{intl.get("敬请期待")}</div>
                              )}

                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                ) : ''
              }

              <div className="advise-box">
                <div className="advise-t-0">{intl.get("更多功能即将到来，您可以留下宝贵意见～")}</div>
                <div className="advise-t-1">{intl.get("您可以把需要的新功能，或者对现有功能的意见告诉我们，我们期待您的反馈")}</div>
                <a href="mailto:kefu@foundao.com" className="advise-go-btn">{intl.get("发表意见")}</a>
              </div>
              <div className="t-0">{intl.get("App视频编辑")}</div>
              <div className="t-1">{intl.get("满足多类移动场景的视频创作")}</div>
              <div className="swiper-box">
                <div className="swiper-container" id="home-moerApp">
                  <div className="swiper-wrapper" id="moreApp-wrapper">
                    {swiper_list.map((item, index) => {
                      return <div className="swiper-slide home-moerApp" key={index}>
                        <div className="swiper-left">
                          <img src={item.icon} alt={item.tit1} className="swiper-icon"/>
                          <p className="swiper-tit1">{intl.get(item.tit1)}</p>
                          <p className="swiper-tit2">{intl.get(item.tit2)}</p>
                          <p className="swiper-tips">{intl.get(item.tips)}</p>
                          <a className="swiper-btn"
                             href={item.download_url}
                             target="_blank">{intl.get("立即下载")}</a>
                        </div>
                        <img src={item.img}
                             alt={item.tit2}
                             className="swiper-img"/>
                      </div>
                    })}
                  </div>
                </div>
              </div>
              <div className="swiper-changeBox">
                <div className={curSwiperIndex === 0 ? "swiper-btn swiper-now" : "swiper-btn"}
                     onClick={this.changeSwiper.bind(this, 0)}
                ></div>
                <div className={curSwiperIndex === 1 ? "swiper-btn swiper-now" : "swiper-btn"}
                     onClick={this.changeSwiper.bind(this, 1)}
                ></div>
              </div>
            </div>
          </div>
          {
            !is_ZH ? ( <MessageBoard id="1"/>) : ('')
          }

        </div>
      );
    } else {
      return (
        <HomeEn/>
      )
    }

  }
}

export default Home;
