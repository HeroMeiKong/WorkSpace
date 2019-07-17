import React, {Component} from 'react';
import {Button,Message} from 'element-react';

import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
export default
class OnlineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forbidType:'forbid'
    };
  }

  componentWillMount() { 
    
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){

  }

  componentWillUnmount() {

  }
  // 禁言
  handel_forbid = (data,h5_id,type) => {
    httpRequest({
      url:api.chatForbid,
      type:'POST',
      data:{
        h5_id:h5_id.packageID,
        uid:data.uid,
        type:type?'forbid':'offforbid'
      }
    }).done((resp) => {
      if(resp.code / 1 === 0){
        this.props.changStatus(data,type)
      }else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
  };

  
  // 提出聊天室
  // handel_kickOut = () => {

  // };
  render() {
    const {data,h5_id} = this.props;
    return (
      <div className="online_item">
        <div className="online_operate">
          {data.is_forbid === 0 ?<Button size='small' onClick={this.handel_forbid.bind(this,data,h5_id,1)}>禁言</Button>:
            <Button size='small' onClick={this.handel_forbid.bind(this,data,h5_id,0)} style={{color:'#F44B53',borderColor:'#F44B53'}}>取消禁言</Button>
          }
          
          {/* <Button size='small' onClick={this.handel_kickOut}>踢出</Button> */}
        </div>
        <div className="user_info">
          <div className="user_avatar" style={{backgroundImage: `url(${data.avatar})`}}/>
          <div className="user_name">{data.nick_name}</div>
        </div>
      </div>
    );
  }
}