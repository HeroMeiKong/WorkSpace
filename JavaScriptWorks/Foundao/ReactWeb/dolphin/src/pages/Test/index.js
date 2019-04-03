/**
 * Created by DELL on 2019/3/28.
 */
import React, {Component} from 'react'
import Upload from '@/components/Upload'

import TransList from './TransList';

// let g_total_time = 0;      // 转码时间
// let g_trans_progress = 0; // 转码进度
// let g_trans_md5 = ''; // 转码md5

export default
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      uploadSuccessList: []
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  uploadSuccess = (fileName, fileSize, fileMd5) => {
    console.timeEnd('upload');
    // console.log(fileName, fileSize, fileMd5);
    console.log('uploadSuccess');
    const {uploadSuccessList} = this.state;
    uploadSuccessList.unshift({
      fileName,
      fileSize,
      fileMd5,
    });
    this.setState({
      uploadSuccessList
    })
  };

  uploadProgress = (percent) => {
    console.log(percent);
    this.setState({
      percent
    })
  };


  uploadChange = (file, files) => {
    // console.log(file, 'file');
    // console.log(files, 'files');
    console.time('upload')
  };

  render() {
    const {percent, uploadSuccessList} = this.state;
    const style = {
      width: '200px',
      height: '200px',
      border: '1px solid red'
    };
    return (
      <div>
        <Upload disabled={false}
                accept='*'
                onChange={this.uploadChange}
                onProgress={this.uploadProgress}
                onSuccess={this.uploadSuccess}>
          <p style={style}>上传进度: {percent} / 100%</p>
        </Upload>
        <TransList uploadSuccessList={uploadSuccessList}/>
      </div>
    )
  }
}