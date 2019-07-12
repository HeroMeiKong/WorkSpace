import React, { Component } from 'react'
import './Animation_inAndOut.scss'

class Animation_inAndOut extends Component {
  static defaultProps = {
    data: {
      time_text: 'time',
      location_text: 'location',
      color: '#000',
      time: '10s',
      backgroundColor: 'yellow',
      width: '200px',
      height: '40px',
      times: 'infinite',//动画次数
    },
    layerSize: {//动画大小
      width: 200,
      height: 38
    },
    site: {//动画位置
      x: 0,
      y: 20
    }
  }

  constructor () {
    super()
    this.state = {
      defaultWidth: '200px',
      defaultHeight: '38px'
    }
  }

  componentDidMount() {
    this.sendHeight()
  }

  changeTimeText = (e) => {
    this.props.callBack(e.target.textContent,'time')//告诉父类我改变了文字内容，根据第二个参数判别是哪一个
  }

  changeLocationText = (e) => {
    this.props.callBack(e.target.textContent,'location')//告诉父类我改变了文字内容，根据第二个参数判别是哪一个
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

  //获取内容新高度
  sendHeight = () => {
    const height = this.refs.inAndOut.getBoundingClientRect().height || 38
    this.props.getHeight(height)
  }
  
  render () {
    const { data, layerSize, site } = this.props
    const { defaultWidth, defaultHeight } = this.state
    const justifyContent = this.getJustifyContent(data.textAlign)
    return (
      <div id='inAndOut' ref='inAndOut' onBlur={this.props.noModify} style={{width: layerSize.width + 'px' || defaultWidth,  
      height: layerSize.height + 'px' || defaultHeight, color: data.color, fontFamily: data.fontFamily, 
      fontSize: data.fontSize, left: site.x+'px', bottom: site.y+'px'}}>
        <div className="inAndOut_inner" style={{animationDuration: data.time}}>
          <div className="inAndOut_time">
            <div contentEditable={data.contentEditable} suppressContentEditableWarning="true"
             style={{animationDuration: data.time, fontWeight: data.wider ? 'bolder' : 'normal', 
             fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
             justifyContent}} onDoubleClick={this.changeTimeText}
             onInput={this.changeTimeText}>{data.time_text}</div>
          </div>
          <div className="inAndOut_location">
            <div contentEditable={data.contentEditable} suppressContentEditableWarning="true"
             onDoubleClick={this.changeLocationText} onInput={this.changeLocationText}
             style={{animationDuration: data.time, fontWeight: data.wider ? 'bolder' : 'normal', 
             fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
             justifyContent}}>{data.location_text}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Animation_inAndOut