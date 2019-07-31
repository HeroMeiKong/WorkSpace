import React, { Component } from 'react';
import './App.css';

class Scale extends Component {
  constructor(){
    super()
    this.state = {
      markpic: false,//激活水印
      scalepic: false,//激活放大缩小图片
      oldMarkpic_pos: {x: 0, y: 0},//记录前一次水印的位置
      oldMarkpic_size: {width: 0, height: 0},//记录前一次水印的大小
      markpic_pos: {x: 0, y: 0},//开始点击水印都位置
      watermark: {width: 200, height: 200, x: 0, y: 0},//水印图片最终信息
      whichOne: '',
      pos: {
        LT: {x: 0, y: 0},
        RT: {x: 0, y: 0},
        LB: {x: 0, y: 0},
      }
    }
  }

  componentDidMount() {
    document.onmousemove = this.startMove;
    document.onmouseup = this.overMove;
  }

  clickMarkPic = () => {
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      markpic: true,
      markpic_pos: {x,y},
      oldMarkpic_pos: {x: this.state.watermark.x, y: this.state.watermark.y}
    })
  }

  startMove = () => {
    const { scalepic, markpic, whichOne } = this.state
    if(scalepic){
      switch (whichOne) {
        case 'left_top':
          this.ScalePicLT()
          break;
        case 'right_top':
          this.ScalePicRT()
          break;
        case 'left_bottom':
          this.ScalePicLB()
          break;
        case 'right_bottom':
          this.ScalePicRB()
          break;
  
        default:
          break;
      }
    } else {
      if(markpic){
        this.moveMarkPic('watermark')
      }
    }
  }

  overMove = () => {
    this.setState({
      markpic: false,
      removepic: false,
      scalepic: false,
    })
  }

  clickScaleMarkPic = (value) => {
    const { watermark } = this.state
    const e = window.event
    const x = e.pageX || e.clientX
    const y = e.pageY || e.clientY
    this.setState({
      whichOne: value,
      markpic: true,
      scalepic: true,
      markpic_pos: {x,y},
      oldMarkpic_size: {width: this.state.watermark.width, height: this.state.watermark.height},
      pos: {
        LT: {x: watermark.x + watermark.width, y: watermark.y + watermark.height},
        RT: {x: watermark.x, y: watermark.y + watermark.height},
        LB: {x: watermark.x + watermark.width, y: watermark.y},
      }
    })
  }

  moveMarkPic = () => {
    const e = window.event
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let x = 0
    let y = 0
    x = newX - this.state.markpic_pos.x + this.state.oldMarkpic_pos.x
    y = newY - this.state.markpic_pos.y + this.state.oldMarkpic_pos.y
    const screenWidth = 800
    const screenHeight = 800
    if(0 <= x && x <= screenWidth - this.state.watermark.width){
      if(0 <= y && y <= screenHeight - this.state.watermark.height){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x, y},
        })
      } else if(0 > y){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x, y: 0},
        })
      } else {
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x, y: screenHeight - this.state.watermark.height},
        })
      }
    } else if(0 > x){
      if(0 <= y && y <= screenHeight - this.state.watermark.height){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: 0, y},
        })
      } else if(0 > y){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: 0, y:0},
        })
      } else {
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: 0, y: screenHeight - this.state.watermark.height},
        })
      }
    } else {
      if(0 <= y && y <= screenHeight - this.state.watermark.height){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: screenWidth - this.state.watermark.width, y},
        })
      } else if(0 > y){
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: screenWidth - this.state.watermark.width, y: 0},
        })
      } else {
        this.setState({
          watermark: {width: this.state.watermark.width, height: this.state.watermark.height, x: screenWidth - this.state.watermark.width, y: screenHeight - this.state.watermark.height},
        })
      }
    }
  }

  ScalePicLT = () => {
    const { markpic_pos, oldMarkpic_size, oldMarkpic_pos, pos } = this.state
    const e = window.event
    const minSize = {width: 40, height: 40}
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let width = 0
    let height = 0
    width = markpic_pos.x - newX + oldMarkpic_size.width
    height = markpic_pos.y - newY + oldMarkpic_size.height
    let a = newX - markpic_pos.x
    let b = newY - markpic_pos.y
    if(width >= minSize.width && width <= pos.LT.x){
      if(height >= minSize.height && height <= pos.LT.y){
        this.setState({
          watermark: {width, height, x: oldMarkpic_pos.x + a, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width, height: minSize.height, x: oldMarkpic_pos.x + a, y: pos.LT.y-40},
        })
      } else {
        this.setState({
          watermark: {width, height: pos.LT.y, x: oldMarkpic_pos.x + a, y: 0},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= pos.LT.y){
        this.setState({
          watermark: {width: minSize.width, height, x: pos.LT.x-40, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: minSize.width, height: minSize.height, x: pos.LT.x-40, y: pos.LT.y-40},
        })
      } else {
        this.setState({
          watermark: {width: minSize.width, height: pos.LT.y, x: pos.LT.x-40, y: oldMarkpic_pos.y + b},
        })
      }
    } else {
      if(height >= minSize.height && height <= pos.LT.y){
        this.setState({
          watermark: {width: pos.LT.x, height, x: 0, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: pos.LT.x, height: minSize.height, x: 0, y: pos.LT.y-40},
        })
      } else {
        this.setState({
          watermark: {width: pos.LT.x, height: pos.LT.y, x: 0, y: 0},
        })
      }
    }
  }

  ScalePicRT = () => {
    const { markpic_pos, oldMarkpic_size, oldMarkpic_pos, watermark, pos } = this.state
    const e = window.event
    const minSize = {width: 40, height: 40}
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let width = 0
    let height = 0
    width = newX - markpic_pos.x + oldMarkpic_size.width
    height = markpic_pos.y - newY + oldMarkpic_size.height
    const screenWidth = 800
    let b = newY - markpic_pos.y
    if(width >= minSize.width && width <= screenWidth - pos.RT.x){
      if(height >= minSize.height && height <= pos.RT.y){
        this.setState({
          watermark: {width, height, x: watermark.x, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width, height: minSize.height, x: watermark.x, y: pos.RT.y-40},
        })
      } else {
        this.setState({
          watermark: {width, height: pos.RT.y, x: watermark.x, y: 0},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= pos.RT.y){
        this.setState({
          watermark: {width: minSize.width, height, x: watermark.x, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: minSize.width, height: minSize.height, x: watermark.x, y: pos.RT.y-40},
        })
      } else {
        this.setState({
          watermark: {width: minSize.width, height: pos.RT.y, x: watermark.x, y: 0},
        })
      }
    } else {
      if(height >= minSize.height && height <= pos.RT.y){
        this.setState({
          watermark: {width: screenWidth - pos.RT.x, height, x: watermark.x, y: oldMarkpic_pos.y + b},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: pos.RT.x, height: minSize.height, x: watermark.x, y: pos.RT.y-40},
        })
      } else {
        this.setState({
          watermark: {width: screenWidth - pos.RT.x, height: pos.RT.y, x: watermark.x, y: 0},
        })
      }
    }
  }

  ScalePicLB = () => {
    const { markpic_pos, oldMarkpic_size, oldMarkpic_pos, watermark, pos } = this.state
    const e = window.event
    const minSize = {width: 40, height: 40}
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let width = 0
    let height = 0
    width = markpic_pos.x - newX + oldMarkpic_size.width
    height = newY - markpic_pos.y + oldMarkpic_size.height
    const screenHeight = 800
    let a = newX - markpic_pos.x
    if(width >= minSize.width && width <= pos.LB.x){
      if(height >= minSize.height && height <= screenHeight - pos.LB.y){
        this.setState({
          watermark: {width, height, x: oldMarkpic_pos.x + a, y: watermark.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width, height: minSize.height, x: oldMarkpic_pos.x + a, y: pos.LB.y},
        })
      } else {
        this.setState({
          watermark: {width, height: screenHeight - pos.LB.y, x: oldMarkpic_pos.x + a, y: pos.LB.y},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= screenHeight - pos.LB.y){
        this.setState({
          watermark: {width: minSize.width, height, x: pos.LB.x - 40, y: pos.LB.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: minSize.width, height: minSize.height, x: pos.LB.x - 40, y: pos.LB.y},
        })
      } else {
        this.setState({
          watermark: {width: minSize.width, height: pos.LB.y, x: pos.LB.x - 40, y: watermark.y},
        })
      }
    } else {
      if(height >= minSize.height && height <= screenHeight - pos.LB.y){
        this.setState({
          watermark: {width: pos.LB.x, height, x: 0, y: watermark.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: pos.LB.x, height: minSize.height, x: pos.LB.x, y: watermark.y},
        })
      } else {
        this.setState({
          watermark: {width: pos.LB.x, height: screenHeight - pos.LB.y, x: 0, y: pos.LB.y},
        })
      }
    }
  }

  ScalePicRB = () => {
    const { markpic_pos, oldMarkpic_size, watermark } = this.state
    const e = window.event
    const minSize = {width: 40, height: 40}
    const newX = e.pageX || e.clientX
    const newY = e.pageY || e.clientY
    let width = 0
    let height = 0
    width = newX - markpic_pos.x + oldMarkpic_size.width
    height = newY - markpic_pos.y + oldMarkpic_size.height
    const screenWidth = 800
    const screenHeight = 800
    if(width >= minSize.width && width <= screenWidth - watermark.x){
      if(height >= minSize.height && height <= screenHeight - watermark.y){
        this.setState({
          watermark: {width, height, x: watermark.x, y: watermark.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width, height: minSize.height, x: watermark.x, y: watermark.y},
        })
      } else {
        this.setState({
          watermark: {width, height: screenHeight - watermark.y, x: watermark.x, y: watermark.y},
        })
      }
    } else if(width < minSize.width){
      if(height >= minSize.height && height <= screenHeight - watermark.y){
        this.setState({
          watermark: {width: minSize.width, height, x: watermark.x, y: watermark.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: minSize.width, height: minSize.height, x: watermark.x, y: watermark.y},
        })
      } else {
        this.setState({
          watermark: {width: minSize.width, height: screenHeight - watermark.y, x: watermark.x, y: watermark.y},
        })
      }
    } else {
      if(height >= minSize.height && height <= screenHeight - watermark.y){
        this.setState({
          watermark: {width: screenWidth - watermark.x, height, x: watermark.x, y: watermark.y},
        })
      } else if(height < minSize.height){
        this.setState({
          watermark: {width: screenWidth - watermark.x, height: minSize.height, x: watermark.x, y: watermark.y},
        })
      } else {
        this.setState({
          watermark: {width: screenWidth - watermark.x, height: screenHeight - watermark.y, x: watermark.x, y: watermark.y},
        })
      }
    }
  }

  render () {
    const { watermark } = this.state
    return (
      <div className="wrapper">
        <div className="inner">
          <div className="box" onMouseDown={this.clickMarkPic} style={{
            width: watermark.width, height: watermark.height,
            transform: 'translate('+watermark.x+'px,'+watermark.y+'px)'}}>
            <div className="left_top inner_box" onMouseDown={this.clickScaleMarkPic.bind(this,'left_top')}></div>
            <div className="right_top inner_box" onMouseDown={this.clickScaleMarkPic.bind(this,'right_top')}></div>
            <div className="left_bottom inner_box" onMouseDown={this.clickScaleMarkPic.bind(this,'left_bottom')}></div>
            <div className="right_bottom inner_box" onMouseDown={this.clickScaleMarkPic.bind(this,'right_bottom')}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Scale;
