/**
 * Created by DELL on 2019/3/28.
 */
/* eslint-disable */
import React, {Component,Fragment} from 'react'
import PropTypes from 'prop-types';
import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tool';
// import {Message} from "element-react";
import './upload.scss';
import _api from '@/API/api';
import Alert from '../Alert/index';

/* eslint-disable */

const workers = [];
const workersLength = 1;  // 生成workers的数量
let file = null;          // 上传的文件

let g_filemd5 = '';       // 文件md5值
let upToken  = '';    //文件上传token


/*文件上传*/
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',        // 上传文件返回的地址
      isUploading: false, // 是否文件上传中
      percent: 0,         // 上传进度
      msg:'',
      msgDialog:false,
      currIndex:0,//当前上传值
      currUpload:null,
      g_filemd5:'',
      upToken:'',
      isvip:false,//是否是会员
    }
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isvip){
      return
    } else {
      if (nextProps.readyList[0]===this.state.currUpload) {
        return
      }else {
        this.setState({
          currUpload:nextProps.readyList[0]
        },()=>{
          this.initWorker();
          this.handleFiles()
        })
      }
    }


  }

  componentDidMount() {
    let _this = this;
    const {data,isvip}= this.props;
    if (!data){
      return
    }
    let st = 1000*data.index;
    if (data.realIndex){
      st = 1000*data.realIndex;
    }
    if (isvip){
      this.setState({
        isvip:true,
        currIndex:data.index,
        file:data.item
      },()=>{
        setTimeout(()=>{
          _this.initWorker();
          _this.handleMuliFiles(data.item)
        },st)
      })
    }
  }


  // 创建worker
  initWorker = () => {
    const _this = this;
    for (let i = 0; i < workersLength; i++) {
      const worker = new Worker('./uploadWorker.js');
      const {showStatus, showProgress} = this;
      worker.onmessage = function (message) {
        var jsonobj = message.data;
        if (jsonobj != null && jsonobj["msg"] != null) {
          let {file}= _this.state;
          switch (jsonobj["msg"]) {
            case "net":
              showStatus(jsonobj["data"]);
              break;
            case "partfinish":
              // console.log("part upload finished");
              break;
            case "finish":

              // console.log("file upload finished");
              _this.uploadSuccess();
              showStatus("file size:" + file.size + ", uploaded:" + file.size + ", 100%");
              showProgress("100");

              break;
            case "md5":
              // console.log(111)
              _this.setState({
                g_filemd5:jsonobj.data
              },()=>{
                const {g_filemd5} = _this.state;
                _this.getToken(g_filemd5);
              });
              break;
            // 后端进度
            case "uploaded":
              // console.log("file uploaded size:" + jsonobj["data"]["writed"] + ", progress:" + jsonobj["data"]["progress"]);
              // showStatus("file size:" + file.size + ", uploaded:" + jsonobj["data"]["writed"] + ", percent:" + jsonobj["data"]["progress"] + "%");
              // showProgress(jsonobj["data"]["progress"]);
              break;
            // 前端进度
            case "progress":
              // console.log("file uploaded size:" + jsonobj["data"]["writed"] + ", progress:" + jsonobj["data"]["progress"]);
              showStatus("file size:" + file.size + ", uploaded:" + jsonobj["data"]["writed"] + ", percent:" + jsonobj["data"]["progress"] + "%");
              showProgress(jsonobj["data"]["progress"]);
              break;
            case "timeout":
              _this.TimeOut()
              break;
            default:
              break;
          }
        }

        //worker.terminate();
      };

      worker.onerror = function (error) {
        // console.log(error.filename, error.lineno, error.message);
      }
      workers[i] = worker;
    }
  };
  // 获取上传文件token
  getToken = (g_filemd5) => {
    let { file ,currIndex} = this.state;
    const userInfo = tools.getUserData_storage();
    let api = '';
    if (this.props.project === 'singleCut') {
      api = _api.getClipUploadToken
    }else if(this.props.project === 'muliSplicing'){
      api = _api.mulisplicingToken
    } else if (this.props.project === 'rewatermark'){
      api = _api.removewaterToken
    } else {
      api = _api.getUploadToken
    }
    httpRequest({
      url: api,
      type: 'post',
      data: {
        token: userInfo.token || '',
        // token: 'a5422c67e4443b5a47833689013270881655cb9ad348',
        file_md5: g_filemd5,
        file_size: file.size,
      },
    }).done(resp => {
      if (resp.code === '0') {
        const {up_token} = resp.data;
        // console.log(up_token,'up_token');
        this.setState({
          upToken : up_token
        },()=>{
          const {upToken} = this.state
          this.start_upload(upToken);
        })
      } else {
        if ( this.props.onTimeOut) {
          this.props.onTimeOut(currIndex)
        }
        this.setState({
          isUploading: false,
          msgDialog:true,
          msg:resp.msg
        })
      }
    }).fail(() => {
      this.setState({
        isUploading: false
      });
    })
  };
  // 开始上传
  start_upload = (up_token) => {
    // console.log(up_token,'up_token')
    for (let i = 0; i < workersLength; i++) {
      const worker = workers[i];
      worker.postMessage(
        {
          cmd: 'start',
          data: up_token
        }
      );
    }
  };
  // 上传各种提示
  showStatus = (msg) => {
    // console.log('uploadStatus --->', msg);
  };
  /**链接超时**/
  TimeOut = () => {
    const {currIndex} = this.state
    this.setState({
      msgDialog:true,
      msg:window.intl.get('连接超时！')
    });
    if (this.props.onTimeOut) {
      this.props.onTimeOut(currIndex);
    }
    if (this.refs.input) {
      this.refs.input.value = '';
    }
    this.setState({
      isUploading: false
    })
  };
  showProgress = (percent) => {
    const {currIndex} = this.state
    if (this.state.isUploading) {
      const {onProgress} = this.props;
      if (onProgress && typeof onProgress === 'function') {
        onProgress(percent,currIndex);
      }
    }
  };

  handleFiles = (files) => {
    const {readyList} = this.props
    if (readyList && readyList.length > 0) {
      this.initFileItem(readyList[0], readyList);
    }
  };
  handleMuliFiles = (files) => {
    // console.log(files,'files')
    if (files && files!=='') {
      this.initFileItem(files, files);
    }
  };
  initFileItem = (fileItem, files) => {
    const {isUploading} = this.state;
    if (isUploading) {
      return false;
    } else {

    }
    const {onChange, autoUpload} = this.props;
    this.setState({
      isUploading: true
    });
    if (onChange && typeof onChange === 'function') {
      onChange(fileItem, files);
    }
    this.setState({
      file:fileItem
    },()=>{
      if (!autoUpload && typeof autoUpload !== 'undefined') {
        return
      } else {
        this.start_upload_worker(fileItem)
      }
    });

  };

  stop_upload = () => {
    this.state.isUploading = false
    for (let i = 0; i < workersLength; i++) {
      const worker = workers[i];
      worker.postMessage(
        {
          cmd: 'stop'
        }
      )
    }
  };

  start_upload_worker = (fileItem) => {
    const {file,currIndex} = this.state;
    // console.log(file,'file1111')
    let fileNew = file;
    if (fileItem) {
      fileNew = fileItem
    }
    this.setState({
      file:fileItem
    },()=>{
      const {file} = this.state;
      if ((file.size / 1024 / 1024 > this.props.maxSize) && this.props.maxSize !== 0) {
        //上传的文件大小大于规定的最大值,0时为终极套餐  不限制
        if (this.props.onError && typeof this.props.onError === 'function') {
          this.setState({isUploading:false})
          this.props.onError({code: 1, msg: window.intl.get('文件过大')})
        }
        return
      }
      this.setState({isUploading: true})
      for (let i = 0; i < workersLength; i++) {
        // console.log(file,'2222')
        const worker = workers[i];
        worker.postMessage(
          {
            cmd: 'stop'
          }
        );
        worker.postMessage(
          {
            cmd: 'init',
            id: currIndex||0,
            usr: 'user',
            ps: 'Foundao.com',
            url: _api.webSorket,
            f: file,
            server_time_url : _api.get_server_time
          });
        // worker.postMessage(
        //   {
        //     cmd: 'start'
        //   }
        // );
      }
    })

  }
  // 文件上传input框发生改变
  inputChange = (e) => {
    const files = e.target.files;
    // console.log(files)
    let fileType = files[0].type;
    let fileName = files[0].name.slice(files[0].name.lastIndexOf('.')+1);
    if(fileType.indexOf('video')!==-1 ||fileName ==='mkv'||fileName==='flv'){
      this.handleFiles(files)
    }else{
      this.setState({
        msgDialog:true,
        msg:window.intl.get('抱歉，不支持该文件格式！')
      })
    }
  };
  uploadClick = () => {
    const {isUploading} = this.state;
    if (!isUploading) {
      // 重置input框 否则选择相同的文件不会触发change 事件
      this.refs.input.value = '';
      this.refs.input.click()
    }
  };
  // 文件上传成功
  uploadSuccess = () => {
    const {isUploading,g_filemd5, file ,upToken ,currIndex} = this.state;
    // const {readyList} = this.props;
    // console.log('上传成功',file.name);
    let _this = this;
    // 确保成功回调只会触发一次
    if (isUploading) {
      const {onSuccess} = this.props;
      if (onSuccess && typeof onSuccess === 'function') {
        this.setState({
          isUploading: false,
        }, onSuccess(file.name, file.size, g_filemd5,upToken,currIndex))
      }
    }

  };

  inputClick = () => {
    this.refs.input.click()
  }

  render() {
    const {msgDialog,msg} = this.state;
    const {accept, disabled, className} = this.props;
    const fileAccept = accept || 'video/*'; // 默认只能上传视频
    return (
      <Fragment>
        <div className={'upload-box' + ' ' + (className || '')}
             ref='upload-box'
             onClick={this.uploadClick}>
          <input type="file"
                 ref="input"
                 disabled={disabled}
                 hidden
                 accept={fileAccept}
                 onChange={this.inputChange.bind(this)}/>
          <div className="upload-box-inner">{this.props.children}</div>
        </div>
        {msgDialog?
          <Alert
            cancelCallBack={()=>this.setState({msgDialog:false})}
            msg={msg}
          />:""}
      </Fragment>
    )
  }
}
Upload.propTypes = {
  onSuccess: PropTypes.func.isRequired,  // 文件上传成功
  onChange: PropTypes.func,               // 可选参数, 文件状态改变时的钩子，上传成功或者失败时都会被调用
  onError: PropTypes.func,               // 文件上传失败
  onProgress: PropTypes.func,      // 文件上传时的进度
  disabled: PropTypes.bool,     // 是否不能点击按钮默认为false
  accept: PropTypes.string,     // 接受文件限制后缀
  uploadType: PropTypes.string, // 上传文件类型 image / audio / video
  maxSize: PropTypes.number, // 上传文件大小 M
};