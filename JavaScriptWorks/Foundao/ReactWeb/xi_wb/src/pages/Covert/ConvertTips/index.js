import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './index.scss'

export default class ConvertTips extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
  }

  render() {
    const {showWhat,currMsg} = this.props;
    return (
      <div className="convert-Tips">
        <div className='tipsInner'>
          {
            showWhat ?
              <div className='uptips'>
                <p>{currMsg||'VIP convert channel, upload speed exceeds 95% of other users.'}</p>
                <Link to='/pay/ct' target='_blank'>TRY NOW</Link>
              </div>
              :
              <ul>
                <li>
                  <div className='tipsIcon'></div>
                  <h3>Free online Video Converter</h3>
                  <p>A free web tool that converts video files in your browser. The tool supports more than 300 video formats. Moreover, you don’t even need to sign up or sign in.</p>
                </li>
                <li>
                  <div className='tipsIcon'></div>
                  <h3>Security guaranteed</h3>
                  <p>Your files are automatically deleted from our servers a few hours after you are done working with them. Nobody has access to them except you.</p>
                </li>
                <li>
                  <div className='tipsIcon'></div>
                  <h3>High-performance conversion</h3>
                  <p>Your video files are converted by our powerful servers. In most cases, the process takes less time than it would take if you used your computer.</p>
                </li>
              </ul>

          }

        </div>
      </div>
    )
  }
}