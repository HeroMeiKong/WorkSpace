import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Dialog,
  Pagination,
  Table,
  Input,
  Message,
  Notification,
  Checkbox,
  Radio,
  DatePicker,
  Form,
  InputNumber,
  Switch,
  MessageBox
} from 'element-react'
import tools from '@/utils/tool'
import moment from 'moment';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
import './index.scss'

const multipleList = [
  {name: '单选', value: 0},
  {name: '多选', value: 1},
];

/*投票*/
export default
class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false, //菜单管理弹框
      packageID: '',  //H5id
      page_size: 10,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,         // 总数
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        gmt_end: {type: 'date', required: true, message: '日期不能为空', trigger: 'blur'},
      },
      form: {
        id: '',
        title: '',
        main_title: '',
        gmt_end: null,
        open_result: 1,
        select_count: 1,
        multiple: 0,
        multiple_num: 2,
        // options: 1,
        options: [
          {id: 0, title: '选项1', cmd: 'edit'},
          {id: 0, title: '选项2', cmd: 'edit'},
        ]
      },
      //视频编辑弹框表单
      data: [], //精彩视频数据
      columns: [
        {
          label: "ID",
          prop: "id",
          width: 80,
        },
        {
          label: "投票名称",
          prop: "title",
          // width: 260,
        },
        {
          label: "投票人数",
          prop: "choose_count",
          // width: 260,
        },
        {
          label: "截止时间",
          prop: "gmt_end",
          width: 180,
        },
        {
          label: "开关",
          prop: "status",
          width: 180,
          render: (row) => {
            return <Switch
              // checked={form.showRobot}
              onText="开"
              offText="关"
              value={Boolean(row.status_open === '1')}
              onChange={this._onChange_status.bind(this, row)}/>
          }
        },
        {
          label: "操作",
          width: 190,
          align: 'center',
          render: (row) => {
            const url = this.props.history.location.pathname + '/result?id=' + row.id;
            return (<span>
                <Link to={url}>
                  <Button type='text'>查看</Button>
                </Link>
                     <div className="divider_line"/>
                <Button onClick={this.handel_edit.bind(this, row)}
                        type='text'>编辑</Button>
                     <div className="divider_line"/>
                <Button className="btn_red"
                        onClick={this.handel_del.bind(this, row)}
                        type='text'>删除</Button>
              </span>
            )
          }
        }
      ],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    const {search = ''} = this.props.location;
    const {packageID} = this.props.match.params;
    const params = tools.getParams(search);
    const {page} = params;
    this.setState({
      packageID: packageID,
      current_page: page ? page / 1 : 1,
    }, () => {
      this.getList();
    });
  }

  getList = () => {
    const {packageID, page_size, current_page} = this.state;
    httpRequest({
      url: api.voteList,
      type: 'post',
      data: {
        h5_id: packageID,
        page: current_page,
        limit: page_size,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list,
          total: resp.data.total
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
  // 修改状态
  _onChange_status = (row, status) => {
    this.del_ajax(row, status ? 'off' : 'on')
  };
  handel_edit = (row) => {

    this.handleReset('ruleForm');
    const options = row.options.map(item => {
      return {...item, cmd: 'edit'}
    });
    const form = {
      id: row.id,
      title: row.title,
      // main_title: row.title,
      gmt_end: new Date(row.gmt_end),
      open_result: row.open_result === '1',
      select_count: row.select_count === '1' ? 1 : 0,
      multiple: row.select_count > 1,
      multiple_num: row.select_count > 1 ? row.select_count : 2,
      // options: 1,
      options: options
    };
    this.setState({
      form,
      dialogVisible: true
    });
  };
  handel_del = (row) => {
    this.sure_again({
      content: '确认删除嘛？',
      callback: this.del_ajax.bind(this, row, 'delete')
    })
  };
  del_ajax = (row, status) => {
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
  // 文件上传成功
  uploadSuccess = (key, url) => {
    this.setState({
      videoEditForm: Object.assign({}, this.state.videoEditForm, {[key]: url})
    })
  };

  videoEditInput = (e) => {
    const {videoEditForm} = this.state
    this.setState({
      videoEditForm: {...videoEditForm, name: e}
    })
  };
  // 详情弹框编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };
  _onChangeOptions = (index, value) => {
    const form = {...this.state.form};
    form.options[index].title = value;
    this.setState({
      form: form
    });
  };
  // 删除选项
  handel_delOption = (index) => {
    const form = {...this.state.form};

    if (form.options[index].id) { // 是存在的
      form.options[index].cmd = 'delete';
    } else {
      form.options.splice(index, 1)
    }
    this.setState({
      form: form
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

  // 新建投票
  handelAdd = () => {
    this.handleReset('ruleForm');
    const form = {
      id: '',
      title: '',
      // main_title: '',
      gmt_end: null,
      open_result: 1,
      select_count: 1,
      multiple: 0,
      multiple_num: 2,
      // options: 1,
      options: [
        {id: 0, title: '选项1', cmd: 'edit'},
        {id: 0, title: '选项2', cmd: 'edit'},
      ]
    };
    this.setState({
      form,
      dialogVisible: true
    });
  };
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    });
  };
  // 新增选项
  handel_addOption = () => {
    const form = {...this.state.form};
    const showOptions = form.options.filter(item => {
      return item.cmd !== 'delete'
    });
    if (showOptions.length > 3) {
      Message.warning('最多添加四个选项');
      return false
    }
    form.options.push({
      id: 0,
      title: '',
      cmd: 'edit'
    });
    this.setState({
      form: form
    });
  };
  checkForm = () => {
    const options = [...this.state.form.options];
    const showOptions = options.filter(item => {
      return item.cmd !== 'delete' && !item.title
    });
    return showOptions.length < 1
  };
  // 提交表单
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {form, packageID} = this.state;

      const allRight = this.checkForm();
      if (!allRight) {
        Message.warning('请先将选项标题填写完整');
        return false;
      }
      httpRequest({
        url: api.editVote,
        type: 'post',
        data: {
          h5_id: packageID,
          id: form.id,
          // main_title: form.title,
          gmt_end: moment(form.gmt_end).format('YYYY-MM-DD HH:mm:ss'),
          open_result: form.open_result ? 1 : 0,
          select_count: form.multiple ? form.multiple_num : 1,
          title: form.title,
          options: JSON.stringify(form.options),
        }
      }).done(resp => {
        if (resp.code === '0') {
          this.setState({
            dialogVisible: false
          });
          Message.success('操作成功');
          this.getList()
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
  // 分页
  currentChange = (current_page) => {
    const {pathname} = this.props.location;
    this.props.history.replace(pathname + `?page=${current_page}`);
    this.setState({
      current_page: current_page
    }, () => {
      this.getList();
    });
  };

  render() {
    const {page_size, current_page, total, dialogVisible, form} = this.state;
    const showOptions = form.options.filter(item => {
      return item.cmd !== 'delete'
    });
    return (
      <div className="vote_wrapper">
        <div className="clearfix" style={{marginBottom: '10px'}}>
          <Button style={{float: 'right'}}
                  type='primary'
                  icon="plus"
                  onClick={this.handelAdd}>新建投票</Button>
        </div>
        <Table
          columns={this.state.columns}
          data={this.state.data}
          // border={true}
          height={500}
          stripe={true}
        />
        {total > 0 ? (<div className="pagination_wrapper">
          <Pagination layout="total, prev, pager, next, jumper"
                      pageSize={page_size}
                      currentPage={current_page}
                      total={total}
                      onCurrentChange={this.currentChange}
          />
        </div>) : ''}


        <Dialog
          title='新建投票'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="投票主题" prop="title">
                <Input value={form.title}
                       maxLength={32}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'title', 'form')}
                       autoComplete="off"/>
                <span className="limitNum">{form.title.length} / 32</span>
              </Form.Item>

              <Form.Item label="截止时间" prop="gmt_end">
                <DatePicker
                  value={form.gmt_end}
                  isShowTime={true}
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  onChange={this._onChange.bind(this, 'gmt_end', 'form')}
                />
              </Form.Item>
              <Form.Item label='投票结果' prop='open_result'>
                <Checkbox checked={Boolean(form.open_result)}
                          onChange={this._onChange.bind(this, 'open_result', 'form')}>对用户开放</Checkbox>
              </Form.Item>
              <Form.Item label='选项类型' prop='multiple'>
                <Radio.Group
                  value={form.multiple}
                  onChange={this._onChange.bind(this, 'multiple', 'form')}>
                  {
                    multipleList.map((item, index) =>
                      <Radio key={index} value={item.value}>
                        {item.name}
                      </Radio>
                    )
                  }
                </Radio.Group>
              </Form.Item>
              {form.multiple ? (
                <Form.Item label='最多选项' prop='multiple_num'>
                  <InputNumber defaultValue={form.multiple_num}
                               onChange={this._onChange.bind(this, 'multiple_num', 'form')} min="2" max="4"/>
                </Form.Item>
              ) : ''}

              {form.options.map((item, index) => {
                return item.cmd !== 'delete' ? (
                  <div className="diy_input clearfix" key={index}>
                    <Form.Item label={`选项${index + 1}`}>
                      <Input value={item.title}
                             maxLength={16}
                             placeholder=''
                             onChange={this._onChangeOptions.bind(this, index)}
                             autoComplete="off"/>
                      <span className="limitNum">{item.title.length} / 16</span>
                    </Form.Item>
                    {index > 1 ? (
                      <Button size='small' onClick={this.handel_delOption.bind(this, index)}>删除</Button>) : ''}
                  </div>
                ) : ''
              })}
              {showOptions.length < 4 ? (
                <Form.Item label=''>
                  <div className="noData" onClick={this.handel_addOption}>添加选项</div>
                </Form.Item>
              ) : ''}

            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit}>确 认</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}