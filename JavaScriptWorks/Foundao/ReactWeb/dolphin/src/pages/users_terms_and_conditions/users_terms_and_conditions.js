import React, { Component } from 'react';
import './users_terms_and_conditions.scss'
//pc端组件
import Header from '@/components/Header/Header'
import BottomBar from '@/components/BottomBar/BottomBar'
import Loading from '@/components/Loading/Loading'

class UsersTermsAndConditions extends Component{
  constructor () {
    super()
    this.state = {
      isLoading: false,
    }
  }
  render () {
    const { isLoading } = this.state
    return (
      <div id='wrapper' className='wrapper'>
        <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        <Header />
        <div className='wrapper_content'>
          <div className='content index_div'>
            <article>
              <header>
                <h1>Users Terms and Conditions</h1>
              </header>
              <section>
                <p>Please read this service agreement(The “Agreement”) carefully before using this platform services, which are owned and operated by TianMaiTuoDao (also known as “TuoDao ”).By clicking the “SUBMIT/AGREEMENT” button on any website of TuoDao which references this agreement, or by using the service described herein in any manner, you and the entity you represent(“Client”) agree that you have read and agree to be bound by and a party to the terms. If the terms of this agreement are considered an offer, acceptance is expressly limited to such terms. Capitalized terms not defined herein shall have the meaning set forth on the login page which references this agreement.</p>
              </section>
              <section>
                <h2>Definitions.</h2>
                <p>“Site” means xxxxx.com.<br/>“Services” means the platform service and any other services provided by TuoDao on the Site. </p>
              </section>
              <section>
                <h2>Disclaimer of Warranties, Inaccuracies or Errors.</h2>
                <ul>
                  <li>Although TuoDao tries to ensure that all information and recommendations, whether in relation to the products, services, offerings or otherwise (hereinafter "Information") provided as part of this website is correct at the time of inclusion on the web site, TuoDao does not guarantee the accuracy of the Information. TuoDao makes no representations or warranties as to the completeness or accuracy of Information.</li>
                  <li>TuoDao makes no commitment to update or correct any Information that appears on the Internet or on this web site.</li>
                  <li>Information is supplied upon the condition that the persons receiving the same will make their own determination as to its suitability for their purposes prior to use or in connection with the making of any decision. No Information at this web site shall constitute an invitation to invest in TuoDao or any affiliates. Any use of this website or the Information is at your own risk. Neither TuoDao and TuoDao affiliates, nor their officers, employees or agents shall be liable for any loss, damage or expense arising out of any access to, use of, or reliance upon, this website or the Information, or any website linked to this website.</li>
                </ul>
              </section>
              <section>
                <h2>Availability.</h2>
                <ul>
                  <li>TuoDao controls and operates this web site from the People’s Republic of China and makes no representation that the materials are appropriate or will be available for use in other locations. If you use this web site from outside the People’s Republic of China, you are entirely responsible for compliance with all applicable local laws.</li>
                  <li>TuoDao has several websites offering products, services, content and various other functionalities (collectively the "Services") to specific regions worldwide. The Services offered in one region may differ from those in other regions due to availability, local or regional laws, shipment and other considerations. TuoDao does not make any warranty or representation that a user in one region may obtain the Services from the TuoDao site in another region and TuoDao may cancel a user's order or redirect a user to the site for that user's region if a user attempts to order Services offered on a site in another region.</li>
                </ul>
              </section>
              <section>
                <h2>Privacy.</h2>
                <p>TuoDao is committed to respecting the privacy of the personal information of the individuals with whom we interact. We have developed a Website Privacy Policy to describe our privacy policies and practices, and how we collect, use and disclose the personal information of those individuals who visit our website. Please see our Website Privacy Policy for further details.</p>
              </section>
              <section>
                <h2>Indemnification.</h2>
                <p>You agree to indemnify and hold TuoDao harmless against all claims or liability asserted against TuoDao arising out of or in connection with any breach by you or anyone acting on your behalf of any of these Terms of Use.Notice and Procedure for Making Claims of Infringement TuoDao respects the copyright of others, and we ask our users to do the same. If you believe that your work has been copied in a way that constitutes copyright infringement, or your intellectual property rights have been otherwise violated, please provide us with a written communication addressed to our Chief Executive Officer including all relevant information.</p>
              </section>
              <section>
                <h2>Others.</h2>
                <p>TuoDao may revise and update these Terms of Use at anytime and without notice. You are cautioned to review the Terms of Use posted on the Website periodically. Your continued access or use of this Website after any such changes are posted will constitute your acceptance of these changes.You may not interfere with the security of, or otherwise abuse this Website or any secure areas, system resources, services or networks connected to or accessible through this Website. You may only use this Website for lawful purposes.</p>
              </section>
            </article>
          </div>
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default UsersTermsAndConditions