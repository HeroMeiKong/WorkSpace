import React, {Component} from 'react';
import './../Privacy/privacy.scss';
// import $ from 'jquery';
// import classNames from 'classnames';
// import API from './../../config/api';
// import Const from './../../config/const';
// import Tool from './../../utils/tool';
// import Error from './../../utils/error';
import {connect} from 'react-redux';
import {login, logout} from './../../redux/models/admin';

@connect(
    state => ({admin: state.admin}),
    {login, logout}
)

class UserTerms extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // shouldComponentUpdate() {
    //
    // }

    render() {
        const {isForeign} = this.props.admin;

        return (
            <div className="privacy-page">
                <div className="privacy-head">
                    <div className="privacy-head-text">{window.intl.get("用户条款")}</div>
                </div>
                {
                    !isForeign ? (
                        <div className="privacy-main">
                            <div>
                                感谢您选择使用由天脉拓道（北京）科技有限公司（下称“拓道科技”）提供的产品服务（下称“本服务”）。为了您可以更好地使用本服务，在使用本服务前，您需认真阅读并完全同意本协议条款的全部规定。如您不接受本协议的条款或内容，请您不要使用本服务；但若您使用了本服务，您的使用行为将被视为您已认真阅读且透彻理解并完全同意本协议条款及本服务的全部规定，且承诺遵守。如果您未满18周岁，请在法定监护人的陪同下阅读本协议。
                            </div>
                            <div>本协议由您与天脉拓道（北京）科技有限公司于您点击同意本服务协议之时签署。</div>
                            <div className="privacy-main-t0">定义</div>
                            <div>如无特别说明，下列术语在本协议中的定义为：</div>
                            <div>
                                用户，即使用拓道平台产品服务的用户，包括但不仅限于使用部分拓道平台产品服务的用户、使用全部拓道平台产品服务的用户、免费使用拓道平台产品服务的用户、付费使用拓道平台产品服务的用户、以及自行向拓道平台产品上传/接入多媒体素材的用户；用户类型包括自然人、法人和其他组织等；
                            </div>
                            <div>服务，是指拓道科技（包括其相关网站和服务）提供的所有产品、服务、内容、特性、技术或功能；</div>
                            <div>多媒体素材，指用户向拓道平台产品上传/接入的内容，包括但不限于视频、音频、图片等多种媒体形式。</div>

                            <div className="privacy-main-t0">管辖</div>
                            <div>
                                本条款的解释，效力及纠纷的解决，适用于中华人民共和国（不包括港澳台地区）法律。因使用拓道科技服务产生的或与此相关的纠纷，拓道科技及您均有权将其提交至北京仲裁委员会通过仲裁方式解决。仲裁结果具有终局性，对各方均有约束力。
                            </div>
                            <div className="privacy-main-t0">风险</div>
                            <div>拓道科技仅依现状及现有基础提供服务，而并未对自身服务的及时性、准确性进行任何形式的担保。在法律允许的范围内，拓道科技对以下情形导致的服务中断或受阻不承担责任：</div>
                            <div>因系统维护或升级；</div>
                            <div>受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</div>
                            <div>用户或拓道科技的电脑软件、系统、硬件和通信线路出现故障；</div>
                            <div>用户操作不当；</div>
                            <div>用户通过非法方式使用拓道科技平台产品；</div>
                            <div>其他拓道科技无法控制或合理预见的情形；</div>
                            <div>如您欲使用拓道科技提供的服务，须承担以上风险，拓道科技对您或任何第三人由此遭受的损害均不承担赔偿责任。</div>

                            <div className="privacy-main-t0">用户注册及安全</div>
                            <div>
                                在注册、认证、使用和管理平台帐户时，请您使用真实、准确、合法、有效的相关身份证明材料及必要信息（包括您的姓名及电子邮件地址、联系电话、联系地址等），以便拓道科技在必要时与您联系，并注意及时更新。
                            </div>
                            <div>您有义务妥善保管在注册时获得的账号及密码，如因黑客、第三人行为或您自身保管疏忽导致账号、密码遭他人非法使用并给您造成损失的，拓道科技就此不承担任何责任。</div>

                            <div className="privacy-main-t0">个人数据和隐私保护</div>
                            <div>在本协议中，您保证由您通过拓道平台产品上传/接入、制作、复制、分发的任何内容的知识产权归属您或已取得合法授权且以上内容您有权授权拓道科技使用。</div>
                            <div>
                                拓道科技承诺将采取必要措施保护用户存放在拓道科技网络服务上的个人数据及隐私信息的安全。除本协议约定的除外情况，拓道科技保证不对外公开或向第三方提供、公开或共享您的个人数据及隐私信息。
                            </div>
                            <div>在以下情况下，拓道科技对您个人数据及隐私信息的披露将不视为违约，具体包括：</div>
                            <div>拓道科技已获得您的明确授权；</div>
                            <div>根据有关的法律法规要求，拓道科技负有披露义务的；</div>
                            <div>司法机关或行政机关基于法定程序要求拓道科技提供的；</div>
                            <div>为维护社会公共利益及拓道科技合法权益，在合理范围内进行披露的；</div>
                            <div>
                                拓道科技可能会与第三方合作向用户提供相关的网络服务或使用其数据收集工具用以完善自身服务，在此情况下，如该第三方同意承担与拓道科技同等的隐私保护责任的，则拓道科技可在合理范围内对您的信息进行披露。
                            </div>

                            <div>在不披露您的个人数据及隐私的前提下，拓道科技有权对拓道科技整体用户数据信息进行技术分析，并对已进行分析、整理后的统计数据进行利用。</div>
                            <div>
                                尽管拓道科技已为用户的隐私权保护做了极大的努力，但是仍然不能保证现有的安全技术措施使您的个人数据及隐私等不受任何形式的损失。您对上述情况充分知情，且不会因此追究拓道科技的法律责任。
                            </div>

                            <div className="privacy-main-t0">用户上传内容</div>
                            <div>您须了解并认可，在您使用拓道科技产品时 ，须遵守社会公序良德和相关法律法规，且不得上传如下内容：</div>
                            <div>违反宪法确定的基本原则的；</div>
                            <div>违反我国法律、法规及其它规定的；</div>
                            <div>违背社会公序良俗，有损社会公共利益的</div>
                            <div>侵害第三方合法权益的文件或信息，包括但不限于病毒代码、黑客程序、软件破解注册信息等；</div>
                            <div>
                                拓道科技有权对您发布和上传的内容进行审核，如拓道科技根据自身独立判断认为您所发布、上传的内容包含前述情况的，有权直接删除相关内容，且无需另行通知您。您在此确认，拓道科技的审核行为并不为其设置任何义务，也不能免除您的任何责任。
                            </div>
                            <div>
                                您在使用拓道科技平台产品过程中创作内容所包含的权利将依法归您自行所有。但您应了解，对于您通过拓道科技产品服务上传或下载的任何内容，均视为您已同意授权拓道科技获得相应内容在全世界范围内免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。
                            </div>

                            <div className="privacy-main-t0">其他条款</div>
                            <div>本协议自您点击同意本服务协议之时起生效；</div>
                            <div>
                                拓道科技会在必要时修改本协议的条款，您可以通过本服务的最新版本中查询相关条款。拓道科技在此建议您，您应不时查询本服务协议条款是否存在变更；若您不接受发生变更的条款内容，您应当停止继续使用本服务；若您继续使用本服务，视为您接受修改后的协议条款；
                            </div>
                            <div>本协议任何部分被视为无效或不可执行的，不影响本协议其他条款或部分的有效性和可执行性，其他条款对双方仍具有约束力；</div>
                            <div>本协议未涉及的问题参见国家有关法律法规，当本协议与国家法律法规冲突时，以国家法律法规为准。本协议最终解释权归属天脉拓道（北京）科技有限公司。</div>

                        </div>
                    ) : (
                        <div className="privacy-main">
                            <div className="privacy-main-t0">Users Terms and Conditions</div>
                            <div>Please read this service agreement(The “Agreement”) carefully before using this
                                platform services, which are owned and operated by TianMaiTuoDao (also known as “TuoDao
                                ”).By clicking the “SUBMIT/AGREEMENT” button on any website of TuoDao which references
                                this agreement, or by using the service described herein in any manner, you and the
                                entity you represent(“Client”) agree that you have read and agree to be bound by and a
                                party to the terms. If the terms of this agreement are considered an offer, acceptance
                                is expressly limited to such terms. Capitalized terms not defined herein shall have the
                                meaning set forth on the login page which references this agreement.
                            </div>
                            <div className="privacy-main-t0">Definitions.</div>
                            <div>
                                “Site” means xxxxx.com.
                            </div>
                            <div>
                                “Services” means the platform service and any other services provided by TuoDao on the
                                Site.
                            </div>
                            <div className="privacy-main-t0">Disclaimer of Warranties, Inaccuracies or Errors.</div>

                            <div>Although TuoDao tries to ensure that all information and recommendations, whether in
                                relation to the products, services, offerings or otherwise (hereinafter "Information")
                                provided as part of this website is correct at the time of inclusion on the web site,
                                TuoDao does not guarantee the accuracy of the Information. TuoDao makes no
                                representations or warranties as to the completeness or accuracy of Information.
                            </div>
                            <div>TuoDao makes no commitment to update or correct any Information that appears on the
                                Internet or on this web site.
                            </div>
                            <div>Information is supplied upon the condition that the persons receiving the same will
                                make their own determination as to its suitability for their purposes prior to use or in
                                connection with the making of any decision. No Information at this web site shall
                                constitute an invitation to invest in TuoDao or any affiliates. Any use of this website
                                or the Information is at your own risk. Neither TuoDao and TuoDao affiliates, nor their
                                officers, employees or agents shall be liable for any loss, damage or expense arising
                                out of any access to, use of, or reliance upon, this website or the Information, or any
                                website linked to this website.
                            </div>
                            <div className="privacy-main-t0">Availability.
                            </div>
                            <div>
                                TuoDao controls and operates this web site from the People’s Republic of China and makes
                                no representation that the materials are appropriate or will be available for use in
                                other locations. If you use this web site from outside the People’s Republic of China,
                                you are entirely responsible for compliance with all applicable local laws.
                            </div>
                            <div>TuoDao has several websites offering products, services, content and various other
                                functionalities (collectively the "Services") to specific regions worldwide. The
                                Services offered in one region may differ from those in other regions due to
                                availability, local or regional laws, shipment and other considerations. TuoDao does not
                                make any warranty or representation that a user in one region may obtain the Services
                                from the TuoDao site in another region and TuoDao may cancel a user's order or redirect
                                a user to the site for that user's region if a user attempts to order Services offered
                                on a site in another region.
                            </div>

                            <div className="privacy-main-t0">Privacy.</div>
                            <div>TuoDao is committed to respecting the privacy of the personal information of the
                                individuals with whom we interact. We have developed a Website Privacy Policy to
                                describe our privacy policies and practices, and how we collect, use and disclose the
                                personal information of those individuals who visit our website. Please see our Website
                                Privacy Policy for further details.
                            </div>
                            <div className="privacy-main-t0">Indemnification.</div>
                            <div>You agree to indemnify and hold TuoDao harmless against all claims or liability
                                asserted against TuoDao arising out of or in connection with any breach by you or anyone
                                acting on your behalf of any of these Terms of Use.
                                Notice and Procedure for Making Claims of Infringement TuoDao respects the copyright of
                                others, and we ask our users to do the same. If you believe that your work has been
                                copied in a way that constitutes copyright infringement, or your intellectual property
                                rights have been otherwise violated, please provide us with a written communication
                                addressed to our Chief Executive Officer including all relevant information.
                            </div>
                            <div className="privacy-main-t0">Others.</div>
                            <div>TuoDao may revise and update these Terms of Use at anytime and without notice. You are
                                cautioned to review the Terms of Use posted on the Website periodically. Your continued
                                access or use of this Website after any such changes are posted will constitute your
                                acceptance of these changes.You may not interfere with the security of, or otherwise
                                abuse this Website or any secure areas, system resources, services or networks connected
                                to or accessible through this Website. You may only use this Website for lawful
                                purposes.
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default UserTerms;