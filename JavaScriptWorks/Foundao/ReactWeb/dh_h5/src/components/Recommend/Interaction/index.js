import React, {Component} from 'react';
import $ from 'jquery';
import {withRouter} from "react-router-dom";
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import './index.scss'
class Interaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      interactionAll:{},
      interactionData:[]
    }
    ;
  }

  componentWillMount() {
    const {data} = this.props;
    this.setState({
      data
    });
    // console.log(data)
  }
  componentDidMount() {
    let _this = this;
    const {data}=this.props;
    if(!data){
      return
    }
    window['interactionData'+data.order]=function (resp) {
      let interactionData=[];
      for (let i in resp.data.itemList){
        if(resp.data.itemList[i].isShow==='0'){
          return false
        }else {
          interactionData.push(resp.data.itemList[i])
        }
      }
      _this.setState({
        interactionData,
        interactionAll:resp.data
      },function () {
        var mySwiper = new Swiper('.recommend-interaction-box .swiper-container', {
          slidesPerView : 3,
          spaceBetween : 5,
          centeredSlides: true,
          loop:true,
          pagination: {
            el: '.swiper-pagination',
          },
        })
      })
    };
    this.getInteraction();
  }
  getInteraction=()=>{
    const {data}=this.state;
    if(!data){
      return
    }
    let interactionUrl = data.templateUrl;
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+interactionUrl+'&cb=interactionData'+data.order,
      dataType:'jsonp',
      type:'GET'
    })
  };

  /*切换路由*/
  changeLink=(data)=>{
    let firstNav;
    if(sessionStorage.firstNav){
      firstNav=JSON.parse(sessionStorage.firstNav);
    }else {
      this.props.history.push('/');
      return false
    }
    let PageLink ='/';
    let firstNavList = firstNav.categoryList;
    let dataSign = data.categorySign ,categoryCid = data.categoryCid;
    for (let i in firstNavList){
      if (dataSign===firstNavList[i].sign){
        // console.log(firstNavList[i])
        let category = firstNavList[i].category;
        if (category/1===1){
          PageLink='/'
        }  else if (category/1===2){
          PageLink='/talkingPoetry/'+dataSign+'?type='+categoryCid
        }  else if (category/1===3){
          PageLink='/lookPoetry/'+dataSign+'?type='+categoryCid
        }  else if (category/1===4){
          PageLink='/lookPoetry2/'+dataSign+'?type='+categoryCid
        }  else if (category/1===5){
          PageLink='/PopularityList/'+dataSign
        }
        break;
      }
    }
    // console.log(data)
    // console.log(this.props.history)
    this.props.history.push(PageLink);
  };
  render() {
    const {data , interactionAll,interactionData} = this.state;
    // console.log(data)
    return (
      <div className='recommend-interaction-box'>
        <h2>{data.title}
          {data.categoryControl==='1'?
            <a onClick={this.changeLink.bind(this,data)}>more</a>
            :""}
        </h2>
        <div className='swiper-container'>
          <div className="swiper-wrapper">
            {interactionData.map((item,index)=>{
              // console.log(item)
              return <div key={index} className="swiper-slide">
                <div>
                  <img src={item.imgUrl} alt=""/>
                  {item.video_length?
                    <p>{item.video_length}</p>
                    :""
                  }
                </div>
                <h3  className='limit-line2' >{item.title}</h3>
                {item.vtype/1===1 ?
                  <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId}></a>
                  :
                  item.vtype/1===3 ?
                    <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId}></a>
                    :
                    item.vtype/1===7 ?
                      <a href={item.pcUrl}></a>
                      :
                      item.vtype/1===8 ?
                        <a href={"http://app.cctv.com/special/cbox/newlive/index.html?channel="+item.channelId}></a>
                        :
                        item.vtype/1===23 ?
                          <a href={"http://cbox.cntv.cn/special/cbox/fastvideo/index.html?id="+item.vsetPageid+"&guid="+item.vid+"vtype=47"}></a>
                          :
                  ""
                }
              </div>
            }
            )}
          </div>
        </div>
        <div className='swiper-pagination interaction-pagination'></div>
        </div>
    )
  }
}
export default withRouter(Interaction)