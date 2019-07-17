import React, {Component} from 'react';
import './index.scss';
import step1_img from '../../../../assets/help01@2x.png'
import step2_img from '../../../../assets/help02@2x.png'
import step3_img from '../../../../assets/help03@2x.png'
import step4_img from '../../../../assets/help04@2x.png'

/* eslint-disable */

export default class ClipOperation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // shouldComponentUpdate() {
  //
  // }

  render() {

    return (
      <div className="help_content_box">
        <h2 className="help_content_title">如何使用喜剪在线编辑视频？</h2>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第一步：将视频添加到在线视频编辑器</h3>
          <p className="help_content_tip">
            单击+按钮或者拖放或者点击添加视频选项以添加您需要编辑的视频。
          </p>
          <img src={step1_img} alt="步骤1" className="help_content_img"/>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第二步：使用修剪，裁剪等编辑视频</h3>
          <p className="help_content_tip">
            您可以在此界面上在线修剪，裁剪，旋转，翻转调整视频。单击视频缩略图下的按钮，进行所需要的更改。
          </p>
          <img src={step2_img} alt="步骤2" className="help_content_img"/>
          <p className="help_content_tip">
            <span className="help_content_bold">修剪：</span>
            可以拖动小剪刀，设置视频的开始时间和结束时间轻松修剪视频，视频选中框可以整体拖动选择。
          </p>
          <p className="help_content_tip">
            <span className="help_content_bold">裁剪：</span>
            根据需要裁剪不需要的部分或者将宽高比更改为1:1（方形），4:3（经典电视），16:9宽屏幕，21:9银幕。
          </p>
          <p className="help_content_tip">
            <span className="help_content_bold">旋转：</span>
            在线旋转视频180度，逆时针或者顺时针旋转视频90度。
          </p>
          <p className="help_content_tip">
            <span className="help_content_bold">翻转：</span>
            翻转视频水平或者垂直以实现镜像效果。
          </p>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第三步：开始在线编辑视频</h3>
          <p className="help_content_tip">
            单击“格式或者质量”选项可以选择您需要的格式和不同大小的文件质量（当前仅支持MP4格式）。最后，点击“处理”按钮喜剪开始处理您所编辑的视频。
          </p>
          <img src={step3_img} alt="步骤3" className="help_content_img"/>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第四步：保存并下载您的视频</h3>
          <p className="help_content_tip">编辑过程即将完成，您可以通过单击“
            <span className="help_content_bold">下载</span>”按钮下载您的自定义视频。或者单击“
            <span className="help_content_bold">编辑另一个视频</span>”继续编辑其他视频，则回到首页。
          </p>
          <img src={step4_img} alt="步骤4" className="help_content_img"/>
        </div>
      </div>
    );
  }
}

