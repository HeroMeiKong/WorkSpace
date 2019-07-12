import React, {Component} from 'react';
import {Message, Notification, Button, Table, Dialog, Tabs, Switch, Form, Input, MessageBox} from 'element-react';
import Ks3Upload from '@/components/Ks3Upload';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
import './index.scss'

/*互动打赏*/
export default
class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '', // 直播id
      activeId: '',
      dialogVisible: false,
      dialogVisible_money: false, // 地址弹框
      page_size: 6,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,         // 总数
      data: [],
      moneyData: [],
      giftData: [],
      activeTab: 'money',
      open_gift: '',
      open_money: '',
      form_money: {},
      form_gift: {
        id: '',
        title: '',
        price: '',
        icon: ''
      },
      rules: {
        price: {required: true, message: '金额不能为空', trigger: 'blur'},
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        icon: {required: true, message: '图片不能为空', trigger: 'blur'},
      },
      columns_money: [
        {
          label: "ID",
          prop: "id",
          // width: 100
        },
        {
          label: "名称",
          prop: 'title'
        },
        {
          label: "金额",
          prop: 'price'
        },
        {
          label: "操作",
          align: 'center',
          render: (row, style, index) => {

            return (
              <span>
                <Button type='text'
                        onClick={this.handel_editMoney.bind(this, row, index)}>编辑</Button>
            </span>
            )
          }
        }
      ],
      columns_gift: [
        {
          label: "ID",
          prop: "id",
          // width: 100
        },
        {
          label: "图片",
          prop: 'icon',
          width: '160',
          align: 'center',
          render: (row) => {
            return <div className="table_image">{row.icon ? <img src={row.icon} alt=""/> : ""}</div>
          }
        },
        {
          label: "礼物名称",
          prop: 'title'
        },
        {
          label: "礼物金额",
          prop: 'price'
        },
        {
          label: "状态",
          prop: 'status',
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
                        onClick={this.handel_editGift.bind(this, row, index)}>编辑</Button>
                  <div className="divider_line"/>
                  {row.status === '1' ? <Button type='text'
                                                className="btn_red"
                                                onClick={this.handel_giftStatus.bind(this, row, 'offline')}>下架</Button> :
                    <Button type='text'
                            onClick={this.handel_giftStatus.bind(this, row, 'online')}>上架</Button>}
            </span>
            )
          }
        }
      ],
    };
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


  componentDidMount() {

  }

  getList = () => {
    const {activeTab} = this.state;
    httpRequest({
      url: api.giftListAll,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        type: activeTab
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        const packageDetail = resp.data.package || {};
        if (activeTab === 'money') {
          this.setState({
            moneyData: resp.data.list || [],
            open_money: packageDetail.open_money / 1
          })
        } else if (activeTab === 'gift') {
          this.setState({
            giftData: resp.data.list || [],
            open_gift: packageDetail.open_gift / 1
          })
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
  // 金额编辑
  handel_editMoney = (row) => {
    this.handleReset('ruleForm_money');
    const form_money = {
      id: row.id,
      price: row.price,
    };
    this.setState({
      dialogVisible_money: true,
      form_money
    })
  };
  // 礼物编辑
  handel_editGift = (row) => {
    this.handleReset('ruleForm_money');
    const form = {
      id: row.id,
      price: row.price,
      icon: row.icon,
      title: row.title,
    };
    this.setState({
      dialogVisible_gift: true,
      form_gift: form
    })
  };
  handel_giftStatus = (row, type) => {
    let typeName = '上架';
    if (type === 'offline') {
      typeName = '下架';
    }
    this.sure_again({
      content: `确认${typeName}此礼物吗？`,
      callback: this.del_ajax.bind(this, row, type)
    })
  };
  // 删除礼物
  del_ajax = (row, type) => {
    httpRequest({
      url: api.giftStatus,
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
      data: {
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
  //tabs切换
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    }, () => {
      this.getList()
    })
  };
  // 修改状态
  _onChange_status = (key, value) => {
    this.setState({
      [key]: value
    });
    this.setManStatus(key, value);
  };
  setManStatus = (key, value) => {
    const {activeTab} = this.state;
    let status = '0';
    if (value) {
      status = '1';
    }
    httpRequest({
      url: api.openGift,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        type: activeTab,
        status: status,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success('操作成功!');
      } else {
        Message.error(resp.msg);
        this.setState({
          [key]: !value
        })
      }
    }).fail(err => {
      this.setState({
        [key]: !value
      });
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  close_dialog_gift = () => {
    this.setState({
      dialogVisible_gift: false
    })
  };
  handleSubmit_gift = () => {
    this.validate_form('ruleForm_gift', () => {
      const {form_gift} = this.state;
      const price = window.parseFloat(form_gift.price);
      if (price < 0.01) {
        Message.warning('金额不能小于0.01元');
        return false;
      }
      this.editAjax({
        id: form_gift.id,
        icon: form_gift.icon,
        title: form_gift.title,
        price: price,
        type: 'gift',
      });
    })
  };
  close_dialog_money = () => {
    this.setState({
      dialogVisible_money: false
    })
  };
  handleSubmit_money = () => {
    this.validate_form('ruleForm_money', () => {
      const {form_money} = this.state;
      const price = window.parseFloat(form_money.price);
      if (price < 0.01) {
        Message.warning('红包金额不能小于0.01元');
        return false;
      }
      this.editAjax({
        id: form_money.id,
        icon: '',
        title: '',
        price: price,
        type: 'money',
      });
    })
  };
  editAjax = (data) => {
    this.setState({
      is_updating: false
    })
    httpRequest({
      url: api.editGift,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        id: data.id,
        icon: data.icon,
        title: data.title,
        price: data.price,
        type: data.type,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success('操作成功');
        this.setState({
          dialogVisible_money: false,
          dialogVisible_gift: false,
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

  render() {
    const {
      activeTab,
      giftData,
      moneyData,
      open_money,
      open_gift,
      dialogVisible_money,
      form_money,
      dialogVisible_gift,
      form_gift,
      is_updating
    } = this.state;
    return (
      <div className="goods_page">
        <Tabs activeName={activeTab} onTabClick={ this.changeTabs}>
          <Tabs.Pane label="红包打赏" name="money">
            <div className="btn_switch">是否开启红包打赏：
              <Switch
                onText="开"
                offText="关"
                onChange={this._onChange_status.bind(this, 'open_money')}
                value={Boolean(open_money)}
              />
            </div>
            <Table
              columns={this.state.columns_money}
              data={moneyData}
              stripe={true}
            />
          </Tabs.Pane>
          <Tabs.Pane label="礼物打赏" name="gift">
            <div className="btn_switch">是否开启红包打赏：
              <Switch
                onText="开"
                offText="关"
                onChange={this._onChange_status.bind(this, 'open_gift')}
                value={Boolean(open_gift)}
              />
            </div>
            <Table
              columns={this.state.columns_gift}
              data={giftData}
              stripe={true}
            />
          </Tabs.Pane>
        </Tabs>

        {/*红包打赏配置*/}
        <Dialog
          title='红包打赏配置'
          visible={ dialogVisible_money }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_money }
        >
          <Dialog.Body>
            <Form model={form_money}
                  ref="ruleForm_money"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="金额" prop="price">
                <p className="tips">金额不能少于 0.01 元</p>
                <Input value={form_money.price}
                       type='number'
                       placeholder=''
                       onChange={this._onChange.bind(this, 'price', 'form_money')}
                       append="元"
                       autoComplete="off"/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_money }>取 消</Button>
            <Button type="primary"
                    loading={is_updating}
                    onClick={ this.handleSubmit_money}>{is_updating ? '提交中' : '确 认'}</Button>

          </Dialog.Footer>
        </Dialog>
        {/*礼物打赏配置*/}
        <Dialog
          title='礼物打赏配置'
          visible={ dialogVisible_gift }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_gift }
        >
          <Dialog.Body>
            <Form model={form_gift}
                  ref="ruleForm_gift"
                  rules={this.state.rules}
                  labelWidth="80">
              <Form.Item label="名称" prop="title">
                <Input value={form_gift.title}
                       placeholder=''
                       onChange={this._onChange.bind(this, 'title', 'form_gift')}
                       maxLength={6}
                       autoComplete="off"/>
                <span className="limitNum">{form_gift.title.length} / 6</span>
              </Form.Item>
              <Form.Item label="金额" prop="price">
                <p className="tips">金额不能少于 0.01 元</p>
                <Input value={form_gift.price}
                       type='number'
                       placeholder=''
                       onChange={this._onChange.bind(this, 'price', 'form_gift')}
                       append="元"
                       autoComplete="off"/>
              </Form.Item>
              <Form.Item label="图片" prop="icon">
                <Ks3Upload cover={form_gift.icon}
                           successCallBack={this._onChange.bind(this, 'icon', 'form_gift')}/>
                <span className="min_tips">(建议尺寸 88 * 88)</span>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_gift }>取 消</Button>
            <Button type="primary"
                    loading={is_updating}
                    onClick={ this.handleSubmit_gift}>{is_updating ? '提交中' : '确 认'}</Button>

          </Dialog.Footer>
        </Dialog>

      </div>
    );
  }
}