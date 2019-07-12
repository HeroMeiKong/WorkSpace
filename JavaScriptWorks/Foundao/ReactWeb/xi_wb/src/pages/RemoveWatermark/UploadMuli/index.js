import React, { Component,Fragment } from 'react'
import './index.scss'
import {withRouter} from 'react-router-dom';
import Upload from '@/components/MuliUpload/index';
import api from  '@/API/api';
import messageBox from '@/utils/messageBox';
import transCode  from  '@/utils/transCode';
import tools from '@/utils/tool';
import httpRequest from  '@/utils/httpRequest';
import defaultImg from '@/assets/removewatermark/default_cover.png';
import Comfirm from '@/components/Comfirm/index';
class UploadMuli extends Component {
  constructor(props){
    super(props)
    this.state = {
      chooseFiles:[],
      alertMsg: window.intl.get('请重新选择文件！'),
      alertDialog:false,
      isVip:true,//是否是vip
      uploadSuccess:0,//上传成功的个数
      getVipDialog:false,
      delCount:0
    }
  }
  componentWillMount() {
    let {chooseFiles} = this.props;
    const {isVip} = this.state;
    let files=[];
    for (let i in chooseFiles){
      if(!chooseFiles[i]){return}
      if (files.length>10){
        messageBox(window.intl.get('最多上传10个视频！'));
        return
      }
      if (isVip){
        if (chooseFiles[i].size >1024*1024*1024 ){
          messageBox(window.intl.get('最大只能上传1G的视频'))
        }else {
          files.push(chooseFiles[i])
        }
      }else {
        if (chooseFiles[i].size >100*1024*1024 ){
          this.setState({
            getVipDialog:true
          })
          // messageBox('当前仅支持100MB以内的文件，成为会员支持更大容量上传')
        }else {
          files.push(chooseFiles[i])
        }
      }

    }
    this.setState({
      chooseFiles:files||[]
    })
  }
  /**上传文件**/
  uploadfile=()=>{
    window.gtag&& window.gtag('event', 'click', {'event_category': 'remove_upload','event_label': 'remove'})
    this.refs.fileInput.click();
  }
  uploadMuli=(e)=>{
    let files = e.target.files;
    let count = 0;
    const {chooseFiles} = this.state;
    for (let i =0 ;i<chooseFiles.length;i++){
      if (chooseFiles[i]){
        count++
      }
    }
    for (let j =0 ;j < files.length; j++){
      // console.log(j+count+1)
      if (j+count<10){
        chooseFiles.push(files[j]);
      } else {
        messageBox('最多上传10个视频！');
      }
    }
    this.setState({
      chooseFiles
    })
  }
  /**上传进度**/
  UploadProgress = (progress,index)=>{
    const {chooseFiles} = this.state;
    chooseFiles[index].progress = progress;
    this.setState({
      chooseFiles
    })
  };
  UploadSuccess = (file_name,size,g_filemd5,token,index)=>{
    this.uploadBack(token)
    let _this = this;
    const {chooseFiles} = this.state;
    chooseFiles[index].progress = 100;
    this.setState({
      chooseFiles
    });
    let format =file_name.slice(file_name.lastIndexOf('.')+1);
    if (format==='mp4'){
      _this.getVideoUrl(g_filemd5,file_name,index,token);
    } else{
      /**开始转码***/
      chooseFiles[index].trans=true
      _this.setState({
        isTrans:true,
        chooseFiles
      })
      transCode({
        transOptions:{
          inFileName:file_name,
          inFileMd5:g_filemd5
        },
        transSuccess:(res)=>{
          _this.getVideoInfo(g_filemd5,file_name,res,index,token);
        },
        transFail: ()=>{
          // console.log(index)
        },
        transProgress:(progress)=>{
          this.setState({
            isTrans:true,
            uploadPercent:progress*1
          });
        }
      })
    }


  };
  vipTimeOut = (index)=>{
    const {chooseFiles} = this.state;
    chooseFiles.splice(index,1)
    this.setState({
      chooseFiles
    })
  };
  /**删除视频**/
  delVideo=(index)=>{
    let count=0;
    let {chooseFiles,delCount} = this.state;
    delCount++;
    chooseFiles[index]=null;
    for (let i in chooseFiles){
      if (chooseFiles[i]){
        count++
      }
    }
    if (count===0){
      this.setState({
        chooseFiles:[],
        uploadSuccess:0,
        delCount:delCount
      })
    }else{
      this.setState({
        chooseFiles,
        delCount:delCount
      })
    }

  }
  /**获取视频连接**/
  getVideoUrl=(md5,file_name,index,token)=>{
    httpRequest({
      url:api.GetInFilePath,
      dataType: 'text',
      data:{
        MD5:md5
      }
    }).done(res=>{
      this.getVideoInfo(md5,file_name,res,index,token);
    }).fail(()=>{
      messageBox(window.intl.get('获取视频链接失败！'))
    })
  }
  getVideoInfo = (g_filemd5,file_name,url,index,token)=>{
    const {chooseFiles , uploadSuccess} = this.state;
    httpRequest({
      url: api.qureyMeidiaInfo,
      data: {
        MD5: g_filemd5
      }
    }).done((res) => {
      if (res.status / 1 === 0) {
        chooseFiles[index].width= res.width;
        chooseFiles[index].height= res.height;
        chooseFiles[index].duration= res.duration;
        chooseFiles[index].g_filemd5= g_filemd5;
        chooseFiles[index].file_name= file_name;
        chooseFiles[index].url=url;
        chooseFiles[index].left=0;
        chooseFiles[index].right=res.width - 100;
        chooseFiles[index].top=0;
        chooseFiles[index].trans=false
        chooseFiles[index].bottom=res.height -100;
        chooseFiles[index].token = token;
        this.setState({
          chooseFiles,
          uploadSuccess:uploadSuccess+1
        })
      } else {
        messageBox(window.intl.get('此视频已损坏或未完全上传！'))
        this.initUpload()
      }
    }).fail(() => {
      tools.checkNetwork() ? messageBox(window.intl.get('网络出错，请检查您的网络链接!')) : messageBox(window.intl.get('内部服务器错误！'))
      this.initUpload()
    })
  }
  /**回到上一页**/
  goPre=()=>{
    this.props.goPre()
  }
  /**点击开始**/
  StartRemoveWarter=()=>{
    const {chooseFiles} = this.state;
    // console.log(chooseFiles)
    let videoData = [];
    for (let i in chooseFiles){
      if (chooseFiles[i]&&chooseFiles[i].url){
        videoData.push({
          width: chooseFiles[i].width,
          height: chooseFiles[i].height,
          duration: chooseFiles[i].duration,
          g_filemd5: chooseFiles[i].g_filemd5,
          file_name: chooseFiles[i].file_name,
          url:chooseFiles[i].url,
          token:chooseFiles[i].token||'',
          left:0,
          boxwidth:100,
          boxheight:100,
          top:0,
        })
      }
    }
    // console.log(videoData)
    this.props.successMuli(videoData)
  }
  /**上传成功后回调(埋点统计)**/
  /**上传成功后回调(埋点统计)**/
  uploadBack=(uptoken)=>{
    httpRequest({
      url:api.up_end,
      type:'POST',
      data:{
        trans_type:5,
        up_token:uptoken
      }
    }).done(res=>{}).fail(()=>{})
  }
  render() {
    const {chooseFiles ,uploadSuccess,getVipDialog,removeDialog,removeDmsg,delCount} = this.state
    let delNum = 0;
    return (
      <div className='remove_muli'>
        <div className='remove_muli_inner'>
          <div className='main-inner'>
            <div className='inner-header'>
              <button onClick={this.uploadfile}>{window.intl.get('添加文件')}</button>
              <input type="file" accept='video/mp4,video/x-m4v,video/*'
                     ref='fileInput'
                     style={{display:'none'}}
                     multiple={true} onChange={this.uploadMuli}/>
            </div>
            <div className='inner-body'>
              <ul>
                {
                  chooseFiles.map((item,index)=>{
                    if (!item){
                      delNum++
                      return
                    }
                    return <li key={item.name+index}>
                      <Upload
                        isvip={true}
                        data={{item:item,index:index,realIndex:index-uploadSuccess}}
                        accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                        project='rewatermark'
                        className='removeWater'
                        autoUpload={true}
                        onProgress={this.UploadProgress}
                        onSuccess={this.UploadSuccess}
                        onTimeOut = {this.vipTimeOut}
                      />
                      <div className='fileItem'>
                        <p className='file_index'>{ (index-delNum)<9 ?'0'+(index+1-delNum) : (index+1-delNum)}</p>
                        <div className='file_img'>
                          {item.url?
                            <video src={item.url||''} controls={false}> </video>
                            :
                            <Fragment>
                              <img src={defaultImg} alt={window.intl.get("喜视频")}/>
                              <p style={{width:item.progress ? item.progress * 1.2 : 0}}></p>
                            </Fragment>
                          }
                        </div>
                        <p className='fileName'>{item.name||''}</p>
                        {item.trans ?
                          <p className='fileProgress'>{window.intl.get('转码中')}</p>
                          :
                          <p className='fileProgress'>{item.progress||0} %</p>
                        }
                        {true?
                        <p className='closeIcon' onClick={this.delVideo.bind(this,index)}> </p>
                          : ""
                        }
                      </div>
                    </li>
                  })
                }
              </ul>
            </div>
            <div className='inner-footer'>
              <button className='cancel' onClick={()=>this.setState({removeDialog:true,removeDmsg:window.intl.get("是否放弃当前操作，回到去水印首页")})}>{window.intl.get('取 消')}</button>
              <button className='start' onClick={this.StartRemoveWarter}>{window.intl.get('开 始')}</button>
            </div>
          </div>
        </div>
        {getVipDialog ?
          <Comfirm
            msg={window.intl.get('当前仅支持100MB以内的文件，成为会员支持更大容量上传')}
            okbtnName={window.intl.get('取 消')}
            cancelBtnName={ window.intl.get('去了解') }
            cancelCallBack={()=>{this.props.history.push('/mulipay/remove')}}
            okCallBack={()=>this.setState({getVipDialog:false})}
          />
          :""
        }
        {removeDialog ?
          <Comfirm
            msg={removeDmsg}
            cancelCallBack={()=>this.setState({removeDialog:false})}
            okCallBack={this.goPre}
          />
          :""
        }

      </div>
    )
  }
}
export default withRouter(UploadMuli)