import React, {Component} from 'react';
import {

  Message,
  Notification,

} from 'element-react'
import tools from '@/utils/tool'
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'
import QuesItem from './QuesItem'
import './index.scss'

/*竞猜结果*/
export default
class GuessDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteID: '',
      packageID: '',
      statistics: {},
      question: [],
      correct: {}
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
      correct_id: id
    }, () => {
      this.getList();
    });
  }

  getList = () => {
    const {packageID, correct_id} = this.state;
    httpRequest({
      url: api.correctResult,
      type: 'post',
      data: {
        h5_id: packageID,
        correct_id: correct_id,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          statistics: resp.data.statistics,
          question: resp.data.question,
          correct: resp.data.correct,
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
    const {statistics, question, correct} = this.state;
    return (
      <div className="vote_result guess_detail">
        <div className="vote_info">
          <div className="form_box clearfix">
            <div className="form_item" style={{float: 'none'}}>
              <div className="item_label">题库名称</div>
              <div className="item_value">{correct.q_title}</div>
            </div>
            <div className="form_item" style={{float: 'none'}}>
              <div className="item_label">截止时间</div>
              <div className="item_value">{correct.gmt_end}</div>
            </div>
            <div className="clearfix">
              <div className="form_item">
                <div className="item_label">竞答人数</div>
                <div className="item_value">{statistics.all_total}</div>
              </div>
              <div className="form_item">
                <div className="item_label">全对人数</div>
                <div className="item_value">{statistics.right_total}</div>
              </div>
              <div className="form_item">
                <div className="item_label">获奖人数</div>
                <div className="item_value">{statistics.get_total}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="percent_list">
          {question.map((item, index) => {
            return <QuesItem key={index}
                             index={index}
                             data={item}/>
          })}
        </div>
      </div>
    );
  }
}