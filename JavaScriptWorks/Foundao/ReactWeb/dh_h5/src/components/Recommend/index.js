import React, {Component} from 'react';
import './index.scss';
import $ from 'jquery';
import api from '../../API/api';
import Latest from './LatestInformation/index';
import Person from './Person/index';
import Interaction from './Interaction/index';
import WholePeriod from './wholePeriod/index';
import FeiHuaLing from './FeiHuaLing/index';
import ImageTextList from './ImageTextList/index';
export default class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据

    };
  }

  componentWillMount() {
    this.getRecommendData();
    let _this = this;
    /*推荐回调函数*/
    window.setStyle1=function(resp){
      _this.setState({
        data:resp.data
      },function () {

      })
    }
  }
  componentDidMount() {
  }

  /*获取推荐的数据*/
  getRecommendData=()=>{
    $.ajax({
      type:'GET',
      dataType: "jsonp",
      url:api.recommendList + 'setStyle1',
      data:{},
    })
  };

  render() {
    const {data} = this.state;
    let columnList = data.columnList?data.columnList:[];
    return (
      <div className='recommend-box'>
        {
          columnList.map(item => {
            if (item.templateType/1===35){
              return  <Latest
                key={item.order}
                data={item}
              />
            }else if (item.templateType/1===36) {
              return <Person
                key={item.order}
                data={item}
              />
            }else if (item.templateType/1===37) {
              return  <Interaction
                key={item.order}
                data={item}
              />
            }else if (item.templateType/1===6) {
              return <WholePeriod
                key={item.order}
                data={item}
              />
            }else if (item.templateType/1===2) {
              return <FeiHuaLing
                key={item.order}
                data={item}
              />
            } else if (item.templateType/1===8) {
              return <ImageTextList
                key={item.order}
                data={item}
              />
            }
          })
        }
      </div>
    )
  }
}