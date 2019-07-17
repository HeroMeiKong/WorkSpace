import React, {Component,Fragment} from 'react';
import './index.scss';
import {Link} from "react-router-dom";
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
      <div style={{backgroundColor:'#FBFBFB'}}>
        <div className='audioDeal'>
          <div className='audioDeal-inner'>
            <div className='audio-header'>
              <span>Online Audio Converter</span>
              <Link to='/' target='_blank'>More Privileges</Link>
            </div>
            <div className='audio-body'>
              <ul className='voiceList'>
                <li className='voice-item'>
                  <p>这是一个有故事的视频</p>
                  <div>

                  </div>
                </li>
              </ul>
              <div className='audio-deal-all'>

              </div>
            </div>
            <div className='audio-footer'>

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default AudioDeal;
