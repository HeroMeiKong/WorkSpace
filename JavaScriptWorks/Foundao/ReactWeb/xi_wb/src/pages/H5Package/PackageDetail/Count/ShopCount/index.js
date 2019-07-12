import React, {Component} from 'react';
import {
  Form,
  Message,
  Notification,
  DateRangePicker,
  Table,
  Button
} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
// import moment from 'moment';
// import tools from '@/utils/tools';
import {scenes} from '@/pages/H5Package/config';
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30);
const defaultDate = [startDate, endDate];
/*购物统计*/
export default
class ShopCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,    // 数据请求中
      searchForm: {              // 搜索框
        timeRange: [...defaultDate],           // 时间范围
      },
      pv_total: 0,
      uv_total: 0,
      page_size: 30,
      total: 0,
      current_page: 1,
      data: [],
      columns: [
        {
          label: "商品ID",
          prop: "h5_id",
          // width: 180,
        },
        {
          label: "商品名称",
          prop: "title",
        },
        {
          label: "点击次数",
          prop: "pv",
        },
        {
          label: "创建时间",
          prop: "gmt_create",
        },
      ],
      shortcuts: [
        {
          text: '最近一周',
          onClick: () => {
            const {searchForm} = this.state;
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            const timeRange = [start, end];
            this.setState({searchForm: {...searchForm, timeRange}});
            this.daterangepicker.togglePickerVisible()
          }
        }, {
          text: '最近一个月',
          onClick: () => {
            const {searchForm} = this.state;
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            const timeRange = [start, end];
            this.setState({searchForm: {...searchForm, timeRange}});
            this.daterangepicker.togglePickerVisible()
          }
        }, {
          text: '最近三个月',
          onClick: () => {
            const {searchForm} = this.state;
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            const timeRange = [start, end];
            this.setState({searchForm: {...searchForm, timeRange}});
            this.daterangepicker.togglePickerVisible()
          }
        }
      ],
    };
  }

  componentDidMount() {
    this.getMain();
    this.getList();
  };

  componentWillUnmount() {
    // tools.hide_loading();
  };

  getModuleName = (moduleValue) => {
    const item = scenes.find(item => item.value === moduleValue) || {};
    return item.name || '未知';
  };
  getMain = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.count_goodMain,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done((resp) => {
      // tools.hide_loading();
      // const data = resp.data;
      if (resp.code / 1 === 0) {
        this.setState({
          pv_total: resp.data.pv_total,
          uv_total: resp.data.uv_total,
        });
        // this.disposeDataTop5(data)  //处理获取到的数据
      } else {
        Message.error(resp.msg);
      }

    }).fail(jqXHR => {
      // tools.hide_loading();
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + jqXHR.status
      });
    })
  };
  getList = () => {
    // tools.show_loading();
    const {packageID} = this.props.match.params;
    const {current_page, page_size} = this.state;
    httpRequest({
      url: api.count_goodList,
      type: 'post',
      data: {
        h5_id: packageID,
        page: current_page,
        limit: page_size
      }
    }).done((resp) => {
      // tools.hide_loading();
      // const data = resp.data;
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list,
          total: resp.data.total,
        });
        // this.disposeDataTop5(data)  //处理获取到的数据
      } else {
        Message.error(resp.msg);
      }

    }).fail(jqXHR => {
      // tools.hide_loading();
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + jqXHR.status
      });
    })
  };
  refreshTop5 = (options) => {
    // const xData = [18203, 23489, 29034, 104970, 131744, 630230];
    // const yData = ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'];
    const {xData, yData} = options;
    const option = {
      title: {
        text: '点击量总量Top5',
        // subtext: '数据来自网络'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data: ['点击量']
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLabel: {
          interval: 0,
          rotate: 30
        },
      },
      series: [
        {
          name: '点击量',
          type: 'bar',
          data: xData
        }
      ]
    };
    this.charts_top5.setOption(option);
  };
  //处理获取到的数据
  disposeData = (result = {}) => {
    const {pv_list, uv_list} = result;
    const date = [];
    const pvData = [];
    const uvData = [];
    pv_list.forEach(item => {
      date.push(item.date);
      pvData.push(item.total / 1);
    });
    uv_list.forEach(item => {
      uvData.push(item.total / 1);
    });
    this.chartEntirety({
      date,
      pvData,
      uvData
    });
  };
  disposeDataTop5 = (result = []) => {
    const xData = [];
    const yData = [];
    result.forEach(item => {
      xData.push(item.total / 1);
      let title = item.h5_id;
      if (item.package) {
        title = item.package.title
      }
      yData.push(title);
    });
    this.refreshTop5({
      xData,
      yData,
    });
  };
  //配置整体统计折线图
  chartEntirety = (options) => {
    const {date, pvData, uvData} = options
    var option = {
      title: {
        text: 'PV/UV'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['pv(浏览量)', 'uv(单独用户)']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        right: '5%',
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,  //是两边有一定的边距
        data: date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'uv(单独用户)',
          type: 'line',
          // stack: '用户量',
          data: uvData
        },
        {
          name: 'pv(浏览量)',
          type: 'line',
          data: pvData
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    this.myChart_entirety.setOption(option);
  }

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
    return current && current > today;
  };
  handleSearchClick = () => {
    this.getList();
  };

  render() {
    const {
      data,
      shortcuts,
      searchForm,
      pv_total,
      uv_total
    } = this.state;
    return (
      <div className="content_wrapper AdStatisticsDetails">
        {/*搜索框*/}
        <div className="table_toolbar clearBoth">
          <Form model={searchForm} inline={true}>
            <div style={{float: 'right'}}>
              <Form.Item label="">
                <DateRangePicker
                  ref={e => this.daterangepicker = e}
                  shortcuts={shortcuts}
                  value={searchForm.timeRange}
                  placeholder="选择日期范围"
                  disabledDate={this.disabledDate}
                  onChange={this.timePickerChange}
                />
              </Form.Item>
              <Button type="info" onClick={this.handleSearchClick}>查询</Button>
            </div>
          </Form>
        </div>
        <div className="analysis-detail-box">
          <h2 className="analysis-title">数据汇总</h2>
          {/*<div className="detail-box">*/}
          {/*<div className="title">购物面板点击量</div>*/}
          {/*<div className="content"><span>{20}</span><span>次</span></div>*/}
          {/*</div>*/}
          <div className="detail-box">
            <div className="title">商品点击总量</div>
            <div className="content"><span>{pv_total}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            <div className="title">总人数</div>
            <div className="content"><span>{uv_total}</span><span>人</span></div>
          </div>
        </div>
        <Table
          columns={this.state.columns}
          data={data}
          stripe={true}
        />
      </div>
    )
  }
}