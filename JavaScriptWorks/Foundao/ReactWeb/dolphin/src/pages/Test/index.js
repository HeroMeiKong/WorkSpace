/**
 * Created by DELL on 2019/3/28.
 */
import React, {Component} from 'react'
import Upload from '@/components/Upload'

import TransList from './TransList';
import './test.scss';
// let g_total_time = 0;      // 转码时间
// let g_trans_progress = 0; // 转码进度
// let g_trans_md5 = ''; // 转码md5

export default
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      uploadSuccessList: [],
      // keyword:['习近平'],
      // stringArticle: '习2平 习近平1111习近平 习1平 习近1'
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

  filterKeyword = (article) => {

    return article.replace(/习/g, 'xi');
  };
  render() {
    const {percent, uploadSuccessList} = this.state;
    const style = {
      width: '200px',
      height: '200px',
      border: '1px solid red'
    };
    // const result = this.filterKeyword(stringArticle);
    return (
      <div>
        <a href="http://foundao.f3322.net:18080/dst/6bd5662aaf5e5c794e9f3a9fa209db50_400x400.mp4" rel="noopener noreferrer" target="_blank"
           download='download'>http://foundao.f3322.net:18080/dst/6bd5662aaf5e5c794e9f3a9fa209db50_400x400.mp4</a>
        <br/>
        <Upload disabled={false}
                accept='*'
                onChange={this.uploadChange}
                onProgress={this.uploadProgress}
                onSuccess={this.uploadSuccess}>
          <p style={style}>上传进度: {percent} / 100%</p>
        </Upload>

        <TransList uploadSuccessList={uploadSuccessList}/>
        <br/>
        <br/>
        <br/>
        <p>
          {/*{result}*/}

        </p>
        <div className="maskImage">
          <p>111</p>
          <p>222</p>
          <p>333</p>
          <p>444</p>
          <p>555</p>
          233
        </div>
      </div>
    )
  }
}