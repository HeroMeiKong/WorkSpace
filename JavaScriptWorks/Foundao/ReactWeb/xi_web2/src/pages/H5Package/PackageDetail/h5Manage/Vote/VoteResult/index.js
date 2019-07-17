import React, {Component} from 'react';
import {

  Message,
  Notification,

} from 'element-react'
import tools from '@/utils/tool'
// import moment from 'moment';
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
import VoteResultItem from '@/components/VoteResultItem'
import './index.scss'

// const multipleList = [
//   {name: '单选', value: 0},
//   {name: '多选', value: 1},
// ];

/*投票结果*/
export default
class VoteResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteID: '',
      packageID: '',
      statistics: {}
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const {search = ''} = this.props.location;
    const {packageID} = this.props.match.params;
    const params = tools.getParams(search);
    const {id} = params;
    this.setState({
      packageID: packageID,
      voteID: id
    }, () => {
      this.getList();
    });
  }

  getList = () => {
    const {packageID, voteID} = this.state;
    httpRequest({
      url: api.voteStatistics,
      type: 'post',
      data: {
        h5_id: packageID,
        id: voteID,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          statistics: resp.data
        });
      } else {
        Message.error(resp.msg);
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  render() {
    const {statistics} = this.state;
    const {options = []} = statistics;
    return (
      <div className="vote_result">
        <div className="vote_info">
          <div className="form_box clearfix">
            <div className="form_item">
              <div className="item_label">投票主题</div>
              <div className="item_value">{statistics.title}</div>
            </div>
            <div className="form_item">
              <div className="item_label">截至时间</div>
              <div className="item_value">{statistics.gmt_end}</div>
            </div>
            <div className="form_item">
              <div className="item_label">投票结果</div>
              <div className="item_value">{statistics.open_result === '1' ? '对用户开放' : '不开放'}</div>
            </div>
            <div className="form_item">
              <div className="item_label">投票人数</div>
              <div className="item_value">{statistics.choose_people_count}</div>
            </div>
          </div>
        </div>
        <div className="vote_percent">
          <h2>{statistics.title}</h2>
          <div className="result_list">
            {options.map((item, index) => {
              return <VoteResultItem key={index}
                                     total={statistics.choose_count / 1}
                                     index={index}
                                     data={item}/>
            })}
          </div>
        </div>
      </div>
    );
  }
}