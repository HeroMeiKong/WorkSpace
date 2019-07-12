import React, {Component} from 'react';
import './../Privacy/privacy.scss';
import {connect} from 'react-redux';
import {login, logout} from './../../redux/models/admin';

/* eslint-disable */

@connect(
    state => ({admin: state.admin}),
    {login, logout}
)

class About extends Component {
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
                    <div className="privacy-head-text">{window.intl.get("关于我们")}</div>
                </div>
                {
                    !isForeign ? (
                        <div className="privacy-main">
                            <div className="privacy-main-t0">企业精神</div>
                            <div>执着开拓 理想之道</div>
                            <div className="privacy-main-t0">企业文化</div>
                            <div>喜欢未知，困难，勇于挑战。</div>
                            <div className="privacy-main-t0">企业价值</div>
                            <div>与公司团队人员最真实直接的交流；</div>
                            <div>团队人员先自我管理，以自己为榜样，再管理他人；</div>
                            <div>永远不安于现状，鼓励声音，沟通至上。</div>
                            <div className="privacy-main-t0">企业简介</div>
                            <div>
                                我们是一家年轻且极富活力的创新互联网公司，成立于2015年4月，一直专注于视频领域，立志通过自身的技术积累帮企业解决视频内容生产、营销传播领域的难题，打造了直播+短视频+多屏互动的整合服务平台。
                            </div>
                            <div>四年来，我们陆续推出基于广电背景的专业移动直播平台、短视频在线编辑平台等等，从素材、制作、分发三位一体提升用户的生产效率和多平台分发困境，并与直播业务形成互为补充。
                            </div>
                            <div>
                                我们将持续在视频领域进行技术积累与研发创新，作为内容生产与流量平台的连接器，做好工具，协助运营是我们的目标，我们对科技心存敬畏，在技术上勤勉专注孜孜不倦，期待厚积薄发，帮助用户实现短视频时代的营销创新升级。
                            </div>
                        </div>) : (
                        <div className="privacy-main">
                            <div className="privacy-main-t0">Enterprise Spirit.</div>
                            <div>Pursuing an ideal way.</div>

                            <div className="privacy-main-t0">Enterprise Culture.</div>
                            <div>We are glad to embrace the unknown challenges and exploit our potential during the
                                adventure.
                            </div>

                            <div className="privacy-main-t0">Enterprise Value.</div>
                            <div>Creating shareable values;</div>
                            <div>Advocating self-management;</div>
                            <div>Building effective communication.</div>

                            <div className="privacy-main-t0">Team Members.</div>
                            <div>Our members can be regarded as the soul of our company. They are from different places
                                of
                                China, believing that respectful works can be made by us.
                            </div>
                            <div>Our enthusiasm of technology in turn serves the development of our research well, and
                                it is
                                the most valuable quality our team has.
                            </div>

                            <div className="privacy-main-t0">Company Profile.</div>
                            <div>TianMaiTuoDao (also known as TuoDao ) was established in April 2015, is an enterprising
                                Internet company with strong innovational vision. We are dedicated to explore and
                                improve
                                the technology on the field of video encoding, streaming, producing that can help more
                                enterprises to promote their brand. Now we have already built a complete platform which
                                integrated live broadcasting, short video encoding, multi-screens interacting.
                            </div>

                            <div>We have launched a professional mobile live broadcasting platform for the customers of
                                radio
                                and television industry and an online editor since 2015.
                                Enormous high quality copyrighted video materials, capabilities of professional video
                                editing for users, simple and efficiency multi-platform distribution ways, are three
                                major
                                competitive powers. We have always been persistent and overcome thousands of
                                difficulties
                                because of our faith in it.
                            </div>

                            <div>The journey of TuoDao is about to begin.
                                We will continuously invest time in the field of video technology research and
                                innovation.
                                As a company of platform, our goal is simple: to build the best connector for content
                                creators and mobile data providers. We have faith in technology driven and we believe
                                that
                                we can help more users to archive the technical upgrade on marketing in an era of short
                                videos.
                            </div>

                        </div>
                    )
                }

            </div>
        );
    }
}

export default About;