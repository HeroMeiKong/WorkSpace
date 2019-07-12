import React, { Component } from 'react';
import './BottomContents.scss'
import BottomContent from './BottomContent/BottomContent'

class BottomContents extends Component {
  render () {
    return (
      <div className='index_content'>
        <div className='content index_div inner_conetnt'>
          {/* <div className='index_bottom_content'>
            <div className='index_bottom_content_img index_bottom_content_left'>
              <img alt='capacity' src={require('../../assets/images/UP_image@2x.png')}></img>
            </div>
            <div className='index_bottom_content_text'>
              <p className='index_bottom_content_title'>Up to 10GB video converting</p>
              <p className='index_bottom_content_tip'>Want to converting a huge video file in a very<br/>short time? the Dolphin MP4 Converter allows you<br/>convert maxium 10GB file at once!</p>
            </div>
          </div> */}
          <BottomContent imgLeft={true} imgUrl={require('../../assets/images/10GB_image@2x.png')} titles={['Up to 10GB','video converting']} tips={['Want to convert a huge video file','in a very short time? the Dolphin MP4','Converter allows you to convert maxium','10GB file at once!']} />
          <BottomContent imgLeft={false} imgUrl={require('../../assets/images/Speed_image@2x.png')} titles={['20X speed faster','than PC software']} tips={['The Dophing MP4 Converter, which combines the','latest GPU video enconding and cloud-based','uploading/downloading technology, brings you','far more processing speed than many desktop converter softwares.']} />
          <BottomContent imgLeft={true} imgUrl={require('../../assets/images/high_image@2x.png')} titles={['High quality codec','technology']} tips={['We use advanced slice compression, size conversion','and resampling algorithms; excellent image','sharpening and color correction filter techniques','help improve the visual quality of poor source files.']} />
          <BottomContent imgLeft={false} imgUrl={require('../../assets/images/these_image@2x.png')} titles={['These are free']} tips={['Can you experience our service for free? We','provide you with a maximum of 50MB of','video memory space, as long as your video','length is more than 10 seconds, you can use','it for free!']} />
          {/* <div className='index_bottom_content'>
            <div className='index_bottom_content_text'>
              <p className='index_bottom_content_title'>20X speed faster<br/>than normal PC<br/>software </p>
              <p className='index_bottom_content_tip'>the Dolphin MP4 Converter that combines the latest GUP<br/>video enconding and Cloud based uploading/downloading<br/>technology brings you far more processing speed than many<br/>desktop converter softwares</p>
            </div>
            <div className='index_bottom_content_img index_bottom_content_right'>
              <img alt='speed' src={require('../../assets/images/Speed_image@2x.png')}></img>
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}

export default BottomContents