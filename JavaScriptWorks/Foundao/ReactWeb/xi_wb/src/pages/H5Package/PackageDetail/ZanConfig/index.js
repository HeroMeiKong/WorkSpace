import React, {Component} from 'react';
import {Message, Notification,Button} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
// import Upload from '@/components/Ks3Upload';
import classnames from 'classnames';
import './index.scss'
const $  = window.jQuery;
/*视频库管理*/
export default
class ZanConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '', // 直播id
      activeId: '',
      data: []
    }
    this.intervalTimerArr = [];
    this.timeoutTimer = null;
  }

  componentWillMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID: packageID || ''
    }, () => {
      this.getList();
    });
  };

  componentWillUnmount() {


    // velocity
    clearTimeout(this.timeoutTimer)
    clearInterval(this.intervalTimer);
    for(let i = 0; i<this.intervalTimerArr.length;i++){
      clearTimeout(this.intervalTimerArr[i])
    }
  }
  componentDidMount() {
    if (!document.querySelector('#velocityJS')) {
      window.$('head').append(`<script id="velocityJS" src="/plug/velocity.js"></script>`)
    }
    this.intervalTimer = setInterval(this.start_zanAnimate, 3000);
  }

  getList = () => {
    httpRequest({
      url: api.zanIconList,
      type: 'post',
      data: {
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        const now_icon = resp.data.now_icon || {};
        let activeId = '';
        if (resp.data.icon_list.length > 0) {
          activeId = resp.data.icon_list[0].id
        }
        this.setState({
          data: resp.data.icon_list || [],
          activeId: now_icon.id || activeId,

        })
      } else {
        Message.error(resp.msg);
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };

  // 重置表单
  handleReset(formName) {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].resetFields();
  }

  // 修改zan的样式
  handel_change_zan = (item) => {
    this.setState({
      activeId: item.id
    })
  };
  // 确认提交
  handel_submit = () => {
    const {activeId, packageID, data} = this.state;
    if (!activeId) {
      Message.warning('请先选择一个点赞样式');
      return false;
    }
    const currentItem = data.find(item => activeId === item.id);
    httpRequest({
      url: api.setZanIcon,
      type: 'post',
      data:{
        h5_id: packageID,
        zan_icon: JSON.stringify(currentItem),
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success('设置成功');
      } else {
        Message.error(resp.msg);
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  start_zanAnimate = (times = 5) => {
    for (let i = 0; i < times; i++) {
      this.intervalTimerArr[i] = setTimeout(this.zanAnimate, 100 * i)
    }
  };
  // 点赞动画
  zanAnimate = () => {
    const {data, activeId} = this.state;
    const zanBox = $('.create_box');
    const _id = 'img_' + new Date().getTime();

    const _left_arr = ['-30px', '-20px', '-10px', '0px', '10px', '20px', '30px'];
    const currentItem = data.find(item => activeId === item.id) || {};
    // const _zan_arr = ['zan.png', 'zan1.png', 'zan2.png'];
    const _zan_arr = currentItem.icons || [];

    const random0 = Math.floor(Math.random() * _left_arr.length);
    const _left = _left_arr[random0];

    const random1 = Math.floor(Math.random() * _zan_arr.length);
    const _zan_img = _zan_arr[random1];
    zanBox.append('<img id="' + _id + '" class="zanfly" src=' + _zan_img + ' />');
    // TODO:此处必须先移除才能执行动画效果，但是dom却没有真正的被移除 bug？？？
    // $('#' + _id).remove();
    $('#' + _id).velocity(
      {
        bottom: "200px",
        opacity: "0",
        // rotateZ: 360 * 2,
        scale: 1.3,
        left: _left
      }, {
        complete: function (elements) {
          // console.log('complete');
          $(elements).remove();
          // $('#' + _id).remove();
        },
        duration: 2000
      }
    );
  };
  render() {
    const {data, activeId} = this.state;
    return (
      <div className="zan_icon_page">
        <h4>点赞样式</h4>
        <div className="zan_icon_list clearfix">
          {data.map((item, index) => {
            return <div key={index}
                        onClick={this.handel_change_zan.bind(this, item)}
                        className={classnames('zan_icon_item', {active: activeId === item.id})}>
              <div className="zan_icon_img">
                <div className="img_box">
                  <img src={item.icons? item.icons[0] : ''} alt=""/>
                </div>
              </div>
              <div className="zsn_icon_name">{item.title}</div>
            </div>
          })}
        </div>
        <h4>效果预览</h4>

        <div className="zan_preview">
          <div className="create_box" />
        </div>
        <Button type='primary' size='small' onClick={this.handel_submit}>确认</Button>
      </div>
    );
  }
}