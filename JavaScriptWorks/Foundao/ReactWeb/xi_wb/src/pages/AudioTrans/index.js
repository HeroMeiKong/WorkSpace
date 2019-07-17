import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
import AudioBefore from './AudioBefore/index';
import AudioInfo from './AudioInfo/index';
import AudioDel from './AudioDeal/index';
@connect(
  state => ({admin: state.admin}),
  {}
)

class AudioTran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBefore:false,//是否选择过文件
      currTipsIndex:0,
    }
  }

  componentWillMount() {
    this.initTips()
  }
  initTips=()=>{
    let number = Math.ceil(Math.random()*4)-1;
    this.setState({
      currTipsIndex:number
    })
  }

  render() {
    const {isBefore , currTipsIndex} = this.state;
    return (
      <div className='audioTran'>
        {isBefore?
          <AudioBefore />
          :
          <AudioDel />
        }
        <AudioInfo currTipsIndex={currTipsIndex} />
      </div>
    );
  }
}

export default AudioTran;
