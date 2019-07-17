import React, {Component} from 'react';
import {
  Switch,
  Route,
  // Redirect,
  // HashRouter,
  BrowserRouter,
} from 'react-router-dom';
import './style/common.css'
import './style/base.scss';
import './App.scss';
import loadable from '@/utils/loadable'
import {connect} from 'react-redux';
import {login, logout} from './redux/models/admin';
import 'element-theme-default';
// import User from './pages/User/user';
// import Return from './pages/Retrun/return';
import Main from "./pages/main";
// import fault from "./pages/404/404";
import tool from "@/utils/tool";
import $ from "jquery";
import intl from 'react-intl-universal';
import locales from './locales/index';

// import {_environment} from '@/API/baseConfig.js'
const User = loadable(() => import('./pages/User/user'));
const Return = loadable(() => import('./pages/Retrun/return'));
// const Main = loadable(() => import('./pages/main'));
const fault = loadable(() => import('./pages/404/404'));

@connect(
  state => ({admin: state.admin}),
  {login, logout}
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false
    }
  }

  componentWillMount() {
    this.checkPlatform();
    this.initLang()
    this.loadLocales();
    this.initUser()
    this.initGoogleAd();
  }

  componentDidMount() {
    // document.querySelector('#root').style.display = 'block';
    // this.initEzoicAd();
    this.add_googletagmanager();
  };

  // 检查平台
  checkPlatform = () => {
    if (!tool.isPc()) {
      if (!sessionStorage.getItem('continueSee')) {
        let lang = 'zh';
        if (tool.isForeign()) {
          lang = 'en'
        }
        window.location.href = '/mobile.html?lang=' + lang + '&back=' + encodeURIComponent(window.location.href);
      }
    }
  };
  // // ezoic 广告
  // initEzoicAd = () => {
  //   // 添加 ezoic 广告
  //   if (window.location.hostname === 'enjoycut.com' || window.location.hostname === 'www.enjoycut.com' ) {
  //     setTimeout(() => {
  //       $('body').append(`<script type="text/javascript" src="//go.ezoic.net/ezoic/ezoic.js"></script>`)
  //     }, 0);
  //   }
  // };
  // 添加谷歌搜索
  add_googletagmanager = () => {
    if (window.location.hostname.indexOf('enjoycut.com')!==-1) {
      $('body').append(`<script async src="https://www.googletagmanager.com/gtag/js?id=UA-142861821-1"></script>`)
      $('body').append(`<script>window.dataLayer = window.dataLayer || [];window.gtag=function(){dataLayer.push(arguments);};gtag('js', new Date());gtag('config', 'UA-142861821-1');</script>`)
    }

  };

  initGoogleAd() {
    if (this.props.admin.isForeign) {
      $('head').append('<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\n' +
        '<script>\n' +
        '  (adsbygoogle = window.adsbygoogle || []).push({\n' +
        '    google_ad_client: "ca-pub-5530199460323567",\n' +
        '    enable_page_level_ads: true\n' +
        '  });\n' +
        '</script>')
    }
  }

  loadLocales() {
    intl.init({
      currentLocale: this.props.admin.language,
      locales,
    }).then(() => {
      // window.intl_demo = {
      //     get: (text) => text
      // }
      window.intl = intl;
      this.setState({initDone: true});
    });


  }

  initLang() {
    if (document.domain.indexOf('enjoycut.com') >= 0 || document.domain.indexOf('enjoycut-en') >= 0) {
      $('html').attr('lang', 'en')
    }
  }

  //唯一一个从sessionStorage读用户数据的地方
  initUser() {
    //区分国外国内版
    const {isForeign} = this.props.admin;
    const userInfo = tool.getUserData_storage();
    // console.log(userInfo,'123')
    if (userInfo.token) {
      this.props.login(userInfo)
    }
  }


  render() {
    let Router = BrowserRouter
    // if(_environment === 'online'){
    //   Router = BrowserRouter
    // }
    return (
      this.state.initDone ? (
        <Router>
          <Switch>
            <Route path="/user" component={User}/>
            <Route path="/return" component={Return}/>
            <Route path="/" component={Main}/>
            <Route path="/404" component={fault}/>
          </Switch>
        </Router>) : ('')

    );
  }
}


export default App;
