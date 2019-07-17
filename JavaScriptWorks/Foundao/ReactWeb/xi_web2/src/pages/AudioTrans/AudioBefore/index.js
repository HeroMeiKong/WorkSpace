import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
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

        <div className='bottom-zs'></div>
      </div>
    );
  }
}

export default AudioBefore;
