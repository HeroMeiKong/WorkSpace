import React, { Component } from 'react'
import './Animation_bigAndSmall.scss'

class Animation_bigAndSmall extends Component {
  static defaultProps = {
    data: {
      text: '请输入您的文字内容',
      color: '#000000',
      time: '10s',
      backgroundColor: 'yellow',
    },
    layerSize: {//动画大小
      width: 300,
      height: 28
    },
    site: {//动画位置
      x: 0,
      y: 0
    }
  }

  constructor () {
    super()
    this.state = {
      defaultWidth: '300px',
      defaultHeight: '28px'
    }
  }
  
  changeText = (e) => {
    this.props.callBack(e.target.textContent)//告诉父类我改变了文字内容，根据第二个参数判别是哪一个
  }

  //设置位置对齐方式，暂时没用
  getJustifyContent = (str) => {
    switch (str) {
      case 'left':
        return 'flex-start'
      case 'center':
        return 'center'
      case 'right':
        return 'flex-end'

      default:
        return 'center'
    }
  }

  render () {
    const { data, layerSize, site } = this.props
    const { defaultWidth, defaultHeight } = this.state
    const justifyContent = this.getJustifyContent(data.textAlign)
    return (
      <div id='bigAndSmall' onBlur={this.props.noModify} style={{animationDuration: data.time, 
        width: layerSize.width+'px' || defaultWidth, height: layerSize.height+'px' || defaultHeight, 
        fontFamily: data.fontFamily, fontSize: data.fontSize, 
        left: site.x+'px', top: site.y+'px'}}>
        <div className="bigAndSmall_wrapper" style={{color: data.color,animationDuration: data.time}}>
          <div contentEditable={data.contentEditable} suppressContentEditableWarning="true" 
          className="bigAndSmall_innder" onDoubleClick={this.changeText} 
          style={{backgroundColor: data.backgroundColor, fontWeight: data.wider ? 'bolder' : 'normal', 
          fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
          justifyContent}} onInput={this.changeText}>{data.text}</div>
        </div>
      </div>
    )
  }
}

export default Animation_bigAndSmall