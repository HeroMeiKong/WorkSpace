import React, {Component} from 'react';
import $ from "jquery";
import ListStyleSnd from '../ListStyleSnd/index'
import ListStyleOne from "../ListStyleOne/index";
export default class LookPoetry2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      LookList:[],
      categoryType:1,//页面样式
    };
  }


  componentWillReceiveProps(nextProps, nextContext) {
    this.getParameter(nextProps.match.params.name);
    this.setState({
      // sign:'',
      ListData:[],
      // url:''
    })
  }

  /*获取数据接口*/
  getParameter = (url)=>{
    let dataUrl ='';
    let firstNav;
    if(sessionStorage.firstNav){
      firstNav=JSON.parse(sessionStorage.firstNav);
    }else {
      this.props.history.push('/');
      return false
    }
    let firstNavList = firstNav.categoryList;
    let pageUrl = url;
    for (let i in firstNavList){
      if (pageUrl === firstNavList[i].sign){
        dataUrl=firstNavList[i].listUrl
      }
    }
    // console.log(dataUrl)
    let pagelink = window.location.href;
    let sign ='';
    if (pagelink.indexOf('?type=')===-1){
      sign=''
    } else{
      sign = pagelink.slice(pagelink.lastIndexOf('?type=')+6);
    }
    this.setState({
      dataUrl,
      sign
    },function () {
      this.getData();
    })
  };
  componentWillMount() {
    this.getParameter(this.props.match.params.name)
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let tp = window.sessionStorage.getItem('top');
    $(document).scrollTop(tp)
  }
  componentDidMount() {
    let _this=this;
    window.getTalkData=(resp)=>{
      console.log(resp);
      _this.setState({
        talkall:resp.data,
        LookList:resp.data.categoryList||[]
      },()=>{
        _this.getListData();
        _this.getCurrType();
      })
    }
    window.LookList=function (resp) {
      // console.log(resp)
      _this.setState({
        ListData:resp.data.itemList||[]
      })
    }
  }

  /*获取页面数据*/
  getData=()=>{
    const {dataUrl} = this.state;
    $.ajax({
      type:'GET',
      dataType: "jsonp",
      url:'http://m.app.cctv.com/json/jsonp?url='+dataUrl+'&cb=getTalkData',
      data:{},
    })
  };

  /*判断当前类型*/
  getCurrType=()=>{
    const {sign,LookList} = this.state;
    // console.log(sign)
    // console.log(LookList)
    if (!sign){
      this.setState({
        categoryType:LookList[0].category
      })
    } else {
      for (let i in LookList){
        if (sign === LookList[i].sign) {
          if (LookList[i].category/1===2){
            this.setState({
              categoryType:2
            })
          } else {
            this.setState({
              categoryType:1
            })
          }
        }
      }
    }

  };

  /*请求列表数据*/
  getListData=()=>{
    let {sign , url , LookList} = this.state;
    url = LookList[0].listUrl;
    if(sign.length>0){
      for (let i in LookList){
        if (sign===LookList[i].sign){
          url = LookList[i].listUrl;
          break;
        }
      }
    }else {
      url = LookList[0].listUrl
    }
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+url+'&cb=LookList',
      dataType:'jsonp',
      type:'GET'
    })
  };
  /*切换数据*/
  changeSee=(item)=>{
    let pagelink = this.props.match.url;
    this.props.history.push(pagelink+'?type='+item.sign);
  };
  render() {
    const {LookList ,ListData, sign ,categoryType} = this.state;
    console.log(categoryType)
    return (
      <div className='lookStyle_1-box'>
        <ul className='lookNav'>
          {
            LookList.map((item,index)=>{
              return <li
                className={sign===''&&index===0?"active":sign === item.sign?'active':''}
                onClick={this.changeSee.bind(this,item)} key={'look'+index}>{item.title}</li>
            })
          }
        </ul>
        { categoryType / 1===1 ?
          <ListStyleSnd data={ListData}/>
          :
          <ListStyleOne data={ListData}/>
        }
      </div>
    )
  }
}