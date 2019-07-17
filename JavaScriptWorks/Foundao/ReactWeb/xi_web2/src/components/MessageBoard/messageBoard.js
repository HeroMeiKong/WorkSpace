import React, {Component} from 'react';
import './messageBoard.scss';
import $ from 'jquery';
import classNames from 'classnames';
import API from './../../API/api';
import Const from './../../config/const';
import Tool from './../../utils/tool';
import Error from './../../utils/error';
import {connect} from 'react-redux';
import {login, logout} from './../../redux/models/admin';
import {Message} from "element-react";

@connect(
    state => ({admin: state.admin}),
    {login, logout}
)

class MessageBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFlag: false,
            email: '',
            content: '',
            step: 0,
            id: '',
        };

    }

    componentWillMount() {
        this.state.id = this.props.id;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // shouldComponentUpdate() {
    //
    // }

    render() {
        const {showFlag, step} = this.state;

        return (
            <div className="messageBoard-box">
                <div className="messageBoard-btn" onClick={() => {
                    this.setState({
                        showFlag: true,
                        step: 0
                    })
                }}>Feedback
                </div>
                {showFlag ? (
                    <div className="messageBoard-layer">
                        <div className="m-l-close" onClick={() => {
                            this.setState({
                                showFlag: false
                            })
                        }}></div>

                        {
                            step === 0 ? (
                                <div>
                                    <input className="m-l-email" placeholder="Your email address" onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        })
                                    }} value={this.state.email}></input>
                                    <textarea className="m-l-content" placeholder="Leave us your comment…"
                                              onChange={(e) => {
                                                  this.setState({
                                                      content: e.target.value
                                                  })
                                              }} value={this.state.content}></textarea>
                                    <button className="m-l-sendBtn" onClick={() => {
                                        this.sendMessage()
                                    }}>SEND
                                    </button>
                                </div>
                            ) : (
                                <div className="feedback-success">
                                    Thank you for your feedback
                                </div>
                            )
                        }
                    </div>
                ) : ('')}
            </div>
        );
    }

    sendMessage() {
        $.ajax({
            url: API.submit_message,
            type: 'post',
            dataType: 'json',
            data: {
                project_id: this.props.id || '0',
                email: this.state.email,
                question: this.state.content,
            },
        }).done(res => {
            if (parseInt(res.code) === 0) {
                this.success();
            }
        })
    }

    success() {
        this.setState({
            content: '',
            email: '',
            step: 1,
        })
    }
}

export default MessageBoard;