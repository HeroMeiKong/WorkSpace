import React, { Component } from 'react'
import './pay.scss'
import Header from '../../components/Header/Header'
import BottomFold from '../../components/BottomFold/BottomFold'
import BottomContent from '../../components/BottomContents/BottomContent/BottomContent'
import PayBottomContents from './PayBottomContents/PayBottomContents'
import BottomBar from '../../components/BottomBar/BottomBar'

class Pay extends Component {
  render () {
    return(
      <div className='wrapper'>
      <div className='backcolor'></div>
        <Header />
        <div className='wrapper_content'>
          <div className='content pay_div'>
            <div>
              <p className='content_header'>FD.MP4 CONVERTER</p>
              <p className='content_title'>We provide an efficient online convert service<br/>Free maximum file size: 100MB</p>
            </div>
          </div>
          <BottomFold />
          <div className='index_content'>
            <div className='content index_div'>
              <BottomContent imgLeft={false} imgUrl={require('../../assets/images/UP_image@2x.png')} titles={['The highest efficiency convert']} tips={['MP4 CONVERT will improve your device’s','performance by cleaning junk files, optimizing','device memory']} />
            </div>
          </div>
          <PayBottomContents />
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default Pay