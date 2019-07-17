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

          <div className="section-one-zs zs"></div>
        </div>
        <div className='section-snd section-box'>

          <div className="section-snd-zs zs"></div>
        </div>
        <div className='section-third section-box'>


        </div>
        <div className='section-bottom'>
          <div className="section-bottom-zs"></div>
        </div>
      </div>
    );
  }
}

export default AudioInfo;
