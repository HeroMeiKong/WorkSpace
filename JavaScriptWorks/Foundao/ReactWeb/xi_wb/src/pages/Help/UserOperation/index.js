import React, {Component} from 'react';
import './index.scss';
import TransOperation from "./TransOperation";
import ClipOperation from "./ClipOperation";
/* eslint-disable */

export default class UserOperation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNum : 1,
    };
  }

  componentWillMount() {
    if(this.props.userTabNum){
      this.setState({tabNum:this.props.userTabNum/1})
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
    const {tabNum} = this.state
    return (
      <div className="userOperation-page">
        <div className="userOperation_content">
          <div className="operation_tabs">
            <div className={tabNum === 1 ?"product_tab active_tab" : "product_tab"}
                 onClick={()=>this.setState({tabNum : 1})}
            >在线转码</div>
            <div className={tabNum === 2 ?"product_tab active_tab" : "product_tab"}
                 onClick={()=>this.setState({tabNum : 2})}
            >单段剪辑</div>
          </div>
          {tabNum === 1 ?
            <TransOperation/> : <ClipOperation/>}
        </div>
      </div>
    );
  }
}

