import React, {Component} from 'react';

import './index.scss';
export default class WaterList extends Component {
  constructor (props) {
    super(props);
    this.state={

    }
  }
  render() {
    return (
      <div className='watermark-box'>
        <div className='boxInner'>
          <ul>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('添加图片水印')}</h2>
                <p>{window.intl.get('免费的在线图片水印添加功能，只需本地上传一张图片即可添加至视频的任意位置')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('添加文字水印')}</h2>
                <p>{window.intl.get('丰富的文字素材，支持多种特殊字体，在线修改文字内容、字体大小以及字体颜色')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('添加动态水印')}</h2>
                <p>{window.intl.get('选择文字水印动态化模版，其中部分动效功能支持自定义，轻松实现水印效果')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('参考线辅助')}</h2>
                <p>{window.intl.get('提供辅助参考线，拖拽图片靠近参考线时可以自动吸附，让水印定位变得更加便捷')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('水印模版存储')}</h2>
                <p>{window.intl.get('将已有的水印存储为模版，会自动保存水印内容及水印位置')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('套用水印模版')}</h2>
                <p>{window.intl.get('上传视频后可以直接套用水印模版，水印模版存储在云端，更加方便的实现批量处理')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('快速拖动水印位置')}</h2>
                <p>{window.intl.get('无延迟的图片拖拽技术以及精确的可拖拽区域，可以有效减少用户的操作成本，提高水印合成质量')}</p>
              </div>
            </li>
            <li>
              <div className='list-image'></div>
              <div className='list-info'>
                <h2>{window.intl.get('隐私与安全')}</h2>
                <p>{window.intl.get('我们已将隐私保护内置于我们提供的每个产品功能中，让您在获得出色使用体验的同时能够确保个人信息安全可靠')}</p>
              </div>
            </li>

          </ul>
        </div>
      </div>
    );
  }
}
