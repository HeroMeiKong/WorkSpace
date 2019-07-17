import React, { Component } from 'react'
import './OtherProduct.scss'

class OtherProduct extends Component {
  render () {
    return (
      <div className='otherproduct'>
        <div className="otherproduct_inner">
          <div className="otherproduct_pic"></div>
          <div className="otherproduct_delete"></div>
          <div className="otherproduct_left"></div>
          <div className="otherproduct_right">
            <p className="otherproduct_title"></p>
            <p className="otherproduct_text"></p>
            <div className="otherproduct_button">立即使用</div>
          </div>
        </div>
      </div>
    )
  }
}

export default OtherProduct