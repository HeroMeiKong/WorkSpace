import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './user.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
//pc端组件
import Header from '@/components/Header/Header'
import BottomBar from '@/components/BottomBar/BottomBar'
import DownloadRecords from './DownloadRecords/DownloadRecords'
import Loading from '@/components/Loading/Loading'
//app端组件
import Menu from '@/components/App/Menu/Menu'

class User extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      newRecords: [],
      records: [],
    }
  }

  componentDidMount(){
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
          alert(res.msg)
        }
      }).fail(res => {
        alert('网络异常请刷新页面')
      })
    } else {
      alert('未登录')
    }
  }

  backHome = () => {
    window.location.href = api.return_url
  }

  updateData = (arr) => {
    const length = arr.length
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
  updateRecords = (arr) => {
    if(arr){
      const length = arr.length
      for(let i=0;i<length;i++){

      }
    } else {
      alert('获取数据失败！')
    }
  }

  updateCapacity = () => {
    let capacity = tools.getCapacity_storage().capacity/(1024*1024) || 0
    let used_capacity = tools.getCapacity_storage().used_capacity/(1024*1024) || 0
    const isZero = used_capacity
    let percent = 0
    if(used_capacity === 0){
      percent = 0
    } else {
      percent = used_capacity/capacity
    }
    switch (capacity>=1000) {
      case true:
        capacity = (capacity/1000).toFixed(1) + 'T'
        break;
      default:
        capacity = capacity.toFixed(1) + 'G'
        break;
    }
    switch (used_capacity>=1000) {
      case true:
      used_capacity = (used_capacity/1000).toFixed(1) + 'T'
        break;
      default:
      used_capacity = used_capacity.toFixed(1) + 'G'
        break;
    }
    if(isZero === 0) {used_capacity = '0G'}
    return {capacity ,used_capacity, percent}
  }

  render () {
    const { isLoading, records } = this.state
    const {capacity ,used_capacity, percent} = this.updateCapacity()
    if(!tools.getUserData_storage().token){this.backHome()}
    return(
      <div id='wrapper' className='wrapper'>
        <div className='backcolor' />
        {isLoading ? <Loading /> : ''}
        <Header />
        <Menu />
        <div className='wrapper_content'>
          <div className='content'>
            <div className='myplan'>
              <h1>MY PLAN</h1>
              <div className='line'></div>
              <h2>Correct Plan：{capacity}</h2>
              <p>Membership Capacity</p>
              <div className='progress'>
                <div className='used' style={{width: percent+'%'}}></div>
              </div>
              <p>{used_capacity} / {capacity}</p>
              <div className='upgrade'><Link to='./purchase'>Upgrade</Link></div>
            </div>
            <div className='myplan'>
              <h1>MY FILES</h1>
              <div className='line'></div>
              {records.map((item,index) => {
                return <DownloadRecords key={index} data={item} record_date={item.date} />
              })}
              {/* <DownloadRecords record_date='4PM Friday 22March'/>
              <DownloadRecords record_date='11AM Thursday 21March'/> */}
            </div>
          </div>
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default User