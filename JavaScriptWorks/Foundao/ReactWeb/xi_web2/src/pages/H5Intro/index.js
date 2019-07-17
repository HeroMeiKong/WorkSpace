import React, {Component} from 'react';
import img_pc from './images/pc.png'
import swiper1 from './images/swiper1.png'
import swiper2 from './images/swiper2.png'
import swiper3 from './images/swiper3.png'
import swiper4 from './images/swiper4.png'
import swiper5 from './images/swiper5.png'
import partnerImg from './images/partner.png'
import icon1 from './images/icon1.png';
import icon2 from './images/icon2.png';
import icon3 from './images/icon3.png';
import icon4 from './images/icon4.png';
import icon5 from './images/icon5.png';
import icon6 from './images/icon6.png';
import './index.scss';
import {scenes} from '../H5Package/config';
import tools from '@/utils/tool'
/*h5直播介绍页*/
export default
class H5Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      swiperArr: [
        swiper1,
        swiper2,
        swiper3,
        swiper4,
        swiper5,
      ],
      functionArr: [
        {name: '互动', icon: icon1, desc: ['评论互动', '点赞互动', '聊天互动', '互动答题', '互动投票', '礼物打赏']},
        {name: '媒体库', icon: icon2, desc: ['视频存储', '视频合并', '', '视频剪辑', '快速下载', '']},
        {name: '分享', icon: icon3, desc: ['微信分享', 'QQ分享', '微博分享', '分享配置', '', '']},
        {name: '品牌', icon: icon4, desc: ['自定义封面', '自定义分享图标', '', '自定义背景图', '自定义LOGO', '']},
        {name: '观看', icon: icon5, desc: ['验证码', '付费观看', '', '手机白名单', '', '']},
        {name: '统计', icon: icon6, desc: ['微信用户', '省份城市', 'IP地址', '观看时长', '直播时长', '']},
      ]
    };
  }

  componentWillMount() {
    // this.checkLogin();
    const userInfo = tools.getUserData_storage();
    let sawIntro = localStorage.getItem('XI_sawIntro') || '';
    if (userInfo.token) { // 已登录
      const sawTokenArr = sawIntro.split(',');
      // 判断用户是否浏览过直播介绍，如果浏览过 则直接跳转到包装列表页
      if (sawTokenArr.indexOf(userInfo.token) >= 0) {
        this.props.history.replace('h5package');
      }else {
        // 追加记录 下次进入直接跳转到列表页
        sawIntro = sawIntro + ',' + userInfo.token;
        localStorage.setItem('XI_sawIntro', sawIntro);
      }
    }
  };

  componentDidMount() {
    const swiper = new window.Swiper('.swiper-container', {
      slidesPerView: 5,
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true, // 点击设置为true则点击slide会过渡到这个slide
      pagination: {},
    });
  }

  componentWillUnmount() {

  }
  // 服务咨询
  service_ask = () => {
    this.setState({
      showDialog: true
    })
  };
  // 立即试用
  startUse = () => {
    this.props.history.push('h5package');
  };
  closeDialog = () => {
    this.setState({
      showDialog: false
    })
  };
  render() {
    const {swiperArr, functionArr, showDialog} = this.state;
    return (
      <div className="h5_package_intro">
        <div className="banner fullbg">
          <div className="main">
            <h1>拓道直播-企业级直播包装平台</h1>
            <p className="merit">个性化设置 | 多维度互动 | 完美适配微信</p>
            <div className="btn_wrapper">
              <button className="btn_primary" onClick={this.startUse}>免费试用</button>
              <button className="btn_line" onClick={this.service_ask}>服务咨询</button>
            </div>
          </div>
        </div>
        <section className="pull_block">
          <div className="main">
            <h2>网络拉流 一键包装</h2>
            <p className="section_desc">拉流形式多样化 一键操作使直播更加高效快捷展示</p>
            <div className="block_content clearfix">
              <div className="tools_wrapper">
                <div className="tool_item sjtl">手机推流</div>
                <div className="tool_item wlll">网络拉流</div>
                <div className="tool_item zysb">专业设备</div>
                <div className="tool_item wrj">无人机</div>
              </div>
              <div className="pc_img">
                <img src={img_pc} alt=""/>
              </div>
            </div>
          </div>
        </section>
        {/*轮播*/}
        <section className="module_block fullbg">
          <div className="main">
            <h2>多样化包装模板</h2>
            <p className="section_desc">提供多样化直播包装模板 对不同直播场景进行包装 充分体现出直播的效果</p>
            <div className="block_content">
              <div className="swiper-container">
                <div className="swiper-wrapper">
                  {swiperArr.map((item, index) => {
                    return <div key={index} className="swiper-slide">
                      <img src={item} alt=""/>
                    </div>
                  })}
                </div>

              </div>
            </div>
          </div>
        </section>
        {/*系统功能*/}
        <section className="function_block">
          <div className="main">
            <h2>丰富的系统功能</h2>
            <p className="section_desc">多种直播包装功能，完美适配微信移动端，提供稳定流畅服务</p>
            <div className="block_content function_wrapper">
              {functionArr.map((item, index) => {
                return <div key={index} className="function_item">
                  <div className="function_info">
                    <div className="fun_icon" style={{backgroundImage: `url(${item.icon})`}}/>
                    <div className="fun_name">{item.name}</div>
                  </div>
                  <div className="fun_detail">
                    {item.desc.map((childItem, childIndex) => {
                      return <span key={`${index}-${childIndex}`}>{childItem}</span>
                    })}
                  </div>
                </div>
              })}
            </div>
          </div>
        </section>
        {/*平台优势*/}
        <section className="advantage_block">
          <div className="main">
            <h2>平台优势</h2>
            <p className="section_desc">既有传统媒体直播包装模板，还提供了当下流行的直播包装模板</p>
            <div className="block_content">
              <div className="scene_wrapper">
                {scenes.map((item, index) => {
                  return <div key={index}
                              className="scene_item"
                              style={{backgroundImage: `url(${item.img})`}}>
                    <div className="item_name">{item.name}</div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </section>
        {/*多媒体合作*/}
        <section className="function_block">
          <div className="main">
            <h2>多媒体合作</h2>
            <p className="section_desc">
              拓道直播，专业企业直播平台&直播包装平台，具有强大的功能配置与简单的操作设计，按直播的应用场景配置个性化功能，活跃直播间气氛，充分体现直播包装的效果，提升企业直播营销效率</p>
            <div className="block_content">
              <img className="partner_img" src={partnerImg} alt=""/>
            </div>
          </div>
        </section>
        {/*立即试用*/}
        <section className="join_block fullbg">
          <div className="main">
            <p className="free_tips">推广期间所有功能免费开放使用</p>
            <p>还在观望什么呢？ 快来立即试用吧～</p>
            <div className="btn_wrapper">
              <button className="btn_primary" onClick={this.startUse}>免费试用</button>
            </div>
          </div>
        </section>
        {/*服务咨询弹框*/}
        {showDialog? <div className="dialog_wrapper">
          <div className="dialog_inner">
            <div className="dialog_title">服务咨询</div>
            <div className="dialog_body">
              <p>在使用过程中，如果您对我们的产品有疑问或者意见，请联系我们</p>
              <div className="connect_item connect_phone"><i className="icon_phone" /><a href="tel:010-85235106">010-85235106</a></div>
              <div  className="connect_item connect_email"><i className="icon_email" /><a href="mailto:kefu@foundao.com">kefu@foundao.com</a></div>
            </div>
            <div className="dialog_footer">
              <button className="btn_primary" onClick={this.closeDialog}>确 认</button>
            </div>
          </div>
        </div>: ''}

      </div>
    );
  }
}