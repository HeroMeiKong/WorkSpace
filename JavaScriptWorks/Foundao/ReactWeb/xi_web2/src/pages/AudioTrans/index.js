import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
import AudioBefore from './AudioBefore/index';
import AudioInfo from './AudioInfo/index';
@connect(
  state => ({admin: state.admin}),
  {}
)

class AudioTran extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className='audioTran'>
        <AudioBefore />
        <AudioInfo />
      </div>
    );
  }
}

export default AudioTran;
