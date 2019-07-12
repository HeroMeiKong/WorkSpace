import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

import moment from 'moment';
import classnames from 'classnames';

/*互动聊天*/
@withRouter
export default
class TalkItem extends Component {
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

  renderContent = () => {
    const {data} = this.props;

    let itemInner = (<div className="talk_inner">
      <div className='top_bar'>
          <span>
            <span className='head_pic'><img src={data.avatar} alt=""/></span>
            <span>{data.nick_name}</span>
          </span>
        <span className='talk_time'>{moment(data.gmt_create).format('YYYY-MM-DD hh:mm:ss')}</span>
      </div>
      <div className='talk_content_outDiv'>
        <div className='talk_content_innerSpan'>
          {data.content}
        </div>
      </div>
    </div>);

    if (data.type === 'system') {
      itemInner = (<div className="talk_inner">
        {data.content}
      </div>)
    }

    return itemInner;
  };


  render() {
    const {data} = this.props;
    return (
      <div className={classnames('talk_item', {'system': data.type === 'system'})}>
        {this.renderContent()}
      </div>
    );
  }
}