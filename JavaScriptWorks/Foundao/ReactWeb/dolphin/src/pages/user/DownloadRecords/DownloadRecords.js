import React, { Component } from 'react';
import './DownloadRecords.scss'
import DownloadRecord from './DownloadRecord/DownloadRecord'
const date = require('@/assets/images/date_icon@2x.png')

class DownloadRecords extends Component {

  changeTime = (millinSeconds) => {
    let date = new Date(millinSeconds)
    let hour = '0'
    let PM_AM = 'PM'
    let day = 'Monday'
    let mounth = 'January'
    let shortMounthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
    let mounthArr = ['January','February','March','April','May','June','July','August','September','October','November','December']
    let week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    let shortWeek = ['Mon','Tues','Wed','Thu','Fri','Sat','Sun']
    let arr = date.toString().split(' ');
    let time = arr[4].split(':')
    for(let i=0;i<12;i++){
      if(arr[1] === shortMounthArr[i]){
        mounth = mounthArr[i]
      }
    }
    for(let j=0;j<7;j++){
      if(arr[0] === shortWeek[j]){
        day = week[j]
      }
    }
    hour = time[0]
    hour >= 12 ? PM_AM = 'AM' : PM_AM = 'PM'

    return hour+PM_AM+' '+day+' '+arr[2]+mounth//4PM Friday 22March
  }

  showToast = (text,openedWindow) => {
    this.props.showToast(text,openedWindow)
  }

  render () {
    const { data,record_date } = this.props
    return (
      <div className='download_records'>
        <div className='record_date'>
          <img className='record_date_img' alt='date' src={date}></img>
          {this.changeTime(record_date)}
        </div>
        <div className='record_file'>
          {data.rows.map((item,index) => {
            return <DownloadRecord key={index} data={item} showToast={this.showToast} />
          })}
          {/* <DownloadRecord fileName='VIDEO345' />
          <DownloadRecord fileName='family video' />
          <DownloadRecord fileName='18107943186' />
          <DownloadRecord fileName='Savanah Wieg…' />
          <DownloadRecord fileName='Dena Hagenes' />
          <DownloadRecord fileName='Dena Hagenes' /> */}
        </div>
      </div>
    )
  }
}

export default DownloadRecords