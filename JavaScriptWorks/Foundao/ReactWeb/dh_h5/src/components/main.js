import React, {Component} from 'react';

import {
  Switch,
  Redirect,
  Route,
  BrowserRouter,
  HashRouter,
} from 'react-router-dom';
/*import FirstPage from './test/page/firstpage/firstpage';
import SecondPage from './test/page/secondPage/secondPage';
import weichat from './test/page/weichatshare/weichatshare';*/

import Recommend from './Recommend/index';
import LookPoetry from './LookPoetry/index';
import LookPoetry2 from './LookPoetry2/index';
import TalkingPoetry from './TalkingPoetry/index';
import PopularityList from './PopularityList/index';
import Answer from "./Answer";
import PageHeader from "./pageHeader";
class App extends Component {
  render() {
    return (
      <div className='main'>
        <Answer/>
        <PageHeader/>
          <Switch>
            <Route path="/recommend/:name" component={Recommend} exact></Route>
            <Route path="/recommend" component={Recommend} exact></Route>
            <Route path="/lookPoetry/:name" component={LookPoetry} exact></Route>
            <Route path="/lookPoetry" component={LookPoetry} exact></Route>
            <Route path="/lookPoetry2/:name" component={LookPoetry2} exact></Route>
            <Route path="/lookPoetry2" component={LookPoetry2} exact></Route>
            <Route path="/talkingPoetry/:name" component={TalkingPoetry} exact></Route>
            <Route path="/talkingPoetry" component={TalkingPoetry} exact></Route>
            <Route path="/PopularityList/:name" component={PopularityList} exact></Route>
            <Route path="/PopularityList" component={PopularityList} exact></Route>
            <Route path="/" component={Recommend}></Route>
          </Switch>
      </div>
    );
  }
}

export default App;
