import React, {Component} from 'react';
import './index.scss';
import tool from '../../tool'
import $ from "jquery";
import api from "../../API/api";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},//推荐页所有数据

    };
    this.falg=false;
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    let data=nextProps.data || [];
    let listData = data?data:[];
    this.setSndVideo(listData);
    this.getVideo();
  }

  /*video创建完成*/
  getVideo=()=>{
    let _this = this;
    let ti;
    ti = setInterval(function () {
      if(window.jQuery('.videoBox').find('video').get(0)){
        let box = document.getElementsByClassName('videoBox');
        for (let a in box){
          if (window.jQuery(box[a]).find('video').get(0)) {
            let videoDom = window.jQuery(box[a]).find('video').get(0);
            videoDom.setAttribute('webkit-playsinline',true);
            videoDom.setAttribute('x-webkit-airplay',true);
            videoDom.setAttribute('x5-playsinline',true);
          }
        }
        clearInterval(ti)
      }
    },1000)
  }

  setSndVideo = (listData)=>{
    let _player_width = document.body.clientWidth|| window.innerWidth;
    _player_width = parseInt(_player_width)>=750?750:parseInt(_player_width);
    let _player_height = parseInt(_player_width*9/16);
    function creatMultiPlayerTest(divid, pid, isAutoPlay, posterImg){
      let fo = window.createCommonPlayer(divid,_player_width,_player_height,"jiankang", isAutoPlay, posterImg);
      if (fo){
        fo.addVariable("id", "null");
        fo.addVariable("videoId", "VIDE100215108600");
        fo.addVariable("articleId", "");
        fo.addVariable("filePath", "");
        fo.addVariable("sysSource", "");//视频来源
        fo.addVariable("channelId", "");
        fo.addVariable("url", "");//视频页面url，如http://tv.cntv.cn/video/C18472/a28126e5e0424a44af6a9bc4c5a47742
        fo.addVariable("scheduleId", "C18472000001");//关键字
        fo.addVariable("videoCenterId",pid); //视频生产中心guid (必要值)
        fo.addVariable("isLogin", "");//用户中心相关
        fo.addVariable("userId", "");//用户中心相关
        fo.addVariable("wideMode", "normal");
        fo.addVariable("adCall", "");	//前贴片广告
        fo.addVariable("adAfter","");	//后贴广告
        fo.addVariable("adPause", "");	//暂停广告
        fo.addVariable("adCorner", "");	//角标广告
        fo.addVariable("adCurtain", "");//跑马灯广告
        window.writePlayer(fo,divid,"","");
      }
    }
    setTimeout(function () {
      for (let i in listData){
        let vdiv = 'sndVideo'+i;
        creatMultiPlayerTest(vdiv, listData[i].vid, false, listData[i].imgUrl);
      }
    },0)

  };

  CommentVideo=(item)=>{
    let mid = '17aQfAjy0815';
    if(tool.is_wxBrowser()){
      tool.jumpToApp('23', mid);
    }else if (tool.is_shici()){
      if (window.localStorage.getItem("user_info")){
        window.location.href ='getguid://guid='+item.vid+'&title='+encodeURI(item.title);
      }else {
        window.location.href='login://app.cctv.cn';
      }
    } else {
      tool.jumpToApp('23', mid);
    }
  };

  render() {
    const {data} = this.props;
    let listData = data?data:[];
    // console.log(listData)
    return (
      <div className='list-box lookStyle_2-box'>
        <ul className='ulList'>
          {listData.map((item,index)=>{
            // console.log(item)
            return <li key={'list'+index}>
              <div className='pic'>
                <div className='videoBox' id={'sndVideo'+index}></div>
                {/*<img src={item.imgUrl} alt={item.title}/>*/}
                {/*<a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=18NJVZji0319&vsid="+item.vsetId}><p className='play-btn'></p></a>*/}
                <div className='video-cover'>
                  <h2 className='video-title limit-line2'>{item.title}</h2>
                </div>
                <p className='video-length'>{item.video_length}</p>
              </div>
              <div className='list-info'>
                {item.vtype/1===1 ?
                  <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId} className='seewhole'>看整期</a>
                  :
                  item.vtype/1===3 ?
                    <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId} className='seewhole'>看整期</a>
                    :
                    item.vtype/1===7 ?
                      <a href={item.pcUrl} className='seewhole'>看整期</a>
                      :
                      item.vtype/1===8 ?
                        <a href={"http://app.cctv.com/special/cbox/newlive/index.html?channel="+item.channelId} className='seewhole'>看整期</a>
                        :
                        item.vtype/1===23 ?
                          <a href={"http://cbox.cntv.cn/special/cbox/fastvideo/index.html?id="+item.vsetPageid+"&guid="+item.vid+"vtype=47"} className='seewhole'>看整期</a>
                          :
                          ""
                }
                {/*<a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=19RJRJF30114&vsid="+item.vsetId} className='seewhole'>看整期</a>*/}
                <div>
                  <p className='commen-btn' onClick={this.CommentVideo.bind(this,item)}>评论</p>
                  {/*<p className='fellow-btn'>点赞</p>*/}
                </div>
              </div>
            </li>
          })}
        </ul>

      </div>
    )
  }
}