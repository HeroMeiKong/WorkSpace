import React, {Component} from 'react';
import {Form, Input, Button, Dialog, DatePicker, Radio, Message, Notification, MessageBox} from 'element-react';
// import Upload from '@/components/Upload';
import Ks3Upload from '@/components/Ks3Upload';
import moment from 'moment';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import Monitor from '@/components/Monitor';

import './index.scss';
const preTypeList = [
  {name: '图片', value: 'image'},
  {name: '视频', value: 'video'},
];
const liveTypeList = [
  {name: '直播', value: 'live'},
  {name: '视频', value: 'video'},
  {name: '图片', value: 'image'},
];
const horizontalList = [
  {name: '横屏', value: '1'},
  {name: '竖屏', value: '2'},
];
export default
class LiveCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageDetail: {}, // 包装详情
      liveDetail: {},    // 直播信息
      noticeDetail: {},    // 直播预告
      cameraList: [], // 分镜头
      defaultForm: {
        title: '',
        intro: '',
        end_time: null,
        screen_type: '2',
      },
      preData: [ //预告数据列表

      ],
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        intro: {required: true, message: '描述不能为空', trigger: 'blur'},
        cover: {required: true, message: '封面不能为空', trigger: 'blur'},
        pull_url: {required: true, message: '拉流地址不能为空', trigger: 'blur'},
        media_url: {required: true, message: '视频不能为空', trigger: 'blur'},
        end_time: {required: true, type: 'date', message: '日期不能为空', trigger: 'blur'}
      },
      rules_pre: {
        time: {required: true, type: 'date', message: '日期不能为空', trigger: 'blur'},
        intro: {required: true, message: '描述不能为空', trigger: 'blur'},
        cover: {required: true, message: '封面不能为空', trigger: 'blur'},
        media_url: {required: true, message: '视频不能为空', trigger: 'blur'},
      },
      rules_camera: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        media_url: {required: true, message: '视频不能为空', trigger: 'blur'},
        intro: {required: true, message: '描述不能为空', trigger: 'blur'},
        cover: {required: true, message: '封面不能为空', trigger: 'blur'},
        pull_url: {required: true, message: '拉流地址不能为空', trigger: 'blur'},
        weight: {required: true, message: '排序值不能为空', trigger: 'blur'},
        content: {required: true, message: '内容不能为空', trigger: 'blur'},
        sub_type: {required: true, message: '直播方式不能为空', trigger: 'blur'},
        end_time: {required: true, type: 'date', message: '日期不能为空', trigger: 'blur'},
      },
      preForm: {  // 预告
        time: null,
        type: '0',
        cover: '',
        video: ''
      },
      observer_url: '', // 直播监控的url
      // 分镜头
      cameraForm: {
        id: '',
        live_id: '',
        title: '',
        intro: '',
        cover: '',
        pull_url: '',
        sub_type: '',
        weight: '',
        content: ''
      }
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getPackageDetail();
  }

  componentWillUnmount() {

  }

  // 获取包装详情
  getPackageDetail = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.packageDetail,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done(resp => {
      if (resp.code === '0') {
        const defaultForm = {...resp.data.live};
        if (moment(defaultForm.gmt_end).isValid()) {
          defaultForm.end_time = new Date(defaultForm.gmt_end)
        } else {
          defaultForm.end_time = null;
        }
        if (!defaultForm.sub_type) {
          defaultForm.sub_type = 'live'; // 默认是直播
        } else if (defaultForm.sub_type === 'video') {
          defaultForm.media_url = defaultForm.pull_url; // 默认是直播
        }
        this.setState({
          packageDetail: resp.data.package || {},
          liveDetail: resp.data.live || {},
          defaultForm,
          noticeDetail: resp.data.notice || {},
          cameraList: resp.data.slave_live || []
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


  // 确认
  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      const {defaultForm} = this.state;
      let pull_url = defaultForm.pull_url;
      if (defaultForm.sub_type === 'video') {
        pull_url = defaultForm.media_url; // 视频就是上传的视频
      }
      httpRequest({
        url: api.editMaster,
        type: 'post',
        data: {
          id: defaultForm.id,
          title: defaultForm.title,
          intro: defaultForm.intro,
          cover: defaultForm.cover,
          pull_url: pull_url,
          sub_type: defaultForm.sub_type,
          gmt_end: moment(defaultForm.end_time).format('YYYY-MM-DD HH:mm:ss'),
          screen_type: defaultForm.screen_type,
        }
      }).done(resp => {
        if (resp.code === '0') {
          Message.success('修改成功');
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
  // 添加直播预告
  handel_addPre = () => {
    const {liveDetail} = this.state;
    const form = {
      id: '',
      time: null,
      type: 'image',
      cover: '',
      live_id: liveDetail.id,
      media_url: '',
      // live_id: liveDetail.h5_id,
    };
    this.setState({
      dialogVisible_pre: true,
      preForm: form
    })
  };

  // 关闭预告弹框
  close_dialog_pre = () => {
    this.setState({
      dialogVisible_pre: false
    })
  };
  handleSubmit_pre = () => {
    this.validate_form('ruleForm_pre', () => {
      const {preForm} = this.state;
      httpRequest({
        url: api.editNotice,
        type: 'post',
        data: {
          id: preForm.id,
          start_date: moment(preForm.time).format('YYYY-MM-DD HH:mm:ss'),
          type: preForm.type,
          cover: preForm.cover,
          content: preForm.media_url,
          live_id: preForm.live_id,
        }
      }).done(resp => {
        if (resp.code === '0') {
          this.setState({
            dialogVisible_pre: false
          });
          this.getPackageDetail();
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

  // 添加辅助镜头
  handel_addCamera = () => {
    const {defaultForm} = this.state;
    if (!defaultForm.cover) {
      Message.warning('请先编辑主镜头');
      return false
    }
    this.handleReset('ruleForm_camera');
    const {liveDetail, cameraList} = this.state;
    let final_item = {};
    if (cameraList.length > 0) {
      final_item = cameraList[cameraList.length - 1];
    }
    const finalIndex = final_item.weight || 0;
    const newIndex = finalIndex / 1 + 1 + '';
    const cameraForm = {
      id: '',
      live_id: liveDetail.id,
      title: '',
      intro: '',
      cover: '',
      pull_url: '',
      sub_type: 'live',
      media_url: '',
      weight: newIndex,
      content: '',
      end_time: null
    };
    this.setState({
      dialogVisible_camera: true,
      cameraForm
    })
  };
  close_dialog_camera = () => {
    this.setState({
      dialogVisible_camera: false
    })
  }
  handleSubmit_camera = () => {
    this.validate_form('ruleForm_camera', () => {
      const {cameraForm} = this.state;
      const {sub_type} = cameraForm;
      let pull_url = cameraForm.pull_url;
      let content = cameraForm.cover;
      if (sub_type === 'video') {
        pull_url = cameraForm.media_url;
      }
      httpRequest({
        url: api.editSlave,
        type: 'post',
        data: {
          id: cameraForm.id,
          live_id: cameraForm.live_id,
          title: cameraForm.title,
          intro: cameraForm.intro,
          cover: cameraForm.cover,
          pull_url: pull_url,
          sub_type: cameraForm.sub_type,
          weight: cameraForm.weight,
          content: content,
          gmt_end: moment(cameraForm.end_time).format('YYYY-MM-DD HH:mm:ss')
        }
      }).done(resp => {
        if (resp.code === '0') {
          Message.success('操作成功');
          this.setState({
            dialogVisible_camera: false
          });
          this.getPackageDetail();
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
  // 编辑分镜头
  handel_edit_camera = (item) => {
    this.handleReset('ruleForm_camera');
    const {liveDetail} = this.state;
    const cameraForm = {
      id: item.id,
      live_id: liveDetail.id,
      title: item.title,
      intro: item.intro,
      cover: item.cover,
      pull_url: item.pull_url,
      media_url: item.pull_url,
      sub_type: item.sub_type,
      weight: item.weight,
      content: item.content,
      end_time: moment(item.gmt_end).isValid() ? new Date(item.gmt_end) : null
    };
    this.setState({
      dialogVisible_camera: true,
      cameraForm
    })
  };
  // 删除分镜头
  handel_del_camera = (item) => {
    this.sure_again({
      content: '确认删除该辅助镜头？',
      callback: this.del_ajax.bind(this, item)
    })
  };
  // 删除ajax
  del_ajax = (row) => {
    httpRequest({
      url: api.slaveStatus,
      type: 'post',
      data: {
        id: row.id,
        type: 'delete',
      }
    }).done(resp => {
      if (resp.code === '0') {
        Message.success('操作成功');
        this.getPackageDetail();
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
  // 编辑预告
  handel_edit_pre = () => {
    const {noticeDetail} = this.state;
    const form = {
      id: noticeDetail.id,
      time: noticeDetail.gmt_start ? new Date(noticeDetail.gmt_start) : null,
      type: noticeDetail.type,
      cover: noticeDetail.cover,
      live_id: noticeDetail.live_id,
      media_url: noticeDetail.content,
    };
    this.setState({
      dialogVisible_pre: true,
      preForm: form
    })

  };
  // 删除预告
  handel_del_pre = () => {
    this.sure_again({
      content: '确认删除该预告？',
      callback: this.del_ajax_pre
    })
  };
  // 删除预告
  del_ajax_pre = () => {
    const {noticeDetail} = this.state;
    httpRequest({
      url: api.noticeStatus,
      type: 'post',
      data: {
        id: noticeDetail.id,
        live_id: noticeDetail.live_id,
        type: 'delete',
      }
    }).done(resp => {
      if (resp.code === '0') {
        Message.success('操作成功');
        this.getPackageDetail();
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
  // 监看
  handel_obs = () => {
    const {defaultForm} = this.state;
    if (defaultForm.pull_url) {
      this.start_obsLive(defaultForm.pull_url);
    } else {
      Message.warning('请先输入正确的流地址')
    }
  };
  // 上传成功
  uploadSuccess = (key, formName, url) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: url})
    });
  };
  // 开始直播监看
  start_obsLive = (url) => {
    this.setState({
      observer_url: url
    });
  };

  // 重置表单
  handleReset(formName) {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].resetFields();
  }

  render() {
    const {observer_url, defaultForm, dialogVisible_pre, preForm, noticeDetail, cameraList, dialogVisible_camera, cameraForm, packageDetail = {}} = this.state;


    let hasNotice = false; // 是否有预告
    // let hasCamera = false; // 是否有辅助镜头
    if (noticeDetail.id > 0) {
      hasNotice = true;
    }
    return (
      <div className="live_camera">
        {/*直播镜头*/}
        <div className="top_block content_block">
          {/*直播监控.*/}
          <div className="monitor_box_wrapper">
            <h4>直播监看画面</h4>
            <div className="monitor_box">
              <Monitor style={{height: '100%'}}
                       cover={''}
                       liveType={'video'}
                       mediaUrl={observer_url}/>
            </div>
          </div>

          <div className="default_camera">

            <h4>默认镜头</h4>
            <Form model={defaultForm}
                  ref="ruleForm"
                  rules={this.state.rules}
                  labelWidth="100">

              <div className="diy_input clearfix">
                <Form.Item label="直播标题：" prop="title">
                  <Input value={defaultForm.title}
                         onChange={this._onChange.bind(this, 'title', 'defaultForm')}
                         maxLength={16}
                         autoComplete="off"/>
                  <span className="limitNum">{defaultForm.title.length} / 16</span>
                </Form.Item>
              </div>

              <div className="diy_input clearfix">
                <Form.Item label="直播简介：" prop="intro">
                  <Input value={defaultForm.intro}
                         onChange={this._onChange.bind(this, 'intro', 'defaultForm')}
                         type='textarea'
                         autosize={{minRows: 4}}
                         maxLength={200}
                         autoComplete="off"/>
                  <span className="limitNum">{defaultForm.intro.length} / 200</span>
                </Form.Item>
              </div>

              <div className="diy_input clearfix">
                <Form.Item label="直播方式" prop="sub_type">
                  <Radio.Group
                    value={defaultForm.sub_type}
                    onChange={this._onChange.bind(this, 'sub_type', 'defaultForm')}>
                    {
                      liveTypeList.map((item, index) =>
                        <Radio key={index}
                               disabled={index === 2 && (packageDetail.scene === 'interaction' || packageDetail.scene === 'interaction-horizontal')}
                               value={item.value}>
                          {item.name}
                        </Radio>
                      )
                    }
                  </Radio.Group>
                </Form.Item>
              </div>

              {/*互动模版才有视频方向*/}
              {/*{packageDetail.scene === 'interaction' ? (*/}
              {/*<div className="diy_input clearfix">*/}
              {/*<Form.Item label="视频方向" prop="screen_type">*/}
              {/*<Radio.Group*/}
              {/*value={defaultForm.screen_type}*/}
              {/*onChange={this._onChange.bind(this, 'screen_type', 'defaultForm')}>*/}
              {/*{*/}
              {/*horizontalList.map((typeItem, typeIndex) => {*/}
              {/*return <Radio key={typeIndex}*/}
              {/*value={typeItem.value}>*/}
              {/*{typeItem.name}*/}
              {/*</Radio>*/}
              {/*}*/}
              {/*)*/}
              {/*}*/}
              {/*</Radio.Group>*/}
              {/*</Form.Item>*/}
              {/*</div>*/}
              {/*) : ''}*/}
              <div className="diy_input clearfix">
                <Form.Item label="封面：" prop="cover">
                  <Ks3Upload cover={defaultForm.cover}
                             successCallBack={this.uploadSuccess.bind(this, 'cover', 'defaultForm')}/>
                  <span className="min_tips">(建议尺寸 750 * 422)</span>
                </Form.Item>
              </div>

              {defaultForm.sub_type === 'live' ? (

                <div className="diy_input clearfix">
                  <Form.Item label="结束时间" prop="end_time">
                    <DatePicker
                      value={defaultForm.end_time}
                      isShowTime={true}
                      placeholder="选择日期"
                      format="yyyy-MM-dd HH:mm:ss"
                      onChange={this._onChange.bind(this, 'end_time', 'defaultForm')}
                    />
                  </Form.Item>
                </div>

              ) : ''}
              {defaultForm.sub_type === 'live' ? (
                <div className="diy_input clearfix">
                  <Form.Item label="拉流地址：" prop="pull_url">
                    <Input value={defaultForm.pull_url}
                           onChange={this._onChange.bind(this, 'pull_url', 'defaultForm')}
                           autoComplete="off"/>
                  </Form.Item>
                  <div className="extra">
                    <Button className="btn_obs"
                            onClick={this.handel_obs}
                            type='line'
                            size='small'>监 看</Button> 支持m3u8、mp4
                  </div>
                </div>
              ) : ''}
              {defaultForm.sub_type === 'video' ? (
                <Form.Item label="视频：" prop="media_url">
                  <p>
                    {defaultForm.media_url ?
                      <a className="break_all" href={defaultForm.media_url}
                         target="_blank">{defaultForm.media_url}</a> : ''}
                  </p>
                  <Ks3Upload cover={defaultForm.media_url}
                             showButton={true}
                             fileType="video"
                             successCallBack={this.uploadSuccess.bind(this, 'media_url', 'defaultForm')}/>
                </Form.Item>
              ) : ''}
              <div className="diy_wrapper" style={{textAlign: 'center'}}>
                <Button type="primary"
                        size='small'
                        onClick={ this.handleSubmit}>确 认</Button>
              </div>


            </Form>


          </div>

        </div>
        {/*直播预告*/}
        {packageDetail.scene === 'base' || packageDetail.scene === 'activity' || packageDetail.scene === 'base-simple' ? (
          <div>
            <div className="content_block">
              <h4>直播预告</h4>
              {!hasNotice ? <div className="noData" onClick={this.handel_addPre}>添加直播预告</div> : (
                <div className="pre_wrapper">
                  <div className="item_operate">
                    <Button size='small'
                            type='plain'
                            onClick={this.handel_edit_pre}>编辑</Button>
                    <Button size='small'
                            type='plain'
                            className="btn_red"
                            onClick={this.handel_del_pre}>删除</Button>
                  </div>
                  <div className="form_box">
                    <div className="form_item">
                      <div className="item_label">直播开始时间：</div>
                      <div className="item_value">{moment(noticeDetail.gmt_start).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    <div className="form_item">
                      <div className="item_label">预告方式：</div>
                      <div className="item_value">
                        <Radio.Group
                          value={noticeDetail.type}>
                          {
                            preTypeList.map((item, index) => {
                                if (item.value === noticeDetail.type) {
                                  return <Radio key={index}
                                    // disabled={item.value !== noticeDetail.sub_type}
                                                value={item.value}>
                                    {item.name}
                                  </Radio>
                                } else {
                                  return ''
                                }
                              }
                            )
                          }
                        </Radio.Group>
                      </div>
                    </div>
                    <div className="form_item">
                      <div className="item_label">预告封面：</div>
                      <div className="item_value">
                        <Ks3Upload cover={noticeDetail.cover}
                                   disabled={true}
                                   successCallBack={this.uploadSuccess.bind(this, 'pull_url', 'preForm')}/>
                      </div>
                    </div>
                    {/*预告是视频*/}
                    {noticeDetail.type === 'video' ? (
                      <div className="form_item">
                        <div className="item_label">视频:</div>
                        <div className="item_value">
                          <video controls
                                 className="small_video"
                                 src={noticeDetail.content}>你的浏览器不支持video
                          </video>
                        </div>
                      </div>
                    ) : ''}

                  </div>
                </div>
              )}

            </div>

            {/*辅助镜头 -> 基础多镜头才有辅助镜头*/}
            {packageDetail.scene === 'base' ? (
              <div className="content_block">
                <h4>辅助镜头</h4>
                <div className="camera_wrapper">
                  {cameraList.map((item, index) => {
                    return <div className="camera_item" key={index}>
                      <div className="item_operate">
                        <Button size='small'
                                type='plain'
                                onClick={this.handel_edit_camera.bind(this, item)}>编辑</Button>
                        <Button size='small'
                                type='plain'
                                className="btn_red"
                                onClick={this.handel_del_camera.bind(this, item)}>删除</Button>
                      </div>
                      <div className="form_box">
                        <div className="form_item">
                          <div className="item_label">分镜头排序：</div>
                          <div className="item_value">{item.weight}</div>
                        </div>
                        <div className="form_item">
                          <div className="item_label">分镜头标题：</div>
                          <div className="item_value">{item.title}</div>
                        </div>
                        <div className="form_item">
                          <div className="item_label">直播方式：</div>
                          <div className="item_value">
                            <Radio.Group
                              value={item.sub_type}>
                              {
                                liveTypeList.map((typeItem, typeIndex) => {
                                    if (typeItem.value === item.sub_type) {
                                      return <Radio key={typeIndex}
                                                    disabled={typeItem.value !== item.sub_type}
                                                    value={typeItem.value}>
                                        {typeItem.name}
                                      </Radio>
                                    } else {
                                      return ''
                                    }
                                  }
                                )
                              }
                            </Radio.Group>
                          </div>
                        </div>
                        {/*镜头是视频*/}
                        {item.sub_type === 'video' ? (
                          <div className="form_item">
                            <div className="item_label">视频:</div>
                            <div className="item_value">
                              {/*<video controls*/}
                              {/*className="small_video"*/}
                              {/*src={item.pull_url}>你的浏览器不支持video*/}
                              {/*</video>*/}
                              {item.pull_url}
                            </div>
                          </div>
                        ) : ''}

                        {item.sub_type === 'live' ? (
                          <div className="form_item">
                            <div className="item_label">拉流地址：</div>
                            <div className="item_value">{item.pull_url}</div>
                          </div>
                        ) : ''}

                        <div className="form_item">
                          <div className="item_label">封面：</div>
                          <div className="item_value">
                            <Ks3Upload cover={item.cover}
                                       disabled={true}
                                       successCallBack={this.uploadSuccess.bind(this, 'pull_url', 'preForm')}/>
                          </div>
                        </div>
                        {/*<div className="form_item">*/}
                        {/*<div className="item_label">分镜头简介：</div>*/}
                        {/*<div className="item_value">{item.intro}</div>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  })}
                </div>
                {cameraList.length < 5 ? <div className="noData" onClick={this.handel_addCamera}>添加辅助镜头</div> : ''}
              </div>
            ) : ''}


          </div>
        ) : ''}


        {/*直播预告弹框*/}
        <Dialog
          title='直播预告'
          visible={ dialogVisible_pre }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_pre }
        >
          <Dialog.Body>
            <Form model={preForm}
                  ref="ruleForm_pre"
                  rules={this.state.rules_pre}
                  labelWidth="120">
              <Form.Item label="直播开始时间" prop="time">
                <DatePicker
                  value={preForm.time}
                  isShowTime={true}
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  onChange={this._onChange.bind(this, 'time', 'preForm')}
                />
              </Form.Item>
              <Form.Item label="预告方式" prop="type">
                <Radio.Group
                  value={preForm.type}
                  onChange={this._onChange.bind(this, 'type', 'preForm')}>
                  {
                    preTypeList.map((item, index) =>
                      <Radio key={index} value={item.value}>
                        {item.name}
                      </Radio>
                    )
                  }
                </Radio.Group>
              </Form.Item>
              <Form.Item label="封面：" prop="cover">
                <Ks3Upload cover={preForm.cover}
                           successCallBack={this.uploadSuccess.bind(this, 'cover', 'preForm')}/>
                <span className="min_tips">(建议尺寸 750 * 422)</span>
              </Form.Item>
              {/*预告是视频*/}
              {preForm.type === 'video' ? (
                <Form.Item label="视频：" prop="media_url">
                  <p>
                    {preForm.media_url ?
                      <a className="break_all" href={preForm.media_url} target="_blank">{preForm.media_url}</a> : ''}
                  </p>
                  <Ks3Upload cover={preForm.media_url}
                             showButton={true}
                             fileType="video"
                             successCallBack={this.uploadSuccess.bind(this, 'media_url', 'preForm')}/>
                </Form.Item>
              ) : ''}
            </Form>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_pre }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit_pre}>保存</Button>

          </Dialog.Footer>
        </Dialog>

        {/*辅助镜头弹框*/}
        <Dialog
          title='分镜头'
          visible={ dialogVisible_camera }
          closeOnClickModal={false}
          onCancel={ this.close_dialog_camera }
        >
          <Dialog.Body>
            <Form model={cameraForm}
                  ref="ruleForm_camera"
                  rules={this.state.rules_camera}
                  labelWidth="120">
              <Form.Item label="分镜头排序：" prop="weight">
                <Input value={cameraForm.weight}
                       onChange={this._onChange.bind(this, 'weight', 'cameraForm')}
                       type='number'
                       autoComplete="off"/>
              </Form.Item>
              <Form.Item label="分镜头标题：" prop="title">
                <Input value={cameraForm.title}
                       onChange={this._onChange.bind(this, 'title', 'cameraForm')}
                       maxLength={16}
                       autoComplete="off"/>
                <span className="limitNum">{cameraForm.title.length} / 16</span>
              </Form.Item>

              <Form.Item label="直播方式" prop="sub_type">
                <Radio.Group
                  value={cameraForm.sub_type}
                  onChange={this._onChange.bind(this, 'sub_type', 'cameraForm')}>
                  {
                    liveTypeList.map((item, index) =>
                      <Radio key={index} value={item.value}>
                        {item.name}
                      </Radio>
                    )
                  }
                </Radio.Group>
              </Form.Item>
              {/*预告是视频*/}
              {cameraForm.sub_type === 'video' ? (
                <Form.Item label="视频：" prop="media_url">
                  <p>
                    {cameraForm.media_url ?
                      <a className="break_all" href={cameraForm.media_url}
                         target="_blank">{cameraForm.media_url}</a> : ''}
                  </p>
                  <Ks3Upload cover={cameraForm.media_url}
                             showButton={true}
                             fileType="video"
                             successCallBack={this.uploadSuccess.bind(this, 'media_url', 'cameraForm')}/>
                </Form.Item>
              ) : ''}

              {/*直播*/}
              {cameraForm.sub_type === 'live' ? (
                <Form.Item label="拉流地址：" prop="pull_url">
                  <Input value={cameraForm.pull_url}
                         onChange={this._onChange.bind(this, 'pull_url', 'cameraForm')}
                         autoComplete="off"/>
                </Form.Item>
              ) : ''}
              {cameraForm.sub_type === 'live' ? (
                <Form.Item label="结束时间" prop="end_time">
                  <DatePicker
                    value={cameraForm.end_time}
                    isShowTime={true}
                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                    onChange={this._onChange.bind(this, 'end_time', 'cameraForm')}
                  />
                </Form.Item>) : ''
              }
              <Form.Item label="封面：" prop="cover">
                <Ks3Upload cover={cameraForm.cover}
                           successCallBack={this.uploadSuccess.bind(this, 'cover', 'cameraForm')}/>
                <span className="min_tips">(建议尺寸 750 * 422)</span>
              </Form.Item>


              {/*<Form.Item label="分镜头简介：" prop="intro">*/}
              {/*<Input value={cameraForm.intro}*/}
              {/*onChange={this._onChange.bind(this, 'intro', 'cameraForm')}*/}
              {/*type='textarea'*/}
              {/*autosize={{minRows: 4}}*/}
              {/*maxLength={200}*/}
              {/*autoComplete="off"/>*/}
              {/*<span className="limitNum">{cameraForm.intro.length} / 200</span>*/}
              {/*</Form.Item>*/}

            </Form>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ this.close_dialog_camera }>取 消</Button>
            <Button type="primary"
                    onClick={ this.handleSubmit_camera}>保 存</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}