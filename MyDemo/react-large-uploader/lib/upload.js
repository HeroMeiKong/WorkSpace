'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('expose-loader?$!expose-loader?jQuery!jquery');

var _webuploaderNolog = require('../web/webuploader.nolog.min');

var _webuploaderNolog2 = _interopRequireDefault(_webuploaderNolog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uploadStatusConfig = {
  init: {
    btn: '开始上传',
    clickName: 'upload',
    barClassName: 'process-bar'
  },
  md5: {
    btn: '计算md5中...',
    barClassName: 'process-bar'
  },
  process: {
    btn: '上传中 ...',
    barClassName: 'process-bar'
  },
  done: {
    btn: '上传完成',
    barClassName: 'process-bar success-bar'
  },
  error: {
    btn: '重新上传',
    clickName: 'retry',
    barClassName: 'process-bar error-bar'
  },
  synthetize: {
    btn: '合成中...',
    barClassName: 'process-bar'
  },
  success: {
    btn: '上传成功',
    barClassName: 'process-bar success-bar'
  },
  fail: {
    btn: '等待超时',
    barClassName: 'process-bar error-bar'
  },
  check_fail: {
    btn: '查询失败',
    barClassName: 'process-bar error-bar'
  }
};

var currying = function currying(fn) {
  for (var _len = arguments.length, ahead = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    ahead[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, behind = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      behind[_key2] = arguments[_key2];
    }

    return fn.apply(undefined, ahead.concat(behind));
  };
};

var LargeUploader = function (_React$Component) {
  _inherits(LargeUploader, _React$Component);

  function LargeUploader() {
    _classCallCheck(this, LargeUploader);

    var _this = _possibleConstructorReturn(this, (LargeUploader.__proto__ || Object.getPrototypeOf(LargeUploader)).call(this));

    _this.setFileItem = function (key, value, id) {
      return new Promise(function (resolve) {
        var fileList = _this.state.fileList;

        var copy = [].concat(_toConsumableArray(fileList));
        var result = copy.filter(function (item) {
          return item.id === id;
        });
        if (result.length) {
          result[0][key] = value;
          _this.setState({
            fileList: copy
          }, function () {
            resolve();
          });
        }
      });
    };

    _this.setUploadStatus = currying(_this.setFileItem, 'uploadStatus');

    _this.handleBeforeFileQueued = function (file) {
      var beforeFileQueued = _this.props.beforeFileQueued;

      return beforeFileQueued(file);
    };

    _this.handleFileQueued = function (file) {
      var fileList = _this.state.fileList;
      var auto = _this.props.options.auto;

      file.percentage = 0;
      file.uploadStatus = 'md5';
      file.image_name = '';
      _this.uploader.md5File(file, 0, 10 * 1024 * 1024).progress(function () {
        _this.setUploadStatus('md5', file.id);
      })
      // 完成
      .then(function (val) {
        _this.setUploadStatus('init', file.id);
        _this.setFileItem('md5Val', val, file.id);
        if (auto && file.uploadStatus !== 'done') _this.uploader.upload(file, file.id);
      });
      _this.setState({
        fileList: [].concat(_toConsumableArray(fileList), [file])
      });
    };

    _this.handleBeforeSend = function (block, data) {
      var _block$file = block.file,
          md5Val = _block$file.md5Val,
          id = _block$file.id,
          chunks = block.chunks;
      var fillDataBeforeSend = _this.props.fillDataBeforeSend;

      var v = fillDataBeforeSend();
      Object.assign(data, v);
      if (chunks === 1) {
        // 未切片的加入默认值
        data.chunks = 1;
        data.chunk = 0;
      }
      // data 中 加入 md5 值
      data.md5Value = md5Val;
      _this.setUploadStatus('process', id);
    };

    _this.handleUploadProgress = function (file, percentage) {
      _this.setFileItem('percentage', percentage, file.id);
    };

    _this.handleUploadAccept = function (file, ret) {
      var uploadResponse = _this.props.uploadResponse;

      _this.setState({
        response: ret
      });
      return uploadResponse(file, ret);
    };

    _this.handleUploadError = function (file, reason) {
      file.error = reason;
      _this.setState({
        error: file.name + ': ' + reason.message
      });
      _this.setUploadStatus('error', file.id).then(function () {
        _this.props.onChange(file, _this.state.fileList);
      });
    };

    _this.handleUploadSuccess = function (file, res) {
      var CSRF_token = '';
      var key = 'csrf-token=';
      file.response = res._raw;
      var parmas = _this.resetImageName(file.image_name);
      window.console.log('parmas: ', parmas);
      _this.setUploadStatus('done', file.id).then(function () {
        var sendTime = 0;
        file.globalTime = window.setInterval(function () {
          sendTime += 1;
          window.console.log('times: ', sendTime);
          if (sendTime < 100) {
            if (document.cookie.split(';').filter(function (item) {
              return item.trim().startsWith(key);
            }).length) {
              var arr = document.cookie.split(';');
              var length = arr.length;
              for (var i = 0; i < length; i++) {
                if (arr[i].indexOf(key) > -1) {
                  CSRF_token = arr[i].split(key)[1];
                }
              }
            }
            $.ajax({
              type: 'GET',
              contentType: 'application/json;charset=UTF-8',
              url: '/api/bigai/v1/project/image/upload/after',
              beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader("X-CSRFToken", CSRF_token);
              },
              data: {
                // job_name: this.state.response.data.job_name,
                // namespace: this.state.response.data.namespace,
                project: parmas.project,
                name: parmas.name,
                tag: parmas.tag
              }
            }).then(function (result) {
              window.console.log('success: ', result);
              // if (result.code === 202) {
              //   if (sendTime > 4) {
              //     this.setUploadStatus('check_fail', file.id).then(() => {
              //       this.props.onChange(file, this.state.fileList);
              //     });
              //     this.setState({
              //       error: `查询${file.name}失败，请前往后台查看文件是否存在！`,
              //     });
              //     window.clearInterval(file.globalTime);
              //   }
              // } else if (result.code === 201) {
              //   // this.setUploadStatus('synthetize', file.id).then(() => {
              //   //   this.props.onChange(file, this.state.fileList);
              //   // });
              // } else if (result.code === 200) {
              //   this.setUploadStatus('success', file.id).then(() => {
              //     this.props.onChange(file, this.state.fileList);
              //   });
              //   window.clearInterval(file.globalTime);
              // } else {
              //   this.setState({
              //     error: `${file.name}: ${result.message}`,
              //   });
              //   window.clearInterval(file.globalTime);
              // }
              if (result.code === 20207) {
                // 不作为
              } else if (result.code === 200) {
                _this.setUploadStatus('success', file.id).then(function () {
                  _this.props.onChange(file, _this.state.fileList);
                });
                window.clearInterval(file.globalTime);
              } else {
                _this.setState({
                  error: file.name + ': ' + result.message
                });
                window.clearInterval(file.globalTime);
              }
            }).catch(function (err) {
              _this.setState({
                error: file.name + ', ' + err.status + ': ' + err.statusText
              });
              window.clearInterval(file.globalTime);
            });
          } else {
            // 超时
            _this.setUploadStatus('fail', file.id).then(function () {
              _this.props.onChange(file, _this.state.fileList);
            });
            _this.setState({
              error: file.name + ': \u7B49\u5F85\u65F6\u95F4\u8FC7\u957F\uFF0C\u8BF7\u524D\u5F80\u540E\u53F0\u67E5\u770B\u6587\u4EF6\u4E0A\u4F20\u662F\u5426\u6210\u529F'
            });
            window.clearInterval(file.globalTime);
          }
        }, 10000);
        _this.props.onChange(file, _this.state.fileList);
        _this.setUploadStatus('synthetize', file.id).then(function () {
          _this.props.onChange(file, _this.state.fileList);
        });
      });
    };

    _this.upload = function (id) {
      return function () {
        var key = 'csrf-token=';
        var CSRF_token = '';
        var fileList = _this.state.fileList;

        var index = fileList.findIndex(function (item) {
          return item.id === id;
        });
        var curFile = fileList[index];
        if (!curFile.image_name) {
          _this.setState({
            error: '镜像名不能为空！'
          });
        } else {
          var file_name = _this.ch2Unicdoe(curFile.image_name);
          if (document.cookie.split(';').filter(function (item) {
            return item.trim().startsWith(key);
          }).length) {
            var arr = document.cookie.split(';');
            var length = arr.length;
            for (var i = 0; i < length; i++) {
              if (arr[i].indexOf(key) > -1) {
                CSRF_token = arr[i].split(key)[1];
              }
            }
          }
          $.ajax({
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: '/api/bigai/v1/project/image/upload/before',
            beforeSend: function beforeSend(xhr) {
              xhr.setRequestHeader("X-CSRFToken", CSRF_token);
            },
            data: JSON.stringify({ image_name: file_name })
          }).then(function (result) {
            window.console.log('success: ', result);
            if (result.code === 200) {
              _this.uploader.upload(id);
              _this.setState({
                error: ''
              });
            } else {
              _this.setState({
                error: curFile.name + ': ' + result.message
              });
            }
          }).catch(function (err) {
            window.console.log('error: ', err);
            _this.setState({
              error: curFile.name + ', ' + err.status + ': ' + err.statusText
            });
          });
        }
      };
    };

    _this.retry = function (id) {
      return function () {
        _this.setUploadStatus('process', id);
        _this.uploader.retry(_this.uploader.getFile(id));
      };
    };

    _this.deleteFile = function (id) {
      return function () {
        var fileList = _this.state.fileList;

        var index = fileList.findIndex(function (item) {
          return item.id === id;
        });
        var curFile = fileList[index];
        if (curFile.globalTime) window.clearInterval(curFile.globalTime); // 清理时间计数器
        fileList.splice(index, 1);
        _this.setState({
          fileList: fileList,
          error: ''
        }, function () {
          _this.props.onChange(curFile, _this.state.fileList);
        });
        _this.uploader.removeFile(_this.uploader.getFile(id, true));
      };
    };

    _this.isChinese = function (str) {
      return (/[\u4e00-\u9fa5]/.test(str)
      );
    };

    _this.ch2Unicdoe = function (str) {
      if (!str) {
        return;
      }
      var length = str.length;
      var unicode = '';
      for (var i = 0; i < length; i++) {
        var temp = str.charAt(i);
        if (_this.isChinese(temp)) {
          unicode += '\\u' + temp.charCodeAt(0).toString(16);
        } else {
          unicode += temp;
        }
      }
      return unicode;
    };

    _this.resetImageName = function (str) {
      window.console.log('resetImageName: ', str);
      var arr = str.split('/');
      var arr1 = arr[2].split(':');
      return {
        project: arr[1],
        name: arr1[0],
        tag: arr[1]
      };
    };

    _this.state = {
      fileList: [],
      error: '',
      response: null
    };
    return _this;
  }

  _createClass(LargeUploader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var options = this.props.options;

      var uploader = _webuploaderNolog2.default.create(_extends({
        chunked: true,
        chunkSize: 5 * 1024 * 1024,
        pick: '#picker',
        chunkRetry: 10,
        threads: 1,
        fileSizeLimit: 2000 * 1024 * 1024,
        fileSingleSizeLimit: 2000 * 1024 * 1024
      }, options, {
        auto: false
      }));
      uploader.on('beforeFileQueued', this.handleBeforeFileQueued);
      uploader.on('fileQueued', this.handleFileQueued);
      uploader.on('uploadBeforeSend', this.handleBeforeSend);
      uploader.on('uploadProgress', this.handleUploadProgress);
      uploader.on('uploadAccept', this.handleUploadAccept);
      uploader.on('uploadError', this.handleUploadError);
      uploader.on('uploadSuccess', this.handleUploadSuccess);
      this.uploader = uploader;

      // WebUploader.Uploader.register({
      //   "before-send":"beforeSend",  //每个分片上传前
      // },
      // {
      //   //时间点2：如果有分块上传，则每个分块上传之前调用此函数  
      //   beforeSend:  function(block) {
      //     var deferred = WebUploader.Deferred();
      //     $.ajax({
      //       type: "POST",
      //       url: "${ctx}/testController/mergeOrCheckChunks.do?param=checkChunk",  //ajax验证每一个分片
      //       data: {
      //         fileName : fileName,
      //         jindutiao:  $("#jindutiao").val(),
      //         fileMd5:  fileMd5,  //文件唯一标记
      //         chunk:  block.chunk,  //当前分块下标
      //         chunkSize:  block.end - block.start//当前分块大小
      //       },
      //       cache: false,
      //       async: false,  // 与js同步
      //       timeout: 1000,  //todo 超时的话，只能认为该分片未上传过
      //       dataType: "json",
      //       success: function(response) {
      //         if (response.ifExist) {
      //           //分块存在，跳过
      //           deferred.reject();
      //         } else {
      //           //分块不存在或不完整，重新发送该分块内容
      //           deferred.resolve();
      //         }
      //       }
      //     });

      //     this.owner.options.formData.fileMd5 = fileMd5;
      //     deferred.resolve();
      //     return deferred.promise();
      //   },
      // });
    }
  }, {
    key: 'handleRename',
    value: function handleRename(e, id) {
      var fileList = this.state.fileList;

      var index = fileList.findIndex(function (item) {
        return item.id === id;
      });
      var curFile = fileList[index];

      curFile.image_name = e.target.value;
      this.setFileItem('image_name', e.target.value, id);
      this.setState({
        fileList: fileList
      });
    }
  }, {
    key: 'renderFileList',
    value: function renderFileList() {
      var _this2 = this;

      var fileList = this.state.fileList;

      return fileList.map(function (item) {
        var id = item.id,
            percentage = item.percentage,
            uploadStatus = item.uploadStatus,
            name = item.name,
            image_name = item.image_name;
        var _uploadStatusConfig$u = uploadStatusConfig[uploadStatus],
            clickName = _uploadStatusConfig$u.clickName,
            btn = _uploadStatusConfig$u.btn,
            barClassName = _uploadStatusConfig$u.barClassName;

        return _react2.default.createElement(
          'div',
          { key: id, className: 'file-item' },
          _react2.default.createElement(
            'div',
            { className: 'file-box' },
            _react2.default.createElement(
              'p',
              null,
              '\u6587\u4EF6\u540D\uFF1A'
            ),
            _react2.default.createElement(
              'span',
              { className: 'file-name' },
              name
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'file-box' },
            _react2.default.createElement(
              'p',
              null,
              '\u955C\u50CF\u540D\u79F0\uFF1A'
            ),
            _react2.default.createElement('input', { type: 'text', className: 'file-name', defaultValue: image_name, onChange: function onChange(e) {
                return _this2.handleRename(e, id);
              } })
          ),
          _react2.default.createElement(
            'div',
            { className: 'file-box file-buttons' },
            _react2.default.createElement(
              'span',
              { className: 'file-status ' + uploadStatus + '-status', onClick: _this2[clickName] ? _this2[clickName](id) : null },
              btn
            ),
            _react2.default.createElement(
              'span',
              { className: 'delete', onClick: _this2.deleteFile(id) },
              '\u53D6\u6D88'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'process' },
            _react2.default.createElement('div', { className: barClassName, style: { width: percentage * 100 + '%' } })
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          border = _props.border,
          width = _props.width;
      var error = this.state.error;

      var style = border ? { width: width } : { width: width, border: 'none' };
      return _react2.default.createElement(
        'div',
        { className: 'large-uploader', style: style },
        _react2.default.createElement(
          'div',
          { className: 'file-list' },
          this.renderFileList()
        ),
        _react2.default.createElement(
          'div',
          { id: 'picker' },
          children
        ),
        _react2.default.createElement(
          'p',
          null,
          error
        )
      );
    }

    // render() {
    //   const { children, border, width } = this.props;
    //   const { error } = this.state;
    //   const style = border ? { width } : { width, border: 'none' };
    //   return (
    //     <div className="large-uploader" style={style}>
    //       <div className="file-col">
    //         <p>文件名：</p>
    //         <span className="file-name">{name}</span>
    //         <div id="picker">
    //           {children}
    //         </div>
    //       </div>
    //       <div className="file-col">
    //         <p>镜像名称：</p>
    //         <input type="text" className="file-name" defaultValue={image_name} onChange={(e) => this.handleRename(e, id)} />
    //       </div>
    //       <div className="file-col">
    //         <span className={`file-status ${uploadStatus}-status`} onClick={this[clickName] ? this[clickName](id) : null}>{btn}</span>
    //         <span className="delete" onClick={this.deleteFile(id)}>取消</span>
    //       </div>
    //       <p>{error}</p>
    //     </div>
    //   );
    // }

  }]);

  return LargeUploader;
}(_react2.default.Component);

LargeUploader.defaultProps = {
  options: {},
  onChange: function onChange() {},
  width: 700,
  border: true,
  children: _react2.default.createElement(
    'div',
    { className: 'btn-primary' },
    '\u9009\u62E9\u6587\u4EF6'
  ),
  beforeFileQueued: function beforeFileQueued() {
    return true;
  },
  fillDataBeforeSend: function fillDataBeforeSend() {
    return {};
  },
  uploadResponse: function uploadResponse() {
    return true;
  }
};
LargeUploader.propTypes = {
  options: _propTypes2.default.object,
  onChange: _propTypes2.default.func,
  width: _propTypes2.default.number,
  border: _propTypes2.default.bool,
  children: _propTypes2.default.element,
  beforeFileQueued: _propTypes2.default.func,
  fillDataBeforeSend: _propTypes2.default.func,
  uploadResponse: _propTypes2.default.func
};
exports.default = LargeUploader;
//# sourceMappingURL=upload.js.map