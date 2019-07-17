import React, {Component} from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './Footer.scss';
/* eslint-disable */
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import locales from './../../locales/index';
import SendMessage from '../SendMessage/SendMessage'

@connect(
    state => ({admin: state.admin}),
)

class Footer extends Component {

    componentDidMount() {
        this.loadLocales();
    }


    loadLocales() {
        intl.init({
            currentLocale: this.props.admin.language,
            locales,
        }).then(() => {
            // this.setState({initDone: true});
        });
    }

    //判断当前页面
    checkurl = () => {
        const url = window.location.href
        if (url.indexOf('/convert') !== -1 ||url.indexOf('/trans') !== -1) {
            return '/1'
        } else if (url.indexOf('/trim') !== -1) {
            return '/2'
        } else {
            return ''
        }
    }

    render() {
        const {isForeign} = this.props.admin;

        return (
            <div className='footer-box'>
                <div className='limit-box'>
                    <p className='webset-name'>{intl.get("天脉拓道科技有限公司-喜视频")}</p>
                    <ul className='footer-nav'>
                        {
                            isForeign ? ('') : (
                                <li><Link to={'/help' + this.checkurl()} target='_blank'>{intl.get("帮助")}</Link></li>
                            )
                        }
                        <li><Link to='/privacy' target='_blank'>{intl.get("隐私条款")}</Link></li>
                        <li><Link to='/userTerms' target='_blank'>{intl.get("用户条款")}</Link></li>
                    </ul>
                    <p>Copyright © 2019 Foundao</p>
                </div>
                <SendMessage />
            </div>
        );
    }
}

export default withRouter(Footer);
