import React, { Component } from 'react';
import './DownloadLists.scss'
import tools from '@/utils/tools'
import api from '@/config/api'
import { Link } from 'react-router-dom'
// import OutOption from './OutOption/OutOption'
import DownloadList from './DownloadList/DownloadList'

class DownloadLists extends Component {
  constructor () {
    super()
    this.state = {
      // downloadList: [],
      // showOutOption: true
    }
  }

  startCovert (el,state) {
    //el表示当前视频md5，state表示转码成功还失败
    this.props.startCovert(el,state)
  }

  deleteDownloadRecord (el) {
    this.props.callBack(el)
  }

  moreFile = () => {
    if(tools.getCapacity_storage().capacity > 0){
      window.location.href = api.return_url+'#/user'
    } else {
      if (window.confirm('非会员用户不能查看记录，请充值查看！') === true) {
        window.location.href = api.return_url+'#/purchase'
      }
    }
  }

  showToast = (text) => {
    this.props.showToast(text)
  }

  render () {
    const { uploadSuccessList } = this.props
    // const { downloadList, showOutOption } = this.state
    // if(!start){
      return (
        <div className='download_lists'>
          { uploadSuccessList.length < 1 ? 
              <div className='download_lists_inner'>
                <p className='download_lists_tip'>Want to convert more videos? Or beyond the 50MB limit?</p>
                <Link to='./purchase'>GO PRO</Link>
              </div>
            :
              <div className='download_lists_inner'>
                {/* {uploadSuccessList.map((item, index) => {
                  return <DownloadList key={item.fileMd5} data={item} videoInfo={videoInfo} />
                })} */}
                {uploadSuccessList.filter((curr,index) => index<5).map((item, index) => {
                  return <DownloadList key={item.fileMd5} data={item} videoInfo={item.videoInfo} 
                  callBack={this.deleteDownloadRecord.bind(this,item.fileMd5)}
                  startCovert={this.startCovert.bind(this,item.fileMd5)}
                  isTransing={item.isTransing} showToast={this.showToast} />
                })}
                {uploadSuccessList.length > 5 ? <div className='download_lists_button' onClick={this.moreFile}>MY FILES</div> : ''}
              </div>
          }
        </div>
      )
    // } else {
    //   return (
    //     <div className='download_lists'>
    //       {showOutOption ? <OutOption fileName={file.name} callBack={this.startCovert} /> : ''}
    //       {downloadList.map ( (item,i)=> <DownloadList key={i} file={{name: item.name,size: item.name,md5: item.md5}} />)}
    //       <div className='download_lists_button'>MY FILES</div>
    //     </div>
    //   )
    // }
  }
}

export default DownloadLists