import React, { Component } from 'react'
import './Animation_Character.scss'

class Animation_Character extends Component {
  static defaultProps = {
    data: {
      name: 'name',
      resume: 'resume',
      color: '#000',
      time: '10s',
      backgroundColor: 'yellow',
      width: '200px',
      height: '210px',
      times: 'infinite',//动画次数
    },
    layerSize: {
      width: 120,
      height: 130
    },
    site: {
      x: 0,
      y: 0
    }
  }

  constructor () {
    super()
    this.state = {
      defaultWidth: '120px',
      defaultHeight: '130px'
    }
  }

  lineWidth = (str) => {
    if(str && str.length > 0){
      const value = str.substring(0,str.length-2)
      return (value-10)+'px'
    } else {
      return '0px'
    }
  }

  resetHeight = (str) => {
    if(str && str.length > 0){
      const value = str.substring(0,str.length-2)
      return {topHeight: (value-10)*.6,bottomHeight: (value-10)*.4}
    } else {
      return {topHeight: '120px',bottomHeight: '80px'}
    }
  }

  changeNameText = (e) => {
    this.props.callBack(e.target.textContent,'name')
  }

  changeResumeText = (e) => {
    this.props.callBack(e.target.textContent,'resume')
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
    const line_width = this.lineWidth(data.width || defaultWidth)
    const {topHeight,bottomHeight} = this.resetHeight(data.height || defaultHeight)
    return (
      <div id='character' onBlur={this.props.noModify} style={{width: layerSize.width+'px' || defaultWidth , 
        height: layerSize.height+'px' || defaultHeight, fontFamily: data.fontFamily, fontSize: data.fontSize, 
        left: site.x+'px', top: site.y+'px'}}>
        <div className="character_inner" style={{animationDuration: data.time}}>
          <div className="character_name" style={{height: topHeight}}>
            <div contentEditable={data.contentEditable} suppressContentEditableWarning="true"
             onDoubleClick={this.changeNameText} onInput={this.changeNameText}
             style={{animationDuration: data.time, fontWeight: data.wider ? 'bolder' : 'normal', 
             fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
             justifyContent, color: data.color}}>{data.name}</div>
          </div>
          <div className="character_line" style={{width: line_width, animationDuration: data.time}}></div>
          <div className="character_resume" style={{height: bottomHeight}}>
            <div contentEditable={data.contentEditable} suppressContentEditableWarning="true"
             onDoubleClick={this.changeResumeText} onInput={this.changeResumeText}
             style={{animationDuration: data.time, fontWeight: data.wider ? 'bolder' : 'normal', 
             fontStyle: data.italic ? 'italic' : 'normal', textDecoration: data.underline ? 'underline' : 'none', 
             justifyContent, color: data.color}}>{data.resume}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Animation_Character