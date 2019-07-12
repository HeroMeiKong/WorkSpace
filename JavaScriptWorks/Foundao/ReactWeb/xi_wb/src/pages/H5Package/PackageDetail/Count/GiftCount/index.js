import React, {Component} from 'react';
import {
  // Form,
  Message,
  Notification,
  // Tabs,
  Pagination,
  Table
  // DateRangePicker,
} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
import moment from 'moment';
// import tools from '@/utils/tool';

const endDate = new Date();
const startDate = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30);
const defaultDate = [startDate, endDate];
/*礼物统计*/
export default
class GiftCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,    // 数据请求中
      activeTab: 'money',
      searchForm: {              // 搜索框
        timeRange: [...defaultDate],           // 时间范围
      },
      total: 0,
      data: [],
      page_size: 10,
      current_page: 1,
      countDetail: {
        all_money: 0,
        all_pv_times: 0,
        all_uv_times: 0,
        gift_pv_times: 0,
        gift_total: 0,
        gift_uv_times: 0,
        money_pv_times: 0,
        money_total: 0,
        money_uv_times: 0,
      },
      columns_single: [
        {
          label: "用户头像",
          prop: "avatar",
          width: 100,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "uid",
          prop: "uid",
        },
        {
          label: "用户昵称",
          prop: "nick_name",
        },
        {
          label: "金额",
          prop: "price",
        },
      ],
      columns_total: [
        {
          label: "用户头像",
          prop: "avatar",
          width: 100,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "uid",
          prop: "uid",
        },
        {
          label: "用户昵称",
          prop: "nick_name",
        },

        {
          label: "金额",
          prop: "total",
        },
      ],
      columns: [
        {
          label: "订单ID",
          prop: "order_id",
          // width: 100,

        },
        {
          label: "用户头像",
          prop: "avatar",
          width: 100,
          render: (row) => {
            let avatar = '';
            if (row.pay_user) {
              avatar = row.pay_user.avatar;
            }
            return <div className="table_image avatar">{avatar ? <img src={avatar} alt=""/> : ""}</div>
          }
        },
        {
          label: "uid",
          prop: "uid",
        },
        {
          label: "用户昵称",
          prop: "nick_name",
          render: (row) => {
            let nick_name = '';
            if (row.pay_user) {
              nick_name = row.pay_user.nick_name;
            }
            return nick_name
          }
        },
        {
          label: "类型",
          prop: "order_type",
          render: (row) => {
            let order_type = this.get_orderType(row.order_type);
            return order_type
          }
        },

        {
          label: "金额",
          prop: "price",
        },
      ],
    };
    this.myChart = null;
  }

  componentDidMount() {
    this.getMain();
    this.getList();
  };

  componentWillUnmount() {
    // tools.hide_loading();
  };

  getMain = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.count_moneyMain,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done((resp) => {

      if (resp.code / 1 === 0) {
        const {
          all_money = 0,
          all_pv_times = 0,
          all_uv_times = 0,
          gift_pv_times = 0,
          gift_total = 0,
          gift_uv_times = 0,
          money_pv_times = 0,
          money_total = 0,
          money_uv_times = 0,
        } = resp.data || {};
        const countDetail = {
          all_money,
          all_pv_times,
          all_uv_times,
          gift_pv_times,
          gift_total,
          gift_uv_times,
          money_pv_times,
          money_total,
          money_uv_times,
        }
        this.setState({
          countDetail
        });
      } else {
        Message.error(resp.msg);
      }
    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + jqXHR.status
      });
    })
  };
  getList = () => {
    const {packageID} = this.props.match.params;
    const {current_page, page_size} = this.state;
    httpRequest({
      url: api.count_moneyList,
      type: 'post',
      data: {
        h5_id: packageID,
        page: current_page,
        limit: page_size
      }
    }).done((resp) => {
      const data = resp.data
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list,
          total: resp.data.total
        });
        // tools.hide_loading();
        this.disposeData(data.top5)  //处理获取到的数据
      } else {
        Message.error(resp.msg);
      }

    }).fail(jqXHR => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + jqXHR.status
      });
    })
  };


  get_orderType = (value) => {
    let typeName = '';
    switch (value) {
      case 'live-gift':
        typeName = '礼物';
        break;
      case 'live-money':
        typeName = '红包';
        break;
      default:
        typeName = '未知';
    }
    return typeName
  };
  //处理获取到的数据
  disposeData = (result = []) => {
    if (result.length === 0) {
      return false
    }
    const yData = [];
    const xData = [];
    result.forEach(item => {
      yData.push(item.package ? item.package.title : item.tid);
      xData.push(item.total);
    });
    this.refreshTop5({yData, xData});
  };

  //日期范围发生改变
  timePickerChange = (date) => {
    const {searchForm} = this.state;
    this.setState({
      searchForm: {...searchForm, timeRange: date || []},
      currentDateValue: true
    }, () => {
      this.getList();
    })
  };

  //禁用当前日期以后的日期选择
  disabledDate = (current) => {
    const today = new Date();
    return current && current > moment(today.getTime() - 3600 * 1000 * 24).endOf('day');
  };
  //tabs切换
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
    })
  };
  // 分页
  currentChange = (current_page) => {
    const {pathname} = this.props.location;
    this.props.history.replace(pathname + `?page=${current_page}`);
    this.setState({
      current_page: current_page
    }, () => {
      this.getList();
    });
  };
  render() {
    const {
      data,
      page_size,
      current_page,
      total,
      countDetail
    } = this.state;

    return (
      <div className="content_wrapper AdStatisticsDetails">
        <div className="analysis-detail-box">
          <h2 className="analysis-title">数据汇总</h2>
          {/*红包*/}
          <div className="detail-box">
            <div className="center-content">红包</div>
          </div>
          <div className="detail-box">
            <div className="title">总金额</div>
            <div className="content"><span>{countDetail.money_total}</span><span>元</span></div>
          </div>
          <div className="detail-box">
            <div className="title">总次数</div>
            <div className="content"><span>{countDetail.money_pv_times}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            <div className="title">参与人数</div>
            <div className="content"><span>{countDetail.money_uv_times}</span><span>人</span></div>
          </div>

          <hr color="#f5f5f5" size={1}/>

          {/*礼物*/}
          <div className="detail-box">
            <div className="center-content">礼物</div>
          </div>
          <div className="detail-box">
            {/*<div className="title">总金额</div>*/}
            <div className="content center-content"><span>{countDetail.gift_total}</span><span>元</span></div>
          </div>
          <div className="detail-box center-content">
            {/*<div className="title">总次数</div>*/}
            <div className="content center-content"><span>{countDetail.gift_pv_times}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            {/*<div className="title">参与人数</div>*/}
            <div className="content center-content"><span>{countDetail.gift_uv_times}</span><span>人</span></div>
          </div>
          <hr color="#f5f5f5" size={1}/>
          {/*总计*/}
          <div className="detail-box">
            <div className="center-content">总计</div>
          </div>
          <div className="detail-box">
            {/*<div className="title">总金额</div>*/}
            <div className="content center-content"><span>{countDetail.all_money}</span><span>元</span></div>
          </div>
          <div className="detail-box">
            {/*<div className="title">总次数</div>*/}
            <div className="content center-content"><span>{countDetail.all_pv_times}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            {/*<div className="title">参与人数</div>*/}
            <div className="content center-content"><span>{countDetail.all_uv_times}</span><span>人</span></div>
          </div>
        </div>
        <div className="analysis-detail-box">
          <h2 className="analysis-title">打赏记录</h2>
          <Table
            columns={this.state.columns}
            data={data}
            stripe={true}
          />
          <div className="pagination_wrapper">
            <Pagination layout="total, prev, pager, next, jumper"
                        pageSize={page_size}
                        currentPage={current_page}
                        total={total / 1}
                        onCurrentChange={this.currentChange}
            />
          </div>
        </div>
        {/*<h3 className="block_head">单个金额Top5</h3>*/}
        {/*<Table*/}
        {/*columns={this.state.columns_single}*/}
        {/*data={singleData}*/}
        {/*stripe={true}*/}
        {/*/>*/}

      </div>
    )
  }
}