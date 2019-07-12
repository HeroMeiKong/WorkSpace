import React, {Component} from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import './index.scss';
import {connect} from 'react-redux';
import {login, logout} from '@/redux/models/admin';
import PackageList from './PackageList';
import PackageDetail from './PackageDetail';
import {Loading} from 'element-react';
import tool from '@/utils/tool';

@connect(
  state => ({admin: state.admin}),
  {login, logout}
)

export default class H5Package extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.checkLogin();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // 检查用户是否登录
  checkLogin = () => {
    const userInfo = tool.getUserData_storage();
    if (!userInfo.token) { // 未登录跳转到登录页面
      const current_url = encodeURIComponent(window.location.href);
      this.props.history.push(`/user/login?callback=${current_url}`);
    }
  };

  render() {
    const copyStyle = {
      position: 'absolute',
      top: '-1000px',
      zIndex: '-10'
    };
    return (
      <div className="h5_package_wrapper">
        {/*拷贝输入框*/}
        <input style={copyStyle} type="text" id="copy-input"/>
        <PackageList/>
        <Switch>
          <Route path="/h5Package/:packageID" component={PackageDetail}/>
        </Switch>
          {/*全局loading*/}
          <div className="content_loading">
            <Loading loading={true} text="拼命加载中"/>
          </div>
      </div>
    );
  }
}