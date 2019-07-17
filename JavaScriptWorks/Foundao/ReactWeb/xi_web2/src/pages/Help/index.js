import React, {Component} from 'react';
import './index.scss';
import {connect} from 'react-redux';
import {login, logout} from './../../redux/models/admin';
import UserOperation from "./UserOperation";
import ProblemSolve from "./ProblemSolve";

@connect(
  state => ({admin: state.admin}),
  {login, logout}
)

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNum: 1,
      userTabNum : 1
    };
  }

  componentWillMount() {
    const params = this.props.match.params
    if(params.id){
      this.setState({userTabNum:params.id})
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // shouldComponentUpdate() {
  //
  // }

  render() {
    const {tabNum,userTabNum} = this.state;

    return (
      <div className="help-page">
        <div className="help-head">
          <div className="help-head-text">在线帮助</div>
        </div>

        <div className="help_tab">
          <div className={tabNum === 1 ? 'active_btn help_tab_btn' : "help_tab_btn"}
               onClick={() => this.setState({tabNum: 1})}>
            用户操作指南
          </div>
          <div className={tabNum === 2 ? 'active_btn help_tab_btn' : "help_tab_btn"}
               onClick={() => this.setState({tabNum: 2})}>
            常见问题及解答
          </div>
        </div>

        {tabNum === 1 ?
          <UserOperation userTabNum={userTabNum}/>
          :
          tabNum === 2 ?
            <ProblemSolve/> : ''
        }
      </div>
    );
  }
}

