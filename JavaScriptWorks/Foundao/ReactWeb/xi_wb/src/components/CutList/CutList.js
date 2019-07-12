/* eslint-disable */
import React, {Component} from 'react';

import {} from 'react-router-dom';

import './CutList.scss';
class CutList extends Component {
  constructor (props) {
    super(props);
    this.state={

    }
  }
  componentWillMount() {
    const {type} = this.props;
    if (type === 'singleCut') {
      this.setState({
        datalist:[
          {
            title:window.intl.get('在线视频切割'),
            desc:window.intl.get('当您需要剪切视频时，这个在线视频编辑器非常便于修建视频中不需要的部分，只需拖动修建框便可轻松编辑。')
          },
          {
            title:window.intl.get('裁剪视频'),
            desc:window.intl.get('裁剪允许您将视频构图至所需区域或者更改宽高比，以轻松适应不同所需场景。')
          },
          {
            title:window.intl.get('旋转视频'),
            desc:window.intl.get('您可以将视频旋转180度，顺时针或者逆时针旋转90度，在横向模式下拍摄肖像场景时，旋转功能很实用。')
          },
          {
            title:window.intl.get('翻转视频'),
            desc:window.intl.get('您可以在水平和垂直的方向上翻转镜像视频。')
          },
          {
            title:window.intl.get('多种输出质量选择'),
            desc:window.intl.get('不但能够输出原视频相同分辨率的视频，还能够选择性的输出240p，360p，480p，720p，1080p分辩率的视频。')
          },
          {
            title:window.intl.get('快速拖动切割框'),
            desc:window.intl.get('您能够整体拖动视频切割框，快速选择更换视频切割区域，一用就爱上，方便快捷准确，节省时间。')
          },
          {
            title:window.intl.get('在线视频编辑'),
            desc:window.intl.get('该应用程序可以在您的浏览器窗口中直接在线编辑视频文件，方便直接快捷。')
          },
          {
            title:window.intl.get('隐私与安全'),
            desc:window.intl.get('我们已将隐私保护内置于我们提供的的每个产品功能中,让您在获得出色使用体验的同时能够确保个人信息安全可靠。')
          }
        ]
      })
    }else if (type === 'muliSpelicing'){
      this.setState({
        datalist:[
          {
            title:window.intl.get('同时上传多个视频'),
            desc:window.intl.get('您可以同时上传多个视频，无需进行多次操作，方便快捷。')
          },
          {
            title:window.intl.get('支持所有视频格式'),
            desc:window.intl.get('我们的工具支持当下所有主流的视频格式，包括MP4,AVI，MPG，VOB，WMV，MOV等。')
          },
          {
            title:window.intl.get('多种转场效果'),
            desc:window.intl.get('淡入淡出，擦出，渐变，圆圈多种转场效果可以进行选择，使用过渡动效后，让您的视频流畅衔接，变得更加清晰自然')
          },
          {
            title:window.intl.get('任意调整视频顺序'),
            desc:window.intl.get('您可以拖动单个视频调整视频的顺序。')
          },
          {
            title:window.intl.get('多种输出质量选择'),
            desc:window.intl.get('不但能够输出原视频相同分辨率的视频，还能够选择性的输出240p，360p，480p，720p，1080p分辩率的视频。')
          },
          {
            title:window.intl.get('多种比例尺寸选择'),
            desc:window.intl.get('您可以根据需要，将拼接好的视频，选择统一的视频尺寸，以适应不同场景的需要。')
          },
          {
            title:window.intl.get('在线视频拼接'),
            desc:window.intl.get('该应用程序可以在您的浏览器窗口中直接在线拼接视频文件，方便直接快捷。')
          },
          {
            title:window.intl.get('隐私与安全'),
            desc:window.intl.get('我们已将隐私保护内置于我们提供的的每个产品功能中,让您在获得出色使用体验的同时能够确保个人信息安全可靠。')
          }
        ]
      })
    }
  }

  render() {
    const {datalist} = this.state;
    const {type} = this.props;
    return (
      <div className='cutList-box'>
        <div className='boxInner'>
          <ul>
            {
              datalist.map((item,index)=>{
                return <li className={type === 'singleCut'?'sc-item' : 'muliSpelicing'} key={'singleCut'+index}>
                  <div className='list-image'></div>
                  <div className='list-info'>
                    <h2>{item.title}</h2>
                    <p>{item.desc}</p>
                  </div>
                </li>
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default CutList;
