import React, { Component } from 'react'
import './FAQ.scss'
import QA from './QA/QA'

class FAQ extends Component {
  constructor () {
    super()
    this.state = {
      renderThis: 'All_Products',//渲染那一部分
      defaultData: [
        {
          user_name: 'mouyi***@163.com',
          tip: 'Merge Video',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'Hello, I want to know what is Crop Video? Do you have any instructions on how to use it? I might need to use this gadget, thanks.',
          answer: 'The large amount of material captured in the film production will be selected, selected, disassembled and assembled to complete a coherent, fluid, clear-cut, artistically appealing work. Starting with American director Griffith, the method of split-lens shooting was used, and then these shots were combined to create a clip art. Editing is both an indispensable work in the filmmaking process and the last re-creation in the film art creation process. French New Wave film director Godard: Editing is the official start of film creation.'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'Hello, I want to know what is online watermarking? What does it do? I want to add the watermark on video today, but I don\'t know how to operate it. Could you please send the detailed tutorial to my email?',
          answer: 'It was invented by Europeans and has a history of 700 years. The watermark is formed by changing the density of the pulp during the papermaking process. The watermark is divided into two types. The watermark formed by thickening the paper is called “black watermark”, and the watermark formed by thinning the paper is called “white watermark”. You can clearly see the graphics, portraits or text with light and dark textures during the fluoroscopy. Usually, banknotes, documents, securities, food stamps, etc. are used in this way to prevent fraud.'
        }
      ]
    }
  }

  //改变渲染对象
  changeOption = (value) => {
    this.setState({
      renderThis: value || 'All_Products'
    })
  }

  renderAllProducts = () => {
    const { defaultData } = this.state
    return <div>
            {defaultData.map((data,i) => <QA data={data} key={i} />)}
          </div>
  }

  renderMergeVideo = () => {
    const { defaultData } = this.state
    return <div>
            {defaultData.map((data,i) => <QA data={data} key={i} />)}
          </div>
  }

  renderWatermark = () => {
    const { defaultData } = this.state
    return <div>
            {defaultData.map((data,i) => <QA data={data} key={i} />)}
          </div>
  }

  renderVideoTemplate = () => {
    const { defaultData } = this.state
    return <div>
            {defaultData.map((data,i) => <QA data={data} key={i} />)}
          </div>
  }

  renderCropVideo = () => {
    const { defaultData } = this.state
    return <div>
            {defaultData.map((data,i) => <QA data={data} key={i} />)}
          </div>
  }

  //根据传入的值选择渲染不同内容
  renderFAQ = (str) => {
    switch (str) {
      case 'All_Products':
        return this.renderAllProducts()
      case 'Merge_Video':
        return this.renderMergeVideo()
      case 'Watermark':
        return this.renderWatermark()
      case 'Video_Template':
        return this.renderVideoTemplate()
      case 'Crop_Video':
        return this.renderCropVideo()

      default:
        return this.renderAllProducts()
    }
  }

  render () {
    const { renderThis } = this.state
    return (
      <div className='messageboard'>
        <div className="messageboard_top">
          <h1>{window.intl.get('常见问题和解答')}</h1>
          <div className="messageboard_line"></div>
        </div>
        <div className="faq">
          <div className="faq_inner">
            <div className="faq_title">Select a product</div>
            <ul className="faq_type">
              <li className={renderThis === 'All_Products' ? 'active' : ''} onClick={this.changeOption.bind(this,'All_Products')}>
                <p>All Products</p>
                <div className="faq_line"></div>
              </li>
              <li className={renderThis === 'Merge_Video' ? 'active' : ''} onClick={this.changeOption.bind(this,'Merge_Video')}>
                <p>Merge Video</p>
                <div className="faq_line"></div>
              </li>
              <li className={renderThis === 'Watermark' ? 'active' : ''} onClick={this.changeOption.bind(this,'Watermark')}>
                <p>Watermark</p>
                <div className="faq_line"></div>
              </li>
              {/*<li className={renderThis === 'Video_Template' ? 'active' : ''} onClick={this.changeOption.bind(this,'Video_Template')}>*/}
                {/*<p>Video Template</p>*/}
                {/*<div className="faq_line"></div>*/}
              {/*</li>*/}
              <li className={renderThis === 'Crop_Video' ? 'active' : ''} onClick={this.changeOption.bind(this,'Crop_Video')}>
                <p>Crop Video</p>
                <div className="faq_line"></div>
              </li>
            </ul>
            {this.renderFAQ(renderThis)}
          </div>
        </div>
      </div>
    )
  }
}

export default FAQ