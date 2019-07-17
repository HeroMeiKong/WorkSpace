import React, {Component} from 'react';
import './index.scss';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import PackageMenu from './PackageMenu';
import menus from './menu';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import {Message, Notification, Popover} from 'element-react';
import {getH5_url} from '@/config'


export default
class PackageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_menu: {}, // 一级路由
      second_menu: {}, // 二级路由
      packageDetail: {}, // 包装详情
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getCurrentMenu();
    this.getPackageDetail();
  }

  componentWillReceiveProps(nextProps) {
    this.getCurrentMenu()
  }

  componentWillUnmount() {

  }

  // 获取包装详情
  getPackageDetail = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.packageDetail,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          packageDetail: resp.data.package || {}
        }, () => {
          this.setQrcode()
        })
      } else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
  };
  getCurrentMenu = () => {
    const currentPath = this.props.history.location.pathname;
    const pathArr = currentPath.split('/');
    const path = pathArr[3];
    let pathSecend = path + '/'; // 二级路由
    if (pathArr[4]) {
      pathSecend = path + '/' + pathArr[4].split('?')[0]
    }
    let current_menu = menus[0].children[0];
    let second_menu = {};
    for (let i = 0; i < menus.length; i++) {
      const menuItem = menus[i];
      let find = false;
      if (menuItem.children) {
        const menusChildren = menuItem.children;
        for (let j = 0; j < menusChildren.length; j++) {
          const childrenItem = menusChildren[j];
          if (childrenItem.path === path) {
            find = true;
            current_menu = menuItem.children[j];
            break;
          }
          if (pathSecend === childrenItem.path) {
            second_menu = menuItem.children[j];
          }
        }
      } else {
        if (menuItem.path === path) {
          find = true;
          current_menu = menuItem;
          break;
        }
      }
      if (find) {
        break;
      }
    }
    this.setState({
      current_menu,
      second_menu
    })
  };

  // 筛选路由
  getRouter = () => {
    const arr = [];
    menus.forEach((item) => {
      if (item.children) {
        item.children.forEach((childItem) => {
          arr.push(childItem)
        })
      } else {
        arr.push(item)
      }
    });
    return arr;
  };
  setQrcode = () => {
    const {packageDetail} = this.state;
    const url = getH5_url(packageDetail.id);
    if (document.getElementById('qrcode_phone').childElementCount < 1) {
      new window.QRCode(document.getElementById('qrcode_phone'), {
        text: url,
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  };

  render() {
    const {current_menu, packageDetail = {}, second_menu} = this.state;
    const routerArr = this.getRouter();
    const liveUrl = getH5_url(packageDetail.id);
    return (
      <div className="package_detail">
        <PackageMenu packageDetail={packageDetail}/>
        <div className="package_content">
          <div className="content_header">
            <div style={{float: 'right'}}>
              观看链接： <a href={liveUrl}
                       className="limit-line1"
                       style={{maxWidth: '400px'}}
                       target="_blank">{liveUrl}</a>


              <Popover placement="bottom"
                       title=""
                       width="100"
                       trigger="hover"
                       content={(<div className="address_code" id='qrcode_phone'/>
                       )}>
                <div className="mobile_tips"><i className="icon_mobile"/>移动端观看</div>
              </Popover>
            </div>
            <h2>{current_menu.name} {second_menu.name ? '/' : ''} {second_menu.name ?
              <span>{second_menu.name}</span> : ''}</h2>
          </div>
          {/*所有的路由*/}
          <div className="package_content_inner">
            <Switch>
              {routerArr.map((item, index) => {
                return <Route key={index}
                              exact={true}
                              path={`/h5Package/:packageID/${item.path}`}
                              component={item.component}
                              // component={loadable(() => item.component)}
                />
              })}

              {/*<Route path="/h5Package/:liveID/liveDetail" component={LiveDetail}/>*/}
              {/*<Route path="/h5Package/:liveID/liveCamera" component={LiveCamera}/>*/}
              {/*<Route path="/h5Package/:liveID/liveMonitor" component={LiveMonitor}/>*/}
              {/*<Route path="/h5Package/:liveID/imgLive" component={ImgLive}/>*/}
              {/*<Route path="/h5Package/:liveID" redirect component={LiveDetail}/>*/}
              <Redirect path="/h5Package/:packageID" to="/h5Package/:packageID/liveDetail"/>
            </Switch>
          </div>
        </div>

      </div>
    );
  }
}