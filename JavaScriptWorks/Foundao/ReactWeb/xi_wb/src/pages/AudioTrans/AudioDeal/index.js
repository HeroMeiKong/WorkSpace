import React, {Component,Fragment} from 'react';
import './index.scss'
import {connect} from 'react-redux';
@connect(
  state => ({admin: state.admin}),
  {}
)


class AudioDeal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className='audioDeal'>
        这个有故事
      </div>
    );
  }
}

export default AudioDeal;
