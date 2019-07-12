import React, {Component} from 'react';
import {Tabs, Popover, Dialog, Table, Button, MessageBox, Message, Notification, Form, Input} from 'element-react';
import './index.scss';
import OnlineList from './OnlineList';
import Interactive from './Interactive';
import classnames from 'classnames';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import Monitor from '@/components/Monitor';
import defaultCover from '@/assets/images/h5/defaultCover.png'
import tools from '@/utils/tool'

let g_ws = null;
/*直播监控*/
export default
class LiveMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      dialogVisible: false,
      dialogVisible_push: false,
      activeCameraIndex: 0, // 默认选中第一个镜头
      onlineListData: [], //
      typea: 0,
      form: {
        id: '',
        platform: '',
        push_url: ''
      },
      rules: {
        platform: {required: true, message: '名称不能为空', trigger: 'blur'},
        push_url: {required: true, message: '推流地址不能为空', trigger: 'blur'},
      },
      pushList: [], // 推流地址
      columns: [
        {
          label: "用户头像",
          prop: "avatar",
          width: 100,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "用户昵称",
          prop: "nick_name",
          // width: 100
        },
        {
          label: "禁言时间",
          prop: 'gmt_create'
        },

        {
          label: "操作",
          render: (row, style, index) => {
            return (
              <span>
                <Button size='small'
                        type='text'
                        onClick={this.handel_cancelForbid.bind(this, row, index)}
                        style={{color: 'red'}}>取消禁言</Button>
            </span>
            )
          }
        }
      ],
      columns_push: [
        {
          label: "平台",
          width: '100',
          prop: "push_name",
        },
        {
          label: "推流地址",
          prop: "push_url",
          // width: 100
        },
        {
          label: "状态",
          prop: "status",
          width: 80,
          render: (row) => {
            return row.push_status === 'start' ? '推流中' : '暂停'
          }
        },
        {
          label: "操作",
          render: (row) => {
            return (
              <span>
                {row.push_status === 'start' ? (
                  <Button size='small'
                          type='text'
                          onClick={this.handel_status.bind(this, row, 'stop')}
                          style={{color: 'red'}}>停止推流</Button>
                ) : (<Button size='small'
                             type='text'
                             onClick={this.handel_status.bind(this, row, 'start')}>开始推流</Button>)}

                <Button size='small'
                        type='text'
                        onClick={this.handel_status.bind(this, row, 'restart')}
                        style={{color: 'red'}}>重新推送</Button>
                <Button size='small'
                        type='text'
                        onClick={this.handel_edit_push.bind(this, row)}>编辑</Button>
            </span>
            )
          }
        }
      ],
      cameraList: [],
      // 禁言列表
      forbidData: []
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getPackageDetail();
    this.getPushList();
    this.initWebSocket();
    // this.getOnlineList(); //请求在线列表
  }

  componentWillUnmount() {

  }

  // 获取推流地址
  getPushList = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.pushList,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          pushList: resp.data || []
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
        const {live, slave_live = []} = resp.data;
        let cameraList = [{...live}].concat(slave_live);
        if (!live.title) {
          cameraList = [...slave_live];
        }

        this.setState({
          cameraList: cameraList
        }, () => {
          this.initSwiper();
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
  initSwiper = () => {
    new window.Swiper('.camera_list_swiper', {
      slidesPerView: 'auto',
      freeMode: true,
      spaceBetween: 10
    });
  };
  // 查看禁言名单
  handel_forbidList = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.chatForbidList,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          forbidData: resp.data.list
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
    this.setState({
      dialogVisible: true
    });
    // console.log('handel_forbidList');
  };
  // 下载在线名单
  handel_download_online = () => {
    const userInfo = tools.getUserData_storage();
    let h5_id = this.props.match.params
    window.open(api.downloadOnlineList + '?token=' + userInfo.token + '&h5_id=' + h5_id.packageID, '_self');
  };
  //tabs切换
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    })
  };
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  // 取消禁言
  handel_cancelForbid = (row) => {
    this.sure_again({
      content: `确认是否取消禁言用户 - ${row.nick_name}`,
      callback: () => {
        this.hand_offforbid(row)
      }
    })
  };
  // 二次确认
  sure_again = (options = {}) => {
    const {title = '提示', content = '', callback} = options;
    MessageBox.confirm(content, title, {
      type: 'warning'
    }).then(() => {
      if (callback) {
        callback();
      }
    }).catch(() => {
    });
  };

  // 取消禁言
  hand_offforbid = (row) => {
    httpRequest({
      url: api.chatForbid,
      type: 'post',
      data: {
        h5_id: row.h5_id,
        uid: row.uid,
        type: 'offforbid'
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.handel_forbidList()
        // this.setState({
        //   typea:10
        // })
        this.refs['onlineList'].getList();
      } else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
    this.setState({
      dialogVisible: true
    });
  }

  // 切换直播镜头
  handel_changeCamera = (index, item) => {
    const {activeCameraIndex} = this.state;
    if (activeCameraIndex !== index) {
      this.setState({
        activeCameraIndex: index
      })
    }
  };

  // 初始化webSocket
  initWebSocket = () => {
    this.openWebSocket();
  };

  openWebSocket = () => {
    const _this = this;
    try {
      if (g_ws) {
        g_ws.close();
        g_ws = null;
      }
      g_ws = new WebSocket(api.WSS);
      // g_ws.binaryType = "arraybuffer";
      g_ws.onmessage = function (evt) {
        _this.onMessage(evt);
      };
      g_ws.onopen = function (evt) {
        _this.onOpen(evt);
      };
      g_ws.onclose = function (evt) {
        _this.onClose(evt);
        // _this.reconnect();
      };
      g_ws.onerror = function (evt) {
        _this.onError(evt);
        _this.reconnect();
      };
    } catch (e) {
      _this.reconnect();
    }
  };
  onOpen = () => {
    console.log('onOpen');
    this.bindSocket();
    setInterval(this.heartbeat_check, 20000)
  };

  onMessage = (evt) => {
    // console.log(evt.data)
    if (typeof (evt.data) === 'string' || evt.data instanceof String) {
      //console.log("Received data string: " + evt.data);
      let obj = {};
      try {
        obj = JSON.parse(evt.data);
      } catch (e) {

      }
      if (obj["cmd"]) {
        const customEvent = new CustomEvent(obj.cmd, {detail: obj.data});
        // 触发它！
        window.dispatchEvent(customEvent);
        // 弹出异常错误
        if (obj['cmd'] === 'error') {
          Message.error(obj.msg || '未知错误');
        }
      }

    }
  };
  onClose = () => {
    console.log('onClose')
  };
  onError = () => {
    console.log('onError')
  };
  reconnect = () => {
    console.log('reconnect');
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(this.openWebSocket, 1500);
  };
  // 绑定直播间和用户
  bindSocket = () => {
    const userInfo = tools.getUserData_storage();
    const {packageID} = this.props.match.params;
    const token = userInfo.token;
    g_ws.send(`{"cmd":"bind","token":"${token}","lid":"${packageID}"}`)
  };
  // 心跳检测ws
  heartbeat_check = () => {
    if (g_ws) {
      g_ws.send('{"cmd":"ping"}');
    }
  };

  // 新增
  handel_add_push = () => {
    this.handleReset('ruleForm');
    const form = {
      id: '',
      platform: '',
      push_url: ''
    };
    this.setState({
      dialogVisible_push: true,
      form
    })
  };
  // 状态
  handel_status = (row, status) => {
    let statusText = '';
    if (status === 'start') {
      statusText = '开始推流';
    }else if (status === 'stop'){
      statusText = '暂停推流';
    }else if (status === 'restart'){
      statusText = '重新推流';
    }
    this.sure_again({
      content: `确定是否${statusText}`,
      callback: this.statusAjax.bind(this, row, status)
    })
  };
  statusAjax = (row, status) => {
    httpRequest({
      url: api.pushAction,
      type: 'post',
      data: {
        h5_id: row.h5_id,
        id: row.id,
        type: status
      }
    }).done(resp => {
      if (resp.code === '0') {
        Message.success(resp.msg);
        this.getPushList();
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
  // 编辑
  handel_edit_push = (row) => {
    this.handleReset('ruleForm');
    const form = {
      id: row.id,
      platform: row.push_name,
      push_url: row.push_url
    };
    this.setState({
      dialogVisible_push: true,
      form
    })
  };
  // onchange
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };
  // 验证表单是否填写完毕
  validate_form = (formName, success) => {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].validate((valid) => {
      if (valid) {
        if (typeof success === 'function') {
          success();
        }
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };
  // 重置表单
  handleReset(formName) {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].resetFields();
  }

  close_dialog_push = () => {
    this.setState({
      dialogVisible_push: false
    })
  };
  // 提交
  handel_submit_push = () => {
    // this.
    this.validate_form('ruleForm', () => {
      const {packageID} = this.props.match.params;
      const {form, cameraList, activeCameraIndex} = this.state;
      let activeCamera = {};
      if (cameraList.length > 0) {
        activeCamera = cameraList[activeCameraIndex];
      }
      // return false;
      httpRequest({
        url: api.pushEdit,
        type: 'post',
        data: {
          h5_id: packageID,
          live_id: activeCamera.id,
          pull_url: activeCamera.pull_url,
          push_url: form.push_url,
          push_name: form.platform,
          id: form.id,
        }
      }).done((resp) => {
        if (resp.code / 1 === 0) {
          this.setState({
            dialogVisible_push: false
          });
          Message.success('添加成功');
          this.getPushList();
        } else {
          Message.error(resp.msg);
        }
      }).fail(err => {
        Notification.error({
          title: '接口请求失败',
          message: '内部服务器错误' + err.status
        });
      })
    })
  };

  render() {
    const {
      activeTab, dialogVisible, activeCameraIndex, cameraList, onlineListData,
      dialogVisible_push,
      form
    } = this.state;
    let activeCamera = {};
    if (cameraList.length > 0) {
      activeCamera = cameraList[activeCameraIndex];
    }
    // console.log(activeCamera, 'activeCamera');
    return (
      <div className="live_monitor">

        {/*面板左侧*/}
        <div className="panel_left">
          <div className="panel_left_inner">
            {/*直播监控.*/}
            <div className="monitor_box" style={{backgroundImage: `url(${activeCamera.cover})`}}>
              <Monitor style={{height: '100%'}}
                       cover={activeCamera.cover}
                       liveType={activeCamera.sub_type || 'video'}
                       mediaUrl={activeCamera.pull_url}>
                <div className="monitor_box_title">{activeCamera.title ? `正在监看: ${activeCamera.title} ` : ''} </div>
              </Monitor>
            </div>
            {cameraList.length > 0 ? (
              <div className="camera_wrapper">
                <h4>切换到</h4>
                <div className="camera_list">
                  <div className="swiper-container camera_list_swiper">
                    <div className="swiper-wrapper">
                      {cameraList.map((item, index) => {
                        return <div key={index}
                                    style={{backgroundImage: `url(${item.cover || defaultCover})`}}
                                    onClick={this.handel_changeCamera.bind(this, index, item)}
                                    className={classnames('swiper-slide camera_item', {active: activeCameraIndex === index})}>
                          <p className="camera_name limit-line1">{item.title}</p>
                        </div>
                      })}
                    </div>
                  </div>


                </div>
              </div>
            ) : ''}
            <h4>推流到第三方平台</h4>
            <Button size='small' style={{float: 'right', margin: '0 0 10px'}} onClick={this.handel_add_push}>添加推流方</Button>
            <Table
              columns={this.state.columns_push}
              data={this.state.pushList}
              // border={true}
              stripe={true}
            />
            {/*直播情况*/}
            {/*<div className="status_wrapper">*/}
            {/*<h4 style={{fontWeight: 'bold'}}>直播情况</h4>*/}

            {/*<div className="status_box">*/}
            {/*<div className="noData"/>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>

        </div>
        {/*面板右侧*/}
        <div className="panel_right">
          <Tabs activeName={activeTab} onTabClick={ this.changeTabs}>
            <Tabs.Pane label="聊天互动" name="1">
              <Interactive h5_id={this.props.match.params}/>
            </Tabs.Pane>
            <Tabs.Pane label="在线列表" name="2">
              <OnlineList ref="onlineList"
                          h5_id={this.props.match.params}
                          data={onlineListData}/>
            </Tabs.Pane>
          </Tabs>
          {/*悬浮菜单*/}
          <Popover placement="bottom" title="" width="50" trigger="hover" content={(<div className="menu_hover">
            <div className="menu_hover_item" onClick={this.handel_forbidList}>已禁言名单</div>
            <div className="menu_hover_item" onClick={this.handel_download_online}>下载在线名单</div>
          </div>)}>
            <div className="panel_menu"/>
          </Popover>

        </div>


        <Dialog
          title='已禁言名单'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Table
              columns={this.state.columns}
              data={this.state.forbidData}
              // border={true}
              stripe={true}
            />
          </Dialog.Body>
        </Dialog>

        {/*推流*/}
        <Dialog
          title='推流到第三方'
          visible={ dialogVisible_push }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_push }
        >
          <Dialog.Body>
            <Form model={form}
                  labelWidth="120"
                  ref="ruleForm"
                  rules={this.state.rules}>
              <Form.Item label="平台名称: "
                         prop="platform">
                <Input value={form.platform} onChange={this._onChange.bind(this, 'platform', 'form')}/>
              </Form.Item>

              <Form.Item label="推流地址: "
                         prop="push_url">
                <Input value={form.push_url} onChange={this._onChange.bind(this, 'push_url', 'form')}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_push }>取 消</Button>
            <Button type="primary" onClick={ this.handel_submit_push}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}