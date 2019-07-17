import React, {Component} from 'react';
import {
  Form, Input, Button, Dialog, Tabs, Loading, Table, Pagination, Select,
  Message, MessageBox, Notification
} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tool';
import api from '@/API/api';

import './index.scss'
/*评论审核*/
export default
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      dialogVisible_audit: false,
      edit_id: '',           // 编辑的id
      multi_selection: [],   // 多选数组
      articleId: '',         // 具体文章的评论
      packageID: '', // 直播id
      page_size: 10,
      current_page: 1,
      activeTab: '1',  // 0 表示待审核 1审核不通过 2审核通过
      total: 0,
      form_audit: {
        audit_type: ''
      },
      // 经验选项form
      form_forbid: {},
      forbidTime: [
        {name: '24H', value: 1},
        {name: '48H', value: 2},
        {name: '一周', value: 7},
        {name: '一个月', value: 30},
      ],

      columns: [
        {
          type: 'selection',
          minWidth: 50,
        },
        // {
        //   label: "id",
        //   prop: "id",
        //   width: 120,
        // },
        {
          label: "用户头像",
          align: 'center',
          width: 110,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          width: 120,
          label: "用户昵称",
          prop: "nickname",
          render: (row) => {
            return <span>{row.nick_name}</span>
          }
        },
        {
          label: "评论内容",
          minWidth: 130,
          prop: "content"
        },
        // {
        //   label:'图片',
        //   width:100,
        // },
        {
          label: "评论时间",
          width: 170,
          prop: 'addTime',
          render: (row) => {
            return <span>{row.gmt_create}</span>
          }
        },
        {
          label: '类型',
          width: 80,
          render: (row) => {
            return <span>{'评论'}</span>
          }
        },
        {
          label: "操作",
          minWidth: 100,
          align: 'center',
          render: (row) => {
            const {activeTab} = this.state;
            if (activeTab === '1') { // 待审核
              return (
                <span>
                  <Button type='text'
                          onClick={this.handel_audit.bind(this, row, 'pass')}>通过</Button>
                   <div className="divider_line"/>
                  <Button type='text'
                          onClick={this.handel_audit.bind(this, row, 'no_pass')}>不通过</Button>
                   <div className="divider_line"/>
                  {/*<Button webButton="audit"*/}
                  {/*type='text'*/}
                  {/*size='small'*/}
                  {/*onClick={this.handel_audit.bind(this, row, '2')}>禁言</Button>*/}
                  <Button type='text'
                          className='btn_red'
                          onClick={this.handel_del.bind(this, row)}>删除</Button>
                </span>
              )
            } else if (activeTab === '2') {  // 通过
              return (<span>
                {row.is_top / 1 !== 1 ? <Button type='text'
                                                onClick={this.handel_setTop.bind(this, row, 'top')}>置顶</Button> :
                  <Button type='text'
                          className='btn_red'
                          onClick={this.handel_setTop.bind(this, row, 'offtop')}>取消置顶</Button>}
                {/*<Button webButton="del"*/}
                {/*type='text'*/}
                {/*size='small'*/}
                {/*onClick={this.handel_del.bind(this, row)}>回复</Button>*/}

                <div className="divider_line"/>
                <Button type='text'
                        onClick={this.handel_audit.bind(this, row, 'no_pass')}>不通过</Button>
                   <div className="divider_line"/>
                <Button type='text'
                        className='btn_red'
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
              </span>)
            } else if (activeTab === '3') {                   // 不通过
              return <span>
                {/*<Button webButton="lock"*/}
                {/*type='text'*/}
                {/*size='small'*/}
                {/*onClick={this.handel_forbid.bind(this, row)}>禁言</Button>*/}
                <Button type='text'
                        onClick={this.handel_audit.bind(this, row, 'pass')}>通过</Button>
                <div className="divider_line"/>
                <Button type='text'
                        className='btn_red'
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
              </span>
            } else {   //含敏感词评论
              return <span>
                <Button type='text'
                        onClick={this.handel_audit.bind(this, row, 'pass')}>通过</Button>
                  <Button type='text'
                          className='btn_red'
                          onClick={this.handel_del.bind(this, row)}>删除</Button>
              </span>
            }
          }
        }
      ],
      data: []
    }
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = tools.getParams(search) || {};
    const page = params.page;
    const {packageID} = this.props.match.params;
    this.setState({
      current_page: page ? page / 1 : 1,
      packageID: packageID || ''
    }, () => {
      this.getList();
    });
  };

  componentWillUnmount() {
    tools.hide_loading();
  }

  getList = () => {
    this.setState({
      is_loading: true,
      data: [],
      multi_selection: [], // 多选选项置空
      total: 0,
    });
    const {current_page, page_size, activeTab} = this.state;
    httpRequest({
      url: api.commentList,
      type: 'post',
      data: {
        type: activeTab,
        page: current_page,
        limit: page_size,
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list || [],
          total: resp.data.total,
          // current_auditType: resp.data.commentType,
          is_loading: false
        })
      } else {
        Message.error(resp.msg);
        this.setState({
          is_loading: false
        })
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  _onChange_forbid = (key, value) => {
    const {form_forbid} = this.state;
    this.setState({
      form_forbid: Object.assign({}, form_forbid, {[key]: value})
    })
  };
  form_auditChange = (key, value) => {
    const {form_audit} = this.state;
    this.setState({
      form_audit: Object.assign({}, form_audit, {[key]: value})
    })
  };
  // 添加
  handle_add = () => {
    this.handleReset();
    this.setState({
      edit_id: '',
      dialogVisible: true
    })
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

  // 删除
  handel_del = (row) => {
    MessageBox.confirm('确定是否删除此评论?', '提示', {
      type: 'warning'
    }).then(() => {
      this.del_ajax(row.id);
    }).catch(() => {
    });
  };
  // 删除的ajax
  del_ajax = (ids) => {
    // ids 多个id ,隔开
    httpRequest({
      url: api.commentDelete,
      type: 'POST',
      data: {
        ids: ids,
        h5_id: this.state.packageID,
        type: 'delete'
      }
    }).done(resp => {
      if (resp.code / 1 === 0) {
        this.setState({
          multi_selection: []
        });
        Message.success('操作成功');
        this.getList();
      } else {
        Message.error('操作成功: ' + resp.msg);
      }
    }).fail((jqXHR = {}) => {
      Notification.error({
        title: '操作失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    })
  };

  // 多选删除
  // multi_del = () => {
  //   const {multi_selection} = this.state;
  //   const idArr = multi_selection.map(item => {
  //     return item.id
  //   });
  //   if (idArr.length < 1) {
  //     Message.error('请先勾选相关内容');
  //     return false;
  //   }
  //   this.del_ajax(idArr.join(','));
  // };
  // 审核操作
  handel_audit = (row, type) => {
    this.audit_ajax(row.id, type);
  };
  // 审核ajax
  audit_ajax = (ids, type = 'no_pass') => {
    // type: no_pass审核不通过  pass审核通过
    const ary = ids.split(',');
    const idsAry = JSON.stringify(ary)
    httpRequest({
      url: api.commentCheck,
      type: 'POST',
      data: {
        ids: idsAry,
        type: type,
        h5_id: this.state.packageID
      }
    }).done(resp => {
      if (resp.code / 1 === 0) {
        Message.success('操作成功');
        this.setState({
          multi_selection: []
        });
        this.getList();
      } else {
        Message.error('操作失败: ' + resp.msg);
      }
    }).fail((jqXHR = {}) => {
      Notification.error({
        title: '操作失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    })
  };

  //置顶操作
  handel_setTop = (row, type) => {
    let text = '确定置顶此评论?';
    if (type === 'offtop') {
      text = '确定取消置顶此评论?';
    }
    MessageBox.confirm(text, '提示', {
      type: 'warning'
    }).then(() => {
      this.setTop_ajax(row.id, type);
    }).catch(() => {
    });
  }

  //置顶的ajax
  setTop_ajax = (id, type) => {
    httpRequest({
      url: api.commentTop,
      type: 'POST',
      data: {
        id: id,
        h5_id: this.state.packageID,
        type: type
      }
    }).done(resp => {
      if (resp.code / 1 === 0) {
        // this.setState({
        //   multi_selection: []
        // });
        Message.success('操作成功');
        this.getList();
      } else {
        Message.error('操作成功: ' + resp.msg);
      }
    }).fail((jqXHR = {}) => {
      Notification.error({
        title: '操作失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    })
  }

  // 多选审核
  multi_audit = (type) => {
    const {multi_selection} = this.state;
    const idArr = multi_selection.map(item => {
      return item.id
    });
    if (idArr.length < 1) {
      Message.error('请先勾选相关内容');
      return false;
    }
    this.audit_ajax(idArr.join(','), type);
  };

  // 禁言按钮
  handel_forbid = (row) => {
    this.setState({
      // dialogVisible: true,
      form_forbid: {...row, time_lock: 1}
    });
  };

  // 确认禁言
  handleSubmit = () => {
    const {form_forbid} = this.state;
    httpRequest({
      url: api.comment_lock,
      type: 'post',
      data: {
        uid: form_forbid.userUuid,
        time_lock: form_forbid.time_lock || 1,
        is_lock: '-1',  // 固定 -1 为禁言
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          dialogVisible: false
        });
        Message.success('操作成功');
        this.getList();
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

  // 分页
  currentChange = (current_page) => {
    const {articleId} = this.state;
    const {pathname} = this.props.location;
    let articleIdParams = '';
    if (articleId) {
      articleIdParams = '&articleId=' + articleId;
    }
    this.props.history.replace(pathname + `?page=${current_page}${articleIdParams}`);
    this.setState({
      current_page: current_page
    }, () => {
      this.getList()
    });
  };

  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
      current_page: 1
    }, () => {
      const {articleId} = this.state;
      const {pathname} = this.props.location;
      let articleIdParams = '';
      if (articleId) {
        articleIdParams = '&articleId=' + articleId;
      }
      this.props.history.replace(pathname + `?page=1${articleIdParams}`);
      this.getList();
    })
  };

  // 多选
  selectChange = (selection) => {
    this.setState({
      multi_selection: selection
    })
  };

  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  close_dialog_audit = () => {
    this.setState({
      dialogVisible_audit: false
    })
  };

  // 获取审核方式
  get_auditType = (typeValue) => {
    const {audit_types} = this.state;
    const auditItem = audit_types.find(item => {
        return item.value === typeValue;
      }) || {};
    return auditItem.name || '未知';
  };
  changeAudit = () => {
    const form_audit = {
      // audit_type: current_auditType || 0
    };
    this.setState({
      dialogVisible_audit: true,
      form_audit
    })
  };

  render() {
    const {
      is_loading, page_size, current_page, total, activeTab, dialogVisible, form_forbid, forbidTime,
    } = this.state;
    // const audit_type_style = {
    //   fontSize: '16px',
    //   color: 'red',
    //   marginRight: '10px'
    // };
    return (
      <div className="comment_wrapper comment_page">


        {/*搜索框*/}
        {/* <div className="table_toolbar clearBoth">
         </div> */}
        <div className='commentHeader'>
          <Tabs activeName={activeTab} onTabClick={this.changeTabs}>
            <Tabs.Pane label="待审核" name="1"/>
            <Tabs.Pane label="通过" name="2"/>
            <Tabs.Pane label="不通过" name="3"/>
            <Tabs.Pane label="含敏感词评论" name="4"/>
          </Tabs>
          <div className="batch_wrapper clearBoth">
            <div className="batch-btn-group">
              {/*只有待审核有批量通过和批量不通过*/}
              {activeTab === '1' ? <Button webButton="audit"
                                           onClick={this.multi_audit.bind(this, 'pass')}>批量通过</Button> : ''}
              {activeTab === '1' ? <Button webButton="audit"
                                           onClick={this.multi_audit.bind(this, 'no_pass')}>批量不通过</Button> : ''}

              {/*除了未审核都有批量删除*/}
              {/* {activeTab === '1' ? <Button webButton="del"
               onClick={this.multi_del}>批量删除</Button> : ''} */}


            </div>
          </div>
        </div>

        <Loading loading={is_loading} text="拼命加载中">
          <Table
            columns={this.state.columns}
            data={this.state.data}
            // border={true}
            height={500}
            stripe={true}
            align='center'
            onSelectChange={this.selectChange}
          />
          <div className="pagination_wrapper">
            <Pagination layout="total, prev, pager, next, jumper"
                        pageSize={page_size}
                        currentPage={current_page}
                        total={total}
                        onCurrentChange={this.currentChange}
            />
          </div>
        </Loading>
        {/*禁言弹框*/}
        <Dialog
          title='禁言用户'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form_forbid}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="用户昵称" prop="nickname">
                <Input defaultValue={form_forbid.nickname}
                       disabled
                       autoComplete="off"/>
              </Form.Item>
              <Form.Item label="禁言时间" prop="time_lock">
                <Select value={form_forbid.time_lock}
                        placeholder='请选择禁言时间'
                        className="mini_input"
                        onChange={this._onChange_forbid.bind(this, 'time_lock')}>
                  {
                    forbidTime.map(el => {
                      return <Select.Option key={el.value}
                                            label={el.name}
                                            value={el.value}/>
                    })
                  }
                </Select>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}