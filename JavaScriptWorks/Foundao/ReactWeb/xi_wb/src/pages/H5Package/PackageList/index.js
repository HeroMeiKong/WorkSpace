import React, {Component} from 'react';
import './index.scss';
import {
  withRouter
} from 'react-router-dom'
import {
  Button,
  Dialog,
  Table,
  // Form,
  Input,
  MessageBox,
  Message,
  Pagination,
  Notification,
  Popover
} from 'element-react';
import classnames from 'classnames';
import moment from 'moment';

import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import {scenes} from '../config';
import {getH5_url} from '@/config'
import tool from '@/utils/tool'
@withRouter
export default
class PackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      dialogVisible_address: false, // 地址弹框
      page_size: 17,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,         // 总数

      show_upgrade: false, // 显示升级提示
      form: {
        channelName: '',
        scene: 'base-simple',
      },
      rules: {
        channelName: {required: true, message: '名称不能为空', trigger: 'blur'},
        scene: {required: true, message: '直播场景不能为空', trigger: 'change'},
      },
      columns: [
        {
          label: "频道号",
          prop: "id",
          // width: 100
        },
        // {
        //   label: "封面图",
        //   prop: "icon",
        //   width: 140,
        //   render: (row) => {
        //     return <div className="table_image">{row.icon ?
        //       <img src={row.icon} alt=""/> : ""}</div>
        //   }
        // },
        {
          label: "频道名称",
          prop: 'title'
        },
        {
          label: "场景类型",
          render: (row) => {
            return (
              <span>
                {this.getSceneName(row.scene)}
            </span>
            )
          }
        },
        {
          label: "创建时间",
          prop: 'gmt_create'
        },
        {
          label: "操作",
          align: 'center',
          render: (row, style, index) => {
            const live_url = getH5_url(row.id);
            const qrcode_id = `address_code_${row.id}`;
            return (
              <span>
              <Popover placement="left"
                       title=""
                       width="538"
                       trigger="click"
                       content={(<div className="live_address">
                         <div className="left_panel">
                           <h3>观看链接</h3>
                           <Input style={{margin: '10px 0 20px'}} disabled={true} value={live_url}/>
                           <Button onClick={this.copyText.bind(this, live_url)}>复制链接</Button>
                         </div>
                         <div className="right_panel">
                           <p>手机观看二维码</p>
                           <div className="address_code" id={qrcode_id}>
                           </div>
                         </div>
                       </div>)}>
                       <Button onClick={this.setQrcode.bind(this, live_url, qrcode_id)}
                               style={{marginRight: '10px'}}
                               type='text'>直播链接</Button>
              </Popover>
                <div className="divider_line"/>
              <Button type='text'
                      onClick={this.handel_set.bind(this, row)}>设置</Button>
                {/*<Button size='small' type='text' style={{color: '#67CB36'}}>统计</Button>*/}
                <div className="divider_line"/>
                <Button type='text'
                        className="btn_red"
                        onClick={this.handel_del.bind(this, row, index)}>删除</Button>
            </span>
            )
          }
        }
      ],
      data: [
        // {id: '001', cover: scenes1, channelName: '测试直播5', scene: '001'},
        // {id: '002', cover: scenes1, channelName: '测试直播6', scene: '002'},
      ]
    };
    this.scene_swiper = null; // swiper
  }

  componentWillMount() {
  }

  componentDidMount() {
    const {search = ''} = this.props.location;
    const params = tool.getParams(search);
    const {page} = params;
    this.setState({
      current_page: page ? page / 1 : 1,
      showTable: localStorage.getItem('showTable')
    }, () => {
      this.getList();
    });
    // this.initSwiper();
  }

  componentWillUnmount() {

  }

  initSwiper = () => {
    this.scene_swiper = new window.Swiper('.scene_swiper', {
      slidesPerView: 'auto',
      freeMode: true,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  };
  getList = () => {
    const {page_size, current_page} = this.state;
    tool.show_loading();
    httpRequest({
      url: api.packageList,
      type: 'post',
      data: {
        page: current_page,
        limit: page_size
      }
    }).done(resp => {
      tool.hide_loading();
      if (resp.code === '0') {
        this.setState({
          data: resp.list,
          total: resp.count
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
  // 详情弹框编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };
  // 新增直播包装
  handelAdd = () => {
    // this.handleReset('ruleForm');
    const form = {
      channelName: '拓道移动互动包装',
      scene: 'base-simple',
    };
    this.setState({
      form,
      dialogVisible: true
    }, () => {
      if (!this.scene_swiper) {
        setTimeout(this.initSwiper, 100);
      }
    })
  };
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  // 生成随机密码
  createRandomPassword = (size) => {
    const seed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      '2', '3', '4', '5', '6', '7', '8', '9'
    ];//数组
    const seedlength = seed.length;//数组长度
    let createPassword = '';
    for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * seedlength);
      createPassword += seed[j];
    }
    return createPassword;
  };
  handleSubmit = () => {
    // this.validate_form('ruleForm', () => {
    const {form} = this.state;
    const currentChoose = scenes.find(item => form.scene === item.value);
    if (currentChoose.disabled) {
      Message.warning('该直播包装场景暂未开放...请耐心等待');
      return false;
    }
    this.setState({
      is_submit: true
    });
    const random = this.createRandomPassword(4);
    httpRequest({
      url: api.packageEdit,
      type: 'post',
      data: {
        id: '',
        // title: form.channelName,
        title: `拓道互动包装_${moment().format('MMDD')}${random}`,
        scene: form.scene,
      }
    }).done((resp) => {
      this.setState({
        is_submit: true
      });
      if (resp.code === '0') {
        Message.success('操作成功');
        setTimeout(this.handel_addSuccess.bind(this, resp.data || {}), 500);
      } else {
        Message.error(resp.msg)
      }
    }).fail(jqXHR => {
      this.setState({
        is_submit: true
      });
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    });
    // })
  };
  // 新增成功
  handel_addSuccess = (data) => {
    this.setState({
      dialogVisible: false
    });
    this.handel_editCamera(data);
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


  // 获取直播场景
  getSceneName = (value) => {
    let adItem = scenes.find(item => {
        return item.value === value
      }) || {};
    const adType = adItem.name || '未知';
    return adType;
  };

  handel_set = (row) => {
    this.props.history.push(`/h5Package/${row.id}`)
  };
  // 编辑详情
  handel_editCamera = (row) => {
    if (!row.h5_id) {
      return false;
    }
    this.props.history.push(`/h5Package/${row.h5_id}/liveCamera`)
  };

  // 删除
  handel_del = (row) => {
    const warning_title = `确认要删除这条信息吗？`;
    this.sure_again({
      title: warning_title,
      content: '确认删除此H5直播包装页面吗？删除后该页面内所有内容都将会被彻底删除，无法恢复！',
      callback: this.del_ajax.bind(this, row)
    })
  };
  // 删除ajax
  del_ajax = (row) => {
    httpRequest({
      url: api.packageStatus,
      type: 'post',
      data: {
        id: row.id,
        type: 'delete',
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

  // 拷贝
  copyText = (text) => {
    const input = document.querySelector('#copy-input');
    if (input) {
      input.value = text;
      if (document.execCommand('copy')) {
        input.select();
        document.execCommand('copy');
        input.blur();
        Message.success('已复制到粘贴板');
      }
    }
  };
  //
  setQrcode = (url, qrcode_id) => {
    if (document.getElementById(qrcode_id).childElementCount < 1) {
      new window.QRCode(document.getElementById(qrcode_id), {
        text: url,
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 0,      // 纠错等级
      });
    }
  };
  hide_upgrade_tips = () => {
    this.setState({
      show_upgrade: false
    })
  };
  handelChangeShowType = () => {
    this.setState({
      showTable: !this.state.showTable
    });
    localStorage.setItem('showTable', this.state.showTable ? '' : '1')
  };

  render() {
    const {dialogVisible, form, data, page_size, current_page, total, is_submit, showTable} = this.state;
    const currentChoose = scenes.find(item => form.scene === item.value);

    return (
      <div className="package_list">
        <div className="package_list_inner">
          <div className="list_head clearfix">
            <div className="list_head_icon"/>
            <Button style={{float: 'right'}}
                    type='primary'
                    className="refresh"
                    icon="refresh"
                    onClick={this.handelChangeShowType}>切换展示方式</Button>
            {!showTable ? '' : <Button style={{float: 'right'}}
                                       type='primary'
                                       icon="plus"
                                       onClick={this.handelAdd}>添加一个H5直播包装</Button>}

          </div>

          <h1>欢迎回来！</h1>
          <div className="package_list_content">
            {/*{show_upgrade ? <div className="upgrade_tips">*/}
            {/*免费用户只能创建1个H5包装，<span>升级VIP</span>，H5包装不限量！*/}
            {/*<span className="close" onClick={this.hide_upgrade_tips}/>*/}
            {/*</div> : ''}*/}

            {/*直播包装列表*/}


            {showTable ? (
              (<Table
                className="package_list_table"
                columns={this.state.columns}
                data={this.state.data}
                // border={true}
                height={500}
                stripe={true}
              />)
            ) : (
              <ul className="list_wrapper clearfix">
                <li className="add_package" onClick={this.handelAdd}/>
                {data.map((item, index) => {
                  return <li key={index}
                             className="packageItem"
                             onClick={this.handel_set.bind(this, item)}>
                    <div className="package_cover"><img src={item.master.cover} alt=""/></div>
                    <div className={classnames('package_status', {end: item.master.live_status === 'end'})}>
                      • {item.master.live_status === 'end' ? '已结束' : '进行中'}</div>
                    <div className="package_title limit-line2">{item.title}</div>
                  </li>
                })}
              </ul>
            )}


            {total > page_size ? (<div className="pagination_wrapper">
              <Pagination layout="total, prev, pager, next, jumper"
                          pageSize={page_size}
                          currentPage={current_page}
                          total={total}
                          onCurrentChange={this.currentChange}
              />
            </div>) : ''}

          </div>

          <Dialog
            title='选择直播互动模版'
            visible={ dialogVisible }
            closeOnClickModal={false}
            onCancel={ this.close_dialog }
          >
            <Dialog.Body>
              <div className="scene_wrapper clearfix">
                <div className="swiper-container scene_swiper">
                  <div className="swiper-wrapper">
                    {scenes.map((item, index) => {
                      return <div key={index}
                                  onClick={this._onChange.bind(this, 'scene', 'form', item.value)}
                                  className={classnames('scene_item swiper-slide', {
                                    disabled: item.disabled
                                  })}>
                        <div className={classnames('scene_cover_wrapper', {active: form.scene === item.value})}>
                          <div className='scene_cover' style={{backgroundImage: `url(${item.img})`}}/>
                        </div>
                        <div className="item_name">{item.name}</div>
                      </div>
                    })}
                  </div>
                </div>
                <div className="swiper-button-prev" />
                <div className="swiper-button-next" />
              </div>
              <div className="tips_box">
                Tips:
                <p>{currentChoose.tips}</p>
              </div>
            </Dialog.Body>

            <Dialog.Footer className="dialog-footer">
              {/*<Button onClick={ this.close_dialog }>取 消</Button>*/}
              <Button type="primary"
                      loading={is_submit}
                      onClick={ this.handleSubmit}>{is_submit ? '创建中...' : '确认创建'}</Button>

            </Dialog.Footer>
          </Dialog>
          {/*<h2>相关教学视频及文档 </h2>*/}
        </div>

      </div>
    );
  }
}