import React, {Component} from 'react';

import {
    Switch,
    Route,
} from 'react-router-dom';
import './main.scss'
import {connect} from 'react-redux';
import loadable from '@/utils/loadable'
import TestPage from './TestPage/testPage'

import fault from "./404/404";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Loading from "../components/Loading/loading";
import MessageBoard from './MessageBoard/MessageBoard'

// import UserTerms from "./UserTerms/userTerms";
//
// import Home from "./Home/home";
// import Trans from "./Trans";
// import SingleCut from './SinglelCut/index'
// import Watermark from "./Watermark";
// import MuliSplicing from "./MuliSplicing/index";
// import RemoveWatermark from './RemoveWatermark';


// import Pay from "./Pay";
// import Privacy from "./Privacy/privacy";
// import WxPay from "./WxPay";
// import H5Package from "./H5Package";
// import H5Intro from "./H5Intro"; // h5包装介绍页
// import About from "./About";
// import Help from "./Help";

// import MuliPay from "./MuliPay/index";

// import SuccessPay from './SuccessPay/SuccessPay'
// import Problems from './Problems/problems'
// import Grab from './Grab/grab'
// import PopularArticles from './PopularArticles/PopularArticles'
// import ArticleDetails from './ArticleDetails/ArticleDetails'
// import PayPage from './PayPage/PayPage'

// import FAQ from './FAQ/FAQ'
// import AudioTran from './AudioTrans/index'


const Home = loadable(() => import('./Home/home'));
const Trans = loadable(() => import('./Trans'));
const SingleCut = loadable(() => import('./SinglelCut/index'));
const Watermark = loadable(() => import('./Watermark'));
const MuliSplicing = loadable(() => import('./MuliSplicing/index')); // 多段拼接
const RemoveWatermark = loadable(() => import('./RemoveWatermark'));

const Pay = loadable(() => import('./Pay'));
const WxPay = loadable(() => import('./WxPay'));
const Privacy = loadable(() => import('./Privacy/privacy'));
const UserTerms = loadable(() => import('./UserTerms/userTerms'));

const H5Intro = loadable(() => import('./H5Intro'));
const H5Package = loadable(() => import('./H5Package'));
const About = loadable(() => import('./About'));
const Help = loadable(() => import('./Help'));


const MuliPay = loadable(() => import('./MuliPay/index'));
const SuccessPay = loadable(() => import('./SuccessPay/SuccessPay'));
const Problems = loadable(() => import('./Problems/problems'));
// const Grab = loadable(() => import('./Grab/grab'));
const PopularArticles = loadable(() => import('./PopularArticles/PopularArticles'));
const ArticleDetails = loadable(() => import('./ArticleDetails/ArticleDetails'));
const PayPage = loadable(() => import('./PayPage/PayPage'));

const FAQ = loadable(() => import('./FAQ/FAQ'));
const AudioTran = loadable(()=>import('./AudioTrans/index'))

@connect(
    state => ({admin: state.admin}),
    {}
)


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        // console.log(this.props.history)
    }

    render() {
        // const {loading} = this.props.admin;
      // let href = window.location.href;
      // let indexPage = '';//修改首页页面重定向界面
      // if (href.indexOf('convert.enjoycut.com')!==-1){
      //   indexPage = Trans;
      // } else if (href.indexOf('trim.enjoycut.com')!==-1){
      //   indexPage = SingleCut;
      // }  else if (href.indexOf('merge.enjoycut.com')!==-1){
      //   indexPage = MuliSplicing;
      // } else if (href.indexOf('watermark.enjoycut.com')!==-1){
      //   indexPage = Watermark;
      // } else if (href.indexOf('remove.enjoycut.com')!==-1){
      //   indexPage = RemoveWatermark;
      // }else if (href.indexOf('download.enjoycut.com')!==-1){
      //   // indexPage = Grab;
      //   indexPage = fault;
      // }else{
      //   indexPage = Home;
      // }
      return (
        <div className='main'>
          {
            this.props.admin.loading > 0 ? (
                <Loading/>
            ) : ("")
          }
          <Header/>
          <div className="Message_box_bg" id="Message_box_bg">
            <div className="Message_box" id="Message_box"/>
          </div>
          <div className="app_content">
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/home" component={Home} />
              <Route path="/convert" component={Trans} />
              <Route path="/watermark" component={Watermark} />
              <Route path="/trim" component={SingleCut} />
              <Route path="/merge" component={MuliSplicing} />
              <Route path="/muliPay/:type" component={MuliPay} />
              <Route path="/pay" component={Pay} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/help/:id?" component={Help} />
              <Route path="/userTerms" component={UserTerms} />
              <Route path="/about" component={About} />
              <Route path="/h5Package" component={H5Package} />
              <Route path="/h5Intro" component={H5Intro} />
              <Route path="/wxPay/:id?" component={WxPay} />
              <Route path="/testPage" component={TestPage} />
              <Route path="/successPay/:id?" component={SuccessPay} />
              <Route path="/problems/:id?" component={Problems} />
              {/*<Route path="/download" component={Grab} />*/}
              <Route path="/download" component={fault} />
              <Route path="/404" component={fault} />
              <Route path="/popularArticles" component={PopularArticles} />
              <Route path="/articleDetails/:id?" component={ArticleDetails} />
              <Route path="/payPage/:type?" component={PayPage} />
              <Route path="/remove" component={RemoveWatermark} />
              <Route path="/audioTran" component={AudioTran}/>
              <Route path="/messageBoard/:page?" component={MessageBoard} />
              <Route path="/messageBoard/masterNote" component={MessageBoard} />
              <Route path="/FAQ" component={FAQ} />
              <Route component={fault}/>
            </Switch>
            </div>
            <Footer/>
        </div>
        );
    }
}

export default Main;
