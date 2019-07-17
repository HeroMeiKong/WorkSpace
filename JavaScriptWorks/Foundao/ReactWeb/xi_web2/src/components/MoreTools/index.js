import React,{Component} from 'react'
import './index.scss'
import {withRouter,Link} from "react-router-dom";
import singleCut_icon from '@/assets/images/jianji_icon@2x.png'
import muliSplicing_icon from '@/assets/images/pinjie_icon@2x.png'
import watermark_icon from '@/assets/images/icon_stitching@2x.png'
import trans_icon from '@/assets/images/icon_transcoding@2x.png'
import package_icon from '@/assets/images/icon_package copy@2x.png'
import removeIcom from '@/assets/removewatermark/qushuiyin.png'
/* eslint-disable */

@withRouter
export default class MoreTools extends Component{
  constructor(props){
    super(props);
    this.state = {
      title : window.intl.get('我们致力于通过技术为日常挑战创造简单的解决方案'),
      tools : [
        {
          type : 'singleCut',
          name : window.intl.get('单段剪辑'),
          content : window.intl.get('轻松快速地完成剪辑和剪切视频到任意长度'),
          route : '/trim',
          onlineRoute : '//trim.enjoycut.com',
          icon : singleCut_icon,
          canClick : true
        },
        {
          type : 'trans',
          name : window.intl.get('在线转码'),
          content : window.intl.get('支持在线将任意格式的视频转换为MP4格式'),
          route : '/convert',
          onlineRoute : '//convert.enjoycut.com',
          icon : trans_icon,
          canClick : true
        },
        {
          type : 'muliSplicing',
          name : window.intl.get('多段拼接'),
          content : window.intl.get('多个视频进行拼接，可加视频专场特效'),
          route : '/merge',
          onlineRoute : '//merge.enjoycut.com',
          icon : muliSplicing_icon,
          canClick : true
        },
        {
          type : 'watermark',
          name : window.intl.get('添加水印'),
          content : window.intl.get('在线为您的视频添加个性化水印'),
          route : '/watermark',
          onlineRoute : '//watermark.enjoycut.com',
          icon : watermark_icon,
          canClick : true
        },
        {
          type : 'remove',
          name : window.intl.get('去水印4'),
          content :window.intl.get('在线轻松去除视频水印'),
          route : '/remove',
          onlineRoute:"",
          icon : removeIcom,
          canClick : true
        }
      ]
    }
  }

  componentDidMount() {

  }

  //点击
  clickItem = (item)=>{
    if(item.canClick){
      window.open(item.route)
      // const _hostname = window.location.hostname;
      // if (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com') {
      //   window.open(item.onlineRoute)
      // }else {
      //   this.props.history.push(item.route)
      // }
    }else {
      return
    }
  }

  render() {
    const {type} = this.props
    const {title,tools} = this.state
    return (
      <div className="moreTools-box" style={type === 'trans' ? {background : '#F8F9FA'}: {}}>
        <h2 className="more-title">{window.intl.get("更丰富的线上视频工具等您尝试")}</h2>
        <p className="more-tips">{title}</p>
        <ul className="more-content">
          {tools.map((item,index)=>{
            if(type !== item.type) {
              return  <li className={item.canClick ? "more-detail" : "more-detail cantTo"}
                          key={index}>
                  {item.canClick ?
                    <Link to={item.route||''} target='_blank'>{item.name}</Link>:''
                  }
                <div className="detail-bg"></div>
                <div className="detail-main">
                  <img className="detail-icon" src={item.icon} alt={item.name}/>
                  <p className="detail-tit">{item.name}</p>
                  <p className="detail-cont">{item.content}</p>
                </div>
              </li>
            }
          })}
        </ul>
      </div>
    )
  }
}