import React, { Component } from 'react'
import './Animation_bigAndSmall.scss'
import { determineLocale } from 'react-intl-universal';

class Animation_bigAndSmall extends Component {
  static defaultProps = {
    data: {
      text: '请输入您的文字内容',
      color: '#000000',
      time: '10s',
      backgroundColor: 'yellow',
      contentEditable: false,
    },
    layerSize: {
      width: 300,
      height: 28
    },
    site: {
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
    this.props.callBack(e.target.textContent)
  }

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