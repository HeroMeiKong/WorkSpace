import React, {Component} from 'react';
import {
  Switch,
  Route,
  HashRouter,
} from 'react-router-dom';
import $ from 'jquery'
import './App.scss';
import Main from "./components/main";
import tools from "./tool.js";
import api from "./API/api";
class App extends Component {

  componentWillMount() {
    window.isSub = function (resp) {
      sessionStorage.setItem('isSubed',resp.data.isSubed||0);
    }
  }

  componentDidMount() {
    if (tools.is_shici()){
      let userti;
      userti = setInterval(function () {
        // console.log(localStorage.getItem('user_info'),'user_info');
        if (localStorage.getItem('user_info')) {
          clearInterval(userti);
          let user_info = JSON.parse(window.localStorage.getItem('user_info'));
          if (user_info.userId.length<1){
            return false
          }
          $.ajax({
            type:'GET',
            dataType: "jsonp",
            url:api.pageHeader +'isSub',
            data:{
              uid:user_info.userId,
            },
          })
        }

      },1000)


    }
  }

  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route path="/" render={()=>{return <Main/>}}></Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
