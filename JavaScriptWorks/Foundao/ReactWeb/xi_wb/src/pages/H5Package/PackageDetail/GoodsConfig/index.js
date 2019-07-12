import React, {Component} from 'react';
import {Message, Notification, Button, Table, Pagination, Dialog, Form, Input, MessageBox} from 'element-react';
import Ks3Upload from '@/components/Ks3Upload';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
import tool from '@/utils/tool'
import './index.scss'

/*商品配置*/
export default
class GoodsConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '', // 直播id
      activeId: '',
      dialogVisible: false,
      dialogVisible_address: false, // 地址弹框
      page_size: 10,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,         // 总数
      data: [],
      form: {
        id: '',
        title: '',
        cover: '',
        price: '',
        jump_url: '',
        taobao_pass: '',
        images: []
      },
      rules: {
        price: {required: true, message: '金额不能为空', trigger: 'blur'},
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        cover: {required: true, message: '图片不能为空', trigger: 'blur'},
        jump_url: {required: true, message: '链接不能为空', trigger: 'blur'},
      },
      columns: [
        {
          label: "ID",
          prop: "id",
          width: 100
        },
        {
          label: "商品图",
          prop: "cover",
          width: 140,
          render: (row) => {
            return <div className="table_image">{row.cover ?
              <img src={row.cover} alt=""/> : ""}</div>
          }
        },
        {
          label: "商品名称",
          prop: 'title'
        },
        {
          label: "商品价格",
          prop: 'price',
          width: 100,
        },
        {
          label: "商品链接",
          prop: 'jump_url'
        },
        {
          label: "状态",
          prop: 'status',
          width: 80,
          render: (row) => {
            return row.status === '1' ? '已上架' : <span style={{color: 'red'}}>已下架</span>
          }
        },
        {
          label: "操作",
          align: 'center',
          render: (row, style, index) => {
            return (
              <span>
                <Button type='text'
                        onClick={this.handel_edit.bind(this, row, index)}>编辑</Button>
                  <div className="divider_line"/>
                {row.status === '1' ? <Button type='text'
                                              className="btn_red"
                                              onClick={this.handel_status.bind(this, row, 'offline')}>下架</Button> :
                  <Button type='text'
                          onClick={this.handel_status.bind(this, row, 'online')}>上架</Button>}
                <div className="divider_line"/>
                <Button type='text'
                        className="btn_red"
                        onClick={this.handel_status.bind(this, row, 'del')}>删除</Button>

            </span>
            )
          }
        }
      ],
    }
    this.intervalTimerArr = [];
    this.timeoutTimer = null;
  }

  componentWillMount() {
    const {search = ''} = this.props.location;
    const params = tool.getParams(search);
    const {page} = params;
    const {packageID} = this.props.match.params;
    this.setState({
      packageID: packageID || '',
      current_page: page ? page / 1 : 1,
    }, () => {
      this.getList();
    });
  };


  componentDidMount() {

  }

  getList = () => {
    const {page_size, current_page} = this.state;
    httpRequest({
      url: api.goodsList,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        page: current_page,
        limit: page_size,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list || [],
          total: resp.data.total || 0
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
  // onchange
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
  // 编辑
  handel_edit = (row) => {
    this.handleReset('ruleForm');
    const form = {
      id: row.id,
      title: row.title,
      cover: row.cover,
      price: row.price,
      jump_url: row.jump_url,
      taobao_pass: row.taobao_pass,
      images: `[]`
    };
    this.setState({
      dialogVisible: true,
      form: form
    })
  };
  handel_status = (row, type) => {
    let typeName = '上架';
    if (type === 'offline') {
      typeName = '下架';
    } else if (type === 'del') {
      typeName = '删除';
    }
    this.sure_again({
      content: `确认${typeName}此商品吗？`,
      callback: this.del_ajax.bind(this, row, type)
    })
  };
  // 删除礼物
  del_ajax = (row, type) => {
    httpRequest({
      url: api.goodStatus,
      type: 'post',
      data: {
        id: row.id,
        type: type,
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
    })
  };

  // 新增直播包装
  handelAdd = () => {
    this.handleReset('ruleForm');
    const form = {
      id: '',
      title: '',
      cover: '',
      price: '',
      jump_url: '',
      taobao_pass: '',
      images: []
    };
    this.setState({
      form,
      dialogVisible: true
    })
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
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {form} = this.state;
      const price = window.parseFloat(form.price);
      if (price < 0.01) {
        Message.warning('金额不能小于0.01元');
        return false;
      }
      this.editAjax(form);
    })
  };
  editAjax = (data) => {
    this.setState({
      is_updating: false
    })
    httpRequest({
      url: api.editGood,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        id: data.id,
        cover: data.cover,
        title: data.title,
        price: data.price,
        status: '1',
        jump_url: data.jump_url,
        taobao_pass: data.taobao_pass,
        images: `[]`
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success('操作成功');
        this.setState({
          dialogVisible: false,
        });
        this.getList();
      } else {
        Message.error(resp.msg);
      }
      this.setState({
        is_updating: false
      })
    }).fail(err => {
      this.setState({
        is_updating: false
      })
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
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
    const {page_size, current_page, total, is_updating, form, dialogVisible} = this.state;
    return (
      <div className="goods_page">
        <div className="list_head clearfix">
          <Button style={{float: 'right'}}
                  type='primary'
                  icon="plus"
                  onClick={this.handelAdd}>新增</Button>
        </div>

        <Table
          className="package_list_table"
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

        {/*新增商品*/}
        <Dialog
          title='商品编辑'
          visible={ dialogVisible}
          closeOnClickModal={false}
          onCancel={ this.close_dialog }
        >
          <Dialog.Body>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="名称" prop="title">
                <Input value={form.title}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'title', 'form')}
                       maxLength={20}
                       autoComplete="off"/>
                <span className="limitNum">{form.title.length} / 20</span>
              </Form.Item>
              <Form.Item label="金额" prop="price">
                <p className="tips">金额不能少于 0.01 元</p>
                <Input value={form.price}
                       type='number'
                       placeholder=''
                       onChange={this._onChange.bind(this, 'price', 'form')}
                       append="元"
                       autoComplete="off"/>
              </Form.Item>
              <Form.Item label="商品链接" prop="jump_url">
                <Input value={form.jump_url}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'jump_url', 'form')}
                       autoComplete="off"/>
              </Form.Item>
              <Form.Item label="淘口令" prop="taobao_pass">
                <Input value={form.taobao_pass}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'taobao_pass', 'form')}
                       autoComplete="off"/>
                <span className="min_tips">
                  <span className="min_tips red">淘宝商品可填写淘口令</span> &nbsp;&nbsp;&nbsp;&nbsp;
                  用户可复制淘口令后打开淘宝查看商品
                </span>
              </Form.Item>
              <Form.Item label="图片" prop="cover">
                <Ks3Upload cover={form.cover}
                           successCallBack={this._onChange.bind(this, 'cover', 'form')}/>
                <span className="min_tips">(建议尺寸 200 * 200)</span>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog }>取 消</Button>
            <Button type="primary"
                    loading={is_updating}
                    onClick={ this.handleSubmit}>{is_updating ? '提交中' : '确 认'}</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}