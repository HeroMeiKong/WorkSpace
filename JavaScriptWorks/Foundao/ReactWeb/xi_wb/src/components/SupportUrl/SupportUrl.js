import React, { Component } from 'react'
import './SupportUrl.scss'

class SupportUrl extends Component {
  constructor () {
    super()
    this.state = {
      arr: ['MPEG to MP4','WMV to MP4','RM to MP4','RMVB to MP4','MPEG1 to MP4','MPEG2 to MP4'],
      arr1: ['MPEG4 to MP4','3GP to MP4','ASF to MP4','SWF to MP4','VOB to MP4','DAT to MP4','MOV to MP4'],
      arr2: ['M4V to MP4','FLV to MP4','F4V to MP4','MKV to MP4','MTS to MP4','TS to MP4','DMV to MP4','MTV to MP4'],
      arr3: ['ASX to MP4','WebM to MP4','RMHD to MP4','QSV to MP4','Blue-ray to MP4']
    }
  }

  //改变页面url
  changeHash = (value) => {
    const newStr = value.replace(/ /g,"_")
    if (this.props.project){
      window.open('/converter?type='+newStr)
    }else {
      window.open('/convert?type='+newStr)
    }
  }

  //渲染每一行
  renderP = (arr) => {
    if(arr){
      const length = arr.length
      return (
        <div>
          {arr.map((p,i) => {
            if(i === length -1){
              return <p key={i} onClick={this.changeHash.bind(this,p)}>{arr[length-1]}</p>
            } else {
              return <p key={i} onClick={this.changeHash.bind(this,p)}>{p}<span>|</span></p>
            }
          })}
        </div>
      )
    } else {
      return null
    }
    
  }

  render () {
    const { arr, arr1, arr2, arr3 } = this.state
    return (
      <div className='supporturl'>
        <div className="supporturl_title">{window.intl.get('我们为您提供多种视频格式的转换')}</div>
        <div className="supporturl_tip">{window.intl.get('提供的常用的视频格式转换')}</div>
        {/* <div className="supporturl_pic"></div> */}
        <div className="supporturl_url">
          {this.renderP(arr)}
          {this.renderP(arr1)}
          {this.renderP(arr2)}
          {this.renderP(arr3)}
        </div>
      </div>
    )
  }
}

export default SupportUrl