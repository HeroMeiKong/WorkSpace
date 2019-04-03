import React, {Component} from 'react';
import $ from 'jquery';
import {withRouter} from 'react-router-dom'
import './index.scss';
import tool from '../../../tool.js'
class Latest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据
      latestall:{},
      latestData:[],
      cuurvid:"",
      soundState:false,
      curVsetId:"",
      curvid:"",
      iscreate:false,
      currIndex:0
    };
  }

  componentWillMount() {
    const {data} = this.props;
    this.setState({
      data
    })
  }
  componentDidMount() {
    let _this = this;
    window.LatestData=function (resp) {
      let latestData = [];
      for (let i in resp.data.itemList) {
        if(resp.data.itemList[i].isShow==='0'){
          return
        }else {
          latestData.push(resp.data.itemList[i])
        }
      }
      _this.setState({
        latestall:resp.data,
        latestData:latestData,
        curVsetId:latestData[0].vsetId,
        curvid:latestData[0].vid,
        currIndex:0
      },function () {
        const {latestData} = this.state;
        _this.setVideo(latestData[0],0);
      })
    };
    this.getLatest();
    // this.getVideo()
  }

  /*video创建完成*/
  getVideo=()=>{
    let _this = this;
    let ti;
    ti = setInterval(function () {
      if (window.jQuery('#videoBox').find('video').get(0)){
        _this.setState({
          iscreate:false
        });
        let videoDom = window.jQuery('#videoBox').find('video').get(0);
        videoDom.setAttribute('webkit-playsinline',true);
        videoDom.setAttribute('x-webkit-airplay',true);
        videoDom.setAttribute('x5-playsinline',true);
        document.addEventListener("WeixinJSBridgeReady", function () {
          // alert(41)
          if (tool.is_iOS()){
            window.jQuery('#videoBox').find('video').get(0).play();
          }else {
          }

        }, false);
        clearInterval(ti);
        videoDom.addEventListener('ended',function () {
          const { latestData , currIndex} = _this.state;
          if (currIndex >= latestData.length){
            _this.setState({
              currIndex:0
            });
            _this.setVideo(latestData[0],0)
          }else {
            _this.setState({
              currIndex:currIndex+1
            })
            _this.setVideo(latestData[currIndex+1],currIndex+1);
          }
        });
      }
    },100)
  }
  setVideo=(item,index)=>{
    this.setState({
      cuurvid:item.vid,
      currIndex:index,
      iscreate:true
    });
    window.jQuery('#videoBox').html('');
    // console.log(window.jQuery('#videoBox').html())
    // return
    let winw= window.innerWidth>=750?750:window.innerWidth;
    console.log(winw)
    let w =(7.02 / 750)*winw;
    let h =w*0.58;
    function creatMultiPlayerTest(divid, pid, isAutoPlay, posterImg){
      let fo = window.createCommonPlayer(divid,w,h,"jiankang", isAutoPlay, posterImg);
      if (fo){
        fo.addVariable("id", "null");
        fo.addVariable("videoId", "VIDE100215108600");  //视频集id
        fo.addVariable("articleId", "");
        fo.addVariable("filePath", "");
        fo.addVariable("sysSource", "");//视频来源
        fo.addVariable("channelId", "");
        fo.addVariable("url", "");//视频页面url，如http://tv.cntv.cn/video/C18472/a28126e5e0424a44af6a9bc4c5a47742
        fo.addVariable("scheduleId", "");//关键字
        fo.addVariable("videoCenterId",pid); //视频生产中心guid (必要值)
        fo.addVariable("isLogin", "");//用户中心相关
        fo.addVariable("userId", "");//用户中心相关
        // fo.addVariable("wideMode", "normal");
        // fo.addVariable("adCall", "");	//前贴片广告
        // fo.addVariable("adAfter","");	//后贴广告
        // fo.addVariable("adPause", "");	//暂停广告
        // fo.addVariable("adCorner", "");	//角标广告
        // fo.addVariable("adCurtain", "");//跑马灯广告
        // fo.addVariable("preImage", "http://p1.img.cctvpic.com/photoAlbum/page/performance/img/2018/11/27/1543284226918_68.jpg");//默认图片
        // fo.addVariable("isAutoPlay", true);//是否自动播放
        //fo.addVariable("isDefaultPreImage", "true");//是否默认从vdn取图，非自动播放情况下才有效
        // fo.addParam("wmode", "opaque");
        window.writePlayer(fo,divid);
      }

    }
    if (tool.is_iOS()){
      creatMultiPlayerTest("videoBox", item.vid, false, item.imgUrl);
    }else {
      creatMultiPlayerTest("videoBox", item.vid, false, item.imgUrl);
    }
    this.getVideo();
  };
  getLatest=()=>{
    const {data}=this.state;
    if(!data){
      return
    }
    let latestUrl = data.templateUrl;
    $.ajax({
      url:'http://m.app.cctv.com/json/jsonp?url='+latestUrl+'&cb=LatestData',
      dataType:'jsonp',
      type:'GET'
    })
  };
  /*切换视频*/
  changeVideo=(item,index)=>{
    const {iscreate} = this.state
    if (iscreate){
      alert('视频正在赶来的路上，请不要切换太快！');
      return false
    }
    this.setState({
      curVsetId:item.vsetId,
      curvid:item.vid
    });
    this.setVideo(item,index)
  };
  /*声音切换*/
  changeaudio=()=>{
    let videoSound=window.jQuery('#videoBox').find('video').get(0).muted;
    // console.log(videoSound)
    if (videoSound){
      window.jQuery('#videoBox').find('video').get(0).muted=false;
      this.setState({
        soundState:false
      });
    } else {
      window.jQuery('#videoBox').find('video').get(0).muted=true;
      this.setState({
        soundState:true
      });
    }
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
  };

  render() {
    const {data,latestData , curVsetId , curvid ,cuurvid ,soundState} = this.state;
    // console.log(curvid);
    if(data.showControl/1===1){
      return (
        <div className='Latest-box'>
          <div>
            <h2>
              {data.title}
              {data.categoryControl/1===1?
                <a onClick={this.changeLink.bind(this,data)}>more</a>
                :
                ""}
            </h2>
            {curVsetId.length>0?
              <a className='seewhole' href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+curvid+"&mid=17aQfAjy0815&vsid="+curVsetId}>看整期</a>
              :""}
            <div id='videoBox'></div>
            {/*<a href="javascript:;" onClick={this.changeaudio} className={soundState ?"active videoSY":"videoSY"}>声音</a>*/}
          </div>
          <ul className='LatestVideoList'>
            {
              latestData.map((item,index)=>{
                return <li key={'video'+index} className={cuurvid === item.vid ?"active":""}
                           onClick={this.changeVideo.bind(this,item,index)}>
                  <div>
                    <img src={item.imgUrl} alt={item.title}/>
                    {item.video_length?
                      <p>{item.video_length}</p>
                      :""
                    }
                  </div>
                  <h3 className=''>{item.title}</h3>
                </li>
              })
            }
          </ul>
        </div>
      )
    }

  }
}
export default withRouter(Latest)