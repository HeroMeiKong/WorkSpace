import React, { Component } from 'react'
import './index.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import $ from 'jquery'
//pc端组件
import Header from '@/components/Header/Header'
import DropFile from '@/components/DropFile/DropFile'
import DownloadLists from '@/components/DownloadLists/DownloadLists'
import MyFileRecords from '@/components/MyFileRecords/MyFileRecords'
// import BottomFold from '@/components/BottomFold/BottomFold'
import BottomContents from '@/components/BottomContents/BottomContents'
import BottomBar from '@/components/BottomBar/BottomBar'
import Upload from '@/components/Upload'
import Loading from '@/components/Loading/Loading'
import Toast from '@/components/Toast/Toast'

class Index extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      isToast: false,
      toast_text: 'Error!',//提示内容
      index: 0,//当前第几个，为了避免重复，加大md5范围
      percent: 0,//进度
      uploadStart: false,//上传成功
      isType: false,//是否是支持格式
      uploadSuccessList: [],//上传成功列表
      openedWindow: null,//打开新窗口
      newRecords: [],//用户转码记录
      records: [],//转码记录，一天计算
      open_myfile: false,//是否打开myfile
    }
  }

  componentDidMount() {
    this.appendChildScript()//添加统计script
    if(tools.getUserData_storage().token){
      httpRequest({
        type: 'POST',
        url: api.get_lists,
        data: {
          token: tools.getUserData_storage().token
        }
      }).done(res => {
        if(res.code === '0'){
          this.setState({
            newRecords: res.data.rows,
            records: this.updateData(res.data.rows)
          })
        } else {
          this.showToast(res.msg)
        }
      }).fail(res => {
        this.showToast('Something wrong with your connection, please refresh this page!')
      })
    }
  }

  //规范化时间
  updateData = (arr) => {
    if(arr){
      const length = arr.length
      if(length === 0){
        return 0
      } else {
        let newArr = [{date: arr[0].startime*1000, rows: [arr[0]]}]
        let j = 0
        for(let i=1;i<length;i++){
          if(Math.abs(arr[i].startime - arr[i-1].startime) > 3600){
            newArr.push({date: '', rows: []})
            j++
            newArr[j].date = arr[i].startime*1000
            newArr[j].rows.push(arr[i])
          } else {
            newArr[j].rows.push(arr[i])
          }
        }
        return newArr
      }
    } else {
      this.showToast('Something wrong with your connection, please try again later!')
    }
  }

  //添加统计script
  appendChildScript = () => {
    const pv = document.getElementById('pv')
    if(pv){
      pv.parentNode.removeChild(pv)
    }
    const api_url = api.statistics
    const script_dom = '<script id="pv" src="' + api_url + '" type="text/javascript"></script>'
    $('body').append(script_dom)
  }

  //上传成功
  uploadSuccess = (fileName, fileSize, fileMd5, token)=> {
    if(this.state.isType){
      httpRequest({
        url: api.qureyMeidiaInfo,
        data: {
          MD5: fileMd5
        },
      }).done(response => {
        if(response.status >= 0){
          this.state.uploadSuccessList.unshift({
            fileName,
            fileSize,
            fileMd5: fileMd5+this.state.index,
            token,
            videoInfo: response || {width: 0,height: 0},
            isTransing: -1,//100:转码成功,0等待转码，-1初始，-2失败
          })
          this.setState({
            index: this.state.index+1,
            uploadSuccessList: this.state.uploadSuccessList
          })
        } else {
          this.showToast(response.err_str)
        }
      }).fail(res => {
        this.showToast('connect server fail, please try to upload again!')
        this.setState({
          uploadStart: false,
          isType: false,
        })
      })
    } else {
      this.showToast('File upload failed!')
    }
  }

  // 上传改变
  uploadChange = (e) => {
    const arr = e.name.split('.')
    const type = arr[arr.length-1].toLowerCase()
    if(type === 'mp4' || type === 'ts' || type === 'avi' || type === 'mkv' || type === 'rmvb' || type === 'mov' || type === 'flv' || type === '3gp' || type === 'asf' || type === 'wmv'){
      this.setState({
        uploadStart: true,
        isType: true,
      })
      return true
    } else {
      // this.showToast('This media format is not supported!Yon can use mp4、ts、avi、mkv、rmvb、mov、flv、3gp、asf、wmv!')
      this.setState({
        uploadStart: false,
        isType: false,
      })
      return false
    }
  }

  // 上传报错
  uploadError = (msg) => {
    this.showToast(msg)
    this.setState({
      uploadStart: false,
      isType: false,
    })
  }

  // 上传进程
  uploadProgress = (percent) => {
    this.setState({
      percent
    })
    if(percent/1 === 100){
      let time = setTimeout(() => {
        this.setState({
          uploadStart: false
        })
        clearTimeout(time)
      },50000)
    }
  }

  // 删除下载记录
  deleteDownloadRecord = (el) => {
    const arr = this.state.uploadSuccessList
    for(let i=0;i<this.state.uploadSuccessList.length;i++){
      if(arr[i].fileMd5 === el){
        arr.splice(i,1)
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }

  // 修改转码状态
  startCovert = (el,state) => {
    const arr = this.state.uploadSuccessList
    for(let i=0;i<this.state.uploadSuccessList.length;i++){
      if(arr[i].fileMd5 === el){
        arr[i].isTransing = state
        this.setState({
          uploadSuccessList: arr,
        })
      }
    }
  }

  showToast = (toast_text,openedWindow) => {
    this.setState({
      isToast: true,
      toast_text,
      openedWindow
    })
  }

  hiddenToast = () => {
    this.setState({
      isToast: false,
      openedWindow: null
    })
    if(this.state.openedWindow){
      window.open('about:blank').location.href = this.state.openedWindow
    }
  }

  // 点击打开myfile
  change_myfile = () => {
    this.setState({
      open_myfile: !this.state.open_myfile
    })
  }

  render () {
    const { percent, uploadStart, uploadSuccessList, isLoading, isToast, toast_text, newRecords, records, open_myfile } = this.state
    return(
      <div id='wrapper' className='wrapper'>
        <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        {isToast ? <Toast callBack={this.hiddenToast} text={toast_text} /> : ''}
        <Header showToast={this.showToast} records={newRecords} />
        <div className='wrapper_content'>
          <div className='content index_div padding_inner'>
            <div className='content_inner'>
              <h1 className='content_header'>DOLPHIN MP4 CONVERTER</h1>
              <h2 className='content_title'>Convert ANYTHING to Mp4 seamlessly, smoothly and speedily!</h2>
              <Upload disabled={false}
                      accept='video/mp4,video/x-m4v,video/*'
                      onChange={this.uploadChange}
                      onProgress={this.uploadProgress}
                      onSuccess={this.uploadSuccess}
                      onError={this.uploadError}>
                <DropFile start={uploadStart} progress={percent} src={'path1'} />
              </Upload>
              <DownloadLists uploadSuccessList={uploadSuccessList} callBack={this.deleteDownloadRecord}
              startCovert={this.startCovert} showToast={this.showToast} />
            </div>
          </div>
          {/* <BottomFold /> */}
          {newRecords.length === 0
            ? <BottomContents />
            : <div className='myfiles_box'>
                <div className='myfiles' onClick={this.change_myfile}>
                  <div className='myfiles_text'>MY FILES</div>
                  <div className={open_myfile ? 'open_file' : 'close_file'}></div>
                </div>
                {records.map((item,index) => {
                return <MyFileRecords key={index} data={item} record_date={item.date}  showToast={this.showToast} show={open_myfile} />
                })}
              </div>
          }
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default Index