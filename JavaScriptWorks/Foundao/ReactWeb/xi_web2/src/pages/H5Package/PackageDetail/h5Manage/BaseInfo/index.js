import React, {Component} from 'react';
import {Form, Input, Button, Message, Notification} from 'element-react';


import httpRequest from '@/utils/httpRequest';
import tool from '@/utils/tool';
import api from '@/API/api'
import {scenes} from '../../../../H5Package/config'
import Upload from '@/components/Ks3Upload';
import './index.scss'
/*图文直播*/
export default
class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      packageID: '',
      form: {
        title: '',
        scene: '',
        img_url: '',  //上传的H5icon链接
        background_url: '' //上传的背景图片链接
      },
      rules: {
        title: {required: true, message: '标题不能为空', trigger: 'blur'},
        img_url: {required: true, message: '图片不能为空', trigger: 'blur'},
        background_url: {required: true, message: '图片不能为空', trigger: 'blur'},
      },
      is_loading: false
    };
  }

  componentDidMount() {
    const {packageID} = this.props.match.params;
    this.setState({
      packageID: packageID
    }, () => {
      this.getList()
    })
  }

  componentWillUnmount() {
    tool.hide_loading()
  }

  // 标题onchange
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };

  getList = () => {
    this.setState({
      is_loading: true,
      data: [],
    });
    httpRequest({
      url: api.packageDetail,
      type: 'post',
      data: {
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      let data = resp.data;
      const {form} = this.state
      if (resp.code / 1 === 0) {
        this.setState({
          form: {
            ...form,
            title: data.package.title,
            scene: data.package.scene,
            img_url: data.package.icon,
            background_url: data.package.back_img
          },
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

  // 文件上传成功
  uploadSuccess = (key, url) => {
    this.setState({
      form: Object.assign({}, this.state.form, {[key]: url})
    })
  };

  handleSubmit = () => {
    this.validate_form('ruleForm', () => {
      this.handleSave()
    });
  };

  handleSave = () => {
    const {form} = this.state
    httpRequest({
      url: api.BaseInfoManger,
      type: 'post',
      data: {
        title: form.title,
        id: this.state.packageID,
        icon: form.img_url,
        back_img: form.background_url
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        Message.success('保存成功');
        this.setState({
          is_loading: false
        })
      } else {
        Message.error(resp.msg);
        this.setState({
          is_loading: false
        })
      }
    }).fail((err) => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  }
  getSceneName = (value) => {
    let sceneName = '';
    const currentScene = scenes.find(item => {
      return item.value === value
    });
    if (currentScene) {
      sceneName = currentScene.name;
    } else {
      sceneName = '暂无数据';
    }
    return sceneName;
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

  render() {
    const {form} = this.state
    return (
      <div className="setBaseInfo">
        <div className='baseInfoContent'>
          <h4>基础信息</h4>
          <Form model={form}
                ref="ruleForm"
                rules={this.state.rules}
                labelWidth="100">

            <Form.Item label="直播标题：" prop="title">
              <Input value={form.title}
                     onChange={this._onChange.bind(this, 'title', 'form')}
                     placeholder='输入标题'
                     maxLength={16}
                     autoComplete="off"/>
              <span className="limitNum">{form.title.length} / 16</span>
            </Form.Item>
            <Form.Item label='场景类型：' prop='scene'>
              <span>{this.getSceneName(form.scene)}</span>
            </Form.Item>
            <div className="h5Icon">
              <Form.Item label='H5图标：' prop='img_url'>
                <Upload cover={form.img_url}
                        type={'h5Icon'}
                        successCallBack={this.uploadSuccess.bind(this, 'img_url')}/>
                <span className="min_tips">(建议尺寸 100 * 100)</span>
              </Form.Item>
            </div>
            {/*活动模板才有背景图片*/}
            {form.scene === 'activity' ? (<div className="backgroundPicture">
              <Form.Item label='背景图片：' prop='background_url'>
                <Upload cover={form.background_url}
                        type={'backgroundPicture'}
                        successCallBack={this.uploadSuccess.bind(this, 'background_url')}/>
                <span className="min_tips">(建议尺寸 750 * 1625)</span>
              </Form.Item>
            </div>) : ''}
            <Form.Item label='' prop=''>
              <div style={{textAlign: 'center'}}>
                <Button size='small' type='primary' onClick={this.handleSubmit}>保存</Button>
              </div>
            </Form.Item>
          </Form>
          <div className='h5Preview'>
            <h4>H5端预览</h4>
            <img src={require('../../../../../assets/H5yulan.png')} alt=""/>
          </div>

        </div>
      </div>
    );
  }
}