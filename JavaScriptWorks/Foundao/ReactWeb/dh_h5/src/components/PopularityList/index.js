import React, {Component} from 'react';
import './index.scss';
import tool from '../../tool';
export default class PopularityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      dataLink:'',
      isiOS:false,
    };
  }
  componentWillMount() {
    // let pagelink = window.location.href;
    // let dataLink = pagelink.slice(pagelink.lastIndexOf('?')+5);
    // console.log(dataLink);
    if (tool.is_iOS()){
      this.setState({
        isiOS:true
      })
    } else {
      this.setState({
        isiOS:false
      })
    }


    let dataUrl ='';
    let firstNav;
    if(sessionStorage.firstNav){
      firstNav=JSON.parse(sessionStorage.firstNav);
    }else {
      this.props.history.push('/');
      return false
    }
    let firstNavList = firstNav.categoryList;
    let pageUrl = this.props.match.params.name;
    for (let i in firstNavList){
      if (pageUrl === firstNavList[i].sign){
        dataUrl=firstNavList[i].listUrl
      }
    }
    this.setState({
      dataLink:dataUrl
    })
  }

  componentDidMount() {
    // let ifm = window.jQuery('iframe').get(0);
    // if (!ifm){
    //   return
    // }
    // let iframeWin = ifm.contentWindow
    // console.log(ifm.contentWindow.document.documentElement)
    // if (iframeWin.document.body) {
    //   ifm.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
    // }
  }


  render() {
    const {isiOS,dataLink} = this.state;
    return (
      <div className={ isiOS ? "popularity-box iosbox":"popularity-box androidbox"}>
          <iframe src={dataLink} frameBorder="0" height='100%' scrolling="yes"></iframe>
      </div>
    )
  }
}