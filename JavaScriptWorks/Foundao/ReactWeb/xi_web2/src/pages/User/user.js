import React, {Component} from 'react';
import Login from './Login/login';
// import Register from './Register/register';
import Reset from './Reset/reset';
import Reset_F from './Reset_F/reset_F';
import Loading from './../../components/Loading/loading';
import './user.scss';
import {Route, Switch, Link} from 'react-router-dom';
import QRLogin from "./QRLogin/QRLogin";
import {connect} from 'react-redux';

@connect(
    state => ({admin: state.admin}),
)

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {
        // this.loadLocales();
    }


    loadLocales() {
        // intl.init({
        //     currentLocale: this.props.admin.language,
        //     locales,
        // }).then(() => {
        //     this.setState({initDone: true});
        // });
    }

    render() {
        const {isForeign} = this.props.admin

        return (
            <div className="login">
                {
                    this.props.admin.loading > 0 ? (
                        <Loading/>
                    ) : ("")
                }
                <div className="bg"></div>
                <div className="login-box">
                    <Link className={isForeign ? "logo-f" : "logo"} to="/home"></Link>
                    <div className="logo-text">{window.intl.get("秀 出 自 己 ， 发 现 惊 喜")}</div>
                    <Switch>
                        <Route path="/user/login" component={Login}></Route>
                        <Route path="/user/qrcode" component={QRLogin}></Route>
                        {/* <Route path="/user/register" component={Register}></Route> */}
                        <Route path="/user/reset" component={Reset}></Route>
                        <Route path="/user/reset_f" component={Reset_F}></Route>
                        <Route path="/user" component={Login}></Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default User;