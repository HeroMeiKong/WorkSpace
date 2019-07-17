import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Pagination,
  Table,
  Message,
  Notification,
  MessageBox
} from 'element-react'
import tools from '@/utils/tool'
import moment from 'moment';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
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
          label: "题库名称",
          prop: "title",
          // width: 260,
        },
        {
          label: "使用状态",
          render: (row) => {
            return row.use_times > 0 ? '已使用' : <span style={{color: 'red'}}>未使用</span>
          }
        },
        // {
        //   label: "答题人数",
        //   prop: "choose_count",
        //   // width: 260,
        // },
        {
          label: "使用次数",
          prop: "use_times",
          width: 180,
        },

        {
          label: "操作",
          width: 200,
          align: 'center',
          render: (row) => {
            // const result_url = this.props.history.location.pathname + '/result?id=' + row.id;
            const edit_url = this.props.history.location.pathname + '/edit?id=' + row.id;
            const detail_url = this.props.history.location.pathname + '/detail?id=' + row.id;
            return (<div style={{textAlign: 'left'}}>
                <Link to={detail_url}>
                  <Button type='text'>查看</Button>
                </Link>
                 <div className="divider_line"/>
                <Button className="btn_red"
                        onClick={this.handel_del.bind(this, row)}
                        type='text'>删除</Button>
                {row.use_times > 0 ? '' :  (<span>
                  <Link to={edit_url}>
                        <div className="divider_line"/>
                  <Button type='text'>编辑</Button>
                 </Link>
                </span>)}
              </div>
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
      url: api.questionList,
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
      content: `确认删除题库《${row.title}》嘛？`,
      callback: this.del_ajax.bind(this, row, 'delete')
    })
  };
  del_ajax = (row, status) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.questionMainStatus,
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
    const url = this.props.history.location.pathname + '/edit?id=0';
    this.props.history.push(url);
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
    const {page_size, current_page, total} = this.state;

    return (
      <div className="vote_wrapper">
        <div className="clearfix" style={{marginBottom: '10px'}}>
          <Button style={{float: 'right'}}
                  type='primary'
                  icon="plus"
                  onClick={this.handelAdd}>新建题库</Button>
        </div>
        <Table
          columns={this.state.columns}
          data={this.state.data}
          // border={true}
          height={500}
          stripe={true}
        />
        <div className="pagination_wrapper">
          <Pagination layout="total, prev, pager, next, jumper"
                      pageSize={page_size}
                      currentPage={current_page}
                      total={total}
                      onCurrentChange={this.currentChange}
          />
        </div>
      </div>
    );
  }
}