import React, {Component} from 'react';
import './index.scss';
import PropTypes from 'prop-types';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }
  componentWillMount() {}
  cancelCallBack=()=>{
    this.props.cancelCallBack()
  };
  retrn=()=>{
    return false
  }
  render() {
    const {msg,btn,btnname} = this.props;
    return (
      <div className='alert-box' onClick={this.retrn}>
        <div className='alert-inner'>
          <div className='tipsContent' dangerouslySetInnerHTML={{__html: msg}} />
          <div>
            <button onClick={this.cancelCallBack}>{btn ? btn : btnname || window.intl.get('好的')}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Alert;
Alert.propTypes = {
  cancelCallBack: PropTypes.func.isRequired,
  msg: PropTypes.string.isRequired
};