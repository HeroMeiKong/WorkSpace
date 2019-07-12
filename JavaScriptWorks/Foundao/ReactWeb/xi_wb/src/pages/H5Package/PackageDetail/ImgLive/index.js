import React, {Component} from 'react';
import {
  Dialog,
  Form,
  Input,
  Button,
  Pagination,
  Table,
  Message,
  MessageBox,
  Tabs,
  Notification,
  Select
} from 'element-react';
import Ks3Upload from '@/components/Ks3Upload';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import UserList from './UserList';
import ImgPreview from '@/components/ImgPreview';

import './index.scss';
/*图文直播*/
export default
class ImgLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_size: 10,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,
      activeTab: '1',
      form: {
        it_user_id: '',
        content: '',
      },
      data: [],
      userList: [],
      rules: {
        it_user_id: {required: true, message: '昵称不能为空', trigger: 'blur'},
        content: {required: true, message: '内容不能为空', trigger: 'change'},
      },
      columns: [
        {
          label: "ID",
          prop: "id",
          width: 60
        },
        {
          label: "编辑名称",
          prop: 'it_user_id',
          width: 100,
          render: (row) => {
            const nick_name = this.getNickname(row.it_user_id);
            return nick_name
          }
        },
        {
          label: "内容",
          prop: "content",
        },
        {
          label: "图片",
          align: 'center',
          width: 180,
          prop: 'images',
          render: (row) => {
            return <div className="table_image">{row.images ?
              <img src={row.images} alt=""/> : ""}</div>
          }
        },
        {
          label: "发布时间",
          width: 180,
          prop: 'gmt_create'
        },
        {
          label: "状态",
          prop: 'status',
          width: 80,
          render: (row) => {
            return row.status === '1' ? '上线' : '下线'
          }
        },
        {
          label: "操作",
          // width: 120,
          align: 'center',
          render: (row) => {
            return (
              <div style={{textAlign: 'left'}}>
                <Button type='text'
                        onClick={this.handel_edit.bind(this, row)}>编辑</Button>
                <div className="divider_line"/>

                {row.status === '1' ?
                  <Button type='text'
                          onClick={this.handel_status.bind(this, row, 'offline')}>下线</Button> :
                  <Button type='text'
                          onClick={this.handel_status.bind(this, row, 'online')}>上线</Button>}
                <div className="divider_line"/>
                <Button type='text'
                        className="btn_red"
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
                <div className="divider_line"/>
                {row.is_top === '1' ?
                  <Button type='text'
                          className="btn_red"
                          onClick={this.handel_setTop.bind(this, row, 'offtop')}>取消置顶</Button> :
                  <Button type='text'
                          onClick={this.handel_setTop.bind(this, row, 'top')}>置顶</Button>}
              </div>
            )
          }
        }
      ]
    };
  }

  componentWillMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID
    }, () => {
      this.getUserList()
      this.getList()
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  getNickname = (it_user_id) => {
    const {userList} = this.state;
    const userItem = userList.find((item) => {
        return item.id === it_user_id
      }) || {};
    return userItem.nick_name || ''
  };
  // 详情弹框编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
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
  //tabs切换
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    })
  };
  // 用户列表
  getUserList = () => {
    const {packageID} = this.state;
    httpRequest({
      url: api.allUser,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          userList: resp.data,
          // total: resp.data.count
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
  // 图文列表
  getList = () => {
    const {page_size, current_page, packageID} = this.state;
    httpRequest({
      url: api.imgLiveList,
      type: 'post',
      data: {
        page: current_page,
        limit: page_size,
        h5_id: packageID,
      }
    }).done(resp => {
      if (resp.code === '0') {
        this.setState({
          data: resp.data.list,
          total: resp.data.total
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
  // 分页
  currentChange = (current_page) => {
    this.setState({
      current_page: current_page
    }, () => {
      this.getList()
    });
  };
  handelAdd = () => {
    this.handleReset('ruleForm');
    const form = {
      id: '',
      it_user_id: '',
      content: '',
    };
    this.setState({
      form,
      dialogVisible: true
    })
  };
  handel_edit = (row) => {
    this.handleReset('ruleForm');
    const form = {
      id: row.id,
      nick_name: row.nick_name,
      it_user_id: row.it_user_id,
      content: row.content,
      images: row.images || '',
    };
    this.setState({
      form,
      dialogVisible: true
    })
  };
  // 置顶
  handel_setTop = (row, type) => {
    let content = '确认置顶嘛？';
    if (type === 'offtop') { //
      content = '确认取消置顶嘛？';
    }
    this.sure_again({
      title: '',
      content: content,
      callback: this.statue_ajax.bind(this, row, type)
    })
  };
  // 上下线
  handel_status = (row, type) => {
    let content = '确认上线嘛？';
    if (type === 'offline') { //
      content = '确认下线嘛？';
    }
    this.sure_again({
      title: '',
      content: content,
      callback: this.statue_ajax.bind(this, row, type)
    })
  };
  handel_del = (row) => {
    this.sure_again({
      title: '',
      content: '确认删除嘛？',
      callback: this.statue_ajax.bind(this, row, 'delete')
    })
  };
  statue_ajax = (row, type) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.imgLiveStatus,
      type: 'post',
      data: {
        h5_id: packageID,
        id: row.id,
        type: type,
      }
    }).done((resp) => {
      if (resp.code === '0') {
        this.setState({
          dialogVisible: false
        });
        Message.success('操作成功');
        this.getList();
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
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {form, packageID} = this.state;
      httpRequest({
        url: api.imgLiveEdit,
        type: 'post',
        data: {
          h5_id: packageID,
          id: form.id,
          nick_name: form.nick_name,
          it_user_id: form.it_user_id,
          content: form.content,
          images: form.images || '',
        }
      }).done((resp) => {
        if (resp.code === '0') {
          this.setState({
            dialogVisible: false
          });
          Message.success('操作成功');
          this.getList();
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
  showPreviewImgs = () => {
    this.setState({
      showImgs: true,
      imgList: ['1', '2']
    })
  };
  closeImgPreview = () => {
    this.setState({
      showImgs: false,
    })
  };

  render() {
    const {activeTab, page_size, current_page, total, userList, data, dialogVisible, form, showImgs, imgList} = this.state;
    return (
      <div className="img_live">
        <Tabs activeName={activeTab} onTabClick={ this.changeTabs}>
          <Tabs.Pane label="图文发布" name="1">
            <Button className="add_btn"
                    type='primary'
                    icon="plus"
                    onClick={this.handelAdd}>新建图文直播</Button>
            <Table
              columns={this.state.columns}
              data={data}
              height={500}
              // border={true}
              // stripe={true}
            />
            {total > 0 ? (
              <div className="pagination_wrapper">
                <Pagination layout="total, prev, pager, next, jumper"
                            pageSize={page_size}
                            currentPage={current_page}
                            total={total}
                            onCurrentChange={this.currentChange}
                />
              </div>
            ) : ''}

          </Tabs.Pane>
          <Tabs.Pane label="人员管理" name="2">
            <UserList data={userList} getList={this.getUserList} activeTab={activeTab}/>
          </Tabs.Pane>
        </Tabs>
        {showImgs ? <ImgPreview imgList={imgList} onClose={this.closeImgPreview}/> : ''}

        <Dialog
          title='图文直播'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="编辑人员" prop="it_user_id">
                <Select value={form.it_user_id}
                        disabled={Boolean(form.id)}
                        onChange={this._onChange.bind(this, 'it_user_id', 'form')}
                        placeholder="请选择编辑">
                  {
                    userList.map(el => {
                      return <Select.Option key={el.id} label={el.nick_name} value={el.id}/>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="内容" prop="content">
                <Input value={form.content}
                       maxLength={200}
                       type='textarea'
                       autosize={{minRows: 4}}
                       placeholder='请输入内容'
                       onChange={this._onChange.bind(this, 'content', 'form')}
                       autoComplete="off"/>
                <span className="limitNum">{form.content.length} / 200</span>
              </Form.Item>
              <Form.Item label="图片" prop="images">
                <Ks3Upload cover={form.images}
                  // style={{width: '120px', height: '120px'}}
                           successCallBack={this._onChange.bind(this, 'images', 'form')}/>
                <span className="min_tips">(建议尺寸 620 * 348)</span>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit}>{form.id ? '保 存' : '发 布'}</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}