import React, { Component } from 'react';
import { Link } from 'react-router-dom'
//pc端组件
import Header from '@/components/Header/Header'
import BottomBar from '@/components/BottomBar/BottomBar'
import Loading from '@/components/Loading/Loading'
import Toast from '@/components/Toast/Toast'

class WebsitePrivacyPolicy extends Component{
  constructor () {
    super()
    this.state = {
      isLoading: false,
      isToast: false,
      toast_text: 'Error!',
    }
  }

  sendEmail = () => {
    var who = 'kefu@foundao.com'
    // var what = prompt("输入主题: ", "none");
    if (window.confirm("您确定要向" + who + "发送邮件么?") === true) {
        window.location.href = 'mailto:' + who + '?subject='
    }
  }

  showToast = (toast_text) => {
    this.setState({
      isToast: true,
      toast_text
    })
  }

  hiddenToast = () => {
    this.setState({
      isToast: false
    })
  }

  render () {
    const { isLoading, isToast, toast_text } = this.state
    return (
      <div id='wrapper' className='wrapper'>
        {/* <div className='backcolor' /> */}
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} isLevel2={true} />
        <div className='wrapper_content text_backcolor'>
          <div className='content index_div text_inner'>
            <article>
              <header>
                <h1>Website Privacy Policy</h1>
              </header>
              <section>
                <p>This Website is owned and operated by TianMaiTuoDao (also known as “TuoDao ”).In this Privacy Policy, "you" and "your" refers to individual users of the TuoDao Service, as well as to Members and Corporate Members. "Members," "Corporate Members," and other capitalized terms not defined in this privacy policy are defined in the TuoDao Terms of Service currently located at <Link to='users_terms_and_conditions'>Users Terms and Condition</Link>,If you do not agree to the terms of this Privacy Policy you must immediately leave the Website and discontinue your use our products and services.</p>
              </section>
              <section>
                <h2>Privacy Statement.</h2>
                <p>When you use and interact with our websites or services, communicate with or otherwise contact us or attend our events, we may collect, use, share and process information relating to you ("Personal Data"). These Privacy Statement summarize our Personal Data processing practices and your related rights.</p>
              </section>
              <section>
                <h2>Purposes for which we process Personal Data.</h2>
                <p>We collect and process Personal Data for a variety of purposes, including:</p>
                <ul>
                  <li>To send you a welcome email to verify ownership of the email address provided when your account was created.</li>
                  <li>The processing of your name and contact information to provide you with information about our products, manage your registration for and attendance at our websites, manage your registration for contests or promotions, provide you with customer support or otherwise communicate with you.</li>
                  <li>The processing of your billing information to complete transactions with you when you purchase our products or service.</li>
                  <li>To display personalized advertisements to you and to send to you marketing communications about us, our products and our services.</li>
                  <li>We offers you the choice of receiving different types of communication and information related to our company, products and services. You may subscribe to e-newsletters or other publications; you may also elect to receive marketing communications and other special offers from us via email. If at any time you would like to change your communication preferences, we provide unsubscribe links and an opt-out mechanism for your convenience. To comply with our legal obligations under applicable laws and cooperate with public and government authorities.</li>
                </ul>
              </section>
              <section>
                <h2>Personal Data You Provide To Us.</h2>
                <p>We collect Personal Data from you, such as first and last name, email and mailing addresses, telephone number, professional title, company name, and password, when you register for the TuoDao service. In addition, we (or our third-party payment processor on our behalf) will collect Personal Data including your credit card number or account information when you upgrade to a paid account. We also retain information on your behalf, such as the Personal Data described above and any correspondence. If you provide us feedback or contact us via email, we will collect your name and email address, IP address, as well as any other content included in the email, in order to send you a reply, and any information that you submit to us, such as a resume. If we conduct a survey in which you participate, we may collect additional profile information. We may also collect Personal Data at other instances in the Site or Application user experience where we state that Personal Data is being collected.</p>
              </section>
              <section>
                <h2>Your rights relating to your Personal Data.</h2>
                <ul>
                  <li>To access your Personal Data held by us.</li>
                  <li>To erase/delete your Personal Data.</li>
                  <li>To transfer your Personal Data to another controller, to the extent possible.</li>
                </ul>
                <p>Data privacy laws or regulations in your home country may differ from, or be more protective than, those in the People’s Republic of China. We will collect, store, and use your personal information in accordance with this Privacy Policy and applicable laws, wherever it is processed.</p>
              </section>
              <section>
                <h2>Changes to this Privacy Policy.</h2>
                <p>If TuoDao makes changes to this Privacy Policy, these changes will be posted on the Site. TuoDao reserves the right to modify this Privacy Policy at any time, so please review it frequently. You acknowledge that the updated policy will apply to the collection, storage, use or disclosure of Personal Data from the date of publication and it is your responsibility to check the Site and Application regularly for updates.</p>
              </section>
              <section>
                <h2>Contact Us.</h2>
                <p>If you have any queries, concerns or complaints about the manner in which we have collected, stored, used or disclosed your personal information, please contact the Data Protection Officer at <strong onClick={this.sendEmail}>kefu@foundao.com</strong>.</p>
              </section>
            </article>
          </div>
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default WebsitePrivacyPolicy