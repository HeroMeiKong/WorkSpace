import React, {Component,Fragment} from 'react';
import './index.scss'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
@connect(
  state => ({admin: state.admin}),
  {}
)


class AudioInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipsList:[
        {
          title:'30X高速转换，超高速在线音频转换',
          desc:'30倍更快的转换速度，并且丝毫不会影响文件质量，超多格式的互转，满足您的需要。'
        },
        {
          title:'无文件大小限制，不再受限于文件大小',
          desc:"稳定的云服务器，得以支持无限文件大小处理，不再为文件太大而烦恼"
        },
        {
          title:'无限并行转换，一键转码所有文件',
          desc:"专属的处理通道，得以支持您将所有需要转码的文件一键转码，无需重复操作，方便快捷\n"
        },
        {
          title:"超值权益，享受更好的服务和功能",
          desc:"稳定的云服务器，专属的处理通道，无限文件大小，无限同时转换个数，超丰富的VIP特权"
        }
      ]
    }
  }

  componentWillMount() {

  }

  render() {
    const {tipsList} = this.state;
    const {currTipsIndex} = this.props;
    return (
      <Fragment>
        <div className='audioInfo'>
          <div className='section-one'>
            <h2>{tipsList[currTipsIndex].title}</h2>
            <p>{tipsList[currTipsIndex].desc}</p>
            <Link to='/'>
              <span>立即尝试</span>
              <i>推荐</i>
            </Link>
          </div>
          <div className='section-two'>
            <ul>
              <li>
                <div className='item-icon phone'></div>
                <h3 className='item-title'>Make iPhone Ringtones</h3>
                <p className='item-desc'>Instead of using the cumbersome iTunes conversion.Set any audio you like to your personal ringtone.</p>
              </li>
              <li>
                <div className='item-icon highspeed'></div>
                <h3 className='item-title'>30X High Speed Conversion</h3>
                <p className='item-desc'>Stable cloud servers and dedicated channels that can convert all files at the same time.</p>
              </li>
              <li>
                <div className='item-icon simultaneously'></div>
                <h3 className='item-title'>Simultaneous conversion</h3>
                <p className='item-desc'>You can convert and process multiple files simultaneously, and we save them in ZIP format.</p>
              </li>
            </ul>
          </div>
        </div>
        <div className='more-tools'>
          <h2 className='tool-title'>More Online Video Tools Waiting For You</h2>
          <p className='tool-desc'>We are committed to creating simple solutions to everyday challenges through technology</p>
          <ul className='tool-list'>
            <li className='tools-item'>
              <div className='tool-item-icon converter'></div>
              <h3 className='tool-item-title'>Video Converter</h3>
              <p className='tool-item-desc'>Supports converting any format to MP4</p>
              <Link to='/convert'>Video Converter</Link>
            </li>
            <li className='tools-item'>
              <div className='tool-item-icon cut'></div>
              <h3 className='tool-item-title'>Video Cutter</h3>
              <p className='tool-item-desc'>Finish the clip easily and quickly</p>
              <Link to='/trim'>Video Cutter</Link>
            </li>
            <li className='tools-item'>
              <div className='tool-item-icon watermark'></div>
              <h3 className='tool-item-title'>Watermark</h3>
              <p className='tool-item-desc'>Add personalized watermark to video</p>
              <Link to='/watermark'>Watermark</Link>
            </li>
            <li className='tools-item'>
              <div className='tool-item-icon remove'></div>
              <h3 className='tool-item-title'>Watermark Remove</h3>
              <p className='tool-item-desc'>Remove watermark from videos</p>
              <Link to='/remove'>Watermark Remove</Link>
            </li>

          </ul>
        </div>
      </Fragment>
    );
  }
}

export default AudioInfo;
