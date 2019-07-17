import React, { Component } from 'react'
import './MessageForUser.scss'

class MessageForUser extends Component {
  static defaultProps = {
    data: {
      add_time: '',
      email: '',
      replay: '',
      user_quertion: ''
    }
  }

  render () {
    const { data } = this.props
    if(data.replay){
      return (
        <div className='messageforuser'>
          <div className="messageforuser_top">
            <div className="messageforuser_username">
              {/* <div></div> */}
              <p>{window.intl.get('用户：')}{data.email}</p>
            </div>
            <div className="messageforuser_question">{data.user_question}</div>
          </div>
          <div className="messageforuser_bottom">
            <div className="messageforuser_tips"><div></div><p>{window.intl.get('站长回复')}</p></div>
            <div className="messageforuser_answer">{data.replay}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='messageforuser_nodeal'>
          <div className="messageforuser_top">
            <p>{window.intl.get('用户：')}{data.email}</p>
            <p>{data.add_time}</p>
          </div>
          <div className="messageforuser_question">{data.user_question}</div>
        </div>
      )
    }
  }
}

export default MessageForUser