import React, {Component} from 'react';
import {
  Table,
  Pagination,
  Message,
  Notification,

} from 'element-react'
import tools from '@/utils/tool'
import httpRequest from '@/utils/httpRequest';
import api from '@/API/api'

import './index.scss'

/*竞猜结果*/
export default
class GuessDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteID: '',
      packageID: '',
      page_size: 100,    // 每页数量
      current_page: 1,  // 当前分页
      total: 0,         // 总数
      statistics: {},
      correct: {},
      data: [], //精彩视频数据
      columns: [
        {
          label: "ID",
          prop: "id",
          width: 80,
        },
        {
          label: "用户头像",
          width: 100,
          align: 'center',
          render: (row) => {
            return <div className="table_image avatar">{row.user && row.user.avatar? <img src={row.user.avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "用户昵称",
          render: (row) => {
            return row.user.nick_name
          }
        },
        // {
        //   label: "获奖名称",
        //   prop: "title",
        //   // width: 260,
        // },
        {
          label: "领奖人姓名",
          prop: "name",
          // width: 260,
        },
        {
          label: "手机号码",
          prop: "mobile",
        },
        {
          label: "收货地址",
          prop: "address",
          width: 180
        },
        {
          label: "获奖时间",
          prop: "gmt_create",
          // width: 260,
        },
      ],
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
    const {packageID, correct_id, current_page, page_size} = this.state;
    httpRequest({
      url: api.giftList,
      type: 'post',
      data: {
        h5_id: packageID,
        correct_id: correct_id,
        page: current_page,
        limit: page_size,
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          correct: resp.data.correct || {},
          data: resp.data.list || [],
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
    const {page_size, current_page, correct} = this.state;
    return (
      <div className="vote_result guess_prize">
        <div className="vote_info">
          <div className="form_box clearfix">
            <div className="form_item" style={{float: 'none'}}>
              <div className="item_label">题库名称</div>
              <div className="item_value">{correct.q_name}</div>
            </div>
            <div className="clearfix">
              {/*<div className="form_item">*/}
                {/*<div className="item_label">竞答类型</div>*/}
                {/*<div className="item_value">{659842}</div>*/}
              {/*</div>*/}
              <div className="form_item">
                <div className="item_label">奖品</div>
                <div className="item_value">{correct.gift}</div>
              </div>
              <div className="form_item">
                <div className="item_label">奖品总数</div>
                <div className="item_value">{correct.gift_total}</div>
              </div>
              <div className="form_item">
                <div className="item_label">截止时间</div>
                <div className="item_value">{correct.gmt_end}</div>
              </div>
            </div>
          </div>
        </div>

        <Table
          columns={this.state.columns}
          data={this.state.data}
          // border={true}
          minHeight={200}
          stripe={true}
        />
        <div className="pagination_wrapper">
          <Pagination layout="total, prev, pager, next, jumper"
                      pageSize={page_size}
                      currentPage={current_page}
                      total={this.state.data.length}
                      onCurrentChange={this.currentChange}
          />
        </div>
      </div>
    );
  }
}