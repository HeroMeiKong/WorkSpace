import React, {Component} from 'react';
import {
  withRouter,
  NavLink
} from 'react-router-dom'

import {Select, Menu} from 'element-react';
import './index.scss';
import menus from '../menu'
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tool'

@withRouter
export default
class PackageMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],

      defaultOpeneds: ['0'],
      current_channel: '002'
    };
  }

  componentWillMount() {
    this.getList();
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    // this.getCurrentMenu()
  }

  componentWillUnmount() {

  }

  getList = () => {
    httpRequest({
      url: api.packageList,
      type: 'post',
      data: {
        page: 1,
        limit: 50
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          options: resp.list || []
        })
      } else {
      }
    }).fail(jqXHR => {
      // Notification.error({
      //   title: '接口请求失败',
      //   message: '内部服务器错误 ' + jqXHR.status
      // });
    });
  };
  // 频道选择
  channelChange = (newValue) => {
    const {packageID} = this.props.match.params;
    if (packageID !== newValue) {
      const currentPath = this.props.history.location.pathname;
      const pathArr = currentPath.split('/');
      pathArr[2] = newValue;
      const newPath = pathArr.join('/');
      window.location.href = newPath;
    }
  };

  onOpen() {

    // console.log('onOpen')
  }

  onSelect(index, indexPath) {
    const {defaultOpeneds} = this.state;
    const selectIndex = indexPath[0];
    if (defaultOpeneds.indexOf(selectIndex) === -1) {
      defaultOpeneds.push(selectIndex);
      this.setState({
        defaultOpeneds
      })
    }

  }

  onClose(index) {
    const {defaultOpeneds} = this.state;
    for (let i = 0; i < defaultOpeneds.length; i++) {
      const item = defaultOpeneds[i];
      if (item === index) {
        defaultOpeneds.splice(i, 1);
        break;
      }
    }
    this.setState({
      defaultOpeneds
    })
  }

  // 跳转路由
  menuClick = (path) => {
    const currentPath = this.props.history.location.pathname;
    const pathArr = currentPath.split('/');
    pathArr[3] = path;
    const newPath = pathArr.join('/');
    this.props.history.push(newPath)
  };
  getUrl = (path) => {
    const currentPath = this.props.history.location.pathname;
    const pathArr = currentPath.split('/');
    pathArr[3] = path;
    const pathArrNew = pathArr.slice(0, 4);
    const newPath = pathArrNew.join('/');
    return newPath;
  };
  backPackage = () => {
    // this.props.history.push('/h5Package');

    // const currentPath = this.props.history.location.pathname;
    // console.log(this.props.history.location.pathname);
    // const pathArr = currentPath.split('/');
    // const newPathArr = pathArr.slice(0,);
    // const newPath = pathArr.join('/');
    window.location.href = '/h5Package';
  };
  getFilterMenu = () => {
    const {packageDetail = {}} = this.props;
    const {scene = ''} = packageDetail;
    let filterMenu = [];
    const menuClone = tools.deepClone(menus);
    for (let i = 0; i < menuClone.length; i++) {
      const menuItem = menuClone[i];
      if (menuItem.template.indexOf(scene) !== -1) { // 存在

        if (menuItem.children) {
          const filterChildren = menuItem.children.filter(item => {
              return item.template.indexOf(scene) !== -1
            }) || [];
          menuItem.children = filterChildren;
        }
        filterMenu.push(menuItem)
      }
    }
    return filterMenu;
  };

  render() {
    const {options, defaultOpeneds} = this.state;

    const {packageID} = this.props.match.params;
    const filterMenu = this.getFilterMenu()
    return (
      <div className="package_menu">
        <div className="package_menu_inner">
          {/*当前频道*/}
          <div className="current_menu">
            <Select value={packageID} onChange={this.channelChange} placeholder="请选择">
              {
                options.map(el => {
                  return <Select.Option key={el.id}
                                        label={el.title.length > 10 ? ( el.title.substr(0, 6) + '...' + el.title.substr(-4, 4)) : el.title}
                                        value={el.id}/>
                })
              }
            </Select>
          </div>
          {/*所有的菜单*/}

          <Menu defaultActive="0"
                defaultOpeneds={defaultOpeneds}
                className="menu-vertical"
                onOpen={this.onOpen.bind(this)}
                onSelect={this.onSelect.bind(this)}
                uniqueOpened={false}
                onClose={this.onClose.bind(this)}>
            {filterMenu.map((item, index) => {
              return item.children ? (
                <Menu.SubMenu index={`${index}`}
                              key={index}
                              title={<span><i className="el-icon-menu"/>{item.name}</span>}>
                  {item.children.map((childItem, childIndex) => {
                    return childItem.hide ? '' : (<Menu.Item index={`${index}-${childIndex}`}
                                                             key={`${index}-${childIndex}`}>
                      {/*<span onClick={this.menuClick.bind(this, childItem.path)}>{childItem.name}</span>*/}
                      {/*{childItem.name}*/}
                      <NavLink to={this.getUrl(childItem.path)}
                               data-title={this.getUrl(childItem.path)}
                               activeClassName="active">{childItem.name}</NavLink>
                    </Menu.Item>)
                  })}

                </Menu.SubMenu>
              ) : <Menu.Item index={`${index}`}
                             key={index}>
                <NavLink to={this.getUrl(item.path)}
                         className='first_link'
                         data-title={this.getUrl(item.path)}
                         activeClassName="active"><i className="el-icon-menu"/>{item.name}</NavLink>
              </Menu.Item>
            })}
            {/*<Menu.SubMenu index="1" title={<span><i className="el-icon-message"/>直播间管理</span>}>*/}
            {/*<Menu.Item index="1-1">直播详情</Menu.Item>*/}
            {/*<Menu.Item index="1-2">直播镜头</Menu.Item>*/}
            {/*<Menu.Item index="1-3">直播监控</Menu.Item>*/}
            {/*<Menu.Item index="1-4">图文直播</Menu.Item>*/}
            {/*<Menu.Item index="1-5">评论审核</Menu.Item>*/}
          </Menu>
        </div>
        <div className="menu_back" onClick={this.backPackage}>
          <div className="back_icon"/>
          H5包装列表
        </div>
      </div>
    );
  }
}