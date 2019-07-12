import React, {Component} from 'react';
import './index.scss';
import PropTypes from 'prop-types';

class Comfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }
  componentWillMount() {}
  okCallBack=()=>{
    this.props.okCallBack()
  };
  cancelCallBack=()=>{
    this.props.cancelCallBack()
  };
  render() {
    const {msg,okbtnName,cancelBtnName} = this.props;

    return (
      <div className='comfirm-box'>
        <div className='confirm-inner'>
          <div className='msgbox' dangerouslySetInnerHTML={{__html: msg}}/>
          <div>
            <button onClick={this.okCallBack}>{okbtnName ? okbtnName : window.intl.get("是")}</button>
            <button className='cancel-btn' onClick={this.cancelCallBack}>{cancelBtnName ? cancelBtnName : window.intl.get("取 消")}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Comfirm;
Comfirm.propTypes = {
  okCallBack: PropTypes.func.isRequired,
  cancelCallBack: PropTypes.func.isRequired,
  msg: PropTypes.string.isRequired
};