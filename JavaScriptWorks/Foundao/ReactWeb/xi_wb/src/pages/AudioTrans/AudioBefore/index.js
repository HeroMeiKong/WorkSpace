import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
import Upload from '../../../components/MuliUpload/index'
@connect(
  state => ({admin: state.admin}),
  {}
)


class AudioBefore extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className='audioBefore'>
        <h2 className='before-title'>音频在线转换器</h2>
        <h3 className='before-desc'>任意音频格式转换为MP3，WAV，M4R等格式</h3>
        <div className='before-upload'>
          <button><span></span>选择文件</button>
          <p>拖放或者点击添加文件</p>
        </div>
        <div className='cercle-one'></div>
        <div className='cercle-two'></div>
        <div className='cercle-third'></div>
      </div>
    );
  }
}

export default AudioBefore;
