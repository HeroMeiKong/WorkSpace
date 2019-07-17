import React, {Component} from 'react'
import './index.scss'
import messageBox from '@/utils/messageBox';
import Comfirm from '@/components/Comfirm/index'
export default class Convert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vip_type:0,
      comformDialog:false,
      comformMsg:""
    }
  }
  componentDidMount() {
    const {vip_type} = this.props;
    this.setState({
      vip_type
    })
  }
  /**点击文件**/
  clickInput=()=>{
    this.refs.convertmulifile.click();
  }
  chooseFile=(e)=>{
    const {vip_type} = this.props;
    window.gtag&&window.gtag('event', 'click', {'event_category': 'transcoding_upload', 'event_label': 'transcoding'})
    let files = e.target.files;
    let fileList=[]
    for (let i=0;i<files.length ; i++){
      if (vip_type===0){
        if (!files[i]||(files[i].size&&files[i].size/1024/1024>500)){
          this.setState({
            comformDialog:true,
            comformMsg:window.intl.get("您的视频超过500M，我们为您推荐更加快捷的转码服务")
          })
          this.refs.convertmulifile.value='';
          return
        }
      } else if (vip_type!==4) {
        if (!files[i]||(files[i].size&&files[i].size/1024/1024>10240)){
          this.setState({
            comformDialog:true,
            comformMsg:window.intl.get("您的视频超过10G，建议升级至终极版套餐享受极速转码")
          })
          this.refs.convertmulifile.value='';
          return
        }
      }
      fileList.push({
        file:files[i],
        status:1,
        size:files[i].size||0,
        fileName:files[i].name||'',
        trans:false,
        isfinished:false,
        progress:0
      })
    }
    this.props.SuccessUpload(fileList);
  }
  render() {
    const {comformDialog,comformMsg} = this.state;
    return (
      <div className="convert-before">
        <h2 className='title'>MP4 Converter</h2>
        <h3 className='futitle'>Convert video files of any formats online</h3>
        <button className='chooseFile' onClick={this.clickInput}>CHOOSE FILE</button>
        <p className='desc'>SELECT OR DRAG & DROP FILES TO CONVERT</p>
        <input type="file" accept="video/mp4, video/x-m4v, video/3gpp, .mkv, .rm, .rmvb, video/*"
               style={{display:'none'}}
               onChange={this.chooseFile}
               ref='convertmulifile'/>
        {comformDialog?
          <Comfirm
            msg={comformMsg}
            okbtnName={window.intl.get('取消')}
            cancelBtnName={window.intl.get('去了解1')}
            cancelCallBack={()=>{window.open('/pay/ct')}}
            okCallBack={()=>{this.setState({comformDialog:false})}}
          />
          :""}
      </div>
    )
  }
}