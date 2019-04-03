import React, {Component} from 'react';
import $ from 'jquery';
import './index.scss'
import ListStyleSnd from '../ListStyleSnd/index'
export default class TalkingPoetry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUrl:'',
      talkall:{},
      talkList:[],
      sign:'',
      url:"",
      ListData:[]
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // console.log(nextProps)
    this.getParameter(nextProps.match.params.name);
    this.setState({
      // sign:'',
      ListData:[],
      // url:''
    });
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
    // console.log(dataUrl);
    // return
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
    this.getParameter(this.props.match.params.name);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let tp = window.sessionStorage.getItem('top');
    $(document).scrollTop(tp)
  }
  componentDidMount() {

    let _this=this;
    window.getTalkData=(resp)=>{
      // console.log(resp)
      if (!resp){
        return
      }
      _this.setState({
        talkall:resp.data,
        talkList:resp.data.categoryList||[]
      },()=>{
        _this.getListData();
      })
    }
    window.TalkList=function (resp) {
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

  /*请求列表数据*/
  getListData=()=>{
    let {sign , url , talkList} = this.state;
    // console.log(talkList)
    // return;
    // console.log(sign.length,'sign');
    url = talkList[0].listUrl;
    if(sign.length>0){
      for (let i in talkList){
        if (sign===talkList[i].sign){
          url = talkList[i].listUrl;
          break;
        }
      }
    }else {
      url = talkList[0].listUrl
    }
    // console.log(sign)
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+url+'&cb=TalkList',
      dataType:'jsonp',
      type:'GET'
    })
  };
  /*切换数据*/
  changeSee=(item)=>{
    // console.log(this.props)
    let pagelink = this.props.match.url;
    this.props.history.push(pagelink+'?type='+item.sign);
    // this.setState({
    //   sign:item.sign,
    //   ListData:[],
    //   url:item.listUrl
    // },()=> this.getListData())
  };
  render() {
    const {ListData,talkList,sign} = this.state;
    // console.log(talkList,'talkList')
    return (
      <div className='talking-box'>
        {talkList.length>1?
        <ul className='talking-nav'>
          {talkList.map((item,index)=>{
            return <li className={sign===''&&index===0?"active":sign === item.sign?'active':''} key={'tnav'+index} onClick={this.changeSee.bind(this,item)}>
              <div>
                <img src={item.imgUrl} alt={item.title}/>
              </div>
              <h2>{item.title}</h2>
            </li>
          })}
        </ul>
          :''
        }
        <ListStyleSnd data={ListData}/>
      </div>
    )
  }
}