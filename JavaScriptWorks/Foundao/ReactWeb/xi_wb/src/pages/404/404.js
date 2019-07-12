import React, {Component} from 'react';
import './404.scss';
import {Link} from 'react-router-dom';
import noFound from '@/assets/404-02.png';
class fault extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <div className="no_found_box">
                <div className='no_found_inner'>
                    <img src={noFound} alt="404"/>
                    <p>{window.intl.get('对不起，页面没找到！')}</p>
                    <p>{window.intl.get('请检查您输入的网址是否正确，请点击以下按钮返回主页')}</p>
                    <Link to="/">{window.intl.get('首 页')}</Link>
                </div>
            </div>
        );
    }
}

export default fault;