import React, {Component} from 'react';
import './index.scss';
import {Collapse} from 'element-react'

/* eslint-disable */


export default class ProblemSolve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNum: 1,
      problemIndex: 0,
      transData: [
        {
          ques: '1.什么是在线转码？',
          answ: '在线转码是一款线上的视频文件格式及分辨率转化器，我们提供高效优质的在线服务。在线转码可以帮您把任意格式的视频文件转换为主流最实用便捷的MP4格式视频，同时根据个人需要还可以将视频文件的分辨率进行调整，并且我们不单提供主流的分辨率供您选择，您还可以自定义视频的分辨率。在线转码将成为您视频转换服务的得力助手'
        },
        {
          ques: '2.我可以上传的文件的最大大小是多少？',
          answ: '根据用户付费类型不同，用户在上传视频文件时有不同的文件最大限制；未付费用户上传视频文件大小不能超出100M，24小时试用版、1个月、一年的付费用户上传视频文件大小不能超出10G，终极版用户支持无限制大小视频文件上传'
        },
        {
          ques: '3.上传或者下载的文件需要多长时间？',
          answ: '这取决于您拥有的Internet连接类型，网络环境和您上传的文件大小。'
        },
        {
          ques: '4.有哪些分辨率可选？',
          answ: '我们不仅支持您上传的视频文件的原始分辨率转化，同时也将为您提供常用的视频分辨率，分别为：800x400、1280x720、1920x1080、3996x2160'
        },
        {
          ques: '5.分辨率选择有哪些限制？',
          answ: '我们暂不支持分辨率提升服务，所以您无法选择高于您当前视频分辨率的选项，同时视频分辨率默认为偶数，在自定义分辨率时输入的奇数分辨率会自动变为相近的偶数分辨率'
        },
        {
          ques: '6.我同时可以转码多少个视频呢？',
          answ: '普通用户至多允许同时转码两个视频文件，24小时版会员支持同时转码5个视频文件，1个月会员支持同时转码25个视频文件，1年会员支持同时转码50个视频文件，终极版会员将不限制用户同时转码的数量'
        },
        {
          ques: '7.转码的视频会存在哪里？',
          answ: '比如您的下载文件夹里或者浏览器默认的下载文件夹。'
        },
        {
          ques: '8.忘记密码如何找回？',
          answ: '您可以选择找回密码，找回密码会通过短信的方式将验证码发送至您的手机，键入验证码后您便可以重置您的密码'
        },
        {
          ques: '9.付费套餐可以叠加么？',
          answ: '套餐可以叠加，并且购买更高级套餐时会根据您当前套餐所剩的价值进行价格抵扣'
        }
      ],
      clipData: [
        {
          ques: '1.什么是喜剪？',
          answ: '喜剪是一款单段视频在线剪辑器，依靠我们自身的云服务器，独特的交互形式，您无需任何基础即可轻轻松快速的完成剪辑，剪切视频到任意长度，可以完成裁剪，旋转，翻转等多种效果，它还能够导出多种视频格式或清晰度的视频。'
        },
        {
          ques: '2.我可以上传的文件的最大大小是多少？',
          answ: '目前，在免费的喜剪服务上，您可以上传最多100MB的视频。'
        },
        {
          ques: '3.上传的文件支持哪些格式？',
          answ: '支持所有视频格式上传，如果是非MP4，我们会先进行转码。'
        },
        {
          ques: '4.上传或者下载的文件需要多长时间？',
          answ: '这取决于您拥有的Internet连接类型，网络环境和您上传的文件大小。'
        },
        {
          ques: '5.上传过程中如果互联网中断，文件会丢失吗？',
          answ: '您恢复互联网连接后，点击刷新继续上传。'
        },
        {
          ques: '6.找不到下载的文件，它在那里？',
          answ: '比如您的下载文件夹里或者浏览器默认的下载文件夹。'
        },
        {
          ques: '7.我编辑后的视频文件在下载后无法打开，您能帮忙解决问题吗？',
          answ: '如果您下载的文件无法打开，请首先确保您使用了正确的软件打开文件。如果仍有问题，请通过客服留言联系我们。'
        },
        {
          ques: '8.我怎么给你留言？',
          answ: '点击浏览器右边的咨询客服，可以给我们留言。'
        },
        {
          ques: '9.登录时，如果忘记密码怎么办？',
          answ: '手机号注册，可以通过手机号找回密码。'
        },
      ],
      datas: [],
    };
  }

  componentWillMount() {
    const {transData} = this.state
    this.setState({datas: transData})
  }

  componentDidMount() {

  }

  //切换tab
  changeTab = (tabNum) => {
    const {transData, clipData} = this.state
    this.setState({
      tabNum: tabNum,
      problemIndex: 0
    }, () => {
      if (tabNum === 1) {
        this.setState({datas: transData})
      } else if (tabNum === 2) {
        this.setState({datas: clipData})
      }
    })
  }

  //点击problem
  clickProblem = (index) => {
    this.setState({problemIndex: index})
  }

  componentWillUnmount() {

  }

  // shouldComponentUpdate() {
  //
  // }

  render() {
    const {tabNum, problemIndex, datas} = this.state;

    return (
      <div className="problem-page">
        <div className="problem_content">
          <div className="problem_tabs">
            <div className={tabNum === 1 ? "product_tab active_tab" : "product_tab"}
                 onClick={this.changeTab.bind(this, 1)}
            >在线转码
            </div>
            <div className={tabNum === 2 ? "product_tab active_tab" : "product_tab"}
                 onClick={this.changeTab.bind(this, 2)}
            >单段剪辑
            </div>
          </div>

          <ul className="problem-box">
            <Collapse value={problemIndex.toString()}
                      accordion>
              {datas.length > 0 ?
                datas.map((item, index) => {
                  return <Collapse.Item title={item.ques}
                                        name={index.toString()}
                                        key={index}
                                        onClick={this.clickProblem.bind(this, index)}
                  >
                    <div className="problem_detail">
                      {item.answ}
                    </div>
                  </Collapse.Item>
                }) : ''
              }
            </Collapse>
          </ul>
        </div>
      </div>
    );
  }
}

