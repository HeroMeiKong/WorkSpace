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
      sendSuccess: false
    }
  }

  //显示或隐藏
  clickMe = () => {
    this.setState({
      showOrHidden: !this.state.showOrHidden
    })
  }

  //改变文字内容
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

  //发送信息
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
          // messageBox(window.intl.get('保存成功！'))
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
    const { showOrHidden, sendSuccess } = this.state
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
          : <div className='sendmessage_open' onClick={this.clickMe}>
            <div className="sendmessage_icon"></div>
            <p>{window.intl.get('反馈')}</p>
          </div> }
      </Fragment>
    )
  }
}

export default SendMessage