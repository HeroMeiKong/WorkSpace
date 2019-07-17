import React, { Component } from 'react'
import './MessageForAdmin.scss'
import _tool from '@/utils/tool'
import httpRequest from "@/utils/httpRequest";
import _api from "@/API/api";
import messageBox from '@/utils/messageBox'

class MessageForAdmin extends Component {
  constructor () {
    super()
    this.state = {
      latertime: '',
      text: '',
    }
  }

  componentDidMount() {
    this.getMasterNote()
  }
  
  //获取最新一篇站长笔记
  getMasterNote = () => {
    httpRequest({
      url: _api.masternote,
      dataType: 'json',
    }).done((res) => {
      if (res.code / 1 === 0) {
        this.setState({
          text: res.data.text,
          latertime: this.resetTime(res.data.add_time,res.data.server_time)
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  gotoMasterNote = () => {
    window.open('/messageBoard/masterNote')
  }

  //设置时间提示样式
  resetTime = (add_time,server_time) => {
    let value = server_time - add_time
    if(value < 60){
      return value + window.intl.get('秒前')
    } else if(value < 3600){
      return Math.floor(value/60) + window.intl.get('分钟前')
    } else if(value < 86400){
      return Math.floor(value/3600) + window.intl.get('小时前')
    } else if(value < 604800){
      return Math.floor(value/86400) + window.intl.get('天前')
    } else if(value < 2592000){
      return Math.floor(value/604800) + window.intl.get('月前')
    } else {
      return this.changeTime(add_time)
    }
  }

  //另一种时间样式
  changeTime = (millinSeconds) => {
    let date = new Date(millinSeconds*1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const data = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return year + '-' + month + '-' + data + ' ' + hours + ':' + minutes + ':' + seconds
  }

  render () {
    const { latertime, text } = this.state
    return (
      <div className='messageforadmin'>
        <div className="messageforadmin_title">{window.intl.get('站长留言')}</div>
        <div className="messageforadmin_latertime">
          <div className='messageforadmin_clock'></div><p>{latertime}</p>
        </div>
        <div className="messageforadmin_inner">
            <div className="icon1"></div>
            <div className="icon2"></div>
          <div className="messageforadmin_text">{text}</div>
          <div className="messageforadmin_button" onClick={this.gotoMasterNote}>{window.intl.get('站长记事本')}</div>
        </div>
      </div>
    )
  }
}

export default MessageForAdmin