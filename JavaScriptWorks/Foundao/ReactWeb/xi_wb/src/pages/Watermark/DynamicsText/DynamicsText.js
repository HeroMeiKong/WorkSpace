import React, { Component } from 'react'
import './DynamicsText.scss'
// import { ColorPicker } from 'element-react'
import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import MultiText from '@/components/MultiText/MultiText'

class DynamicsText extends Component {
  constructor () {
    super()
    this.state = {
      fontFamily: {Heiti: window.intl.get('黑体'),console: 'console'},
      fontSize: {'16px': '16px','18px': '18px', '20px': '20px'},
      dynamics: {Dynamic0: window.intl.get('无动效'),Dynamic1: window.intl.get('版权动效'),Dynamic2: window.intl.get('文字渐入'),Dynamic3: window.intl.get('地点标注'),Dynamic4: window.intl.get('矩阵动效'),Dynamic5: window.intl.get('特殊标记')},
      color: '#000000',//用户看到的颜色
      realColor: '#000000',//传给服务器的颜色，这是由于服务器颜色是相反的
      dynamicsText: {"width":640,"height":360,"video":[{"url": "http://cd.foundao.com:18080/org/27d4cf6c6924b320c80862ff32fb5973.MOV","type":"video"}],"layer":[{"x": 10,"y": 10,"start_time":0,"duration":10,"yt_type":"text","text_type":"text","text":"文字内容123","width":156,"height":40}]},
      text_type: 'none',//文字类型，判断哪个加上特殊标记
      canIUseColor: true,//是否可以修改颜色
    }
  }

  changeFontFamily = (e) => {
    this.props.callBack(e,'changeFontFamily')
  }

  changeFontSize = (e) => {
    this.props.callBack(e,'changeFontSize')
  }

  changeColor = (e) => {
    const { color, realColor } = this.rgbaToHexa(e)
    this.setState({
      color,
      realColor
    })
    this.props.callBack({ color, realColor },'changeColor')
  }

  //重新设置颜色格式
  rgbaToHexa = (rgba) => {
    //element-react
    // if(rgba){
    //   rgba = rgba + ''//先字符串化
    //   let removehead = (rgba+'').substring(5)//去首部
    //   const length = removehead.length
    //   let removeTail = removehead.substring(0,length-1)//去尾部
    //   let arr = removeTail.split(',')
    //   let hex = '#' + this.tenToHex(arr[0]) + this.tenToHex(arr[1]) + this.tenToHex(arr[2]) + this.tenToHex(Math.round(arr[3]*255))
    //   console.log(hex)
    //   return hex
    // } else {
    //   return '#00000000'
    // }

    //rc-color-picker
    if(rgba){
      let color = rgba.color + this.tenToHex(Math.round(rgba.alpha/100*255))
      let realColor = rgba.color + this.tenToHex(Math.round(Math.abs(rgba.alpha/100*255 - 255)))
      return {color,realColor}
    } else {
      return {color:'#00000000',realColor:'#00000000'}
    }
  }

  //根据后台的要求格式化颜色
  tenToHex = (num) => {
    if(num){
      num = num - 0//先数字化,00是不透明，ff是全透明
      if(num < 16){
        return '0' + num.toString(16)
      } else {
        return num.toString(16)
      }
    } else {
      return '00'
    }
  }

  //根据传入的值判断是否可选颜色
  changeDynamics = (e) => {
    let showColor = true
    this.props.callBack(e,'changeDynamics')
    switch (e) {
      case window.intl.get('无动效'):
        showColor = true
        break;
      case window.intl.get('版权动效'):
        showColor = false
        break;
      case window.intl.get('文字渐入'):
        showColor = false
        break;
      case window.intl.get('地点标注'):
        showColor = false
        break;
      case window.intl.get('矩阵动效'):
        showColor = true
        break;
      case window.intl.get('特殊标记'):
        showColor = false
        break;
      default:
        showColor = true
        break;
    }
    this.setState({
      canIUseColor: showColor
    })
  }

  //添加事件监听函数
  eventListener = (e) => {
    const str = e.target.className.split(' ')
    switch (str[0]) {
      case 'wider':
        this.changeWider(e)
        break;
      case 'italic':
        this.changeItalic(e)
        break;
      case 'underline':
        this.changeUnderline(e)
        break;
      case 'text_left':
        // this.changeText_left(e)
        this.changeTextType(e,'text_left')
        break;
      case 'text_center':
        // this.changeText_center(e)
        this.changeTextType(e,'text_center')
        break;
      case 'text_right':
        // this.changeText_right(e)
        this.changeTextType(e,'text_right')
        break;
      default:
        break;
    }
  }

  //字体加粗
  changeWider = (e) => {
    if(e.target.className === 'wider'){
      e.target.className = 'wider active'
    } else {
      e.target.className = 'wider'
    }
    this.props.callBack(e,'changeWider')
  }

  //字体斜体
  changeItalic = (e) => {
    if(e.target.className === 'italic'){
      e.target.className = 'italic active'
    } else {
      e.target.className = 'italic'
    }
    this.props.callBack(e,'changeItalic')
  }

  //添加下划线
  changeUnderline = (e) => {
    if(e.target.className === 'underline'){
      e.target.className = 'underline active'
    } else {
      e.target.className = 'underline'
    }
    this.props.callBack(e,'changeUnderline')
  }

  //改变字体对齐方式
  changeTextType = (e,value) => {
    if(e.target.className === value){
      this.setState({
        text_type: value
      })
      this.props.callBack(e,value)
    } else {
      this.setState({
        text_type: 'none'
      })
      this.props.callBack(e,'noChangeTextType')
    }
  }

  changeText_left= (e) => {
    if(e.target.className === 'text_left'){
      this.setState({
        text_type: 'text_left'
      })
    } else {
      this.setState({
        text_type: 'none'
      })
    }
    this.props.callBack(e,'changeText_left')
  }

  changeText_center = (e) => {
    if(e.target.className === 'text_center'){
      e.target.className = 'text_center active'
    } else {
      e.target.className = 'text_center'
    }
    this.props.callBack(e,'changeText_center')
  }

  changeText_right = (e) => {
    if(e.target.className === 'text_right'){
      e.target.className = 'text_right active'
    } else {
      e.target.className = 'text_right'
    }
    this.props.callBack(e,'changeText_right')
  }

  

  render () {
    const { fontFamily, fontSize, dynamics, color, text_type, canIUseColor } = this.state
    return (
      <div className='dynamics_text'>
        <div className='dynamics_text_inner'>
          <div className='dynamics_text_left'>
            <MultiText defaultText={window.intl.get('文字动效')} content={dynamics} onChange={this.changeDynamics} />
            {canIUseColor ? <MultiText defaultText={window.intl.get('选择字体')} content={fontFamily} onChange={this.changeFontFamily} /> : ''}
            {canIUseColor ? <MultiText defaultText={window.intl.get('字体大小')} content={fontSize} onChange={this.changeFontSize} /> : ''}
            {/* <ColorPicker showAlpha value={color} onChange={this.changeColor} /> */}
            {canIUseColor ? <ColorPicker color={color} onChange={this.changeColor} placement="bottomRight"
              defaultColor={color} defaultAlpha={100} animation='slide-up' /> : ''}
          </div>
          <div className='dynamics_text_right' onClick={this.eventListener}>
            {/* <div className="wider"></div>
            <div className="italic"></div>
            <div className="underline"></div> */}
            {canIUseColor ? <div className={text_type === 'text_left' ? 'text_left active' : 'text_left'}></div> : <div></div>}
            {canIUseColor ? <div className={text_type === 'text_center' ? 'text_center active' : 'text_center'}></div> : ''}
            {canIUseColor ? <div className={text_type === 'text_right' ? 'text_right active' : 'text_right'}></div> : ''}
          </div>
        </div>
      </div>
    )
  }
}

export default DynamicsText