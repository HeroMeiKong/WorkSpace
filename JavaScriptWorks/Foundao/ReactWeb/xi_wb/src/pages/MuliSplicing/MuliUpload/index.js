/* eslint-disable */
import React, {Component,Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import Upload from '@/components/MuliUpload/index';
import httpRequest from  '@/utils/httpRequest';
// import $ from 'jquery';
import Tool from '@/utils/tool';
import  SortableItem from './Item/index';
import transCode  from  '@/utils/transCode';
import api from  '@/API/api';
import Alert from '@/components/Alert/index';
import Comfirm from '@/components/Comfirm/index';
import './index.scss';
import {login} from '@/redux/models/admin';
import {connect} from "react-redux";
import messageBox from '@/utils/messageBox'

const $ = window.jQuery;
@connect(
  state => ({admin: state.admin}),
  {login}
)
class MuliUpload extends Component {
  constructor (props) {
    super(props);
    this.state={
      dataList:[],//已经上传好的视频数组
      readyList:[],//正在上传或者转码中的视频数组
      isvip:false,//是否是vip
      uploadStatusList:[],//status 1 等待中  2 上传中  3转码中
      realReadList:[],
      showUp:true,//展示上传
      count:0,//失败数量
      showTips:false,
      alertDialog:false,
      alertMsg :'',
      comfirmDialog:false,
      comfirmMsg:''
    }
  }
  componentWillMount() {
    this.setState({
      dataList:this.props.initList||[],
      isvip : this.props.admin.isMuliVip
    })
    if(!window.localStorage.getItem('showUploadTips')){
      window.localStorage.setItem('showUploadTips','xiVideo');
      this.setState({
        showTips:true
      })
    }
  }

  componentDidMount() {

  }

  onSortItems=(list)=>{
    this.setState({
      list
    })
  };
  /**获取视频时长**/
  getVideoTime=(index)=>{
    let _this =this;
    if (this.refs['muliVideo'+index]&& this.refs['muliVideo'+index].duration) {
      let duration = this.refs['muliVideo'+index].duration;
      $(this.refs['muliVideo'+index]).siblings('.itemInfo').find('.videotime').html(Tool.timeModel_zhen(duration))
    }else {
      setTimeout(function () {
        _this.getVideoTime(index)
      },0)
    }
  };
  /**删除视频**/
  delvideo=(index)=>{
    const {dataList,count} = this.state;
    dataList.splice(index,1);
    this.setState({
      dataList,
      count:count+1
    })
  };
  /**多选文件**/
  mliUploadChange=(e)=>{
    let {readyList,isvip,uploadStatusList,dataList ,count} = this.state;
    let limitLength = dataList.length;
    let filesLen = e.target.files.length;//文件数组值
    let realReadList = [];
    for (let i =0 ; i < readyList ; i++){
      if (readyList[i] && readyList[i]!==''){
        realReadList.push(readyList[i])
      }
    }
    // console.log(readyList.length+1,'readyList')
    if (isvip){
      for (let i = 0; i <filesLen; i++){
        // console.log( readyList.length +1 )
        if ( readyList.length+1- count < 10) {
          readyList.push( e.target.files[i]);
          uploadStatusList.push({
            progress:0,
            status:1
          })
        }
      }
      this.setState({
        readyList,
        uploadStatusList,
      });
    } else {
      for (let i = 0; i <filesLen; i++){
        // console.log(e.target.files[i])
        if (e.target.files[i].size > 100*1024*1024) {
          this.setState({
            comfirmDialog:true,
            comfirmMsg : window.intl.get('当前仅支持100MB以内的文件，成为会员支持更大容量上传')
          })
        }
        if (limitLength+readyList.length<5 && e.target.files[i].size<=100*1024*1024) {
          readyList.push( e.target.files[i]);
          uploadStatusList.push({
            progress:0,
            status:1
          })
        }
      }
      this.setState({
        readyList:readyList,
        uploadStatusList:uploadStatusList
      });
    }

  };

  /****----会员上传Start-----****/
  vipUploadProgress = (progress,index)=>{
    let {uploadStatusList}= this.state;
    if (progress<100){
      uploadStatusList[index].status = 2;
      uploadStatusList[index].progress=progress;
    }
    this.setState({
      uploadStatusList
    })
  };
  vipUploadSuccess = (name,size,md5,token,index)=>{
    this.uploadBack(token)
    let  {dataList,readyList} = this.state;
    let format =name.slice(name.lastIndexOf('.')+1);
    if (format==='mp4'){
      httpRequest({
        url:api.GetInFilePath,
        dataType: 'text',
        data:{
          MD5:md5
        }
      }).done(res=>{
        dataList.push({
          link:res,
          name:name,
          md5:md5,
          token:token
        });
        readyList[index]='';
        this.setState({
          dataList,
          readyList
        })
      }).fail(()=>{
        this.setState({
          alertDialog:true,
          alertMsg : window.intl.get('获取视频链接失败！')
        })
      })
    } else{
      transCode({
        transOptions:{
          inFileName:name,
          inFileMd5:md5
        },
        transSuccess:(res)=>{
          let {dataList}= this.state;
          // console.log(dataList);
          // return
          if (dataList[dataList.length-1] && dataList[dataList.length-1].link === res){
            return
          } else {
            readyList[index]='';
            dataList.push({
              link: res,
              name: name,
              md5: md5,
              token:token
            });
          }
          this.setState({
            dataList,
            readyList
          });
        },
        transFail: ()=>{
          this.setState({
            alertDialog:true,
            alertMsg : window.intl.get('转码失败，请重试！')
          })
        },
        transProgress:(progress)=>{
          let {uploadStatusList}= this.state;
          if (progress<100){
            uploadStatusList[index].status = 3;
            uploadStatusList[index].progress=progress;
          }
          this.setState({
            uploadStatusList
          });

        }
      })
    }
  };
  vipTimeOut = (index)=>{
    // console.log(index)
    let  {readyList ,count} = this.state;
    readyList[index]='';
    this.setState({
      readyList,
      count:count+1
    });
  };
  /****----会员上传End----****/

  /****非会员Start****/
  uploadProgress=(val,index)=>{
    let {uploadStatusList}= this.state;
    if (val<100){
      uploadStatusList[index].status = 2;
      uploadStatusList[index].progress=val;
    }
    this.setState({
      uploadStatusList
    })
  };
  uploadSuccess=(name,size,md5,token,index)=>{
    this.uploadBack(token)
    let {uploadStatusList}= this.state;
    uploadStatusList[index].status = 2;
    uploadStatusList[index].progress=100;
    this.setState({
      uploadStatusList,
    });
    let  {dataList,readyList} = this.state;
    let format =name.slice(name.lastIndexOf('.')+1);
    if (format==='mp4'){
      httpRequest({
        url:api.GetInFilePath,
        dataType: 'text',
        data:{
          MD5:md5
        }
      }).done(res=>{
        dataList.push({
          link:res,
          name:name,
          md5:md5,
          token:token
        });
        readyList.splice(0,1);
        this.setState({
          dataList,
          readyList,
        })
      }).fail(()=>{
        this.setState({
          alertDialog:true,
          alertMsg : window.intl.get('获取视频链接失败！')
        })
      })
    } else{
      transCode({
        transOptions:{
          inFileName:name,
          inFileMd5:md5
        },
        transSuccess:(res)=>{
          let {dataList,count}= this.state;
          if (dataList[dataList.length-1].link === res){
            return
          } else {
            readyList.splice(0,1);
            dataList.push({
              link: res,
              name: name,
              md5: md5,
              token:token
            });
          }
          this.setState({
            dataList,
            readyList,
          });
        },
        transFail: ()=>{

        },
        transProgress:(progress)=>{
          let {uploadStatusList}= this.state;
          if (progress<100){
            uploadStatusList[index].status = 3;
            uploadStatusList[index].progress=progress;
          }
          this.setState({
            uploadStatusList
          });
          // console.log(progress,'progress');
          // console.log(index,'index')
        }
      })
    }
  };
  timeOut=()=>{
    // console.log(123)
    const {readyList}= this.state;
    readyList.splice(0,1);
    this.setState({
      readyList
    })
  };
  /****非会员End****/

  /***开始合并***/
  gotoSplicing=()=>{
    const {dataList} = this.state;
    if (dataList.length<2){
      messageBox(window.intl.get('视频不能少于两个，请继续上传！'));
      return
    }
    this.props.muliUploadCallback(dataList);
  }


  cancelCallBack=()=>{
    this.setState({
      alertDialog:false
    })
  };
  /***成为Vip***/
  gotoMuliVip=(e)=>{
    e.stopPropagation();
    e.preventDefault();
    this.props.history.push('/mulipay/muli');
  };
  /**上传成功后回调(埋点统计)**/
  uploadBack=(uptoken)=>{
    httpRequest({
      url:api.up_end,
      type:'POST',
      data:{
        trans_type:2,
        up_token:uptoken
      }
    }).done(res=>{}).fail(()=>{})
  }
  render() {
    const { dataList , readyList ,isvip , uploadStatusList ,showUp,count ,alertDialog,alertMsg,
      showTips,comfirmDialog,comfirmMsg
    } = this.state;
    return (
      <div className='muliUpload-box'>
        <div className='muliupload-inner'>
          <div className='pagename'>
            <h2>{window.intl.get('喜拼接')}</h2>
            <h3>{window.intl.get('随时随地创作/编辑视频从未如此方便')}</h3>
          </div>
          <div className='pagegovip' onClick={this.gotoMuliVip}>
            <p>{window.intl.get('即刻了解喜+会员')}</p>
            <div className='line'></div>
            <p>{window.intl.get('更多权益 等待你解锁')}</p>
          </div>
          <div className='mu-box'>
            <ul>
              {
                /**上传完成的 可拖动的**/
                dataList.map((item, i) => {
                  return <SortableItem
                    key={i}
                    onSortItems={this.onSortItems}
                    items={dataList}
                    sortId={i}>
                    <video src={item.link} ref={'muliVideo'+i} controls={false}> </video>
                    <div className='itemInfo'>
                      <p className='videoName'>{item.name}</p>
                      <div className='delVideo' onClick={this.delvideo.bind(this,i)}>{window.intl.get('删除')}</div>
                      <p className='videotime'>{this.getVideoTime(i)}</p>
                    </div>
                  </SortableItem>
                })
              }
              {
                isvip ?
                  <Fragment>
                    {/**会员上传**/}
                    {
                      readyList.map((item,i)=>{
                        if(item===''){return false}//判断掉已上传的
                        return <li key={'readyItem'+i}>
                          <p className='progressNum'>{uploadStatusList[i] ? uploadStatusList[i].progress+'%':''}</p>
                          <div className='progress-out'>
                            <p className='progress-inner' style={{ width:uploadStatusList[i].progress * 140/100+'px'}}></p>
                          </div>
                          <p className='tips'>{uploadStatusList[i]&&uploadStatusList[i].status===1 ? window.intl.get("等待中")
                            :uploadStatusList[i]&&uploadStatusList[i].status===2 ? window.intl.get('上传中')
                              :uploadStatusList[i]&&uploadStatusList[i].status===3 ? window.intl.get('转码中')
                                :''}
                          </p>
                          <Upload
                            isvip={true}
                            data={{item:item,index:i}}
                            style={{display: 'none'}}
                            accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                            project='muliSplicing'
                            className='Muli'
                            autoUpload={true}
                            onProgress={this.vipUploadProgress}
                            onSuccess={this.vipUploadSuccess}
                            onTimeOut = {this.vipTimeOut}
                          />
                        </li>
                      })
                    }
                  </Fragment>
                  :

                  <Fragment>
                    {/**非会员上传**/}
                    {
                      readyList.map((item,i)=>{
                        return <li key={'readyItem'+i}>
                          <p className='progressNum'>{uploadStatusList[i] ? uploadStatusList[i].progress+'%':''}</p>
                          <div className='progress-out'>
                            <p className='progress-inner' style={{ width:uploadStatusList[i].progress * 140/100+'px'}}></p>
                          </div>
                          <p className='tips'>{uploadStatusList[i]&&uploadStatusList[i].status===1 ? window.intl.get("等待中")
                            :uploadStatusList[i]&&uploadStatusList[i].status===2 ? window.intl.get('上传中')
                              :uploadStatusList[i]&&uploadStatusList[i].status===3 ? window.intl.get('转码中')
                                :''}
                          </p>
                        </li>
                      })
                    }
                    <Upload
                      style={{display: 'none'}}
                      readyList={readyList}
                      accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                      project='muliSplicing'
                      className='Muli'
                      autoUpload={true}
                      onProgress={this.uploadProgress}
                      onSuccess={this.uploadSuccess}
                      onTimeOut = {this.timeOut}
                    />
                  </Fragment>
              }
              {readyList.length-count<9?
              <li className={ readyList.length+dataList.length<5 || isvip ?'lastItem':'lastItem over'}
                  onClick={()=>{
                    if (readyList.length+dataList.length>=5 && isvip ===false){
                      return
                    }else {
                      // window.gtag&& window.gtag('event', 'click', {'event_category': 'upload','event_label': 'video'})
                      this.refs.mulupload.click();
                    }
                  }}>
                <input type="file" ref='mulupload'
                       accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
                       multiple={true}
                       onChange={this.mliUploadChange}
                       style={{display:'none'}}/>
                <div className='addIcon-box'> </div>
                <p> </p>
                { isvip ?
                  <p> {window.intl.get('(最多支持十个视频上传)')}</p>
                  :
                  <p>
                    {readyList.length+dataList.length<5?
                      window.intl.get("（最多支持五个视频上传）")
                      :
                      window.intl.get("我要上传更多视频")
                    }
                  </p>}
                {isvip?"":
                  <div className='getVip'>
                    <a onClick={this.gotoMuliVip}>{window.intl.get('解锁更多视频上传')}</a>
                  </div>
                }
              </li>
                :""
              }
            </ul>
            <div className='mulisplice-box'>
              <div className='number-tips'>{dataList.length}/{isvip?'10':'5'}</div>
              <button onClick={this.gotoSplicing} >{window.intl.get('开始合并')}</button>
            </div>
          </div>
        </div>

        {showTips?
            <div className='upload-tips' onClick={()=>this.setState({showTips:false})}> </div> : ""}
        {alertDialog ?
          <Alert
            msg={ alertMsg||''}
            cancelCallBack={this.cancelCallBack}
          />
          :''
        }
        {comfirmDialog?
          <Comfirm
            msg={comfirmMsg}
            okbtnName={window.intl.get('取 消')}
            cancelBtnName={ window.intl.get('去了解') }
            cancelCallBack={()=>{this.props.history.push('/mulipay/muli')}}
            okCallBack={()=>this.setState({comfirmDialog:false})}
          />
          :""
        }
      </div>
    );
  }
}

export default withRouter(MuliUpload);
