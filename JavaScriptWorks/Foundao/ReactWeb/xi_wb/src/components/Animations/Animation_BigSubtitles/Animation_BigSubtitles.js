import React, { Component } from 'react'
import './Animation_BigSubtitles.scss'

class Animation_BigSubtitles extends Component {
  static defaultProps = {
    data: {
      text: '请输入您的文字内容',
      color: '#000',
      time: '10s',
      backgroundColor: 'yellow',
      width: '200px',
      height: '210px',
      times: 'infinite',//动画次数，暂时没用
    },
    layerSize: {//动画大小
      width: 200
    },
    site: {//动画位置
      x: 0,
      y: 20
    }
  }

  constructor () {
    super()
    this.state = {
      defaultWidth: '200px'
    }
  }

  componentDidMount() {
    this.sendHeight()
  }

  //自动设置宽度
  resetWidth = (str) => {
    if(str && str.length > 0){
      const value = str.substring(0,str.length-2)
      return (value-20)+'px'
    } else {
      return '180px'
    }
  }

  changeText = (e) => {
    this.props.callBack(e.target.textContent)//告诉父类我改变了文字内容，根据第二个参数判别是哪一个
    this.sendHeight()
  }

  //获取内容新高度
  sendHeight = () => {
    const height = this.refs.bigSubtitles.getBoundingClientRect().height || 32
    this.props.getHeight(height)
  }

  //设置位置对齐方式，暂时没用
  // getJustifyContent = (str) => {
  //   switch (str) {
  //     case 'left':
  //       return 'flex-start'
  //     case 'center':
  //       return 'center'
  //     case 'right':
  //       return 'flex-end'

  //     default:
  //       return 'center'
  //   }
  // }

  render () {
    const { data, layerSize, site } = this.props
    const { defaultWidth } = this.state
    // const justifyContent = this.getJustifyContent(data.textAlign)
    const rightWidth = this.resetWidth(data.width || defaultWidth)
    return (
      <div id='bigSubtitles' ref='bigSubtitles' onBlur={this.props.noModify} style={{width: layerSize.width+'px' || defaultWidth, 
        color: data.color, fontFamily: data.fontFamily, fontSize: data.fontSize, left: site.x+'px', bottom: site.y+'px'}}>
        <div className="bigSubtitles_inner" style={{animationDuration: data.time, backgroundColor: data.backgroundColor}}>
          <div className="bigSubtitles_left">
            <div className="bigSubtitles_line"  style={{animationDuration: data.time}}></div>
          </div>
          <div className="bigSubtitles_text" style={{width: rightWidth}}>
            <div contentEditable={data.contentEditable} suppressContentEditableWarning="true"
             onDoubleClick={this.changeText} style={{animationDuration: data.time, fontWeight: data.wider ? 'bolder' : 'normal', 
             fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
             }} onInput={this.changeText}>{data.text}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Animation_BigSubtitles