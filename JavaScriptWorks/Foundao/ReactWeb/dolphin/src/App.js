import React, {Component} from 'react';
import {Route, Switch, Redirect, HashRouter} from 'react-router-dom'
import './App.css';
import Index from './pages/index/index'
// import Pay from './pages/pay/pay'
import Purchase from './pages/purchase/purchase'
import Sign from './pages/sign/sign'
import User from './pages/user/user'
import VideoCutter from './pages/videoCutter/videoCutter'
import WaterMark from './pages/waterMark/waterMark'

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
            {/* <Route path='/pay' component={Pay}/> */}
            <Route path='/purchase' component={Purchase}/>
            <Route path='/sign' component={Sign}/>
            <Route path='/user' component={User}/>
            <Route path='/videoCutter' component={VideoCutter}/>
            <Route path='/waterMark' component={WaterMark}/>
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
