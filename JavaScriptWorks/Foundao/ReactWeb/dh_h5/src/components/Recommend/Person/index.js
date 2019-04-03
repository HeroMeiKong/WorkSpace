import React, {Component} from 'react';
import $ from 'jquery';
import {withRouter} from "react-router-dom";
import './index.scss'
class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      personData:[],
      personall:[]
    };
  }

  componentWillMount() {
    const {data} = this.props;
    this.setState({
      data
    });

  }
  componentDidMount() {
    const {data} = this.props;
    if (!data){return}
    var _this = this;
    window['getPerson'+data.order]=function (resp) {
      // console.log(resp)
      _this.setState({
        personall:resp.data,
        personData:resp.data.itemList
      })

    }
    this.getPerson()
  }

  getPerson=()=>{
    const {data}=this.state;
    if(!data){
      return
    }
    let personUrl = data.templateUrl;
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+personUrl+'&cb=getPerson'+data.order,
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
    let dataSign = data.categoryId ,categoryCid = data.interactid;
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
    console.log(PageLink)
    this.props.history.push(PageLink);
  };
  /*查看更多*/
  seeMorePerson = (data)=>{
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
    this.props.history.push(PageLink);
  }
  render() {
    const {data} = this.props;
    const {personData} = this.state;
    // console.log(personData)
    // console.log(data)
    return (
      <div className='recommend-person-box'>

          <ul>
            { personData.length>5?
              personData.map((item,index)=>{
                if (index<5){
                  if(index<4){
                    return (
                      <li key={index}>
                        <a onClick={this.changeLink.bind(this,item)}>
                          <div>
                            <img src={item.imgUrl} alt={item.title}/>
                          </div>
                          <h3 className='limit-line1'>{item.title}</h3>
                        </a>
                      </li>
                    )
                  }else {
                    return (
                      <li key={index} className='seemorePerson'>
                        <a onClick={this.seeMorePerson.bind(this,data)}>
                          <h3>全部大咖</h3>
                        </a>
                      </li>
                    )
                  }
                }
              })
              :
              personData.map((item,index)=>{
                return (
                  <li key={'s'+index}>
                    <a onClick={this.changeLink.bind(this,item)}>
                      <div>
                        <img src={item.imgUrl} alt={item.title}/>
                      </div>
                      <h3 className='limit-line1'>{item.title}</h3>
                    </a>
                  </li>
                )
              })
            }

          </ul>
      </div>
    )
  }
}
export default withRouter(Person)