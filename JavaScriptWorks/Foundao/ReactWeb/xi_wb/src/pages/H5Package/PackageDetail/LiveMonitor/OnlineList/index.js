import React, {Component} from 'react';
import {Message,Notification} from 'element-react'
import './index.scss';

import OnlineItem from './OnlineItem';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
// import tools from '@/utils/tool';
/*在线列表*/
export default
class OnlineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList:[], //在线列表数据
      wxCount:0 , // 微信在线总数
      allCount:0 , // 当前在线总数
      intervalTime: 10000,  // 人数列表轮询间隔 10s
    };
    this.timer = null; // 定时器
    this.ajax = null; //  ajax

  }

  componentWillMount() {
    this.getList();
    const {intervalTime} = this.state;
    this.timer = setInterval(this.getList, intervalTime);
  }

  componentWillReceiveProps(nextProps){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.ajax.abort(); // 取消ajax
    clearInterval(this.timer);
  }

  // 请求在线列表数据
  getList = () => {
    const {h5_id} = this.props;
    this.ajax = httpRequest({
      url:api.LiveMonitorOnlineList,
      type:'POST',
      data:{
        h5_id:h5_id.packageID
      }
    }).done((resp) => {
      if(resp.code / 1 === 0){
        this.setState({
          wxCount: resp.data.count,
          allCount: resp.data.allCount,
          userList:resp.data.list
        })
      }else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
  }

  changStatus = (data,type) => {
    const userList = [...this.state.userList]
    for(let i=0;i<userList.length;i++){
      var item = userList[i]
      if(data.id === item.id){
        item.is_forbid = type
        this.getList()
        break
      }
    }
    this.setState({
      userList
    })
  } 

  render() {
    const {userList,wxCount, allCount} = this.state
    
    return (
      <div className="online_wrapper">
        <div className="current_online">
          <div className="icon_person"/>
          当前在线总人数 <i> {allCount} </i> 人 登录人数 <i> {wxCount} </i> 人
        </div>
        <p style={{fontSize: '12px', color: '#ccc', padding: '10px 20px'}}>仅展示登录用户</p>
        <div className="online_list">
          {userList.map((item, index) => {
            return <OnlineItem key={index} data={item} h5_id={this.props.h5_id} changStatus={this.changStatus}/>
          })}

        </div>
      </div>
    );
  }
}