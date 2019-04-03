import React, {Component} from 'react';
import $ from 'jquery';
import {withRouter} from "react-router-dom";

import './index.scss'
class ImageTextList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      imageTextAll:{},
      imageTextData:[]
    };
  }

  componentWillMount() {
    const {data} = this.props;
    this.setState({
      data
    },function () {
      this.getFHL();
    });
    // console.log(data)
  }

  componentDidMount() {
    let _this = this;
    const {data} = this.props;
    if (!data){
      return false
    }
    window['imageTextListData'+data.order]=function (resp) {
      // console.log(resp)
      let imageTextData=[];
      for (let i in resp.data.itemList){
        if(resp.data.itemList[i].isShow==='0'){
          return false
        }else {
          imageTextData.push(resp.data.itemList[i])
        }
      }
      _this.setState({
        imageTextAll:resp.data,
        imageTextData:imageTextData
      })
    }
  }

  /*获取数据*/
  getFHL=()=>{
    const {data}=this.state;
    if(!data){
      return
    }
    let fhlUrl = data.templateUrl;
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+fhlUrl+'&cb=imageTextListData'+data.order,
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
    const {data , imageTextData} = this.state;
    return (
      <div className='recommend-imageTextList-box'>
        <h2>{data.title}
          {data.categoryControl==='1'?
            <a onClick={this.changeLink.bind(this,data)}>more</a>
            :""}
        </h2>
        <ul>
          {imageTextData.map((item,index)=>{
            if(index<12){
              return <li key={'imageText'+index}>
                <div className='itemImage'>
                  <img src={item.imgUrl} alt={item.title}/>
                  {item.video_length?
                    <p className='video-length'>{item.video_length}</p>
                    :""
                  }
                  {item.cornerStr?
                    <p className='video-tips'>{item.cornerStr}</p>
                    :""
                  }
                </div>
                <div className='imageItem-title'>
                  <h3 className='limit-line2'>{item.title}</h3>
                </div>
                {/*<p className='feihua-brief'>{item.brief}</p>*/}
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
                {/*<a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=18NJVZji0319&vsid="+item.vsetId}></a>*/}
              </li>
            }else {
              return false
            }
          })}
        </ul>
      </div>
    )
  }
}
export default withRouter(ImageTextList)