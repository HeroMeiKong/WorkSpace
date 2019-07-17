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
    layerSize: {
      width: 200
    },
    site: {
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
    this.props.callBack(e.target.textContent)
    this.sendHeight()
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