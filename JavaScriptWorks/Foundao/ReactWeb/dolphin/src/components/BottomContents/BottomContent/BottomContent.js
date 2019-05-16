import React, { Component } from 'react';
import './BottomContent.scss'

class BottomContent extends Component {
  render () {
    const { imgLeft, imgUrl, titles, tips } = this.props
    const tip = tips || ['1','2','3','4','5']
    const title = titles || ['1','2','3']
    if(imgLeft){
      return (
        <div className='index_bottom_content' id='index_bottom_content'>
          <div className='index_bottom_content_img index_bottom_content_left'>
            <img alt='capacity' src={imgUrl}></img>
          </div>
          <div className='index_bottom_content_text'>
            <p className='index_bottom_content_title'>{title[0]}<br/>{title[1]}<br/>{title[2]}</p>
            <p className='index_bottom_content_tip'>{tip[0]}<br/>{tip[1]}<br/>{tip[2]}<br/>{tip[3]}<br/>{tip[4]}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='index_bottom_content' id='index_bottom_content'>
          <div className='index_bottom_content_text'>
            <p className='index_bottom_content_title'>{title[0]}<br/>{title[1]}<br/>{title[2]}</p>
            <p className='index_bottom_content_tip'>{tip[0]}<br/>{tip[1]}<br/>{tip[2]}<br/>{tip[3]}<br/>{tip[4]}</p>
          </div>
          <div className='index_bottom_content_img index_bottom_content_right'>
            <img alt='speed' src={imgUrl}></img>
          </div>
        </div>
      )
    }
  }
}

export default BottomContent