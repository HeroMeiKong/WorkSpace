import React, {Component} from 'react';
import './problems.scss';
import './../Privacy/privacy.scss';
// import $ from 'jquery';
import classNames from 'classnames';
import API from './../../API/api';
// import Const from './../../config/const';
// import Tool from './../../utils/tool';
// import Error from './../../utils/error';
import {connect} from 'react-redux';
import {login, logout, show_loading, hide_loading} from './../../redux/models/admin';
const $ = window.jQuery;
@connect(
    state => ({admin: state.admin}),
    {login, logout, show_loading, hide_loading}
)

class Problems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problems_id: '',
            project_arr: [{
                project_name: 'All products', //项目名称
                project_id: '', //项目id
            }],
            problems_list: [],
        };

    }

    componentWillMount() {
        this.state.problems_id = this.props.match.params.id || '';
        this.get_projectId()
        this.get_problem_list()
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(next) {
        this.state.problems_id = next.match.params.id || '';
        this.get_projectId()
        this.get_problem_list()
    }

    get_projectId() {
        // this.props.show_loading()
        $.ajax({
            url: API.get_project,
            type: 'post',
            dataType: 'json',
            data: {},
        }).done(res => {
            // this.props.hide_loading()
            if (parseInt(res.code) === 0) {
                this.setState({
                    project_arr: [{
                        project_name: 'All products', //项目名称
                        project_id: '', //项目id
                    }].concat(res.data)
                })
            }
        })
    }

    get_problem_list() {
        // this.props.show_loading()
        $.ajax({
            url: API.get_message,
            type: 'post',
            dataType: 'json',
            data: {
                project_id: this.state.problems_id,
                page: 1,
            },
        }).done(res => {
            // this.props.hide_loading()
            if (parseInt(res.code) === 0) {
                this.setState({
                    problems_list: res.data
                })
            }
        })
    }

    // shouldComponentUpdate() {
    //
    // }

    render() {
        const {project_arr, problems_list, problems_id} = this.state;

        return (
            <div className="privacy-page">
                <div className="privacy-head">
                    <div className="privacy-head-text">Frequently asked questions and answers</div>
                </div>
                <div className="problems-box">
                    <div className="select-box">
                        <div className="select-box-head">Select a product</div>
                        <div className="select-box-list">
                            {
                                project_arr.map((item, key) => {
                                    return (
                                        <div
                                            className={classNames("select-item", item.project_id === problems_id ? 'selected-item' : '')}
                                            key={key} onClick={() => {
                                            this.props.history.push('/problems/' + item.project_id)
                                        }}>{item.project_name}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="problems-list">
                        {
                            problems_list.map((item, key) => {
                                return (
                                    <div className="problem-item" key={key}>
                                        <div className="Q-box">
                                            <div className="Q-user">User: {item.email}</div>
                                            <div className="Q-cont">{item.user_question}</div>
                                        </div>
                                        <div className="A-box">
                                            <div className="A-cont">{item.replay}</div>
                                        </div>
                                        <div className="project-name">{item.project_name}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Problems;