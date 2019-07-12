import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {
  // Form, Input, Button, Dialog, DatePicker, Radio,
  Form,
  Input,
  Button,
  // Pagination,
  Dialog,
  MessageBox,
  Table,
  Message
} from 'element-react';
import Ks3Upload from '@/components/Ks3Upload';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import './index.scss';
@withRouter
/*图文直播*/
export default
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '', // 包装ID
      page_size: 10,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,
      rules: {
        nick_name: {required: true, message: '昵称不能为空', trigger: 'blur'},
        avatar: {required: true, message: '图片不能为空', trigger: 'change'},
      },
      form: {
        nick_name: '',
        avatar: '',
      },
      data: [],
      columns: [
        {
          label: "ID",
          prop: "id",
          width: 100
        },
        {
          label: "头像",
          prop: "avatar",
          width: 80,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ?
              <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "编辑名称",
          prop: 'nick_name'
        },
        {
          label: "操作",
          width: '140',
          align: 'center',
          render: (row) => {
            return (
              <span>
              <Button type='text'
                      onClick={this.handel_edit.bind(this, row)}>修改</Button>
                <div className="divider_line" />
                <Button type='text'
                        className="btn_red"
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
            </span>
            )
          }
        }
      ],
    };
  }

  componentWillMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // 获取数据
  getList = () => {
    this.props.getList()
  };
  handel_edit = (row) => {
    this.handleReset('ruleForm');
    const form = {
      id: row.id,
      nick_name: row.nick_name,
      avatar: row.avatar,
    };
    this.setState({
      form,
      dialogVisible: true
    })
  };
  handel_del = (row) => {
    this.sure_again({
      title: '',
      content: '确认删除嘛？',
      callback: this.del_ajax.bind(this, row)
    })
  };
  del_ajax = (row) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.userStatus,
      type: 'post',
      data: {
        h5_id: packageID,
        id: row.id,
        type: 'delete',
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
      nick_name: '',
      avatar: '',
      // avatar: 'https://github.githubassets.com/images/modules/site/integrators/atom.png',
    };
    this.setState({
      form,
      dialogVisible: true
    })
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
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {form, packageID} = this.state;
      httpRequest({
        url: api.editUser,
        type: 'post',
        data: {
          h5_id: packageID,
          id: form.id,
          nick_name: form.nick_name,
          avatar: form.avatar,
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

  render() {
    const {dialogVisible, form} = this.state;
    const {data} = this.props;
    return (
      <div className="user_list">
        <Button className="add_btn"
                type='primary'
                icon="plus"
                onClick={this.handelAdd}>添加编辑</Button>
        <Table
          columns={this.state.columns}
          data={data}
          // border={true}
          stripe={true}
        />
        {/*<div className="pagination_wrapper">*/}
        {/*<Pagination layout="total, prev, pager, next, jumper"*/}
        {/*pageSize={page_size}*/}
        {/*currentPage={current_page}*/}
        {/*total={total}*/}
        {/*onCurrentChange={this.currentChange}*/}
        {/*/>*/}
        {/*</div>*/}
        <Dialog
          title='信息编辑'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="编辑昵称" prop="nick_name">
                <Input value={form.nick_name}
                       maxLength={30}
                       placeholder='请输入昵称'
                       onChange={this._onChange.bind(this, 'nick_name', 'form')}
                       autoComplete="off"/>
                <span className="limitNum">{form.nick_name.length} / 30</span>
              </Form.Item>
              <Form.Item label="编辑头像" prop="avatar">
                <Ks3Upload cover={form.avatar}
                            style={{width: '120px', height: '120px'}}
                            successCallBack={this._onChange.bind(this, 'avatar', 'form')}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit}>保 存</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}