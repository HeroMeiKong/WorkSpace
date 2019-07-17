import React, {Component} from 'react';
import {
  Tabs,
  Input,
  Form,
  Button,
  Dialog,
  Switch,
  Table,
  Radio,
  Message,
  Notification,
  MessageBox
} from 'element-react';
import httpRequest from '@/utils/httpRequest';
import Upload from '@/components/Ks3Upload';
import tools from '@/utils/tool';
import api from '@/API/api'
import './index.scss';
const positionList = [
  {name: '左上', value: 'left-top'},
  {name: '左下', value: 'left-bottom'},
  {name: '右上', value: 'right-top'},
  {name: '右下', value: 'right-bottom'},
];

/*推广设置*/
export default
class Marketing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageID: '',
      activeTab: '1',
      form: {
        cover: '',
        title: '',
        intro: '',
      },
      pageData: [],
      stopData: [],
      windowData: [],
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        cover: {required: true, message: '图片不能为空', trigger: 'blur'},
        intro: {required: true, message: '描述不能为空', trigger: 'blur'},

        image: {required: true, message: '图片不能为空', trigger: 'blur'},
        jump_url: {required: true, message: '链接不能为空', trigger: 'blur'},
        position: {required: true, message: '位置不能为空', trigger: 'blur'},
      },
      form_ad: {
        image: '',
        jump_url: ''
      },
      page_status: false,
      stop_status: false,
      window_status: false,
      adData: [],
      columns_page: [
        {
          label: "ID",
          width: 80,
          prop: "id"
        },
        {
          label: "图片",
          width: 140,
          align: 'center',
          render: (row) => {
            return <div className="table_image">{row.image ? <img src={row.image} alt=""/> : ""}</div>
          }
        },
        {
          label: "广告链接",
          minWidth: 130,
          prop: "jump_url"
        },
        {
          label: "操作",
          width: 160,
          align: 'center',
          render: (row) => {
            return (
              <span>
                  <Button type='text'
                          onClick={this.handel_edit.bind(this, row, 'page')}>编辑</Button>
                  <div className="divider_line"/>
                  <Button type='text'
                          className='btn_red'
                          onClick={this.handel_del.bind(this, row)}>删除</Button>
                </span>
            )
          }
        }
      ],
      columns_stop: [
        {
          label: "ID",
          width: 80,
          prop: "id"
        },
        {
          label: "图片",
          width: 140,
          align: 'center',
          render: (row) => {
            return <div className="table_image">{row.image ? <img src={row.image} alt=""/> : ""}</div>
          }
        },
        {
          label: "广告链接",
          minWidth: 130,
          prop: "jump_url"
        },
        {
          label: "操作",
          width: 160,
          align: 'center',
          render: (row) => {

            return (
              <span>
                  <Button type='text'
                          onClick={this.handel_edit.bind(this, row, 'stop')}>编辑</Button>
                      <div className="divider_line" />
                <Button type='text'
                        className='btn_red'
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
                </span>
            )
          }
        }
      ],
      columns_window: [
        {
          label: "ID",
          width: 80,
          prop: "id"
        },
        {
          label: "图片",
          width: 140,
          align: 'center',
          render: (row) => {
            return <div className="table_image">{row.image ? <img src={row.image} alt=""/> : ""}</div>
          }
        },
        {
          label: "广告链接",
          minWidth: 130,
          prop: "jump_url"
        },
        {
          label: "操作",
          width: 160,
          align: 'center',
          render: (row) => {

            return (
              <span>
                  <Button type='text'
                          onClick={this.handel_edit.bind(this, row, 'window')}>编辑</Button>
                      <div className="divider_line" />
                <Button type='text'
                        className='btn_red'
                        onClick={this.handel_del.bind(this, row)}>删除</Button>
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
    this.setState({
      packageID: packageID,
      activeTab: params.tab || '1'
    }, () => {
      this.getData()
    })
  }

  componentWillUnmount() {

  }

  getData = () => {
    const {activeTab} = this.state;
    if (activeTab === '2') {
      this.getAdDetail()
    } else {
      this.getDetail();
    }
  };

  // onchange
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };
  // onchange
  _onChange_status = (key, value) => {
    this.setState({
      [key]: value
    });
    this.setManStatus(key, value);
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
  //点击上方导航栏
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    }, () => {
      this.getData()
    });
  };
  setManStatus = (key, value) => {
    const {adData} = this.state;
    let type = 'off';
    if (value) {
      type = 'on';
    }
    let id = '';
    if (key === 'page_status') {
      id = adData[0].id
    } else if (key === 'stop_status') {
      id = adData[1].id
    } else if (key === 'window_status') {
      id = adData[2].id
    }
    httpRequest({
      url: api.ad_mainStatus,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        id: id,
        type: type,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
      } else {
        Message.error(resp.msg);
        this.setState({
          [key]: !value
        })
      }
    }).fail(err => {
      this.setState({
        [key]: !value
      })
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  // 配置详情
  getDetail = () => {
    httpRequest({
      url: api.packageDetail,
      type: 'post',
      data: {
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        const packageInfo = resp.data.package;
        const form = {
          cover: packageInfo.share_cover,
          title: packageInfo.share_title,
          intro: packageInfo.share_intro,
        };
        this.setState({
          form
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
  // 广告详情
  getAdDetail = () => {
    httpRequest({
      url: api.ad_list,
      type: 'post',
      data: {
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        if (resp.data) {
          const pageData = resp.data[0].ads;
          const page_status = resp.data[0].status === '1';
          const stopData = resp.data[1].ads;
          const stop_status = resp.data[1].status === '1';
          const windowData = resp.data[2].ads;
          const window_status = resp.data[2].status === '1';
          this.setState({
            pageData,
            stopData,
            windowData,
            page_status,
            stop_status,
            window_status,
            adData: resp.data
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
  handel_edit = (row, type) => {
    const form = {...row, adType: type}

    this.setState({
      dialogVisible_ad: true,
      form_ad: form
    })
  };
  // 删除广告
  handel_del = (row) => {
    this.sure_again({
      content: '确认删除嘛？',
      callback: this.statue_ajax.bind(this, row)
    })
  };
  statue_ajax = (row) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.ad_status,
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
        this.getData();
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
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {packageID, form} = this.state;
      httpRequest({
        url: api.editShare,
        type: 'post',
        data: {
          id: packageID,
          share_cover: form.cover,
          share_title: form.title,
          share_intro: form.intro,
        }
      }).done((resp) => {
        if (resp.code === '0') {
          this.setState({
            dialogVisible: false
          });
          Message.success('设置成功');
          this.getDetail();
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
  // 新增页面广告
  handelAdd_ad = (type) => {
    this.handleReset('ruleForm_ad');
    const form = {
      id: '',
      image: '',
      jump_url: '',
      small_cover: '',
      position: 'right-bottom',
      adType: type
    };
    this.setState({
      dialogVisible_ad: true,
      form_ad: form
    })
  };
  close_dialog_ad = () => {
    this.setState({
      dialogVisible_ad: false,
    })
  };
  handleSubmit_ad = () => {
    this.validate_form('ruleForm_ad', () => {
      const {adData, packageID, form_ad} = this.state;
      this.setState({
        is_updating: true
      });
      let data = {
        id: form_ad.id,
        h5_id: packageID,
        pid: adData[0].id,
        image: form_ad.image,
        content: form_ad.content,
        jump_url: form_ad.jump_url,
        position: form_ad.position,
      };
      if (form_ad.adType === 'page') {
        data.pid = adData[0].id;
      } else if (form_ad.adType === 'stop') {
        data.pid = adData[1].id;
      } else if (form_ad.adType === 'window') {
        data.pid = adData[2].id;
      }
      this.edit_ajax(data);
    });
  };

  edit_ajax = (data) => {

    httpRequest({
      url: api.ad_edit,
      type: 'post',
      data: {...data}
    }).done((resp) => {
      if (resp.code === '0') {
        this.setState({
          dialogVisible_ad: false
        });
        Message.success('设置成功');
        this.getAdDetail();
      } else {
        Message.error(resp.msg)
      }
      this.setState({
        is_updating: false
      });
    }).fail(jqXHR => {
      this.setState({
        is_updating: false
      });
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
  };

  render() {
    const {activeTab, form, dialogVisible_ad, form_ad, page_status, stop_status, window_status, is_updating} = this.state;
    return (
      <div className="market_set">
        <Tabs activeName={activeTab} onTabClick={this.changeTabs}>
          <Tabs.Pane label='微信分享' name='1'>
            <h3>基础信息</h3>
            <Form model={form}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="100">
              <Form.Item label='分享图标：' prop='cover'>
                <Upload cover={form.cover}
                        successCallBack={this._onChange.bind(this, 'cover', 'form')}/>
                <span className="min_tips">(建议尺寸 100 * 100)</span>
              </Form.Item>

              <Form.Item label="分享标题：" prop="title">
                <Input value={form.title}
                       onChange={this._onChange.bind(this, 'title', 'form')}
                       placeholder='输入标题'
                       maxLength={16}
                       autoComplete="off"/>
                <span className="limitNum">{form.title.length} / 16</span>
              </Form.Item>

              <Form.Item label="分享描述：">
                <Input value={form.intro}
                       onChange={this._onChange.bind(this, 'intro', 'form')}
                       type='textarea'
                       autosize={{minRows: 3}}
                       maxLength={30}
                       autoComplete="off"/>
                <span className="limitNum">{form.intro.length} / 30</span>
              </Form.Item>
              <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary"
                        onClick={ this.handleSubmit}>确 认</Button>
              </Form.Item>
            </Form>
            <h3>分享预览</h3>
            <div className="share_preview clearfix">
              <div className="share_block">
                <p>分享给好友：</p>
                <div className="share_demo appMessage">
                  <div className="user_avatar"/>
                  <div className="share_content">
                    <div className="share_msg clearfix">
                      <h4>{form.title}</h4>
                      <div className="share_img" style={{backgroundImage: `url(${form.cover})`}}/>
                      <div className="share_desc limit-line3">{form.intro}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="share_block">
                <p>分享到朋友圈：</p>
                <div className="share_demo timeLine">
                  <div className="user_avatar"/>
                  <div className="share_content">
                    <div className="user_name">微信昵称</div>
                    <div className="share_msg clearfix">
                      <div className="share_img" style={{backgroundImage: `url(${form.cover})`}}/>
                      <p className="share_desc limit-line2">{form.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Pane>
          <Tabs.Pane label='广告设置' name='2'>
            {/**/}
            <div className="ad_block">
              <div className="operate_header clearfix">
                <h2>benner广告</h2>
                <Switch
                  // checked={form.showRobot}
                  onText="开"
                  offText="关"
                  value={page_status}
                  onChange={this._onChange_status.bind(this, 'page_status')}/>
                <span className="tips">每5秒，页面会自动切换广告</span>
                <Button style={{float: 'right'}}
                        type='primary'
                        icon="plus"
                        disabled={this.state.pageData.length > 4}
                        onClick={this.handelAdd_ad.bind(this, 'page')}>添加广告</Button>
              </div>
              <Table
                columns={this.state.columns_page}
                data={this.state.pageData}
                border={true}
                stripe={true}
                align='center'
                onSelectChange={this.selectChange}
              />
            </div>
            {/*暂停广告*/}
            <div className="ad_block">
              <div className="operate_header clearfix">
                <h2>暂停广告</h2>
                <Switch
                  // checked={form.showRobot}
                  onText="开"
                  offText="关"
                  value={stop_status}
                  onChange={this._onChange_status.bind(this, 'stop_status')}/>
                <Button style={{float: 'right'}}
                        type='primary'
                        icon="plus"
                        disabled={this.state.stopData.length > 0}
                        onClick={this.handelAdd_ad.bind(this, 'stop')}>添加广告</Button>
              </div>
              <Table
                columns={this.state.columns_stop}
                data={this.state.stopData}
                border={true}
                stripe={true}
                align='center'
                onSelectChange={this.selectChange}
              />
            </div>
            {/*悬浮广告*/}
            <div className="ad_block">
              <div className="operate_header clearfix">
                <h2>悬浮广告</h2>
                <Switch
                  // checked={form.showRobot}
                  onText="开"
                  offText="关"
                  value={window_status}
                  onChange={this._onChange_status.bind(this, 'window_status')}/>

                <Button style={{float: 'right'}}
                        type='primary'
                        icon="plus"
                        disabled={this.state.windowData.length > 0}
                        onClick={this.handelAdd_ad.bind(this, 'window')}>添加广告</Button>
              </div>
              <Table
                columns={this.state.columns_window}
                data={this.state.windowData}
                border={true}
                stripe={true}
                align='center'
                onSelectChange={this.selectChange}
              />
            </div>


          </Tabs.Pane>
        </Tabs>

        {/*页面广告*/}
        <Dialog
          title='广告配置'
          visible={ dialogVisible_ad }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_ad }
        >
          <Dialog.Body>
            <Form model={form_ad}
                  ref="ruleForm_ad"
                  rules={this.state.rules}
                  labelWidth="120">
              <Form.Item label='广告图片' prop='image'>
                <Upload cover={form_ad.image}
                        successCallBack={this._onChange.bind(this, 'image', 'form_ad')}/>
                {form_ad.adType === 'page' ? <span className="min_tips">(建议尺寸 750 * 108)</span> : ''}
                {form_ad.adType === 'stop' ? <span className="min_tips">(建议尺寸 490 * 630)</span> : ''}
                {form_ad.adType === 'window' ? <span className="min_tips">(建议尺寸 150 * 150)</span> : ''}
              </Form.Item>

              <Form.Item label="跳转链接" prop="jump_url">
                <Input value={form_ad.jump_url}
                       placeholder='跳转链接'
                       onChange={this._onChange.bind(this, 'jump_url', 'form_ad')}
                       autoComplete="off"/>
              </Form.Item>

              {form_ad.adType === 'window' ? (
                <Form.Item label='广告位置' prop='position'>
                  <Radio.Group
                    value={form_ad.position}
                    onChange={this._onChange.bind(this, 'position', 'form_ad')}>
                    {
                      positionList.map((item, index) =>
                        <Radio key={index} value={item.value}>
                          {item.name}
                        </Radio>
                      )
                    }
                  </Radio.Group>
                </Form.Item>
              ) : ''}
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_ad }>取 消</Button>
            <Button type="primary"
                    loading={is_updating}
                    onClick={ this.handleSubmit_ad}>{is_updating ? '提交中' : '确 认'}</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}