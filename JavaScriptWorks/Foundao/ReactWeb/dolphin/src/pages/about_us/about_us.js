import React, { Component } from 'react';

//pc端组件
import Header from '@/components/Header/Header'
import BottomBar from '@/components/BottomBar/BottomBar'
import Loading from '@/components/Loading/Loading'
import Toast from '@/components/Toast/Toast'

class AboutUs extends Component{
  constructor () {
    super()
    this.state = {
      isLoading: false,
      isToast: false,
      toast_text: 'Error!',
    }
  }

  showToast = (toast_text) => {
    console.log('showToast')
    this.setState({
      isToast: true,
      toast_text
    })
  }

  hiddenToast = () => {
    console.log('hiddenToast')
    this.setState({
      isToast: false
    })
  }

  render () {
    const { isLoading, isToast, toast_text } = this.state
    return (
      <div id='wrapper' className='wrapper'>
        <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} isLevel2={true} />
        <div className='wrapper_content'>
          <div className='content index_div'>
            <article>
              <header>
                <h1>About us</h1>
              </header>
              <section>
                <h2>Enterprise Spirit.</h2>
                <p>Pursuing an ideal way. </p>
              </section>
              <section>
                <h2>Enterprise Culture.</h2>
                <p>We are glad to embrace the unknown challenges and exploit our potential during the adventure.</p>
              </section>
              <section>
                <h2>Enterprise Value.</h2>
                <p>Creating shareable values;<br/>Advocating self-management;<br/>Building effective communication.</p>
              </section>
              <section>
                <h2>Team Members.</h2>
                <p>Our members can be regarded as the soul of our company. They are from different places of China, believing that respectful works can be made by us. <br/>Our enthusiasm of technology in turn serves the development of our research well, and it is the most valuable quality our team has.</p>
              </section>
              <section>
                <h2>Company Profile.</h2>
                <p>TianMaiTuoDao (also known as TuoDao ) was established in April 2015, is an enterprising Internet company with strong innovational vision. We are dedicated to explore and improve the technology on the field of video encoding, streaming, producing that can help more enterprises to promote their brand. Now we have already built a complete platform which integrated live broadcasting, short video encoding, multi-screens interacting.<br/>We have launched a professional mobile live broadcasting platform for the customers of radio and television industry and an online editor since 2015.<br/>Enormous high quality copyrighted video materials, capabilities of professional video editing for users, simple and efficiency multi-platform distribution ways, are three major competitive powers. We have always been persistent and overcome thousands of difficulties because of our faith in it.<br/>The journey of TuoDao is about to begin.<br/>We will continuously invest time in the field of video technology research and innovation. As a company of platform, our goal is simple: to build the best connector for content creators and mobile data providers. We have faith in technology driven and we believe that we can help more users to archive the technical upgrade on marketing in an era of short videos.</p>
              </section>
            </article>
          </div>
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default AboutUs