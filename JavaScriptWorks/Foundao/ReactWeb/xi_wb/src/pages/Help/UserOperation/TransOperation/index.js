import React, {Component} from 'react';
import './index.scss';
import step1_img from '../../../../assets/help1@2x.png'
import step2_img from '../../../../assets/help2@2x.png'
import step3_img from '../../../../assets/help3@2x.png'
import step4_img from '../../../../assets/help4@2x.png'

/* eslint-disable */

export default class TransOperation extends Component {
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
        <h2 className="help_content_title">如何使用在线视频转码工具转换视频文件？</h2>
        <div className="help_content_detail">
          <h3 className="help_content_tit">第一步：将文件添加到在线转换器</h3>
          <p className="help_content_tip">单击+按钮浏览并从计算机添加文件。您可以单击“
            <span className="help_content_bold">拖放</span>”或“
            <span className="help_content_bold">点击添加文件</span>”
            来添加其他文件
          </p>
          <img src={step1_img} alt="步骤1" className="help_content_img"/>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第二步：选择要转换的目标格式</h3>
          <p className="help_content_tip">文件上传完毕后，点击“
            <span className="help_content_bold">原始分辨率</span>”按钮展开下拉菜单，选择您所需的分辨率，若要选择非常规分辨率可在“<span className="help_content_bold">自定义</span>”中进行手动键入
          </p>
          <img src={step2_img} alt="步骤2" className="help_content_img"/>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第三步：转换您的文件</h3>
          <p className="help_content_tip">单击“
            <span className="help_content_bold">转码</span>”按钮开始转换。上传和转换文件需要一些时间，这取决于您的Internet速度。
          </p>
          <img src={step3_img} alt="步骤3" className="help_content_img"/>
        </div>

        <div className="help_content_detail">
          <h3 className="help_content_tit">第四步：下载转换后的文件</h3>
          <p className="help_content_tip">转换完成后，您可以单击“
            <span className="help_content_bold">下载</span>”按钮下载服务器上已转换的文件。
          </p>
          <img src={step4_img} alt="步骤4" className="help_content_img"/>
        </div>
      </div>
    );
  }
}

