import React, {Component} from 'react';
import './demo.scss';
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
    {login,logout}
)

class Demo extends Component {
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

        return (
            <div>

            </div>
        );
    }
}

export default Demo;