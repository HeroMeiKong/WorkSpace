import React, { Component, Fragment } from 'react'
import './SendMessage.scss'
import _tool from '@/utils/tool'
import httpRequest from "@/utils/httpRequest";
import _api from "@/API/api";
import messageBox from '@/utils/messageBox'

class SendMessage extends Component {
  constructor() {
    super()
    this.state = {
      showOrHidden: false,
      email: '',
      question: '',
      sendSuccess: false,
      hidden: 'flex',//FAQ页面隐藏
    }
  }

  componentDidMount() {
    if(window.location.href.indexOf('FAQ') > 0){
      this.setState({hidden: 'none'})
    } else {
      this.setState({hidden: 'flex'})
    }
  }

  clickMe = () => {
    const url = window.location.href
    if(url.indexOf('messageBoard') > 0){
      this.setState({
        showOrHidden: !this.state.showOrHidden
      })
    } else {
      window.open('/messageBoard')
    }
  }

  changeText = (e) => {
    if(e.target.value.length > 1000){
      messageBox('最多输入1000个字符！')
    } else {
      if(e.target.className === 'sendmessage_message'){
        this.setState({
          question: e.target.value
        })
      } else {
        this.setState({
          email: e.target.value
        })
      }
    }
  }

  sendMessage = () => {
    const { email, question } = this.state
    if(email === ''){
      messageBox(window.intl.get('邮箱地址不能为空！'))
    } else if(question === ''){
      messageBox(window.intl.get('问题不能为空！'))
    } else {
      httpRequest({
        url: _api.msgboard_add,
        dataType: 'json',
        type: 'POST',
        data: {
          email,
          question
        }
      }).done((res) => {
        if (res.code / 1 === 0) {
          this.setState({
            sendSuccess: true
          })
          const time = setTimeout(() => {
            // window.location.reload()
            clearTimeout(time)
            this.setState({
              showOrHidden: false,
              sendSuccess: false
            })
          }, 1000)
        } else {
          messageBox(window.intl.get(res.msg))
        }
      }).fail(() => {
        messageBox(window.intl.get('内部服务器错误！'))
      })
    }
  }

  render () {
    const { showOrHidden, sendSuccess, hidden } = this.state
    return (
      <Fragment>
        {showOrHidden
          ? <div className='sendmessage_close'>
              <div className="sendmessage_button" onClick={this.clickMe}></div>
              {sendSuccess 
                ? <div className='sendsuccess'>
                    <div className='sendsuccess_img'></div>
                    <p>Thank you for your feedback</p>
                  </div> 
                : <Fragment>
                    <input className="sendmessage_address" placeholder='Your email address' onChange={this.changeText} />
                    <textarea className="sendmessage_message" placeholder='Leave us your comment…' onChange={this.changeText} />
                    <div className="sendmessage_send">
                      <div className="send_button" onClick={this.sendMessage}>{window.intl.get('发送')}</div>
                    </div>
                  </Fragment>}
            </div>
          : <div className='sendmessage_open' style={{display: hidden}} onClick={this.clickMe}>
            <div className="sendmessage_icon"></div>
            <p>{window.intl.get('反馈')}</p>
          </div> }
      </Fragment>
    )
  }
}

export default SendMessage