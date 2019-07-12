import React, { Component } from 'react'
import './Animation_showAndHidden.scss'

class Animation_showAndHidden extends Component {
  static defaultProps = {
    data: {
      text: '请输入您的文字内容',
      color: 'yellow',
      time: '10s',
      backgroundColor: '',
      width: '400px',
      height: '28px',
      times: 'infinite',//动画次数
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

  changeText = (e) => {
    this.props.callBack(e.target.textContent)//告诉父类我改变了文字内容，根据第二个参数判别是哪一个
    this.sendHeight()
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
    const height = this.refs.showAndHidden.getBoundingClientRect().height || 22
    this.props.getHeight(height)
  }
  
  render () {
    const { data, layerSize, site } = this.props
    const { defaultWidth } = this.state
    const justifyContent = this.getJustifyContent(data.textAlign)
    return (
      <div onBlur={this.props.noModify} contentEditable={data.contentEditable} suppressContentEditableWarning="true"
       id='showAndHidden' ref='showAndHidden'  onDoubleClick={this.changeText} onInput={this.changeText}
       style={{animationDuration: data.time, animationIterationCount: data.times, 
       width: layerSize.width + 'px' || defaultWidth, color: data.color, fontWeight: data.wider ? 'bolder' : 'normal', 
       fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
       justifyContent, fontFamily: data.fontFamily, fontSize: data.fontSize, right: site.x+'px', bottom: site.y+'px'}}>
        {data.text}
      </div>
    )
  }
}

export default Animation_showAndHidden