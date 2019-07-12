import React, { Component } from 'react'
import './MultiText.scss'

class MultiText extends Component {
  static defaultProps = {
    fontSize: '16px',//字体大小
    // width: '150px',
    height: '30px',//动画高度
    color: 'rgba(255, 73, 94, 1)',//文字颜色
    content: {Dynamic0: '无动效',Dynamic1: '效果1',Dynamic2: '效果2',Dynamic3: '效果3',Dynamic4: '效果4', Dynamic5: '效果5'},//选择动效时显示度文字内容
    default: '默认选择',
  }

  constructor () {
    super()
    this.state = {
      name: window.intl.get('默认选择'),
      display: 'none',
    }
  }

  componentWillMount() {
    this.initObject()
    //点击它处，隐藏
    document.addEventListener('click',(e) => {
      if(e.target.className !== 'multiText_top' && e.target.className !== 'multiText_name' && e.target.className !== 'multiText_img'){
        this.setState({
          display: 'none',
        })
      }
    })
    if(this.props.defaultText){
      this.setState({
        name: this.props.defaultText,
      })
    } else {
      this.setState({
        name: window.intl.get('默认选择'),
      })
    }
  }

  //获取初始值
  initObject = () => {
    const { content } = this.props
    if(content){
      const str = JSON.stringify(content).split('"')[3]
      this.props.onChange && this.props.onChange(str)
    }
  }

  showBottom = () => {
    if(this.state.display === 'none'){
      this.setState({
        display: 'flex',
      })
    } else {
      this.setState({
        display: 'none',
      })
    }
  }

  hiddenBottom = (el) => {
    //获取兄弟长度
    const length = el.target.parentNode.childNodes.length
    for(let i=0;i<length;i++){
      //将已经激活状态，失去激活
      if(el.target.parentNode.children[i].className === 'active'){
        el.target.parentNode.children[i].className = ''
      }
    }
    el.target.className = 'active'
    this.setState({
      display: 'none',
      name: el.target.textContent
    })
    this.props.onChange(el.target.textContent)
  }

  render () {
    const { fontSize, color, content, height } = this.props
    const { name, display } = this.state
    return (
      <div className='multiText' style={{fontSize, color, height}}>
        <div className="multiText_inner">
          <div className="multiText_top" onClick={this.showBottom}>
            <div className="multiText_name">{name}</div>
            <div className="multiText_img"></div>
          </div>
          <div className="multiText_bottom" style={{display}}>
          {Object.keys(content).map((key,i) => <div className={i===0 ? 'active' : ''} key={i} onClick={this.hiddenBottom}>{content[key]}</div>
          )}
          </div>
        </div>
      </div>
    )
  }
}

export default MultiText