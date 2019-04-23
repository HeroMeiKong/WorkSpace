/**
 * Created by DELL on 2019/3/30.
 */
import React, {Component} from 'react'
import transCode from '@/utils/transCode'


export default
class TransItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isTransing: false, // 转码中
    }

  }

  componentWillMount() {

  }

  componentDidMount() {
    console.log(this.props.data.fileName, 'fileName');
  }

  startTransCode = () => {
    const {fileName, fileSize, fileMd5} = this.props.data;
    const transOptions = {
      inFileName: fileName,  // 文件名
      inFileSize: fileSize,  // 文件大小
      inFileMd5: fileMd5,    // 文件md5
      outWidth: '400',     // 导出视频宽度
      outHeight: '400',    // 导出视频高度
    };
    transCode({
      transOptions,
      transSuccess: this.transSuccess,    // 转码成功 回调
      transFail: this.transFail,       // 转码失败 回调
      transProgress: this.transProgress,    // 转码中 回调
    });
    this.setState({
      isTransing: true
    })
  };
  transSuccess = (url) => {
    console.log('transSuccess-->', url);
    this.setState({
      isTransing: false
    })
  };
  transFail = (msg) => {
    console.log('转码失败:-->', msg);
    this.setState({
      isTransing: false
    })
  };
  transProgress = (msg) => {
    console.log('转码中:-->' + msg);
    this.setState({
      progress: parseInt(msg) / 100
    })
  };
  render() {
    const {data} = this.props;
    const {progress, isTransing} = this.state;
    return (
      <div className="transItem">
        <div>
          <span>文件名称：{data.fileName}</span>
          <span>文件size：{data.fileSize}</span>
          <span>文件MD5：{data.fileMd5}</span>
          <button disabled={isTransing} onClick={this.startTransCode}>开始转码</button>
        </div>

        <progress value={progress} />
      </div>
    )
  }
}