import React, {Component} from 'react';
import './index.scss';
import Upload from '../../../components/MuliUpload';
import transCode  from  '@/utils/transCode';
import httpRequest from  '@/utils/httpRequest';
import api from "@/API/api";
import messageBox from '@/utils/messageBox';
import Comfirm from '@/components/Comfirm/index';
import Grade from '@/components/Grade'
export default class ConvertDeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList:[],
      comfirmDialog:false,//弹窗
      dialogMsg:"",//弹窗描述
      vip_type:0,//vip类型
      currIndex:'',//当前点击的视频序号
      isVip:false,
      startToken:'',
      showStar:false,
      tipsMsg:"",
      tipsDialog:false,
      readyList:[],//准备列表
      canUpload:false,//是否可以上传
    }
  }
  componentWillMount() {
    const {videoList , vip_type} = this.props;
    this.setState({
      videoList,
      vip_type
    })
  }
  componentDidMount() {

  }
  ClickChoose=()=>{
    this.refs.cfs.click();
  }
  /**上传文件**/
  chooseFile=(e)=>{
    let file = e.target.files[0];
    let {videoList,readyList,canUpload} = this.state;
    for (let i in videoList){
      /**判断视频是否在上次列表中**/
      if (videoList[i]){
        if (file&&file.size===videoList[i].file.size&&file.name===videoList[i].file.name){
          messageBox('This video is  being uploaded!');
          this.refs.cfs.value='';
          return
        }
      }
    }
    for (let i in readyList){
      /**判断视频是否在上次列表中**/
      if (readyList[i]){
        if (file&&file.size===readyList[i].file.size&&file.name===readyList[i].file.name){
          messageBox('This video is  being uploaded!');
          this.refs.cfs.value='';
          return
        }
      }
    }
    const {vip_type} = this.props;
    let realList=[];//获取真实视频数据
    for (let i in videoList){
      if (videoList[i]){
        realList.push(videoList[i])
      }
    }
    for (let i in readyList){
      if (readyList[i]){
        realList.push(readyList[i])
      }
    }
    switch (vip_type) {
      case 0:if (realList.length>=2){
                this.setState({
                  tipsMsg:"The maximum file quantity for your account type - 2 videos.",
                  tipsDialog:true
                })
                return
              };
              break;
      case 2:if (realList.length>=5){
                this.setState({
                  tipsMsg:"The maximum file quantity for your account type - 5 videos.",
                  tipsDialog:true
                })
                return
              };break;
      case 2:if (realList.length>=25){
              this.setState({
                tipsMsg:"The maximum file quantity for your account type - 25 videos.",
                tipsDialog:true
              })
              return
            };break;
      case 3:if (realList.length>=50){
              this.setState({
                tipsMsg:"The maximum file quantity for your account type - 50 videos.",
                tipsDialog:true
              })
              return
            };break;
    }
    if (vip_type===0){
      if (!file||(file.size&&file.size/1024/1024>500)){
        this.setState({
          tipsDialog:true,
          tipsMsg:window.intl.get("您的视频超过500M，我们为您推荐更加快捷的转码服务")
        })
        this.refs.cfs.value='';
        return
      }
    }else if (vip_type!==4) {
      if (!file||(file.size&&file.size/1024/1024>10240)){
        this.setState({
          tipsDialog:true,
          tipsMsg:window.intl.get("您的视频超过10G，建议升级至终极版套餐享受极速转码")
        })
        this.refs.cfs.value='';
        return
      }
    }
    if (canUpload) {
      videoList.push({
        file:file,
        status:1,
        size:file.size||0,
        fileName:file.name||'',
        trans:false,
        isfinished:false,
        progress:0
      })
    }else {
      readyList.push({
        file:file,
        status:1,
        size:file.size||0,
        fileName:file.name||'',
        trans:false,
        isfinished:false,
        progress:0
      })
    }
    this.setState({
      videoList,
      readyList,
      canUpload:false
    })
  }
  UploadProgress=(progress , index)=>{
    let {videoList} = this.state;
    if (!videoList[index]){
      return
    }
    videoList[index].progress = progress ||0;
    this.setState({
      videoList,
    })
  }
  UploadSuccess=(name,size,md5,token,index)=>{
    let {videoList} = this.state;
    if (!videoList[index]){
      return
    }
    this.uploadBack(token);
    this.setState({
      startToken:token
    })
    videoList[index].md5 = md5;
    videoList[index].token = token;
    videoList[index].trans = true;
    videoList[index].progress = 0;
    videoList[index].tranFunc = transCode({
      transOptions:{
        inFileName:name,
        token:token,
        inFileMd5:md5
      },
      transSuccess:(val)=>{
        const {videoList} = this.state;
        this.getVideoDetail(md5,index)
        videoList[index].isfinished = true;
        videoList[index].url = val;
        this.showStartTimes(token)
        this.setState({
          videoList:videoList,
          showStar:true
        })
      },
      transFail: (val)=>{
        messageBox(val)
      },
      transProgress:(val)=>{
        const {videoList} = this.state;
        videoList[index].progress = val;
        this.setState({videoList})
      }
    })
    this.setState({
      videoList
    })
  }
  uploadTimeOut=(index)=>{
    let {videoList} = this.state;
    videoList[index]=null;
    this.setState({
      videoList,
    })
    messageBox('Time Out!')
  }
  /**获取视频信息**/
  getVideoDetail=(md5,index)=>{
    httpRequest({
      url:api.qureyMeidiaInfo,
      data:{
        MD5:md5
      }
    }).done(res=>{
      let {videoList} = this.state;
      let name = videoList[index].fileName;
      let newName = name.slice(0,name.lastIndexOf('.')) + '.mp4';
      videoList[index].fileName = newName;
      videoList[index].width = res.width||'';
      videoList[index].height = res.height||''
      this.setState({
        videoList
      })
    }).fail(()=>{
      messageBox(window.intl.get('获取视频信息失败,请重新上传！'));
    })
  };
  /**删除视频***/
  delfile=(index)=>{
    this.setState({
      comfirmDialog:true,//弹窗
      dialogMsg:window.intl.get("确认要取消此文件么？"),//弹窗描述
      currIndex:index,//当前点击的视频序号
    })
  }
  /**确定删除视频**/
  delectVideo=()=>{
    const {videoList,currIndex} = this.state;
    if (videoList[currIndex]&&videoList[currIndex].tranFunc){
      videoList[currIndex].tranFunc.stopTransCode();
    }
    videoList[currIndex]=null
    let realList = [];
    for (let i in videoList){
      if (videoList[i]){
        realList.push(videoList[i])
      }
    }
    if (realList.length<1){
      this.props.backPage()
    }
    this.setState({
      videoList,
      comfirmDialog:false
    })
  }

  /**下载单个视频**/
  downlodeSingle=(item)=>{
    this.downVideo(item.url,item.token)
  }
  /**下载多个视频**/
  downloadMuli=()=>{
    const {videoList} = this.state;
    let tokenList =[],dataList=[];
    for (let i in videoList) {
      if (videoList[i]&&videoList[i].url){
        tokenList.push(videoList[i].token);
        dataList.push(videoList[i].url||'')
      }
    }
    if (tokenList.length<1||dataList.length<1){
      messageBox('Just a moment, please.')
      return
    }
    this.downVideo(dataList,tokenList)
  }
  /**下载视频**/
  downVideo=(data,token)=>{
    window.gtag&&window.gtag('event', 'click', {'event_category': 'transcoding_download', 'event_label': 'transcoding'})
    httpRequest({
      url : api.downloadVideo,
      dataType : 'json',
      type : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      data : {
        path : data,
        trans_type:1,
        up_token:token
      }
    }).done((res)=>{
      if(res.code /1 === 0){
        window.location.href = res.data||''
      }
    }).fail(()=>{
      messageBox(window.intl.get('下载失败'))
    })
  }

  /**上传完回调**/
  uploadBack=(uptoken)=>{
    httpRequest({
      url:api.up_end,
      type:'POST',
      data:{
        trans_type:1,
        up_token:uptoken
      }
    }).done(res=>{}).fail(()=>{})
  }
  showStartTimes=(token)=>{
    // console.log(token)
    httpRequest({
      url: api.starTimes,
      data: {
        trans_type: '1',
        up_token: token||''
      }
    }).done((res) => {
      // console.log('打星记录成功')
    })
  }
  readyUpload=()=>{
    let {readyList,videoList} = this.state;
    if (readyList.length<1){
      this.setState({
        canUpload:true
      })
    } else {
      videoList.push(readyList[0]);
      readyList.shift();
      this.setState({
        readyList,
        videoList
      })
    }
  }
  render() {
    const {videoList , comfirmDialog ,dialogMsg ,tipsDialog ,tipsMsg ,
      startToken ,showStar ,readyList } = this.state;
    return (
      <div className="convert-deal">
        <div className='deal-box'>
          <div className='main-box'>
            <div className='deal-header'>
              <input type="file"
                     ref='cfs'
                     accept='video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*'
              onChange={this.chooseFile}/>
              <p onClick={this.ClickChoose}>ADD MORE FILES</p>
            </div>
            <ul className='deal-body'>
              {videoList.map((item,index)=>{
                if (!item){return}
                return  <li className='video-item' key={item.fileName+index}>
                  <div className='left-box'>
                    { item.isfinished ?
                      <span className='after-icon icon'></span>
                      :
                      <span className='before-icon icon'></span>
                    }
                    <span className='files-name'>{item.fileName}</span>
                  </div>
                  <div className='center-box'>{(item.size/1024/1024).toFixed(2)}M</div>
                  <div className='right-box'>
                    {item.isfinished ?
                      <div className='finishTips'>
                        <span>{item.width}*{item.height}</span>
                        <p onClick={this.downlodeSingle.bind(this,item)}> </p>
                      </div>
                      :
                      <div className='progress-box'>
                        <span>
                          {item.trans ?
                            "Converting" :
                            "uploading"
                          }
                        </span>
                        <div className='progress' style={{width:item.progress+"%"}}>
                          <span>
                             {item.trans ?
                               "Converting" :
                               "uploading"
                             }
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                  <span className='closeIcon' onClick={this.delfile.bind(this,index)}></span>
                  <Upload
                    isvip={true}
                    data={{item:item.file,index:index}}
                    accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                    project='converter'
                    className='removeWater'
                    autoUpload={true}
                    readyUpload = {this.readyUpload}
                    onProgress={this.UploadProgress}
                    onSuccess={this.UploadSuccess}
                    onTimeOut = {this.uploadTimeOut}
                  />
                </li>
              })
              }
            </ul>
            <ul className='deal-body'>
              {readyList.map((item,index)=>{
                if (!item){return}
                return  <li className='video-item' key={item.fileName+index}>
                  <div className='left-box'>
                    <span className='before-icon icon'></span>
                    <span className='files-name'>{item.fileName}</span>
                  </div>
                  <div className='center-box'>{(item.size/1024/1024).toFixed(2)}M</div>
                  <div className='right-box'>
                    <div className='progress-box'>
                      <span>uploading</span>
                      <div className='progress' style={{width:'0'}}>
                        <span>uploading</span>
                      </div>
                    </div>
                  </div>
                  <span className='closeIcon'></span>
                </li>
              })
              }
            </ul>
            <div className='deal-footer'>
              <button onClick={this.downloadMuli}>DOWLOAD ALL</button>
            </div>
          </div>
        </div>

        { comfirmDialog ?
          <Comfirm
            okCallBack={this.delectVideo}
            cancelCallBack={()=>{this.setState({comfirmDialog:false})}}
            msg={dialogMsg}
          />
          :""
        }
        {tipsDialog?
          <Comfirm
            msg={tipsMsg}
            okbtnName={window.intl.get('取消')}
            cancelBtnName={window.intl.get('去了解1')}
            cancelCallBack={()=>{window.open('/pay/ct')}}
            okCallBack={()=>{this.setState({tipsDialog:false})}}
          />
          :""}
        {showStar ? <Grade token={startToken} /> : ''}
      </div>
    )
  }
}