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

  //跳转到用户页面
  moreFile = () => {
    if(tools.getCapacity_storage().capacity > 0){
      window.location.href = api.return_url_user
      // window.location.href = api.return_url+'#/user'//预上线
      // window.location.href = api.return_url+'user' //线上
    } else {
      if (window.confirm("Non-member users can't view the record, please recharge it!") === true) {
        window.location.href = api.return_url_purchase
        // window.location.href = api.return_url+'#/purchase' //预上线
        // window.location.href = api.return_url+'purchase' //线上
      }
    }
  }

  showToast = (text,openedWindow) => {
    this.props.showToast(text,openedWindow)
  }

  updateCapacity = () => {
    let capacity = tools.getCapacity_storage().capacity || '0'
    return {capacity}
  }

  render () {
    const { uploadSuccessList } = this.props
    const { capacity } = this.updateCapacity()
      return (
        <div className='download_lists'>
          { uploadSuccessList.length < 1 ? 
              <div className='download_lists_inner'>
                <p className='download_lists_tip'>Want to convert more videos? Or beyond the 50MB limit?</p>
                <Link target='_blank' to='./purchase'>GO PRO</Link>
              </div>
            :
              <div className='download_lists_inner'>
                {capacity !== '0' ? '' : <Link target='_blank' to='./purchase'>GO PRO</Link>}
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
  }
}

export default DownloadLists