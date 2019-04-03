import React, { Component } from 'react'
import './SignUpOrLogin.scss'
import SignUpOrLoginCard from './SignUpOrLoginCard/SignUpOrLoginCard'
const facebook = require('@/assets/images/MP4_icon@2x.png')
const twitter = require('@/assets/images/MP4_icon@2x.png')

class SignUpOrLogin extends Component {
  triggerFather = (e) => {
    this.props.callBack(e)
  }
  render () {
    const { show } = this.props
    if(show){
      return (
        <div className='sol_wrapper' onClick={this.triggerFather}>
          <div className='sol_inner'>
            <div className="sol_top">
              <div className="sol_top_img"></div>
              <div className="sol_top_title">MP4·DOLPHIN</div>
            </div>
            <SignUpOrLoginCard sol={show} />
            <div className="sol_bottom">
              <div className="sol_bottom_title">Or login with:</div>
              <img alt='facebook' src={facebook} className="sol_bottom_img"></img>
              <img alt='twitter' src={facebook} className="sol_bottom_img"></img>
            </div>
          </div>
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
}

export default SignUpOrLogin