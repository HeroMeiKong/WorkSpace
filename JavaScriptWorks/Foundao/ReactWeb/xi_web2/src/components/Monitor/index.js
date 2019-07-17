import React, {Component} from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import tools from '@/utils/tool';
import defaultCover from '@/assets/images/h5/defaultCover.png';

let videoPlayer = null;
export default
class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const {liveType = 'video', cover = defaultCover, mediaUrl = ''} = nextProps;
    if ((mediaUrl !== this.props.mediaUrl || (cover !== this.props.cover))) {
      this.createVideo(liveType, cover, mediaUrl)
    }
  }

  createVideo = (type, cover, url) => {
    document.querySelector('#monitor-video-inner').innerHTML = '';

    // 图片直播
    if (type === 'image') {
      document.querySelector('#monitor-video-inner').innerHTML = `<div class="default_monitor" style="background-image: url(${cover})"></div>`;
    } else {
      if (!url) {
        document.querySelector('#monitor-video-inner').innerHTML = `<div class="default_monitor"></div>`;
        return false
      }
      const show_flash_tips = this.checkNeedFlashTips();
      if (show_flash_tips) {
        return false;
      }
      const config = {
        elid: "monitor-video-inner",
        autostart: true,
        // url: "https://media001.newscctv.net/video/vs/hls/2019/05/13/4792009151940051225/index.m3u8",
        // url: "https://cdn-live.foundao.com/ovesystem/data/material/2019/04/19/91cc1ec7ec1830b88ac8318df32f4df011904441932101723101316_e6f3c5c42cdc90fa76e92bc9f429e48e.mp4",
        url: url,
        skin: "liveWhite",
        logo: ''
      };
      // if (videoPlayer) {
      //   document.querySelector('#monitor-video-box').innerHTML = '';
      // }
      videoPlayer = new window.Sewise.SewisePlayer(config);
      // var video_type = url.indexOf('.mp4') > 0 ? 'mp4' : 'm3u8';
      // window.Sewise.SewisePlayer.setup({
      //   server: "vod",
      //   type: video_type,
      //   autostart: "true",
      //   // poster: data.videoImgurl,
      //   //poster: "",
      //   videourl: url,
      //   skin: "vodWhite",
      //   // title: data.videoTitle,
      //   //title: "",
      //   lang: "zh_CN",
      //   claritybutton: 'disable',
      //   // logo: Config.source_host + "img/0.png",
      //   // primary: 'flash',
      // }, "video-container");
      // 启动播放器
      videoPlayer.startup();
    }
  };
  // 是否需要flash提示
  checkNeedFlashTips = () => {
    let needFlash = false;
    const { mediaUrl = ''} = this.props;
    const fls = tools.flashChecker();
    const suffix = mediaUrl.split('.').pop();
    if (!fls.f && suffix === 'm3u8') {
      needFlash = true;
    }
    return needFlash;
  };

  render() {
    const {className = '', style = {}} = this.props;
    const show_flash_tips = this.checkNeedFlashTips();

    return (
      <div className={`monitor-video-box ${className}`} style={{...style}}>
        {show_flash_tips ? (<div className="flash_tips">
          <div className="flash_tips_inner">
            <div className="flash-logo"/>
            <a href="http://www.adobe.com/go/getflash">点击启用或更新 Adobe Flash Player</a>
          </div>
        </div>) : ''}

        <div className="monitor-video-inner" id="monitor-video-inner">
          <div className="default_monitor"/>
        </div>
        {this.props.children}
      </div>
    );
  }
}

Monitor.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};