import React, { Component } from 'react'
import './testPage.scss'
// import RadarPopup from '@/components/RadarPopup/index'
// import TestAnimation from '@/components/TestAnimation/TestAnimation'
// import MultiText from '@/components/MultiText/MultiText'
import DynamicsText from '../Watermark/DynamicsText/DynamicsText'


class TestPage extends Component {
  render () {
    return (
      <div className='testanimation'>
        <DynamicsText />
      </div>
    )
  }
}

export default TestPage