import React, {Component} from 'react'

import api from '@/API/api'
import httpRequest from '@/utils/httpRequest'
import {Message, Loading, Button} from "element-react";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './upload.scss'
// import ks3FileUploader from '@/public/ks3jssdk'
export default
class Ks3Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',  // 上传文件返回的地址
      isUpload: false,
      percent: 0,
      props: '',
      ks3uploadDomain: 'http://ks3-cn-beijing.ksyun.com/enjoycut' // ks3上传文件域名
    };
    this.tempUpload = null;
    this.ks3Data = {};
  }

  componentWillReceiveProps(nextProps) {
    const {cover} = this.props;
    const nextCover = nextProps.cover;
    if (cover !== nextCover) {  // 重置url
      this.setState({
        imageUrl: '',  // 上传文件返回的地址
        isUpload: false,
        percent: 0
      })
    }
  };

  componentWillMount() {

  }

  componentDidMount() {
    if (!document.querySelector('#pluploadJS')) {
      window.$('head').append(`<script id="pluploadJS" src="/ks3/plupload.full.min.js"></script>`)
    }
    if (!document.querySelector('#ks3jssdkJS')) {
      window.$('head').append(`<script id="ks3jssdkJS" src="/ks3/ks3jssdk.min.js"></script>`)
    }
    // if (!document.querySelector('#test2JS')) {
    //   window.$('head').append(`<script id="test2JS" src="/ks3/test2.js"></script>`)
    // }
    const {disabled = false} = this.props;
    if (!disabled) {
      this.initKs3();
    }
  }

  componentWillUnmount() {
  }
  initKs3 = () => {
    const {ks3uploadDomain} = this.state;
    const _this = this;
    const ks3Options = {
      key: '',
      uploadDomain: ks3uploadDomain,
      // autoStart: true,
      onInitCallBack: function (uploader) {

      },
      onErrorCallBack: function (uploader, error) {
        _this.upload_error(error)
      },
      // 文件添加到浏览器时调用的回调函数
      onFilesAddedCallBack: function (uploader, obj) {
        // console.log('onFilesAddedCallBack');
        const filename = obj[0].name;
        const ks3Data = _this.getKs3Data(filename);
        if (!ks3Data.key) {
          return false;
        }
        uploader.setOption("params", {
          "key": ks3Data.key,
          KSSAccessKeyId: ks3Data.KSSAccessKeyId,
          policy: ks3Data.Policy,
          signature: ks3Data.Signature,
          acl: ks3Data.acl,
        });
        uploader.start();
      },

      // 上传进度时调用的回调函数
      onUploadProgressCallBack: function (uploader, file) {
        _this.progressHandlingFunction(file.percent)
      },
      onFileUploadedCallBack: function (uploader) {
        _this.upload_success(uploader);
      },
      onStartUploadFileCallBack: function () {
        _this.upload_start();
      }
    };

    var pluploadOptions = {
      browse_button: _this.refs.upload_wrapper, //触发对话框的DOM元素自身或者其ID
      drop_element: document.body,
      // multipart: false,      // 为true时将以multipart/form-data的形式来上传文件，为false 时则以二进制的格式来上传文件。
      multi_selection: false
    };
    _this.tempUpload = new window.ks3FileUploader(ks3Options, pluploadOptions);
  };

  /*获取initKs3数据*/
  getKs3Data = (fileName) => {
    let ks3Data  = {};
    const {fileType = 'image'} = this.props; // 上传文件的类型 默认是图片
    httpRequest({
      url: api.ks3Upload,
      type: 'POST',
      async: false, // 同步
      data: {
        file_name: fileName || '',
        type: fileType
      },
      dataType: 'json',
    }).done((res) => {
      if (res.code / 1 === 0) {
        ks3Data = res.data;
      } else {
        Message.error(res.msg);
        this.setState({
          isUpload: false
        });
        if (this.props.errorCallBack) {
          this.props.errorCallBack(res.msg)
        }
      }
    }).fail((err) => {
      Message.error('文件上传失败 内部服务器错误 ' + err.status);
      this.setState({
        isUpload: false
      });
      if (this.props.errorCallBack) {
        this.props.errorCallBack('文件上传失败');
      }
    });
    this.ks3Data = ks3Data;
    return ks3Data
  };

  // 开始上传文件
  upload_start = () => {
    this.setState({
      isUpload: true,
      percent: 0
    });
  };
  upload_success = (uploader) => {
    // let filename = uploader.files[0].name;
    // const index1 = filename.lastIndexOf(".");
    // const index2 = filename.length;
    // const suffix = filename.substring(index1, index2);//后缀名
    const file_url = this.ks3Data.file_url;
    // console.log(file_url);
    this.setState({
      imageUrl: file_url,
      isUpload: false,
      percent: 100
    });
    this.props.successCallBack(file_url);
  };
  upload_error = (error) => {
    console.log('文件上传失败:-->',error);
    Message.error('文件上传失败' + error.message);
    this.setState({
      isUpload: false
    });
    if (this.props.errorCallBack) {
      this.props.errorCallBack('文件上传失败');
    }
  };
  imageErr = () => {
    Message.error('图片加载失败');
  };
  // 上传进度监听
  progressHandlingFunction = (percent) => {
    console.log(percent, '《-- 上传进度percent');
    this.setState({
      percent
    })
  };

  render() {
    const {isUpload, imageUrl, percent} = this.state;
    const {cover, fileType = 'image', showButton, disabled} = this.props;
    const {style} = this.props;
    const box_style = {
      width: '140px',
      height: '80px',
      ...style
    };
    // const fileAccept = accept || 'image/*'; // 默认只能上传图片
    const imageCover = imageUrl || cover;
    // 
    return (
      <div ref={'upload_wrapper'}
           className={classnames('upload-wrapper', {disabled: disabled})}
        // onClick={this.uploadClick}
      >
        {!showButton ? <Loading loading={isUpload} text={`文件上传中 ${percent}%`}>
          <div className="upload-box-inner"
               style={box_style}>
            {fileType === 'image' ? (imageCover ? <img src={imageCover} onError={this.imageErr} alt=""/> :
              <i className="uploader-icon"/>)
              : <i className="uploader-icon"/>
            }
          </div>
        </Loading> : (
          <Button size='small'
                  loading={isUpload}
                  type='info'>{isUpload ? `上传中...${percent}%` : '上传文件'}</Button>
        )}

      </div>
    )
  }
}
Ks3Upload.propTypes = {
  successCallBack: PropTypes.func.isRequired,
  errorCallBack: PropTypes.func,
  // showButton: PropTypes.boolean,     // 是否显示按钮默认为false
  // disabled: PropTypes.boolean,     // 是否不能点击按钮默认为false
  accept: PropTypes.string,     // 接受文件限制后缀
  uploadType: PropTypes.string, // 上传文件类型 image / audio / video
  maxSize: PropTypes.number, // 上传文件大小 M
};