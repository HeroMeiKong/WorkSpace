import React, {Component} from 'react';
import {
  Form,
  Button,
  Message,
  Notification,
  MessageBox,
  Dialog,
  Radio,
  Checkbox,
  Input
} from 'element-react'
import tools from '@/utils/tool'
// import moment from 'moment';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
import './index.scss'

const multipleList = [
  {name: '单选', value: 0},
  {name: '多选', value: 1},
];

/*编辑新增题库*/
export default
class QuestionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qLibID: '', // 问题库ID
      packageID: '',
      form_base: {
        title: ''
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
          {id: 0, title: '选项1', cmd: 'edit', is_true: 0},
          {id: 0, title: '选项2', cmd: 'edit', is_true: 0},
        ]
      },
      questionList: [],
      rules_base: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
      },
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
      },
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const {search = ''} = this.props.location;
    const {packageID} = this.props.match.params;
    const params = tools.getParams(search);
    const {id} = params;
    this.setState({
      packageID: packageID,
      qLibID: id
    }, () => {
      this.getList();
    });
  }

  getList = () => {
    const {packageID, qLibID} = this.state;
    if (qLibID === '0') {
      return false;
    }
    httpRequest({
      url: api.questionDetail,
      type: 'post',
      data: {
        h5_id: packageID,
        id: qLibID,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        if (!resp.data) {
          return false
        }
        const form_base = {
          title: resp.data.title
        };
        this.setState({
          detail: resp.data,
          form_base,
          questionList: resp.data.question || []
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
  handel_changeRight = (index, value) => {
    const {multiple} = this.state.form;
    const form = {...this.state.form};
    if (!multiple) { // 单选只能选择一个
      form.options.forEach(item => {
        item.is_true = 0;
      })
    }
    form.options[index].is_true = value ? 1 : 0;
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
  // 提交题库名称
  handleSubmit_base = () => {
    this.validate_form('ruleForm_base', () => {
      const {form_base, packageID, qLibID} = this.state;
      httpRequest({
        url: api.questionMainEdit,
        type: 'post',
        data: {
          h5_id: packageID,
          id: qLibID,
          title: form_base.title,
        }
      }).done((resp) => {
        if (resp.code / 1 === 0) {
          Message.success('操作成功');
          if (!qLibID || qLibID === '0') {
            if (resp.data && resp.data.id) {
              const id = resp.data.id;
              const {pathname} = this.props.location;
              this.props.history.replace(pathname + `?id=${id}`);
              this.setState({
                qLibID: id
              })
            }
          }
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
  // 新增问题
  handel_addQuestion = () => {
    const {qLibID} = this.state;
    if (!qLibID || qLibID === '0') {
      Message.warning('请先保存题库名称');
      return false;
    }
    this.handleReset('ruleForm');
    const form = {
      id: '',
      title: '',
      multiple: 0,
      // multiple_num: 4,
      options: [
        {id: 0, title: '选项1', cmd: 'edit', is_true: 0},
        {id: 0, title: '选项2', cmd: 'edit', is_true: 0},
      ]
    };
    this.setState({
      dialogVisible: true,
      form,
    })
  };
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    });
  };
  checkForm = () => {
    const {form} = this.state;
    const options = [...form.options];
    const {multiple} = form;
    const emptyArr = []; // 空标题数组
    const right_question = []; // 正确答案数组
    options.forEach(item => {
      if (item.cmd !== 'delete') { // 空标题
        if (!item.title) {
          emptyArr.push(item)
        }
        if (item.is_true) {
          right_question.push(item)
        }
      }
    });

    if (emptyArr.length > 0) {
      Message.warning('请先将选项标题填写完整');
      return false
    }

    if (right_question.length < 1) {
      Message.warning('请先选择正确答案');
      return false
    }
    if (multiple) { // 多选
      if (right_question.length < 2) {
        Message.warning('多选至少两个正确答案');
        return false
      }
    } else {
      if (right_question.length > 1) {
        Message.warning('单选只能选择一个正确答案');
        return false
      }
    }
    return true;
  };
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {

      const allRight = this.checkForm();
      if (!allRight) {
        return false;
      }

      const {form, packageID, qLibID} = this.state;
      httpRequest({
        url: api.questionItemEdit,
        type: 'post',
        data: {
          h5_id: packageID,
          id: form.id,
          pid: qLibID,
          select_count: form.multiple ? 4 : 1,
          answer_time: 0, // 答题时间 0表示无限制
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
      is_true: 0,
      cmd: 'edit'
    });
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

  // 编辑问题
  handel_edit_question = (item) => {
    this.handleReset('ruleForm');
    const options = item.options.map(item => {
      return {
        id: item.id,
        title: item.title,
        cmd: 'edit',
        is_true: item.is_true / 1
      }
    });
    const form = {
      id: item.id,
      title: item.title,
      multiple: item.select_count / 1 > 1 ? 1 : 0,
      // multiple_num: 4,
      options: options
    };
    this.setState({
      dialogVisible: true,
      form,
    })
  };
  // 删除问题
  handel_del_question = (item) => {
    this.sure_again({
      content: `确定删除问题《${item.title}》?`,
      callback: this.delAjax.bind(this, item)
    })
  };
  delAjax = (item) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.questionItemStatus,
      type: 'post',
      data: {
        h5_id: packageID,
        id: item.id,
        type: 'delete',
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
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
  };

  render() {
    const {form_base, dialogVisible, form, questionList} = this.state;
    const showOptions = form.options.filter(item => {
      return item.cmd !== 'delete'
    });
    return (
      <div className="question_edit">
        <div className="qname_block">
          <Form model={form_base}
                ref="ruleForm_base"
                rules={this.state.rules_base}
                labelWidth="80">
            <div className="diy_input clearfix">
              <Form.Item label="题库名称" prop="title">
                <Input value={form_base.title}
                       maxLength={16}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'title', 'form_base')}
                       autoComplete="off"/>
                <span className="limitNum">{form_base.title.length} / 16</span>
              </Form.Item>
              <Button type="primary"
                      size="small"
                      onClick={ this.handleSubmit_base}>保 存</Button>
            </div>

          </Form>
        </div>
        <div className="questionList">
          {questionList.map((item, index) => {
            return <div className='question_item' key={index}>
              <div className="item_operate">
                <Button size='small'
                        type='plain'
                        onClick={this.handel_edit_question.bind(this, item)}>编辑</Button>
                <Button size='small'
                        type='plain'
                        className="btn_red"
                        onClick={this.handel_del_question.bind(this, item)}>删除</Button>
              </div>
              <div className="form_box">
                <div className="form_item">
                  <div className="item_label">题目{index + 1}：</div>
                  <div className="item_value">{item.title}</div>
                </div>
                <div className="form_item">
                  <div className="item_label">选项类型：</div>
                  <div className="item_value">{item.select_count > 1 ? '多选' : '单选'}</div>
                </div>
                {item.options.map((childItem, childIndex) => {
                  return <div className="form_item" key={`${index}-${childIndex}`}>
                    <div className="item_label">选项{childIndex + 1}：</div>
                    <div className="item_value">{childItem.title}
                      {childItem.is_true === '1' ? (
                        <div className="right_checkbox">
                          <Checkbox disabled={true} checked={Boolean(childItem.is_true === '1')}>正确答案</Checkbox>
                        </div>
                      ) : ''}
                    </div>
                  </div>
                })}
              </div>
            </div>
          })}
        </div>
        <div className="noData" onClick={this.handel_addQuestion}>添加问题</div>

        {/*编辑弹框*/}
        <Dialog
          title='编辑问题'
          visible={ dialogVisible }
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="题目名称" prop="title">
                <Input value={form.title}
                       maxLength={16}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'title', 'form')}
                       autoComplete="off"/>
                <span className="limitNum">{form.title.length} / 16</span>
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
                    {/*<Radio value="1" checked={this.state.is_true === 1}*/}
                    {/*onChange={this.handel_changeRight.bind(this, index)}>正确答案</Radio>*/}
                    <div className="right_checkbox">
                      <Checkbox checked={Boolean(item.is_true)} onChange={this.handel_changeRight.bind(this, index)}>正确答案</Checkbox>
                    </div>
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