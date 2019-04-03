import React, {Component} from 'react';
import './index.scss';
import bg from '../../assets/home_top_bg.png'
import $ from "jquery";
import api from "../../API/api";
export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerflag:false,
      answerData:{},
      totalPerson:'0'
    };
  }

  componentWillMount() {
    // let sv ;
    // let _this = this;
    // sv=setInterval(
    //   function () {
    //     _this.getOnlinePerson();
    //   },5000)

  }

  componentDidMount() {
    this.getRecommendData();
    let _this = this;
    /*推荐回调函数*/
    window.setAnswer=function(resp){
      // console.log(resp)
      _this.setState({
        answerData:resp.data.yuyue[0]||{},
      },function () {
        _this.answerIsShow()
      })
    };
    window.getOnline=function (resp) {
      // console.log(resp)
      _this.setState({
        totalPerson:resp.total||'0'
      })
    };
  }
  /*获取推荐的数据*/
  getRecommendData=()=>{
    $.ajax({
      type:'GET',
      dataType: "jsonp",
      url:api.recommendList+'setAnswer',
      data:{},
    })
  };
  getOnlinePerson=()=>{
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: api.onlinePerson+'getOnline'
    })
  }
  /*判断同步答题是否显示*/
  answerIsShow=()=>{
    const {answerData} = this.state;
    let curr = new Date().getTime() / 1000;
    if(answerData.isShow/1===1){
      // console.log(answerData.startTime)
      if(curr>=answerData.startTime&&curr<answerData.endTime){
        this.setState({
          answerflag:true
        })
      }else {
        this.setState({
          answerflag:false
        })
      }
    }else {
      this.setState({
        answerflag:false
      })
    }
  };
  render() {
    const {answerData,totalPerson ,answerflag} = this.state;
    let bgcover = answerData.imgUrl || bg;
    if(answerflag){
      return (
        <div className='answer-box'>
          <div className='answer-inner'
               style={{ backgroundImage:'url('+bgcover+')'}}>
            {/*<p>与{totalPerson}人一起参与互动</p>*/}
            {/*<h2>同步答题</h2>*/}
          </div>
          <a href={answerData.pcUrl}></a>
        </div>
      )
    }else {
      return ''
    }
  }
}