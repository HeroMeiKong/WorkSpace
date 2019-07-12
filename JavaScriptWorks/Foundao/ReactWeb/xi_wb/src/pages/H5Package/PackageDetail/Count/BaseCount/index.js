import React, {Component} from 'react';
import {
  // Form,
  Message,
  Notification,
  Table,
  // DateRangePicker,
} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import api from '@/API/api';
import moment from 'moment';
// import tools from '@/utils/tools';
import {province} from '@/config'

const endDate = new Date();
const startDate = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30);
const defaultDate = [startDate, endDate];


/*地域分布*/
export default
class BaseCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,    // 数据请求中
      searchForm: {              // 搜索框
        timeRange: [...defaultDate],           // 时间范围
      },
      countDetail:{
        correct_total: 0,
        pv_total: 0,
        share_total: 0,
        uv_total: 0,
        vote_total: 0,
        watchtime_total: 0,
      },
      top5: [],
      bot5: [],
      all_seconds: 0,
      avg_seconds: 0,
      total: 0,
      data: [],
      columns: [
        {
          label: "排名",
          // type: 'index',
          width: '65',
          render: (row, style, index) => {
            return index + 1
          }
        },
        {
          label: "省份",
          prop: "region",
          render: (row) => {
            return row.region.replace('省', '').replace('市', '')
          }
        },

        {
          label: "观看量",
          prop: "total",
        },
      ],
    };
    this.charts = null;
    this.charts_watchtime = null;
  }

  componentDidMount() {
    this.getMain();
    this.getList();
    this.getTimeArea();
    // 基于准备好的dom，初始化echarts实例
    this.charts = window.echarts.init(document.getElementById('charts_wrapper'));
    this.charts_watchtime = window.echarts.init(document.getElementById('charts_watchtime'));
  };

  componentWillUnmount() {
  };
  getMain = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.count_liveMain,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done((resp) => {

      if (resp.code / 1 === 0) {
        const {
          correct_total = 0,
          pv_total = 0,
          share_total = 0,
          uv_total = 0,
          vote_total = 0,
          watchtime_total = 0,
        } = resp.data;
        const countDetail = {
          correct_total,
          pv_total,
          share_total,
          uv_total,
          vote_total,
          watchtime_total,
        };
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
  // 获取观看地域分布
  getList = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      // url: api.count_h5userArea,
      url: 'http://cd.foundao.com:10080/foundao_api_zh/mstats/live/h5userArea',
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done((resp) => {
      const data = resp.data;
      if (resp.code / 1 === 0) {
        this.disposeData(data)  //处理获取到的数据
        this.setState({
          data: data
        })
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

  // 获取观看时长分布
  getTimeArea = () => {
    const {packageID} = this.props.match.params;
    httpRequest({
      url: api.count_watchTime,
      type: 'post',
      data: {
        h5_id: packageID
      }
    }).done((resp) => {
      const data = resp.data.area;
      if (resp.code / 1 === 0) {
        this.disposeData_watchtime(data)  //处理获取到的数据
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
  refreshCharts = (options) => {
    const {areaJson} = options;

    // const data = [
    //   {name: '北京',value: Math.round(Math.random()*1000)},
    //   {name: '天津',value: Math.round(Math.random()*1000)},
    //   {name: '上海',value: Math.round(Math.random()*1000)},
    //   {name: '重庆',value: Math.round(Math.random()*1000)},
    //   {name: '河北',value: Math.round(Math.random()*1000)},
    //   {name: '河南',value: Math.round(Math.random()*1000)},
    //   {name: '云南',value: Math.round(Math.random()*1000)},
    //   {name: '辽宁',value: Math.round(Math.random()*1000)},
    //   {name: '黑龙江',value: Math.round(Math.random()*1000)},
    //   {name: '湖南',value: Math.round(Math.random()*1000)},
    //   {name: '安徽',value: Math.round(Math.random()*1000)},
    //   {name: '山东',value: Math.round(Math.random()*1000)},
    //   {name: '新疆',value: Math.round(Math.random()*1000)},
    //   {name: '江苏',value: Math.round(Math.random()*1000)},
    //   {name: '浙江',value: Math.round(Math.random()*1000)},
    //   {name: '江西',value: Math.round(Math.random()*1000)},
    //   {name: '湖北',value: Math.round(Math.random()*1000)},
    //   {name: '广西',value: Math.round(Math.random()*1000)},
    //   {name: '甘肃',value: Math.round(Math.random()*1000)},
    //   {name: '山西',value: Math.round(Math.random()*1000)},
    //   {name: '内蒙古',value: Math.round(Math.random()*1000)},
    //   {name: '陕西',value: Math.round(Math.random()*1000)},
    //   {name: '吉林',value: Math.round(Math.random()*1000)},
    //   {name: '福建',value: Math.round(Math.random()*1000)},
    //   {name: '贵州',value: Math.round(Math.random()*1000)},
    //   {name: '广东',value: Math.round(Math.random()*1000)},
    //   {name: '青海',value: Math.round(Math.random()*1000)},
    //   {name: '西藏',value: Math.round(Math.random()*1000)},
    //   {name: '四川',value: Math.round(Math.random()*1000)},
    //   {name: '宁夏',value: Math.round(Math.random()*1000)},
    //   {name: '海南',value: Math.round(Math.random()*1000)},
    //   {name: '台湾',value: Math.round(Math.random()*1000)},
    //   {name: '香港',value: Math.round(Math.random()*1000)},
    //   {name: '澳门',value: Math.round(Math.random()*1000)}
    // ]
    const allData = areaJson.map(item => item.value / 1);
    let maxNum = Math.max(...allData);
    if (maxNum < 100) {
      maxNum = 100;
    }
    const data = province.map(item => {
      const currentItem = areaJson.find(areaJsonItem => {
          return areaJsonItem.region.replace('省', '').replace('市', '') === item
        }) || {};

      let value = currentItem.value || 0;
      return {
        name: item,
        value: value,
        visualMap: Boolean(value), //  设置 `visualMap: false` 则 visualMap 不对此项进行控制，此时系列
        // 可使用自身的视觉参数（color/symbol/ ...控制此项的显示。
        // value: 1
      }
    });
    const option = {
      title: {
        text: '观看量分布',
        // subtext: '纯属虚构',
        left: 'center'
      },

      tooltip: {
        trigger: 'item',
      },
      label: {
        show: true,
        formatter: "{b}",
        color: '#000000'
      },
      // legend: {
      //   // orient: 'vertical',
      //   // left: 'left',
      //   // data: ['观看量']
      // },
      showLegendSymbol: false,
      visualMap: {
        min: 0,
        max: maxNum,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],           // 文本，默认为数值文本
        calculable: true,
        color: ['orangered', 'yellow', 'lightskyblue']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          // mark: {show: true},
          // dataView: {show: true, readOnly: false},
          // restore: {show: true},
          // saveAsImage: {show: true}
        }
      },
      series: [
        {
          name: '观看量',
          type: 'map',
          mapType: 'china',
          roam: true, // 是否开启鼠标缩放和平移漫游
          // itemStyle: {
          //   normal: {
          //     color: '#b9f0d6', // 圆点的颜色
          //   }
          // },
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: data
        },

      ]
    };
    this.charts.setOption(option);
  };
  refreshCharts_watchtime = (options) => {
    const {areaJson} = options;

    // var areaJson = [
    //   {name: "0-5", value: 11},
    //   {name: "5-30", value: 2},
    //   {name: "30-60", value: 0},
    //   {name: "60-120", value: 1},
    //   {name: "120+", value: 1},
    // ];

    const total = Object.keys(areaJson).reduce(function (all, key) {
      return all + areaJson[key].value / 1;
    }, 0);
    const option = {
      // title: {
      //   text: '用户观看时长分布',
      //   subtext: '（分钟）',
      //   x: 'center'
      // },
      color: ['#3398DB'],
      tooltip: {
        formatter: (params) => {
          return `${params.name} : ${params.value} ( ${(params.value / total * 100).toFixed(2) } %)`
        },
        // trigger: 'axis',
        // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        //   type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        // }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: areaJson.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        // name: '人数',
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      series: [
        {
          data: areaJson,
          type: 'bar',
          barWidth: '40',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
        }
      ]
    }
    this.charts_watchtime.setOption(option);
  };
  //处理获取到的数据
  disposeData = (result = []) => {
    const areaData = result.map(item => {
      return {region: item.region, value: item.total}
    });
    this.refreshCharts({areaJson: areaData});
  };

  //处理获取到的数据
  disposeData_watchtime = (result = {}) => {
    const areaData = Object.keys(result).map(item => {
      return {name: item, value: result[`${item}`]}
    });
    console.log(areaData);
    this.refreshCharts_watchtime({areaJson: areaData});
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

  render() {
    const {
      // searchForm,
      // columns,
      countDetail,
      data
    } = this.state;
    const tableStyle = {
      width: '240px',
      position: 'absolute',
      top: '20px',
      right: '20px'
    };
    const tableData = data.slice(0, 5);
    return (
      <div className="content_wrapper">
        {/*搜索框*/}
        {/*<div className="table_toolbar clearBoth">*/}
        {/*<Form model={searchForm} inline={true}>*/}
        {/*<div style={{float: 'right'}}>*/}
        {/*<Form.Item label="">*/}
        {/*<DateRangePicker*/}
        {/*value={searchForm.timeRange}*/}
        {/*placeholder="选择日期范围"*/}
        {/*disabledDate={this.disabledDate}*/}
        {/*onChange={this.timePickerChange}*/}
        {/*/>*/}
        {/*</Form.Item>*/}
        {/*</div>*/}
        {/*</Form>*/}
        {/*</div>*/}
        {/* echarts统计 */}
        <div className="analysis-detail-box">
          <h2 className="analysis-title">数据汇总</h2>
          <div className="detail-box">
            <div className="title">观众数(UV)</div>
            <div className="content"><span>{countDetail.uv_total}</span><span>人</span></div>
          </div>
          <div className="detail-box">
            <div className="title">观看量(PV)</div>
            <div className="content"><span>{countDetail.pv_total}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            <div className="title">观看总时长</div>
            <div className="content"><span>{(countDetail.watchtime_total / 60).toFixed(1)}</span><span>分钟</span></div>
          </div>
          <hr size={1} color="#f5f5f5"/>
          <div className="detail-box">
            <div className="title">分享总次数</div>
            <div className="content"><span>{countDetail.share_total}</span><span>次</span></div>
          </div>
          <div className="detail-box">
            <div className="title">投票总参与人数</div>
            <div className="content"><span>{countDetail.vote_total}</span><span>人</span></div>
          </div>
          <div className="detail-box">
            <div className="title">竞答总参与人数</div>
            <div className="content"><span>{countDetail.correct_total}</span><span>人</span></div>
          </div>
        </div>
        {/*时长分布*/}
        <div className="analysis-detail-box">
          <h2 className="analysis-title">观看时长分析</h2>
          <div style={{position: 'relative'}}>
            {/*<h3>Top5</h3>*/}
            <div id="charts_watchtime" className="charts_box"
                 style={{width: '600px', height: '300px'}}/>
          </div>
        </div>
        {/*观看地域分布*/}
        <div className="analysis-detail-box">
          <h2 className="analysis-title">观看地域分布</h2>
          <div style={{position: 'relative'}}>
            {/*<h3>Top5</h3>*/}
            <div id="charts_wrapper" className="charts_box"
                 style={{width: '100%', height: '600px', paddingRight: '180px', paddingLeft: '30px'}}/>
            <div className="map_table" style={tableStyle}>
              <Table columns={this.state.columns}
                     border={true}
                     data={tableData}/>

            </div>
          </div>
        </div>
      </div>
    )
  }
}