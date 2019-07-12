import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
@connect(
  state => ({admin: state.admin}),
  {}
)


class AudioInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className='audioInfo'>
        <div className='section-one section-box'>
          <div className='section-one-left'>
            <h3>制作iPhone铃声</h3>
            <div>视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道。</div>
          </div>
          <div className='section-one-right'></div>
          <div className="section-one-zs zs"></div>
        </div>
        <div className='section-snd section-box'>
          <div className='section-snd-left'></div>
          <div className='section-snd-right'>
            <h3>30X高速转换</h3>
            <div>视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道。</div>
          </div>
          <div className="section-snd-zs zs"></div>
        </div>
        <div className='section-third section-box'>
          <div className='section-third-left'>
            <h3>多文件同时转换</h3>
            <div>视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道，提升速度，省时省力视频编辑高速通道。</div>
          </div>
          <div className='section-third-right'></div>
        </div>
        <div className='section-bottom'>
          <div className="section-bottom-zs"></div>
        </div>
      </div>
    );
  }
}

export default AudioInfo;
