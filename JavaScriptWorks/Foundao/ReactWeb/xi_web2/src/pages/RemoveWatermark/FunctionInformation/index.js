import React, { Component } from 'react'

import './index.scss'
import undraw_online_friends from '../../../assets/removewatermark/undraw_online_friends_x73e@2x.png';
import undraw_ethereum_desire from '../../../assets/removewatermark/undraw_ethereum_desire_wy1b@2x.png';
import bainzu from '../../../assets/removewatermark/bainzu9@2x.png';
import undraw_percentages from '../../../assets/removewatermark/undraw_percentages_0rur@2x.png';

export default class FunctionInformation extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div className='information_wrapper'>
        <div className='leftPic_type'>
          <div className='picBox'>
            <img src={undraw_online_friends} alt={window.intl.get("批量处理3")}/>
          </div>
          <div className='textBox'>
            <div className='plateIcon chuli'></div>
            <div className='title'>{window.intl.get("批量处理3")}</div>
            <div className='content'>{window.intl.get("您可以同时批量处理多个视频去水印，无需重复上传，重复框选水印区域，节省时间，方便快捷。我们会将它们保存为ZIP格式，方便您的下载。")}</div>
          </div>
        </div>
        <div className='rightPic_type'>
          <div className='textBox'>
            <div className='plateIcon infine'> </div>
            <div className='title'>{window.intl.get("无限次数")}</div>
            <div className='content'>{window.intl.get("每日无限次视频去水印，不再为次数限制而烦恼，满足您的高频需要，让您随时随地都能轻轻松松地去除视频的水印。")}</div>
          </div>
          <div className='picBox'>
            <img src={undraw_ethereum_desire} alt={window.intl.get("无限次数")}/>
          </div>
        </div>
        <div className='leftPic_type'>
          <div className='picBox'>
            <img src={bainzu} alt={window.intl.get("1GB超大文件")}/>
          </div>
          <div className='textBox'>
            <div className='plateIcon bigger'> </div>
            <div className='title'>{window.intl.get("1GB超大文件")}</div>
            <div className='content'>{window.intl.get("单个视频最大支持1G文件上传，满足您的特殊需要，真正实现您的视频，您做主。同时，为了您更好的使用体验，我们一直都在不断提高文件大小限制。")}</div>
          </div>
        </div>
        <div className='rightPic_type'>
          <div className='textBox'>
            <div className='plateIcon muliupload'></div>
            <div className='title'>{window.intl.get("同时上传")}</div>
            <div className='content'>{window.intl.get("稳定的云服务器，专属的视频通道，保障了您在批量处理时，所有的视频都可以同时上传，节省时间，方便快捷。")}</div>
          </div>
          <div className='picBox'>
            <img src={undraw_percentages} alt={window.intl.get("同时上传")}/>
          </div>
        </div>
      </div>
    )
  }
}