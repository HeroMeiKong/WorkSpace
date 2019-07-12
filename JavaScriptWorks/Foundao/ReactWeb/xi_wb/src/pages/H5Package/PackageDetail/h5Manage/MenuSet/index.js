import React, {Component} from 'react';
import {Tabs, Button, Dialog, Table, Input, Message, Notification, Loading, Form, MessageBox} from 'element-react'

import tool from '@/utils/tool';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
import {menuType} from '../../../../H5Package/config'
import Upload from '@/components/Ks3Upload';
import './index.scss'
/*菜单设置*/
export default
class MenuSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: ' ',  // 直播介绍: intro  图文直播: it  评论互动:comment  聊天互动: chat  视频: video   榜单排行:rank
      dialogVisible: false, //菜单管理弹框
      dialogVisible_videoEdit: false, //视频编辑弹框
      is_updating: false,
      packageID: '',  //H5id
      is_loading: false,
      menuNameAry: [], //保存输入的菜单名称的数组
      currentMenuList: [], //当前显示的菜单列表
      menuMangerForm: [],//菜单管理
      videoEditForm: {
        title: '',  //视频名称
        cover: '',  //视频封面链接
        video_url: '' //视频链接
      },
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        cover: {required: true, message: '封面不能为空', trigger: 'blur'},
        video_url: {required: true, message: '视频不能为空', trigger: 'blur'},
      },
      //视频编辑弹框表单
      videoData: [], //精彩视频数据
      columns: [
        {
          label: "菜单名称",
          prop: "menuType",
          // width: 260,
          minWidth: '180',
          render: (row, style, index) => {
            return (<div className='adPositionTbox'>
              <Input placeholder=""
                     trim={true}
                     value={row.title}
                     className='ele_input'
                     maxLength={4}
                     autoComplete="off"
                     onChange={this.onChangeInput.bind(this, row, index)}/>
              <span>{row.title.length} / 4</span>
            </div>)
          }
        },
        {
          label: "菜单类型",
          prop: "menuType",
          minWidth: 110,
          // minWidth: '180',
          render: (row) => {
            let name = ''
            menuType.forEach((item) => {
              if (row.type === item.value) {
                name = item.name
              }
            })
            return <span>{name }</span>
          }
        },
        {
          label: "操作",
          align: 'center',
          minWidth: '180',
          render: (row) => {
            let id = row.id
            return (
              <div style={{textAlign: 'left'}}>
                {row.type !== 'rank' ? <span>
                  {row.status / 1 === 1 ? <span>
                      <span>
                        <Button type='text'
                                className='btn_red'
                                onClick={this.clickMenuStatus.bind(this, 'stop', id)}>停用</Button>
                         <div className="divider_line"/>
                        {row.is_master / 1 === 0 ?
                          <Button type='text'
                                  onClick={this.clickMenuStatus.bind(this, 'master', id)}>设为默认菜单</Button>
                          : <Button type='text'
                                    className='btn_red'
                                    onClick={this.clickMenuStatus.bind(this, 'cur_master', id)}>当前默认菜单</Button>}
                </span>
                    </span>
                    : <Button type='text'
                              onClick={this.clickMenuStatus.bind(this, 'start', id)}>启用</Button>}
                </span> : '暂未开放' }
              </div>
            )
          }
        }
      ],
      videoColumns: [
        {
          label: "视频名称",
          prop: "title",
          // width: 160
        },
        {
          label: "封面图",
          prop: "cover",
          width: 140,
          render: (row) => {
            return <div className="table_image">{row.cover ?
              <img src={row.cover} alt=""/> : ""}</div>
          }
        },
        // {
        //   label: "视频地址",
        //   prop: "url",
        //   // minWidth: 200
        // },
        {
          label: "操作",
          // width: 140,
          render: (row) => {
            return (
              <span>
                <Button type='text' onClick={this.videoEdit.bind(this, row)}>编辑</Button>
                <Button type='text' onClick={this.videoDel.bind(this, row)}>删除</Button>
              </span>
            )
          }
        }
      ]
    };
  }

  componentWillMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID: packageID
    }, () => {
      this.getList()
    })
  }

  componentDidMount() {

  }

  getList = () => {
    this.setState({
      is_loading: true,
      activeTab: ' ',
      // menuMangerForm: [],
    });
    httpRequest({
      url: api.menuSetList,
      type: 'post',
      data: {
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      let menuList = resp.data.list;
      if (resp.code / 1 === 0) {
        this.setState({
          menuMangerForm: menuList,
          is_loading: false
        });
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
  // 获取视频列表
  getVideoList = () => {
    httpRequest({
      url: api.videoList,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        page: 1,
        limit: 100
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          videoData: resp.data.list
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

  componentWillUnmount() {
    tool.hide_loading()
  }

  filterMenu = () => {
    const {menuMangerForm} = this.state;
    const currentMenuList = menuMangerForm.filter(item => {
      return item.status === '1'
    });

    // let activeTabName = 'activeTab';
    // if (currentMenuList.length > 0) {
    //   const activeTabItem = currentMenuList.find(item => {
    //     return item.type === activeTab
    //   });
      // if (activeTabItem) {
      //   activeTabName = activeTab;
      // } else {
      //   activeTabName = currentMenuList[0].type;  // 默认选中第一个
      // }
    // }
    return JSON.parse(JSON.stringify(currentMenuList));
  };
  //点击上方导航栏
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    });
    if (tab.props.name === 'video') {
      this.getVideoList();
    }
  };


  menuManger = () => {
    this.setState({
      dialogVisible: true
    })
  };

  //input change事件
  onChangeInput = (row, index, value) => {

    const menuMangerForm = [...this.state.menuMangerForm]
    menuMangerForm[index].title = value;
    this.setState({
      menuMangerForm: menuMangerForm
    })
  }

  clickMenuStatus = (type, id) => {
    if (type === 'cur_master') {
      Message.warning('当前菜单已设置默认菜单');
      return false
    }
    httpRequest({
      url: api.menuSetStatus,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        type: type,
        id: id
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success(resp.msg);
        // this.getList()
        this.changeMenuStatus(type, id);
        this.setState({
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

  changeMenuStatus = (type, id) => {
    const menuMangerForm = [...this.state.menuMangerForm];
    for (let i = 0; i < menuMangerForm.length; i++) {
      let menuItem = menuMangerForm[i];
      if (type === 'master') {
        menuItem.is_master = '0';
      }
      if (menuItem.id === id) {
        if (type === 'master') {
          menuItem.is_master = '1';
        } else if (type === 'start') {
          menuItem.status = '1';
        } else if (type === 'stop') {
          menuItem.status = '0';
        }
      }
    }
    this.setState({
      menuMangerForm
    })
  };

  // 菜单管理弹框保存
  handleSubmit = () => {

    const {menuMangerForm} = this.state;
    let content = [];
    for (let i = 0; i < menuMangerForm.length; i++) {
      const item = menuMangerForm[i];
      if (item.title) {
        content.push({
          id: item.id,
          title: item.title
        })
      } else {
        Message.warning('菜单名称不能为空');
        return false;
      }
    }
    this.setState({
      is_updating: true
    });
    let contentAry = JSON.stringify(content);
    httpRequest({
      url: api.menuSetSave,
      type: 'post',
      data: {
        h5_id: this.state.packageID,
        content: contentAry
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          dialogVisible: false,
          is_updating: false
        })
        this.getList()
      } else {
        Message.error(resp.msg);
        this.setState({
          is_updating: false
        })
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  }
  // 添加精彩视频
  handel_addVideo = () => {
    const videoEditForm = {
      id: '',
      title: '',  //视频名称
      cover: '',  //视频封面链接
      video_url: '' //视频链接
    };
    this.setState({
      videoEditForm,
      dialogVisible_videoEdit: true
    })
  };
  //视频编辑
  videoEdit = (row) => {
    const videoEditForm = {
      id: row.id,
      title: row.title,  //视频名称
      cover: row.cover,  //视频封面链接
      video_url: row.url //视频链接
    };
    this.setState({
      videoEditForm,
      dialogVisible_videoEdit: true
    })
  };
  videoDel = (row) => {
    this.sure_again({
      content: '确认删除该视频？',
      callback: this.del_ajax.bind(this, row)
    })
  };

  del_ajax = (row) => {
    const {packageID} = this.state;
    httpRequest({
      url: api.videoStatus,
      type: 'post',
      data: {
        h5_id: packageID,
        id: row.id,
        type: 'delete'
      }
    }).done(resp => {
      if (resp.code === '0') {
        Message.success('操作成功');
        this.getVideoList();
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

  getTabName = (value) => {
    let tabText = '';
    switch (value) {
      case  'intro':
        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, 'liveCamera')}>直播介绍</span> 模块</p>
        </div>);
        break;
      case  'it':
        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, 'imgLive')}>图文直播</span> 模块</p>
        </div>);
        break;
      case  'comment':
        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, 'comment')}>评论互动</span> 模块</p>
        </div>);
        break;
      case  'chat':

        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, 'liveMonitor')}>聊天互动</span> 模块</p>
        </div>);
        break;
      case  'video':

        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, '')}>视频</span> 模块</p>
        </div>);
        break;
      case  'rank':
        tabText = (<div className="content_inner">
          <p>当前为 <span className="model_name"
                       onClick={this.goPage.bind(this, '')}>榜单排行</span> 模块</p>
        </div>);
        break;
      default:

        tabText = <div className="content_inner">
          <p className="model_name"
             onClick={this.goPage.bind(this, '')}>添加一个菜单模块吧！</p>
        </div>;
    }
    return tabText;
  };
  // 跳转新页面
  goPage = (type) => {
    if (!type) {
      this.menuManger();
      return false;
    }

    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/${type}`);
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
  handel_submit = () => {
    this.validate_form('ruleForm', () => {
      const {videoEditForm, packageID} = this.state;
      httpRequest({
        url: api.videoEdit,
        type: 'post',
        data: {
          h5_id: packageID,
          id: videoEditForm.id,
          title: videoEditForm.title,
          cover: videoEditForm.cover,
          url: videoEditForm.video_url,
        }
      }).done(resp => {
        if (resp.code === '0') {
          Message.success('操作成功');
          this.getVideoList();
          this.setState({
            dialogVisible_videoEdit: false
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
    })
  };
  // tab内部
  renderContent = () => {
    let {activeTab} = this.state;
    const currentMenuList = this.filterMenu();
    let activeTabItem = currentMenuList.find(item => {
      return item.type === activeTab;
    });
    if (!activeTabItem && currentMenuList.length > 0) {
      activeTab = currentMenuList[0].type;
    }
    let content = '';
    const tabText = this.getTabName(activeTab);
    if (activeTab === 'video') { // 精彩视频
      content = (<div className='videoWrapper'>
        <Table
          style={{width: '100%'}}
          columns={this.state.videoColumns}
          maxHeight={400}
          data={this.state.videoData}
        />
        <div className="noData" style={{marginTop: '20px'}} onClick={this.handel_addVideo}>添加精彩视频</div>
      </div>)
    } else { // 直播 介绍
      content = <div className="tab_content">
        {tabText}
      </div>;
    }
    return content;
  };

  render() {
    const {dialogVisible, dialogVisible_videoEdit, is_updating, is_loading, videoEditForm} = this.state;
    let {activeTab} = this.state;
    const currentMenuList = this.filterMenu();
    let activeTabItem = currentMenuList.find(item => {
      return item.type === activeTab;
    });
    if (!activeTabItem && currentMenuList.length > 0) {
      activeTab = currentMenuList[0].type;
    }
    return (
      <div className="menuSet">
        <div className='menuSetContent'>
          <div className='topDiv clearfix'>
            {currentMenuList.length > 0 ? (
              <Tabs activeName={activeTab} onTabClick={this.changeTabs}>
                {currentMenuList.map((item, index) => {
                  return <Tabs.Pane label={item.title} name={item.type} key={`${index}-${item.type}`}/>
                })}
              </Tabs>
            ) : ''}

            <Button onClick={this.menuManger}>菜单管理</Button>
          </div>
          <div>
            <Loading loading={is_loading} text="拼命加载中">

              {this.renderContent()}
            </Loading>

            {/* 精彩视频 */}

          </div>
        </div>
        <div className='h5Preview'>
          <h4>H5端预览</h4>
          <img src={require('@/assets/H5yulan.png')} alt=""/>
        </div>
        {/*菜单管理弹框*/}
        <Dialog
          title="菜单管理"
          closeOnClickModal={false}
          visible={ this.state.dialogVisible }
          // size="small"
          onCancel={ () => this.setState({dialogVisible: false}) }
        >
          <Dialog.Body>
            {dialogVisible && (
              <Table
                style={{width: '100%'}}
                stripe={true}
                columns={this.state.columns}
                data={this.state.menuMangerForm}/>
            )}
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({dialogVisible: false}) }>取 消</Button>
            <Button type="primary" onClick={ this.handleSubmit}>{is_updating ? '保存中' : '确 定'}</Button>
          </Dialog.Footer>
        </Dialog>
        {/* 视频编辑弹框 */}
        <Dialog
          title="视频编辑"
          closeOnClickModal={false}
          visible={dialogVisible_videoEdit }
          onCancel={ () => this.setState({dialogVisible_videoEdit: false}) }
        >
          <Dialog.Body>
            <Form model={videoEditForm}
                  labelWidth="120"
                  ref="ruleForm"
                  rules={this.state.rules}>
              <Form.Item label="视频名称: "
                         prop="title"
              >
                <Input value={videoEditForm.title} onChange={this._onChange.bind(this, 'title', 'videoEditForm')}/>
              </Form.Item>
              <Form.Item label="视频封面: " prop="cover">
                <Upload cover={videoEditForm.cover}
                        type={'h5Icon'}
                        successCallBack={this._onChange.bind(this, 'cover', 'videoEditForm')}/>
              </Form.Item>
              <Form.Item label="上传视频: " prop="video_url">
                <p>
                  {videoEditForm.video_url ?
                    <a className="break_all" href={videoEditForm.video_url}
                       target="_blank">{videoEditForm.video_url}</a> : ''}
                </p>
                <Upload cover={videoEditForm.video_url}
                        fileType={'video'}
                        showButton={true}
                        successCallBack={this._onChange.bind(this, 'video_url', 'videoEditForm')}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({dialogVisible_videoEdit: false}) }>取 消</Button>
            <Button type="primary" onClick={ this.handel_submit}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}