import React, { Component } from 'react';
import './Toast.scss'

class Toast extends Component{
  static defaultProps = {
    text: 'Error occurred!'
  }

  triggerFather = () => {
    //触发父类方法
    this.props.callBack()
  }

  render () {
    return (
      <div className='toast'>
        <div className='toast_box'>
          <h1>Permissions</h1>
          <p>{this.props.text}</p>
          <div className="toast_button" onClick={this.triggerFather}>DONE</div>
        </div>
      </div>
    )
  }
}

export default Toast