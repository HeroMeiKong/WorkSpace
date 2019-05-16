import React, {Component} from 'react';
// import {Route, Switch, Redirect, BrowserRouter} from 'react-router-dom'
import {Route, Switch, Redirect, HashRouter} from 'react-router-dom'
import './App.css';
import Index from './pages/index/index'
import Purchase from './pages/purchase/purchase'
import User from './pages/user/user'
// import VideoCutter from './pages/videoCutter/videoCutter'
// import WaterMark from './pages/waterMark/waterMark'
import AboutUs from './pages/about_us/about_us'
import UsersTermsAndConditions from './pages/users_terms_and_conditions/users_terms_and_conditions'
import WebsitePrivacyPolicy from './pages/website_privacy_policy/website_privacy_policy'

import NotFound from './pages/NotFound';
import Test from './pages/Test';
import Player from './pages/player/player'
import TakePhoto from './pages/takePhoto/takePhoto'

export default
class App extends Component {
  render() {
    return (
      <HashRouter>
          <Switch>
            <Route exact path='/' component={Index}/>
            <Route path='/purchase' component={Purchase}/>
            <Route path='/user' component={User}/>
            {/* <Route path='/videoCutter' component={VideoCutter}/>
            <Route path='/waterMark' component={WaterMark}/> */}
            <Route path='/about_us' component={AboutUs}/>
            <Route path='/users_terms_and_conditions' component={UsersTermsAndConditions}/>
            <Route path='/website_privacy_policy' component={WebsitePrivacyPolicy}/>
            <Route path='/test' component={Test}/>
            <Route path='/player' component={Player}/>
            <Route path='/takePhoto' component={TakePhoto}/>
            <Route exact path="/404" component={NotFound}/>
            <Redirect path="*" to="/404"/>
          </Switch>
      </HashRouter>
    );
  }
}
