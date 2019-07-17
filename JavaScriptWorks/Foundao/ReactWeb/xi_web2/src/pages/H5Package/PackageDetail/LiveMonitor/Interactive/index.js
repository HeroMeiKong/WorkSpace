import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Popover, Button, Form, Input, DatePicker, Select, Message, Notification, Checkbox} from 'element-react';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tool';
import moment from 'moment';
import classnames from 'classnames';
import './index.scss';
import TalkItem from './TalkItem';
const prizeTicketList = [
  {name: '手机', value: 'mobile'},
  {name: '姓名', value: 'name'},
  {name: '收货地址', value: 'address'},
];
/*互动聊天*/
@withRouter
export default
class Interactive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '',
      dialogVisible_infoEdit: false, // 信息编辑弹框
      form_edit: {
        text: ''
      },
      confimBtnType: true, //输入框下方确定按钮是否禁用
      form: {
        gift: '',
        questionLib: '',
        need_info: ['name', 'mobile', 'address'],
        gift_total: '',
        gmt_end: null,
      },
      userForm: {
        nick_name: '我是管理员',
        avatar: 'https://github.githubassets.com/images/modules/site/integrators/atom.png',
        id: '',
      },
      infoEditForm: {
        title: '',  //视频名称
        cover: '',  //视频封面链接
      },
      // 题库列表
      qList: [],
      // 投票列表
      voteList: [],
      talk_listData: [],// 聊天互动列表数据
      viewMore: true, //查看更多历史消息
      last_id: '', //查看历史消息的最后一个id
      userOptions: [], // 所有人员的下拉菜单
      rules: {
        gift: {required: true, message: '奖品不能为空', trigger: 'blur'},
        gift_total: {required: true, message: '数量不能为空', trigger: 'change'},
        questionLib: {required: true, message: '问题库不能为空', trigger: 'change'},
        gmt_end: {type: 'date', required: true, message: '问题库不能为空', trigger: 'change'},
      },
    };
  }

  componentWillMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID: packageID,
    }, () => {
      this.getChatHistory();   // 聊天历史记录列表
      this.getAllUser();       // 编辑列表
      this.getQList();         // 题库列表
      this.getVoteList();      // 投票列表
    })
  }


  componentDidMount() {
    this.initEvent();
  }

  componentWillUnmount() {
    tools.hide_loading()
  }

  initEvent = () => {
    const _this = this;
    window.addEventListener('chat-publish', function (e) {
      _this.add_newComment(e.detail)
    })
    // 进入直播间
    window.addEventListener('chat-join', function (e) {
      _this.addNewJoin(e.detail);
    });
    // 礼物
    window.addEventListener('chat-gift', function (e) {
      _this.addGiftMessage(e.detail);
    });
  };
  addNewJoin = (data) => {
    const {talk_listData} = this.state;
    talk_listData.push({
      content: data.content,
      type: 'system'
    });
    this.setState({
      talk_listData
    }, () => {
      this.scrollToBottom();
    })
  };
  addGiftMessage = (data) => {
    const {talk_listData} = this.state;
    if (data.gift_type === 'gift') {
      talk_listData.push({
        content: `${data.nick_name}送给了主播一个 ${data.gift_title}`,
        img: data.gift_icon,
        type: 'system'
      });
    } else if (data.gift_type === 'money') {
      talk_listData.push({
        content: `${data.nick_name}送给了主播一个价值 ${data.gift_price} 元的红包`,
        type: 'system',
        img: data.gift_icon,
      });
    }

    this.setState({
      talk_listData
    }, () => {
      this.scrollToBottom();
    })
  };
  add_newComment = (data) => {
    const {talk_listData} = this.state
    talk_listData.push({
      avatar: data.avatar,
      nick_name: data.nick_name,
      gmt_create: data.gmt_create,
      content: data.content,
      id: data.id
    });
    this.setState({
      talk_listData,
    }, () => {
      this.scrollToBottom();
    })
  };
  // 滑动到底部
  scrollToBottom = () => {
    const inner_listHeight = this.refs.inner_list.clientHeight;
    this.refs.talk_list.scrollTo(0, inner_listHeight)
  };
  // 题库列表
  getQList = () => {
    httpRequest({
      url: api.questionSelect,
      type: 'post',
      data: {}
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          qList: resp.data || [],
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

  // 人员列表
  getAllUser = () => {
    const {h5_id} = this.props;
    httpRequest({
      url: api.allUser,
      type: 'post',
      data: {
        h5_id: h5_id.packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          userForm: resp.data[0],
          userOptions: resp.data
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
  }

  // 聊天历史记录列表
  getChatHistory = () => {
    const {h5_id} = this.props;
    const {last_id} = this.state;
    httpRequest({
      url: api.chatHistory,
      type: 'post',
      data: {
        last_id: last_id,
        h5_id: h5_id.packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        if (resp.data && resp.data.list && resp.data.list.length > 0) { // 有历史记录
          let last_id = resp.data.list[resp.data.list.length - 1].id;
          const {talk_listData} = this.state;
          const newData = resp.data.list.reverse();
          const allList = newData.concat(talk_listData);
          this.setState({
            last_id: last_id,
            talk_listData: allList
          }, () => {
            this.scrollToBottom();
          })
        } else {
          this.setState({
            viewMore: false,
          })
        }
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
  // 详情弹框编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
    if (key === 'gmt_end') {
      setTimeout(() => {
        document.querySelector('.tool_item.question').click();
      }, 0)
    }
    // 如果是输入框并且有值 取消确定按钮的禁用
    if (key === 'text' && value) {
      this.setState({
        confimBtnType: false
      })
    } else {
      this.setState({
        confimBtnType: true
      })
    }
  };
  // 重置表单
  handleReset(formName) {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].resetFields();
  }

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
  // 新建投票
  handelAdd = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/vote`);
  };

  // 新建题库
  addNewLib = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/question/edit?id=0`);
  };
  // 发起竟达
  handel_correct = () => {
    this.validate_form('ruleForm_correct', () => {
      const {form, packageID} = this.state;
      if (form.need_info.length < 1) {
        Message.warning('请先勾选获奖凭证');
        return false;
      }

      httpRequest({
        url: api.publishCorrect,
        type: 'post',
        data: {
          h5_id: packageID,
          qid: form.questionLib,
          gmt_end: moment(form.gmt_end).format('YYYY-MM-DD HH:mm:ss'),
          gift: form.gift,
          gift_total: form.gift_total,
          need_info: JSON.stringify(form.need_info),
        }
      }).done(resp => {
        if (resp.code === '0') {
          Message.success('发起成功')
        } else {
          Message.error(resp.msg)
        }
      }).fail(jqXHR => {
        Notification.error({
          title: '接口请求失败',
          message: '内部服务器错误 ' + jqXHR.status
        });
      });


    })
  };

  //点击确定按钮发送文字
  hand_sendText = () => {
    const {form_edit, userForm} = this.state
    const {h5_id} = this.props;
    this.setState({
      form_edit: ({}, this.state.form_edit, {text: ''})
    })
    httpRequest({
      url: api.chatAdminChat,
      type: 'post',
      data: {
        h5_id: h5_id.packageID,
        content: form_edit.text,
        nick_name: userForm.nick_name,
        avatar: userForm.avatar
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          confimBtnType: true
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
  }

  // 点击查看更多历史消息按钮
  onClick_viewMore = () => {
    const {h5_id} = this.props;
    httpRequest({
      url: api.chatHistory,
      type: 'post',
      data: {
        last_id: this.state.last_id ? this.state.last_id : '',
        h5_id: h5_id.packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        if (JSON.stringify(resp.data) !== '{}' && resp.data.list.length !== 0) {
          let last_id = resp.data.list[resp.data.list.length - 1].id;
          const {talk_listData} = this.state

          resp.data.list.forEach((item) => {
            talk_listData.unshift(item)
          })
          this.setState({
            talk_listData,
            last_id: last_id
          })
        } else {
          Message.warning('没有更多历史记录了！')
          this.setState({
            viewMore: false
          })
        }
      } else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
  }

  // 选择人员下拉框
  onChange_selecet = (value) => {
    const {userOptions} = this.state
    userOptions.forEach((item) => {
      if (item.id === value) {
        this.setState({
          userForm: {nick_name: item.nick_name, avatar: item.avatar, id: item.id}
        })
      }
    })
  }

  // 获取投票活动
  getVoteList = () => {
    const {packageID} = this.state;
    httpRequest({
      url: api.voteList,
      type: 'post',
      data: {
        h5_id: packageID,
        page: 1,
        limit: 20,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          voteList: resp.data.list,
        });
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
  handel_voteStatus = (row, status) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.voteStatus,
      type: 'post',
      data: {
        h5_id: packageID,
        id: row.id,
        type: status
      }
    }).done(resp => {
      if (resp.code === '0') {
        Message.success('操作成功');
        this.getVoteList();
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

  render() {
    const {viewMore, form, form_edit, qList, talk_listData, userForm, voteList} = this.state;
    return (
      <div className="live_interactive">
        <div className="talk_list" ref='talk_list'>
          {/*对话列表*/}
          <div className='inner_list' ref='inner_list'>
            {viewMore ? <p className="viewmore" onClick={this.onClick_viewMore.bind(this)}>查看更多历史消息</p> : ''}

            {
              talk_listData.map((item, index) => {
                return (
                  <TalkItem data={item} key={index}/>
                )
              })
            }
          </div>
        </div>
        <div className="bottom_panel">
          <div className="current_editor">
            <div className="current_editor_inner">
              {/* <div className="editor_avatar" style={{backgroundImage: `url(${userForm.avatar})`}}/>
               <div className="editor_name" >{userForm.nick_name}</div> */}
              <Popover placement="top" title="" width="300" trigger="hover" content={(
                <div className="user_select">
                  <h3>请选择编辑:</h3>
                  <Select value={userForm.id}
                          placeholder="请选择编辑"
                          onChange={this.onChange_selecet.bind(this)}>
                    {
                      this.state.userOptions.map(el => {
                        return <Select.Option key={el.id} label={el.nick_name} value={el.id}/>
                      })
                    }
                  </Select>
                </div>

              )}>
                {/* <Button> */}
                <div className="current_editor">
                  <div className="current_editor_inner">
                    <div className="editor_avatar" style={{backgroundImage: `url(${userForm.avatar})`}}/>
                    <div className="editor_name">{userForm.nick_name}</div>
                  </div>
                </div>
                {/* </Button> */}
              </Popover>
            </div>
          </div>
          <div className="edit_textarea">
            <Input value={form_edit.text}
              // maxLength={200}
                   type='textarea'
                   rows={5}
                   placeholder='请输入文字'
                   onChange={this._onChange.bind(this, 'text', 'form_edit')}
                   autoComplete="off"/>
          </div>
          <div className="toolbar clearfix">
            {/*投票*/}
            <Popover placement="bottom" title="" width="220" trigger="click"
                     content={(<div className="interactive_menu_hover">
                       <h3>投票活动</h3>
                       {voteList.map(item => {
                         return <div key={item.id}
                                     className={classnames('vote_item', {active: item.status_open === '1'})}>
                           {item.status_open === '1' ? (
                             <Button type='text' style={{color: 'red', float: 'right'}} size='small'
                                     onClick={this.handel_voteStatus.bind(this, item, 'off')}>关闭</Button>) : (
                             <Button type='text' style={{color: '#20a0ff', float: 'right'}} size='small'
                                     onClick={this.handel_voteStatus.bind(this, item, 'on')}>开启</Button>
                           )}

                           <div className="vote_name limit-line1">{item.title}</div>
                         </div>
                       })}
                       <Button type='primary'
                               icon="plus"
                               size='small'
                               style={{margin: '20px auto'}}
                               onClick={this.handelAdd}>新建投票</Button>
                     </div>)}>
              <div title="投票活动" className="tool_item vote"/>
            </Popover>


            {/*问答*/}
            <Popover placement="bottom"
                     title=""
                     width="360"
                     trigger="click"
                     visible={true}
                     content={(<div className="interactive_menu_hover">
                       <h3>有奖竞答</h3>
                       <div className="question_inner">
                         <Form model={form}
                               ref="ruleForm_correct"
                               rules={this.state.rules}
                               labelWidth="100">
                           <Form.Item label="奖品个数" prop="gift_total">
                             <Input value={form.gift_total}
                                    type='number'
                                    onChange={this._onChange.bind(this, 'gift_total', 'form')}
                                    autoComplete="off"/>
                           </Form.Item>
                           <Form.Item label="奖品名称" prop="gift">
                             <Input value={form.gift}
                                    maxLength={20}
                                    placeholder=''
                                    onChange={this._onChange.bind(this, 'gift', 'form')}
                                    autoComplete="off"/>
                             <span className="limitNum">{form.gift.length} / 20</span>
                           </Form.Item>
                           <Form.Item label="截止时间" prop="gmt_end">
                             <DatePicker
                               value={form.gmt_end}
                               isShowTime={true}
                               placeholder="选择日期"
                               format="yyyy-MM-dd HH:mm:ss"
                               disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                               onChange={this._onChange.bind(this, 'gmt_end', 'form')}
                             />
                           </Form.Item>
                           <Form.Item label="获奖凭证" prop="need_info">
                             <Checkbox.Group
                               value={form.need_info}
                               onChange={this._onChange.bind(this, 'need_info', 'form')}>
                               {
                                 prizeTicketList.map((item, index) =>
                                   <Checkbox key={index} value={item.value} disabled={item.value === 'mobile'}>
                                     {item.name}
                                   </Checkbox>
                                 )
                               }
                             </Checkbox.Group>
                           </Form.Item>
                           <Form.Item label="选择题库" prop="questionLib">
                             <Select value={form.questionLib}
                                     placeholder='选择题库'
                                     onChange={this._onChange.bind(this, 'questionLib', 'form')}>
                               {
                                 qList.map(el => {
                                   return <Select.Option key={el.id}
                                                         label={el.title}
                                                         value={el.id}/>
                                 })
                               }
                             </Select>
                           </Form.Item>
                         </Form>
                         <div className="noData btn_new_lib" onClick={this.addNewLib}>新建题库</div>
                         <Button type='primary'
                           // icon="plus"
                                 size='small'
                                 style={{margin: '20px auto'}}
                                 onClick={this.handel_correct}>发起竞答</Button>
                       </div>

                     </div>)}>
              <div ref='tool_item_questiontool_item_question'
                   title="有奖竞答"
                   className="tool_item question"/>
            </Popover>

            {/*<div className="tool_item" />*/}
            <Button className="editor_submit"
                    disabled={this.state.confimBtnType}
                    type='primary'
                    onClick={this.hand_sendText.bind(this)}>确定</Button>
          </div>
        </div>
      </div>
    );
  }
}