import React, { Component } from 'react'
import './QA.scss'

class QA extends Component {
  static defaultProps = {
    data: {
      user_name: 'mouyi***@163.com',
      tip: 'Merge Video',
      question: 'What is Merge Video?',
      answer: 'Online transcoding is an online video file format and resolution converter.'
    }
  }

  render () {
    const { data } = this.props
    return (
      <div className='qa'>
        <div className="qa_left">
          <div className='q'></div>
          <div className='a'></div>
        </div>
        <div className="qa_right">
          <div className="qa_top">
            <div className="qa_user">User：{data.user_name}</div>
            <div className="tip">{data.tip}</div>
          </div>
          <div className="qa_question">{data.question}</div>
          <div className="qa_answer">{data.answer}</div>
        </div>
      </div>
    )
  }
}

export default QA