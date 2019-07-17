import React, {Component} from 'react'
import './index.scss'
import UploadItem from "./UploadItem";
import API from "../../../API/api";
import httpRequest from "../../../utils/httpRequest";
import messageBox from '@/utils/messageBox'
/* eslint-disable */

export default class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }


  //删除文件
  delete = (index) => {
    this.props.deleteFile(index)
  }

  //检查是否可以转码
  checkTrans = () => {
    const {file_list} = this.props
    let file_num = 0
    let has_file = false
    for (let i = 0; i < file_list.length; i++) {
      if (file_list[i].successLoad === true && file_list[i].file_w && file_list[i].file_h) {
        has_file = true
        file_num ++
        continue
      }
      if (!file_list[i].file_name) {
        file_num ++
        continue
      }
    }
    if(file_num === file_list.length && has_file){
      return true
    }else {
      return false
    }
  }

  //检查是否全部可下载
  checkDownload = () => {
    const {file_list} = this.props
    if (file_list.length === 0) {
      return false
    } else {
      // for (let i = 0; i < file_list.length; i++) {
      //   if (file_list[i].successLoad === true && file_list[i].successTrans === true) {
      //     continue
      //   } else {
      //     return false
      //   }
      // }
      // return true
      for (let i = 0; i < file_list.length; i++) {
        if (file_list[i].successLoad === true && file_list[i].successTrans === true) {
          return true
        } else {
          continue
        }
      }
      return false
    }
  }

  //检查是否有正在转码中的视频
  checkTransing = () => {
    const {file_list} = this.props
    if (file_list.length === 0) {
      return true
    } else {
      for (let i = 0; i < file_list.length; i++) {
        if (file_list[i].transing) {
          return true
        }
      }
      return false
    }
  }
  //下载全部
  downloadAll = () => {
    window.gtag && window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'}) //统计下载
    const {file_list} = this.props
    const url_arr = []
    const token_arr = []
    file_list.forEach((item, index) => {
      url_arr.push(item.video_url)
      token_arr.push(item.upToken)
    })
    this.getDownload(url_arr,false,token_arr)
  }

  //下载单个视频
  downloadVideo = (item) => {
    window.gtag && window.gtag('event', 'click', {'event_category': 'download','event_label': 'video'}) //统计下载
    this.getDownload(item,true,[])
  }

  //获取下载地址并跳转下载
  getDownload = (data,isSingle,arr) => {
    let path = ''
    if(isSingle) {
      path = data.video_url
    }else {
      path = data
    }
    // const newWin = window.open()
    let openedWindow = window.open('','_self')
    httpRequest({
      url: API.downloadVideo,
      dataType: 'json',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        path: path,
        up_token : isSingle ? data.upToken : arr,
        trans_type: 1
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        // newWin.location.href = res.data
        openedWindow.location.href=res.data
        // setTimeout(function () {
        //   newWin.close()
        // }, 1500)
      } else {
        // newWin.close()
        messageBox(res.msg)
      }
    }).fail(() => {
      // newWin.close()
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  render() {
    const {file_list} = this.props
    return (
      <div className="upload_controller">
        <div className="upload_controller_bg"></div>
        <div className="upload_controller_main">
          <div className="upload_controller_head">
            <div className="controller_head_btn" onClick={this.props.addUploadBox}>
              <span className="head_addIcon"></span>
              {window.intl.get('添加更多文件')}
            </div>
          </div>

          <ul className="upload_controller_list">
            {file_list.map((item, index) => {
              return <UploadItem item={item}
                                 key={index}
                                 index={index}
                                 uploadChange={this.props.uploadChange}
                                 uploadSuccess={this.props.uploadSuccess}
                                 uploadProgress={this.props.uploadProgress}
                                 uploadError={this.props.uploadError}
                                 selectResolve={this.props.selectResolve}
                                 resolveIndex={this.props.resolveIndex}
                                 clickResolve={this.props.clickResolve}
                                 changeFbl={this.props.changeFbl}
                                 isFirst={this.props.isFirst}
                                 isSelect={this.props.isSelect}
                                 downloadVideo={this.downloadVideo}
                                 retry_this={this.props.retry_this}
                                 stopTrans={this.props.stopTrans}
                                 maxSize={this.props.maxSize}
                                 delete={this.delete}/>
            })}
          </ul>
          {this.checkTransing() ?  //有转码中的视频
            // <div className="upload_controller_btn cantClick">
            //   <div>{window.intl.get('转码中')}</div>
            // </div>
            <div></div>
            :
            this.checkDownload() ?  //全部可以下载
              <div className="upload_controller_btn">
                <div onClick={this.downloadAll}>{window.intl.get('下载全部')}</div>
              </div>
              :
              // <div className={this.checkTrans() ?
              //   "upload_controller_btn" : "upload_controller_btn cantClick"}>
              //   <div onClick={this.transBtn}>{window.intl.get('转码')}</div>
              // </div>
              <div></div>
          }
        </div>
      </div>
    )
  }
}