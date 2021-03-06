import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import 'expose-loader?$!expose-loader?jQuery!jquery';
import WebUploader from '../web/webuploader.nolog.min';

const uploadStatusConfig = {
  init: {
    btn: '开始上传',
    clickName: 'upload',
    barClassName: 'process-bar',
  },
  md5: {
    btn: '计算md5中...',
    barClassName: 'process-bar',
  },
  process: {
    btn: '上传中 ...',
    barClassName: 'process-bar',
  },
  done: {
    btn: '上传完成',
    barClassName: 'process-bar success-bar',
  },
  error: {
    btn: '继续上传',
    clickName: 'retry',
    barClassName: 'process-bar error-bar',
  },
  synthetize: {
    btn: '合成中...',
    barClassName: 'process-bar',
  },
  success: {
    btn: '查看镜像',
    barClassName: 'process-bar success-bar',
  },
};

const currying = (fn, ...ahead) => (...behind) => fn(...ahead, ...behind);

export default class LargeUploader extends React.Component {
  static defaultProps = {
    options: {},
    onChange: () => {},
    width: 700,
    border: true,
    children: <div className="btn-primary" >选择文件</div>,
    beforeFileQueued: () => true,
    fillDataBeforeSend: () => ({}),
    uploadResponse: () => true,
  }

  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
    width: PropTypes.number,
    border: PropTypes.bool,
    children: PropTypes.element,
    beforeFileQueued: PropTypes.func,
    fillDataBeforeSend: PropTypes.func,
    uploadResponse: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      fileList: [],
      error: '',
      response: null,
    };
  }

  componentDidMount() {
    const { options } = this.props;
    const uploader = WebUploader.create({
      chunked: true,
      chunkSize: 5 * 1024 * 1024,
      pick: '#picker',
      chunkRetry: 3,
      threads: 1,
      fileSizeLimit: 2000 * 1024 * 1024,
      fileSingleSizeLimit: 2000 * 1024 * 1024,
      ...options,
      auto: false,
    });
    uploader.on('beforeFileQueued', this.handleBeforeFileQueued);
    uploader.on('fileQueued', this.handleFileQueued);
    uploader.on('uploadBeforeSend', this.handleBeforeSend);
    uploader.on('uploadProgress', this.handleUploadProgress);
    uploader.on('uploadAccept', this.handleUploadAccept);
    uploader.on('uploadError', this.handleUploadError);
    uploader.on('uploadSuccess', this.handleUploadSuccess);
    this.uploader = uploader;
  }

  setFileItem = (key, value, id) => {
    return new Promise((resolve) => {
      const { fileList } = this.state;
      const copy = [...fileList];
      const result = copy.filter(item => item.id === id);
      if (result.length) {
        result[0][key] = value;
        this.setState({
          fileList: copy,
        }, () => { resolve(); });
      }
    });
  }

  setUploadStatus = currying(this.setFileItem, 'uploadStatus')

  handleBeforeFileQueued = file => {
    const { beforeFileQueued } = this.props;
    return beforeFileQueued(file);
  }

  handleFileQueued = file => {
    const { fileList } = this.state;
    const { options: { auto } } = this.props;
    file.percentage = 0;
    file.uploadStatus = 'md5';
    file.image_name = '';
    file_md5 = file.name + file.size + file.lastModifiedDate
    this.uploader.md5File(file_md5)
      .progress(() => {
        this.setUploadStatus('md5', file.id);
      })
      // 完成
      .then((val) => {
        this.setUploadStatus('init', file.id);
        this.setFileItem('md5Val', val, file.id);
        if (auto && file.uploadStatus !== 'done') this.uploader.upload(file, file.id);
      });
    this.setState({
      fileList: [...fileList, file],
    });
  }

  handleBeforeSend = (block, data) => {
    const { file: { md5Val, id }, chunks } = block;
    const { fillDataBeforeSend } = this.props;
    const v = fillDataBeforeSend();
    Object.assign(data, v);
    if (chunks === 1) { // 未切片的加入默认值
      data.chunks = 1;
      data.chunk = 0;
    }
    // data 中 加入 md5 值
    data.md5Value = md5Val;
    this.setUploadStatus('process', id);
  }

  handleUploadProgress = (file, percentage) => {
    this.setFileItem('percentage', percentage, file.id);
  }

  handleUploadAccept = (file, ret) => {
    const { uploadResponse } = this.props;
    this.setState({
      response: ret,
    });
    return uploadResponse(file, ret);
  }

  handleUploadError = (file, reason) => {
    file.error = reason;
    this.setUploadStatus('error', file.id).then(() => {
      this.props.onChange(file, this.state.fileList);
    });
  }

  handleUploadSuccess = (file, res) => {
    window.console.log('handleUploadSuccess');
    file.response = res._raw;
    this.setUploadStatus('done', file.id).then(() => {
      this.props.onChange(file, this.state.fileList);
    });
    // const time = window.setTimeout(() => {
    //   $.ajax({
    //     type: 'POST',
    //     contentType: 'application/json;charset=UTF-8',
    //     url: '/api/bigai/v1/project/image/upload/after',
    //     beforeSend: function(xhr) {
    //       xhr.setRequestHeader("X-CSRFToken", this.state.CSRF_token);
    //     },
    //     data: JSON.stringify({
    //       job_name: this.state.response.job_name,
    //       namespace: this.state.response.namespace,
    //     }),
    //   }).then((result) => {
    //     window.console.log('success: ', result);
    //     if (result.code === 202) {
    //       this.setUploadStatus('synthetize', file.id).then(() => {
    //         this.props.onChange(file, this.state.fileList);
    //       });
    //     } else if (result.code === 200) {
    //       this.setUploadStatus('success', file.id).then(() => {
    //         this.props.onChange(file, this.state.fileList);
    //       });
    //       window.clearTimeout(time);
    //     } else {
    //       this.setState({
    //         error: result.message,
    //       });
    //     }
    //   }).catch((err) => {
    //     window.console.log('error: ', err);
    //     this.setState({
    //       error: `${err.status}: ${err.statusText}`,
    //     });
    //   });
    // }, 10000);
  }

  upload = (id) => () => {
    const key = 'csrf-token=';
    let CSRF_token = '';
    const { fileList } = this.state;
    const index = fileList.findIndex((item) => item.id === id);
    const curFile = fileList[index];
    const len = curFile.image_name.length
    if (!curFile.image_name) {
      this.setState({
        error: '镜像名不能为空！',
      });
    } else if (curFile.image_name.substring(len - 4) !== '.tar') {
      this.setState({
        error: '文件后缀名不对，应该以 .tar 结尾',
      });
    } else {
      const file_name = this.ch2Unicdoe(curFile.image_name);
      if (document.cookie.split(';').filter((item) => item.trim().startsWith(key)).length) {
        const arr = document.cookie.split(';');
        const length = arr.length;
        for (let i = 0; i < length; i ++) {
          if (arr[i].indexOf(key) > -1) {
            CSRF_token = arr[i].split(key)[1];
          }
        }
      }
      $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        url: '/api/bigai/v1/project/image/upload/before',
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", CSRF_token);
        },
        data: JSON.stringify({ image_name: file_name.substring(0, file_name.length - 4) }),
      }).then((result) => {
        window.console.log('success: ', result);
        if (result.code === 200) {
          this.uploader.upload(id);
          this.setState({
            error: '',
          });
        } else {
          this.setState({
            error: result.message,
          });
        }
      }).catch((err) => {
        window.console.log('error: ', err);
        this.setState({
          error: `${err.status}: ${err.statusText}`,
        });
      });
    }
  }

  retry = (id) => () => {
    this.setUploadStatus('process', id);
    this.uploader.retry(this.uploader.getFile(id));
  }

  deleteFile = (id) => () => {
    const { fileList } = this.state;
    const index = fileList.findIndex((item) => item.id === id);
    const curFile = fileList[index];
    fileList.splice(index, 1);
    this.setState({
      fileList,
      error: '',
    }, () => {
      this.props.onChange(curFile, this.state.fileList);
    });
    this.uploader.removeFile(this.uploader.getFile(id, true));
  }

  isChinese = (str) => {
    return /[\u4e00-\u9fa5]/.test(str);
  }

  ch2Unicdoe = (str) => {
    if (!str) {
      return;
    }
    const length = str.length;
    let unicode = '';
    for (let i = 0; i < length; i++) {
      const temp = str.charAt(i);
      if (this.isChinese(temp)) {
        unicode += '\\u' +  temp.charCodeAt(0).toString(16);
      } else {
        unicode += temp;
      }
    }
    return unicode;
  }

  // resetName = (id, name) => () => {
  //   let fileList = this.state.fileList;
  //   const index = fileList.findIndex((item) => item.id === id);
  //   fileList[index].canIRename = true;
  //   this.setState({
  //     file_name: name,
  //     fileList,
  //   });
  // }

  // renameFile = (id) => () => {
  //   const { fileList, file_name } = this.state;
  //   console.log('fileList, file_name ', fileList, file_name)
  //   const index = fileList.findIndex((item) => item.id === id);
  //   const curFile = fileList[index];
  //   curFile.name = file_name;
  //   curFile.canIRename = false;
  //   this.setState({
  //     fileList,
  //   }, () => {
  //     this.props.onChange(curFile, this.state.fileList);
  //   });
  // }

  handleRename(e, id) {
    window.console.log('handleRename', e, id);
    window.console.log('handleRename', e.target.value);
    const { fileList } = this.state;
    const index = fileList.findIndex((item) => item.id === id);
    const curFile = fileList[index];
    
    curFile.image_name = e.target.value;
    this.setFileItem('image_name', e.target.value, id);
    this.setState({
      fileList,
    });
  }

  // renderName(item) {
  //   const { file_name } = this.state;
  //   const { name, id, canIRename } = item;
  //   if (canIRename) {
  //     return (
  //       <Fragment>
  //         <input type="text" className="file-name" defaultValue={file_name} onChange={(e) => this.handleRename(e, id)} />
  //         <span className="rename-button" onClick={this.renameFile(id)}>确认</span>
  //       </Fragment>
  //     );
  //   }
  //   return (
  //     <Fragment>
  //       <span className="file-name">{name}</span>
  //       <span className="rename-button" onClick={this.resetName(id, name)}>重命名</span>
  //     </Fragment>
  //   );
  // }


  renderFileList() {
    const { fileList } = this.state;
    return fileList.map((item) => {
      const { id, percentage, uploadStatus, name, image_name } = item;
      const { clickName, btn, barClassName } = uploadStatusConfig[uploadStatus];
      return (
        <div key={id} className="file-item" >
          <div className="file-box">
            <p>文件名：</p>
            <span className="file-name">{name}</span>
            <p>镜像名称：</p>
            <input type="text" className="file-name" defaultValue={image_name} onChange={(e) => this.handleRename(e, id)} />
          </div>
          <div className="file-box">
            <span className={`file-status ${uploadStatus}-status`} onClick={this[clickName] ? this[clickName](id) : null}>{btn}</span>
            <span className="delete" onClick={this.deleteFile(id)}>x</span>
          </div>
          <div className="process">
            <div className={barClassName} style={{ width: `${percentage * 100}%` }} />
          </div>
        </div>
      );
    });
  }

  render() {
    const { children, border, width } = this.props;
    const { error } = this.state;
    const style = border ? { width } : { width, border: 'none' };
    return (
      <div className="large-uploader" style={style}>
        <div className="file-list">
          {this.renderFileList()}
        </div>
        <div id="picker">
          {children}
        </div>
        <p>{error}</p>
      </div>
    );
  }
}
