import React, {Component} from 'react';
import {Route, Switch, Redirect, HashRouter} from 'react-router-dom'
import './App.css';
import Index from './pages/index/index'
import Pay from './pages/pay/pay'
import Purchase from './pages/purchase/purchase'
import Sign from './pages/sign/sign'
import User from './pages/user/user'

import NotFound from './pages/NotFound';
import Test from './pages/Test';

export default
class App extends Component {
  render() {
    return (
      <HashRouter>
          <Switch>
            <Route exact path='/' component={Index}/>
            <Route path='/pay' component={Pay}/>
            <Route path='/purchase' component={Purchase}/>
            <Route path='/sign' component={Sign}/>
            <Route path='/user' component={User}/>
            <Route path='/test' component={Test}/>
            <Route exact path="/404" component={NotFound}/>
            <Redirect path="*" to="/404"/>
          </Switch>
      </HashRouter>
    );
  }
}
