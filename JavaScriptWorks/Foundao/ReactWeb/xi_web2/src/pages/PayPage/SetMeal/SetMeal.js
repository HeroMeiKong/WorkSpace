import React, { Component } from 'react'
import './SetMeal.scss'

class SetMeal extends Component {
  static defaultProps = {
    type: 'simple',
    data: {
      id: "1",
      price: "39.99",
      recom: "0",//是否特殊标记
      title: "1个月",
    }
  }
  
  render () {
    const { data, isForeign } = this.props
    if(data.recom === '0'){
      return (
        <div className='setmeal'>
          <div className="setmeal_time">{window.intl.get(data.title)}</div>
          <div className="setmeal_price">
            <div className={isForeign ? "setmeal_price_img isForeign" : "setmeal_price_img"}></div>
            {data.price}
          </div>
          <div className="setmeal_tip">{window.intl.get('每日')}<br/>{window.intl.get('仅需')}1.33{window.intl.get('元1')}</div>
          <div className="setmeal_content">
              <div><div></div>10GB {window.intl.get('文件大小')}</div>
              <div><div></div>{window.intl.get('每日')} 15{window.intl.get('次 加水印1')}</div>
              <div><div></div>10 {window.intl.get('个水印模版存储')}</div>
              <div><div></div>{window.intl.get('高')} {window.intl.get('优先级')}</div>
              <div><div></div>{window.intl.get('无广告页')}</div>
          </div>
          <div className="setmeal_button" onClick={this.props.callBack.bind(this,data.id)}>{window.intl.get('即刻享有')}</div>
        </div>
      )
    } else if(data.recom === '1'){
      return (
        <div className='setmeal special'>
          <div className={isForeign ? "setmeal_icon isForeign" : "setmeal_icon"}></div>
          <div className="setmeal_time">{window.intl.get(data.title)}</div>
          <div className="setmeal_price">
            <div className={isForeign ? "setmeal_price_img isForeign" : "setmeal_price_img"}></div>
            {data.price}
          </div>
          <div className="setmeal_tip">{window.intl.get('每日')}<br/>{window.intl.get('仅需')}1.09{window.intl.get('元2')}</div>
          <div className="setmeal_content">
            <div><div></div>{window.intl.get('无限')} {window.intl.get('文件大小')}</div>
            <div><div></div>{window.intl.get('每日')} {window.intl.get('无限')}{window.intl.get('次 加水印2')}</div>
            <div><div></div>{window.intl.get('无限')} {window.intl.get('个水印模版存储')}</div>
            <div><div></div>{window.intl.get('更高')} {window.intl.get('优先级')}</div>
            <div><div></div>{window.intl.get('无广告页')}</div>
          </div>
          <div className="setmeal_button" onClick={this.props.callBack.bind(this,data.id)}>{window.intl.get('即刻享有')}</div>
        </div>
      )
    } else {
      return (
        <div className='setmeal other'>
          <div className="setmeal_time">{window.intl.get(data.title)}</div>
          <div className="setmeal_price">{data.price}</div>
          <div className="setmeal_tip">{window.intl.get('每日')}<br/>{window.intl.get('仅需')}1.09{window.intl.get('元1')}</div>
          <div className="setmeal_content">
            <div className="setmeal_content_size">10GB {window.intl.get('文件大小')}</div>
            <div className="setmeal_content_times">{window.intl.get('每日')} 15{window.intl.get('次 加水印1')}</div>
            <div className="setmeal_content_template">10 {window.intl.get('个水印模版存储')}</div>
            <div className="setmeal_content_priority">{window.intl.get('高')} {window.intl.get('优先级')}</div>
            <div className="setmeal_content_ad">{window.intl.get('无广告页')}</div>
          </div>
          <div className="setmeal_button" onClick={this.props.callBack.bind(this,data.id)}>{window.intl.get('即刻享有')}</div>
        </div>
      )
    }
  }
}

export default SetMeal