import React, {Component} from 'react';
import './privacy.scss';
// import $ from 'jquery';
// import classNames from 'classnames';
// import API from './../../config/api';
// import Const from './../../config/const';
// import Tool from './../../utils/tool';
// import Error from './../../utils/error';
import {connect} from 'react-redux';
import {login, logout} from './../../redux/models/admin';

/* eslint-disable */

@connect(
    state => ({admin: state.admin}),
    {login, logout}
)

class Privacy extends Component {
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
        const {} = this.state;
        const {isForeign} = this.props.admin;

        return (
            <div className="privacy-page">
                <div className="privacy-head">
                    <div className="privacy-head-text">{window.intl.get("隐私条款")}</div>
                </div>
                {
                    !isForeign ? (
                        <div className="privacy-main">
                            <div className="privacy-main-t0">说明</div>
                            <div>
                                天脉拓道（北京）科技有限公司是依据中华人民共和国法律成立的有限责任公司（以下简称“拓道科技”或“我们”，包括其母公司、子公司、关联公司等）。我们重视维护和保护用户的个人信息。您在使用拓道科技的产品、服务时，我们可能会收集和使用您的个人信息。本《隐私权政策》旨在向您说明我们如何收集、储存、使用或分享您的个人信息。希望您仔细阅读本《隐私权政策》，以便在需要的时候，能让您作出合适的选择。
                            </div>
                            <div>您使用或继续使用拓道科技的产品或服务，即意味着您同意我们按照本《隐私权政策》收集、储存、使用和分享您的个人信息。</div>
                            <div className="privacy-main-t0">我们可能收集您的何种个人信息？</div>
                            <div>您通过使用拓道科技的产品或服务的过程中提供给拓道科技的信息，如姓名、电话号码、电子邮箱地址、通讯地址、身份证号码、直播数据、视频数据等。</div>
                            <div>您使用我们的产品或服务时系统读取或储存的信息，如您的位置、产品使用的日志记录、您的设备的配置信息接入我们产品服务的IP地址、时间信息、地理环境和位置信息、分享的文字或图片等。<br/>
                            </div>
                            <div>
                                您的个人信息中可能含有敏感信息，例如您的种族、宗教信仰、个人健康状况、性别取向等，您在使用我们产品或服务时，您可能会在公开渠道上传或发布这类敏感信息。请您谨慎地处理这类敏感信息。
                            </div>

                            <div className="privacy-main-t0">我们为何收集您的个人信息？</div>
                            <div>我们收集您的个人信息以实现如下目的：</div>
                            <div>认证您的身份以防止欺诈；</div>
                            <div>明确您的技术服务需求；</div>
                            <div>确认适合您的产品及服务；</div>
                            <div>根据您的要求提供产品及服务；</div>
                            <div>遵守法律法规的要求。</div>

                            <div className="privacy-main-t0">我们可能如何储存您的个人信息？</div>
                            <div>无论您的个人信息以何种方式提供给拓道科技，都将受到拓道科技的储存和保护。我们建立了信息安全控制体系，防止您的个人信息被他人使用、接触、修改、复制、破坏、泄露、损失或盗取。
                            </div>

                            <div className="privacy-main-t0">我们可能如何使用您的个人信息？</div>
                            <div>我们收集到的您的个人信息将可能被我们用于实现如下目的：</div>
                            <div>向您提供服务。</div>
                            <div>帮助我们设计新产品或新服务，改善我们现有的产品或服务。</div>
                            <div>用于身份识别、客户服务、安全防范、存档或备份等。</div>
                            <div>向您提供与您更加密切相关的广告。</div>
                            <div>让您参与我们的产品或服务调查。</div>

                            <div className="privacy-main-t0">我们如何分享您的个人信息</div>
                            <div>我们不会与拓道科技以外的任何第三方分享您的个人信息，但以下情况除外：</div>
                            <div>在得到您同意的情况下。</div>
                            <div>为实现“我们可能如何使用您的个人信息？”章节中的目的而向拓道科技授权的产品或服务提供商分享您的信息。</div>
                            <div>在拓道科技内部分享您的个人信息以便实现“我们可能如何使用您的个人信息？”章节中的目的。</div>
                            <div>今后我们可能出售拓道科技业务或并购新业务，在此情况下，您的个人信息及相关账目、您购买的产品及服务等，将随着业务一并转移。</div>
                            <div>
                                您的个人信息在如下情况下可能会被强制要求披露：1）在涉嫌犯罪活动时，向司法或执法机构披露以侦查预防犯罪；2）根据法律（或法院）的强制要求披露；3）根据政府的强制要求披露等。在上述情况下，我们将记录信息披露的内容、时间、原因及对象。
                            </div>

                            <div className="privacy-main-t0">您的权限</div>
                            <div>如果您想查阅或验证您的个人信息，以及查看我们的披露记录时，请联络我们的客户经理或经销商。若在某些情况下我们无法提供相关资料，我们将及时告知您原因。</div>
                            <div>
                                在某些情况下您有权选择拒绝向我们提供某些信息，但我们可能因此无法向您提供某些产品、服务或信息。为保护双方利益，例如为确保您的要求被执行、为证明我们向您提供了所需信息，我们可能监控您与拓道科技的电话或邮件往来，以保证我们的服务质量。
                            </div>
                            <div>如果您不希望我们在拓道科技中分享您的个人信息，请通知我们。在此情况下，我们由于信息缺失而有可能无法向您提供特定的产品或服务。</div>
                            <div>如果您未满十八岁，您应该获得父母或监护人的同意和指导以确保正确使用我们的产品和服务。</div>
                            <div>根据您所处的地域的法律规定，本《隐私权政策》的某些条款可能并不适用于您。本《隐私权政策》不排除或限制您根据本地法律规定所享有的任何权利。</div>

                            <div className="privacy-main-t0">变更</div>
                            <div>
                                我们可能适时修订本《隐私权政策》的条款，该等修订构成本《隐私权政策》的一部分。如该等修订造成您在本《隐私权政策》下权利的实质减少，我们将在修订生效前通过在主页上显著位置提示或向您发送电子邮件或以其他方式通知您。在该种情况下，若您继续使用我们的服务，即表示同意受经修订的本《隐私权政策》的约束。
                            </div>

                            <div className="privacy-main-t0">我们的承诺</div>
                            <div>
                                拓道科技非常感谢能有机会为您提供产品和服务。自拓道科技成立至今，赢得并保持您的信任始终是我们的服务宗旨。我们承诺尊重及保护您提供的隐私及个人信息，也希望您能了解我们的隐私保护政策，包括如何采集、使用及披露您的个人信息。
                            </div>
                            <div>我们指定专门的团队负责管理您的个人信息保护，包括制度、纠纷解决、产品培训、联络等各方面，并直接向董事会及总经理汇报隐私保护相关事项。</div>
                            <div>我们将确保在您申请任何产品或服务时，获知上述信息采集目的。如果我们希望将您的个人信息用于其他目的，我们将向您提出申请。</div>
                        </div>
                    ) : (
                        <div className="privacy-main">
                            <div className="privacy-main-t0">Website Privacy Policy</div>
                            <div>This Website is owned and operated by TianMaiTuoDao (also known as “TuoDao ”).In this
                                Privacy Policy, "you" and "your" refers to individual users of the TuoDao Service, as
                                well as to Members and Corporate Members. "Members," "Corporate Members," and other
                                capitalized terms not defined in this privacy policy are defined in the TuoDao Terms of
                                Service currently located at Users Terms and Condition
                            </div>
                            <div>If you do not agree to the terms of this Privacy Policy you must immediately leave the
                                Website and discontinue your use our products and services.
                            </div>
                            <div className="privacy-main-t0">Privacy Statement.</div>
                            <div>When you use and interact with our websites or services, communicate with or otherwise
                                contact us or attend our events, we may collect, use, share and process information
                                relating to you ("Personal Data"). These Privacy Statement summarize our Personal Data
                                processing practices and your related rights.
                            </div>
                            <div className="privacy-main-t0">Purposes for which we process Personal Data.</div>
                            <div>We collect and process Personal Data for a variety of purposes, including:</div>
                            <div>To send you a welcome email to verify ownership of the email address provided
                                when your
                                account was created.
                            </div>
                            <div>The processing of your name and contact information to provide you with
                                information about
                                our products, manage your registration for and attendance at our websites,
                                manage your
                                registration for contests or promotions, provide you with customer support or
                                otherwise
                                communicate with you.
                            </div>
                            <div>The processing of your billing information to complete transactions with you
                                when you
                                purchase our products or service.
                            </div>
                            <div>To display personalized advertisements to you and to send to you marketing
                                communications
                                about us, our products and our services.
                            </div>
                            <div>We offers you the choice of receiving different types of communication and
                                information
                                related to our company, products and services. You may subscribe to
                                e-newsletters or other
                                publications; you may also elect to receive marketing communications and other
                                special
                                offers from us via email. If at any time you would like to change your
                                communication
                                preferences, we provide unsubscribe links and an opt-out mechanism for your
                                convenience. To
                                comply with our legal obligations under applicable laws and cooperate with
                                public and
                                government authorities.
                            </div>

                            <div className="privacy-main-t0">Personal Data You Provide To Us.</div>
                            <div>We collect Personal Data from you, such as first and last name, email and mailing
                                addresses,
                                telephone number, professional title, company name, and password, when you register
                                for the
                                TuoDao service. In addition, we (or our third-party payment processor on our behalf)
                                will
                                collect Personal Data including your credit card number or account information when
                                you
                                upgrade to a paid account. We also retain information on your behalf, such as the
                                Personal
                                Data described above and any correspondence. If you provide us feedback or contact
                                us via
                                email, we will collect your name and email address, IP address, as well as any other
                                content included in the email, in order to send you a reply, and any information that
                                you
                                submit to us, such as a resume. If we conduct a survey in which you participate, we may
                                collect additional profile information. We may also collect Personal Data at other
                                instances
                                in the Site or Application user experience where we state that Personal Data is being
                                collected.
                            </div>
                            <div className="privacy-main-t0">Your rights relating to your Personal Data.</div>
                            <div>To access your Personal Data held by us.</div>
                            <div>To erase/delete your Personal Data.</div>
                            <div>To transfer your Personal Data to another controller, to the extent possible.</div>
                            <div>Data privacy laws or regulations in your home country may differ from, or be more
                                protective
                                than, those in the People’s Republic of China. We will collect, store, and use your
                                personal
                                information in accordance with this Privacy Policy and applicable laws, wherever it
                                is
                                processed.
                            </div>
                            <div className="privacy-main-t0">Changes to this Privacy Policy.</div>
                            <div>If TuoDao makes changes to this Privacy Policy, these changes will be posted on the
                                Site.
                                TuoDao reserves the right to modify this Privacy Policy at any time, so please
                                review it
                                frequently. You acknowledge that the updated policy will apply to the collection,
                                storage,
                                use or disclosure of Personal Data from the date of publication and it is your
                                responsibility to check the Site and Application regularly for updates.
                            </div>
                            <div className="privacy-main-t0">Contact Us.</div>
                            <div>If you have any queries, concerns or complaints about the manner in which we have
                                collected,
                                stored, used or disclosed your personal information, please contact the Data
                                Protection
                                Officer at kefu@foundao.com.
                            </div>

                        </div>
                    )
                }

            </div>
        );
    }
}

export default Privacy;