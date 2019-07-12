import React, {Component} from 'react'
import './index.scss'
import Upload from "@/components/Upload";
import tools from '@/utils/tool';
const pic1 = require('@/assets/wenjian_mp4_icon@2x.png')
/* eslint-disable */

export default class UploadItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoren: true,
      fbl_list: [
        {
          label: window.intl.get('原始分辨率')
        },
        {
          w: 3996,
          h: 2160
        },
        {
          w: 1920,
          h: 1080
        },
        {
          w: 1280,
          h: 720
        },
        {
          w: 800,
          h: 480
        }
      ],
      clickIndex : 0,
    }
  }

  componentWillUnmount () {
    const {index, item} = this.props
    if (!item.successLoad) {
      this.refs.upload.stop_upload()
    } else if (item.transing) {
      this.props.stopTrans(index)
    }
  }

  componentDidMount() {
    const {isFirst, item} = this.props
    if (isFirst) {
      if (item && item.file) {
        this.refs.upload.start_upload_worker(item.file);
      }
    } else {
      this.refs.upload.inputClick()
    }
  }


  //处理文件大小
  replaceSize = (size) => {
    const size_num_MB = size / 1024 / 1024
    if (size_num_MB > 1024) {
      const size_num_GB = size_num_MB / 1024
      const size_num_tofixd = size_num_GB.toFixed(2)
      return size_num_tofixd + 'G'
    } else {
      const size_num_tofixd = size_num_MB.toFixed(2)
      return size_num_tofixd + 'MB'
    }
  }

  changeInput = (index, direction, e) => {
    this.props.changeFbl(index, direction, e)
  }

  //重新上传或者转码
  retryVideo = (index) => {
    const {item} = this.props
    if (item.failLoad) {  //上传失败
      this.refs.upload.start_upload_worker(item.file);
    }
    this.props.retry_this(index)
  }

  //检查是否当前分辨率是被选择的分辨率
  checkFblClick = (fblItem) => {
    const {item} = this.props
    let checkFblclick = false
    if (fblItem.label) {
      if (item.file_w === item.width && item.file_h === item.height) { //与自身分辨率相同
        checkFblclick = true
      }
    } else {
      if (item.file_w === fblItem.w && item.file_h === fblItem.h) {  //相等
        checkFblclick = true
      }
    }
    return checkFblclick
  }

  //检查分辨率能否被点击
  checkCanClick = (fblItem) => {
    const {item} = this.props
    let checkCanClick = false
    if(fblItem.label) {
      checkCanClick = true
    }else {
      if (item.width < fblItem.w && item.height < fblItem.h) {
        checkCanClick = false
      } else {
        checkCanClick = true
      }
    }
    return checkCanClick
  }

  //点击选择分辨率
  clickFbl = (index,fblIndex,fblItem)=>{
    if(!this.checkCanClick(fblItem)){
      return
    }else {
      this.setState({clickIndex:fblIndex},()=>this.props.clickResolve(index, fblItem))
    }
  }

  //修改文字，在文件上传成功后统一改为mp4
  modifyText = (text) => {
    if(text){
      const arr = text.split('.')
      const length = arr.length
      let str = ''
      if(text.indexOf('mp4') > 0){
        return text
      } else {
        for(let i=0;i<length-1;i++){
          str = str + arr[i]
        }
        return str + '.' + 'mp4'
      }
    } else {
      return text
    }
  }

  render() {
    const {item, index, resolveIndex, isSelect} = this.props
    const {isMoren, fbl_list,clickIndex} = this.state
    return (
      <div>
        <Upload onSuccess={this.props.uploadSuccess.bind(this, index)}
                onProgress={this.props.uploadProgress.bind(this, index)}
                ref='upload'
                onError={this.props.uploadError.bind(this, index)}
                maxSize={this.props.maxSize}
                onChange={this.props.uploadChange.bind(this, index)}
                autoUpload={true} //自动上传
                className="display_none"
                accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"/>
        {item.file_name ?
          <li className="upload_controller_detail" key={index}>
            <div className="detail_video_icon" style={item.successLoad && item.successTrans ? {backgroundImage: 'url('+pic1+')'} : {}}></div>
            <p className="detail_video_title">{item.successLoad && item.successTrans ? this.modifyText(item.file_name) : item.file_name}</p>
            <p className="detail_video_size">{this.replaceSize(item.file_size)}</p>
            {item.successLoad && item.successTrans ?   //上传成功 转码成功
              <div className="successTrans_box">
                <div className="successTrans_fbl">
                  {`${item.file_w}*${item.file_h}`}
                </div>
                <div className="download_btn"
                     onClick={this.props.downloadVideo.bind(this, item)}></div>
              </div>
              :
              item.successLoad && !item.transing ?  //上传成功 未转码
                // <div className={isSelect && (resolveIndex / 1 === index / 1) ? "detail_fenbianlv click_bg"
                //   : "detail_fenbianlv"}>
                //   {isSelect?
                //     <div className="fenbianlv_bg"
                //          onClick={this.props.selectResolve.bind(this,index)}></div> :''}
                //   {isSelect && (resolveIndex / 1 === index / 1) ?
                //     <div className="resolve_box">
                //       <div className="resolve_box_head">
                //         <div className={isMoren ? "resolve_moren click_bg" : "resolve_moren"}
                //              onClick={() => this.setState({isMoren: true})}
                //         >{window.intl.get('默认')}
                //         </div>
                //         <div className={isMoren ? "resolve_zdy" : "resolve_zdy click_bg"}
                //              onClick={() => this.setState({isMoren: false})}
                //         >{window.intl.get('自定义')}
                //         </div>
                //       </div>
                //       <div className="resolve_content">
                //         {isMoren ?
                //           fbl_list.map((fblItem, fblIndex) => {
                //             return <div
                //               className={this.checkFblClick(fblItem) ? "resolve_detail click_bg" : !this.checkCanClick(fblItem) ? "resolve_detail cantSelect" : "resolve_detail"}
                //               onClick={this.clickFbl.bind(this,index,fblIndex,fblItem)}
                //               key={fblIndex}>
                //               {fblItem.label ? fblItem.label : fblItem.w + 'x' + fblItem.h}
                //                 {fblIndex === 0 ?
                //                   <span className={clickIndex === 0 ?
                //                     "yuanshi_icon" : "yuanshi_icon yuanshi_not_icon"}></span> : ''
                //                 }
                //                 {fblIndex === 0 ?
                //                   <div className="yuanshi_box">
                //                     {item.width+'*'+item.height}
                //                   </div> : ''
                //                 }
                //             </div>
                //           })
                //           :
                //           <div className="resolve_diy">
                //             {window.intl.get('长：')}<input type="number"
                //                      onChange={this.changeInput.bind(this, index, 'file_w')}
                //                      className="resolve_input"
                //                      max={item.file_w}
                //                      value={item.file_w}/>
                //             {window.intl.get('宽：')}<input type="number"
                //                      className="resolve_input"
                //                      onChange={this.changeInput.bind(this, index, 'file_h')}
                //                      max={item.file_h}
                //                      value={item.file_h}/>
                //             <div className="confirm_resolve_btn"
                //                  onClick={this.props.clickResolve.bind(this, index)}
                //             >{window.intl.get('确定')}
                //             </div>
                //           </div>
                //         }
                //       </div>
                //     </div> : ''
                //   }
                //   <span className={isSelect && resolveIndex / 1 === index / 1 ?
                //     "fenbianlv_icon fbl_click_icon" : "fenbianlv_icon"}></span>
                //   <div className="fbl_box"
                //        onClick={this.props.selectResolve.bind(this, index)}>
                //     {item.file_w === item.width && item.file_h === item.height ?
                //       window.intl.get('原始分辨率') : `${item.file_w}*${item.file_h}`}</div>
                // </div>
                // <div className="uploading_box">
                //   <div className="uploading_bg">{window.intl.get('准备中')}</div>
                //   <p className="uploading_tip">{window.intl.get('准备中')}</p>
                // </div>
                <div className="uploading_box">
                        <div className="uploading_bg" style={{background: '#ffffff',color: 'rgba(244, 75, 83, 1)',paddingRight: '20px'}}>
                        {window.intl.get('准备中')}
                        </div>
                        <div className='uploading_waiting' style={tools.isForeign() ? {right: '10px'} : {right: '10px'}}></div>
                </div>
                :
                item.failLoad || item.failTrans ?  //上传失败
                  <div className="retry_box" onClick={this.retryVideo.bind(this, index)}>
                    <p>{window.intl.get('重试')}</p>
                    <span className="retry_icon"></span>
                  </div>
                  :
                  item.successLoad && item.transing  //转码中
                   ?
                    item.waiting //是否在等待转码返回进度
                      ?
                      <div className="uploading_box">
                        <div className="uploading_bg">
                        {window.intl.get('转换中')}
                        </div>
                        <p className="uploading_tip"
                          style={{clip: `rect(auto auto auto ${(item.percent / 100) * 92}px)`}}
                        >{window.intl.get('转换中')}</p>
                      </div>
                      :
                      <div className="uploading_box">
                        <div className="uploading_bg" style={{background: '#ffffff',color: 'rgba(244, 75, 83, 1)',paddingRight: '20px'}}>
                        {window.intl.get('准备中')}
                        </div>
                        <div className='uploading_waiting' style={tools.isForeign() ? {right: '10px'} : {right: '10px'}}></div>
                      </div>
                    :
                    //上传中
                    <div className="uploading_box">
                      <div className="uploading_bg">
                      {window.intl.get('上传中')}
                      </div>
                      <p className="uploading_tip"
                         style={{clip: `rect(auto auto auto ${(item.percent / 100) * 92}px)`}}
                      >{window.intl.get('上传中')}</p>
                    </div>
            }
            <span className="detail_close_btn"
                  onClick={this.props.delete.bind(this, index)}></span>
          </li> : ''
        }
      </div>
    )
  }
}