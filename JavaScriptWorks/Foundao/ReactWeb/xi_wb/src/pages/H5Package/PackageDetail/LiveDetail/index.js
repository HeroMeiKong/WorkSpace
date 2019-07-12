import React, {Component} from 'react';
import './index.scss';
import api from '@/API/api';
import httpRequest from '@/utils/httpRequest';
import {Button, Message, Notification, Dialog, Form, Input} from 'element-react';
import {scenes} from '../../config';
import {getH5_url} from '@/config'
export default
class LiveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageDetail: {}, // 包装详情
      liveDetail: {},    // 直播信息
      noticeDetail: {},    // 直播预告
      open: {},    // 直播预告
      form: {
        title: ''
      },
      rules: {
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
      },
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
      // console.log(resp)
      if (resp.code === '0') {
        this.setState({
          packageDetail: resp.data.package || {},
          liveDetail: resp.data.live || {},
          noticeDetail: resp.data.notice || {},
          open: resp.data.open || {},
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
  // 拷贝
  copyText = (text = '') => {
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
  // 获取直播场景
  getSceneName = (value) => {
    let adItem = scenes.find(item => {
        return item.value === value
      }) || {};
    const adType = adItem.name || '未知';
    return adType;
  };

  edit_title = () => {
    // this.handleReset('ruleForm');
    // const {packageDetail} = this.state;
    // const form = {...packageDetail};
    // this.setState({
    //   dialogVisible: true,
    //   form: form
    // })

    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/baseInfo`);

  };
  // 详情弹框编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };
  close_dialog = () => {
    this.setState({
      dialogVisible: false
    })
  };
  handleSubmit = () => {
    const {packageID} = this.props.match.params;
    this.validate_form('ruleForm', () => {
      const {form} = this.state;
      httpRequest({
        url: api.packageEdit,
        type: 'post',
        data: {
          id: packageID,
          title: form.title,
          scene: form.scene,
        }
      }).done((resp) => {
        if (resp.code === '0') {
          this.setState({
            dialogVisible: false
          });
          Message.success('修改成功');
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

  // 跳转到直播镜头
  goCamera = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/liveCamera`);
  };
  // 跳转到推广设置
  goMarket = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/marketing?tab=2`);
  };
  // 跳转到投票
  goVote = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/vote`);
  };
  // 跳转到答题
  goQuestion = () => {
    const {packageID} = this.props.match.params;
    this.props.history.push(`/h5Package/${packageID}/question`);
  };
  getNoticeType = (type) => {
    let typeName = '';
    switch (type) {
      case 'image':
        typeName = '图片预告';
        break;
      case 'video':
        typeName = '视频预告';
        break;
      default:
        typeName = '暂无预告';
        break;
    }
    return typeName;
  };

  getQuestion = () => {
    const {open = {}} = this.state;
    const correct = open.correct || {};
    let text = '暂无答题';

    if (correct.id) {
      text = `已发起答题`
    }
    return text;
  };
  getVote = () => {
    const {open = {}} = this.state;
    const vote = open.vote || {};
    let text = '暂无投票';

    if (vote.id) {
      text = `已发起， 截至时间: ${vote.gmt_end}`
    }
    return text;
  };
  getAd = () => {
    const {open = {}} = this.state;
    const {ads = []} = open;
    let text = '暂无广告';
    if (ads.length > 0) {
      const textArr = ads.map(item => {
        return this.getAdType(item.type)
      });
      text = textArr.join(' + ');
    }
    return text;
  };
  getAdType = (type) => {
    let typeName = '';
    switch (type) {
      case 'stop':
        typeName = '暂停广告';
        break;
      case 'page':
        typeName = 'banner广告';
        break;
      case 'window':
        typeName = '悬浮广告';
        break;
      default:
        typeName = '未知广告';
        break;
    }
    return typeName;
  };


  render() {
    const {packageDetail, form, dialogVisible, noticeDetail} = this.state;
    const liveUrl = getH5_url(packageDetail.id);
    return (
      <div className="live_detail">
        <div className="live_detail_content">
          <div className="form_box">
            <div className="form_item">
              <div className="item_label">频道名称：</div>
              <div className="item_operate">
                <Button size='small'
                        type='text'
                        onClick={this.edit_title}>前往修改</Button>
              </div>
              <div className="item_value">{packageDetail.title}</div>
            </div>

            <div className="form_item">
              <div className="item_label">场景类型：</div>
              {/*<div className="item_operate"><Button size='small' type='text'>修改</Button></div>*/}
              <div className="item_value">{this.getSceneName(packageDetail.scene)}</div>
            </div>
            <div className="form_item">
              <div className="item_label">直播预告：</div>
              <div className="item_operate">
                <Button size='small' type='text' onClick={this.goCamera}>前往修改</Button>
              </div>
              <div className="item_value">{this.getNoticeType(noticeDetail.type)}</div>
            </div>
            <div className="form_item">
              <div className="item_label">广告功能：</div>
              <div className="item_operate">
                <Button size='small' type='text' onClick={this.goMarket}>前往修改</Button>
              </div>
              <div className="item_value">{this.getAd()}</div>
            </div>
            <div className="form_item">
              <div className="item_label">互动投票：</div>
              <div className="item_operate">
                <Button size='small' type='text' onClick={this.goVote}>前往修改</Button>
              </div>
              <div className="item_value">{this.getVote()}</div>
            </div>
            <div className="form_item">
              <div className="item_label">互动答题：</div>
              <div className="item_operate">
                <Button size='small' type='text' onClick={this.goQuestion}>前往修改</Button>
              </div>
              <div className="item_value">{this.getQuestion()}</div>
            </div>
            {/*<div className="form_item">*/}
            {/*<div className="item_label">直播开始时间：</div>*/}
            {/*<div className="item_operate">*/}
            {/*<Button size='small' type='text' onClick={this.goCamera}>前往修改</Button>*/}
            {/*</div>*/}
            {/*<div className="item_value">{noticeDetail.gmt_start ? noticeDetail.gmt_start : '暂无'}</div>*/}
            {/*</div>*/}
            {/*<div className="form_item">*/}
            {/*<div className="item_label">广告功能：</div>*/}
            {/*<div className="item_operate"><Button size='small' type='text'>修改</Button></div>*/}
            {/*<div className="item_value">页面广告+弹窗广告</div>*/}
            {/*</div>*/}
            {/*<div className="form_item">*/}
            {/*<div className="item_label">观看限制：</div>*/}
            {/*<div className="item_operate"><Button size='small' type='text'>修改</Button></div>*/}
            {/*<div className="item_value">无设置</div>*/}
            {/*</div>*/}
            {/*<div className="form_item">*/}
            {/*<div className="item_label">最大同时在线人数：</div>*/}
            {/*<div className="item_operate"><Button size='small' type='text'>修改</Button></div>*/}
            {/*<div className="item_value">无设置</div>*/}
            {/*</div>*/}
            <div className="form_item">
              <div className="item_label">H5观看链接：</div>
              <div className="item_operate">
                <Button size='small'
                        onClick={this.copyText.bind(this, liveUrl)}
                        type='text'>复制地址</Button></div>
              <div className="item_value">{liveUrl}</div>
            </div>
            {/*<div className="form_item">*/}
            {/*<div className="item_label">推流地址：</div>*/}
            {/*<div className="item_operate">*/}
            {/*<Button size='small'*/}
            {/*type='text'*/}
            {/*onClick={this.copyText.bind(this, liveDetail.pull_url)}>复制地址</Button>*/}
            {/*</div>*/}
            {/*<div className="item_value">{liveDetail.pull_url}</div>*/}
            {/*</div>*/}
          </div>
          <Dialog
            title='新建H5直播包装'
            visible={ dialogVisible }
            closeOnClickModal={false}
            onCancel={ this.close_dialog }
          >
            <Dialog.Body>
              <Form model={form}
                    ref="ruleForm"
                    rules={this.state.rules}
                    labelWidth="80">
                <Form.Item label="频道名称" prop="title">
                  <Input value={form.title}
                         maxLength={30}
                         placeholder='请输入频道名称'
                         onChange={this._onChange.bind(this, 'title', 'form')}
                         autoComplete="off"/>
                  <span className="limitNum">{form.title.length} / 30</span>
                </Form.Item>
              </Form>
            </Dialog.Body>

            <Dialog.Footer className="dialog-footer">
              <Button onClick={ this.close_dialog }>取 消</Button>
              <Button type="primary"
                      onClick={ this.handleSubmit}>确 认</Button>

            </Dialog.Footer>
          </Dialog>
        </div>
      </div>
    );
  }
}