import React, { Component } from 'react';
import './MyFileRecords.scss'
import MyFileRecord from './MyFileRecord/MyFileRecord'
const date = require('@/assets/images/date_icon@2x.png')

class MyFileRecords extends Component {

  //重新定义时间格式
  changeTime = (millinSeconds) => {
    let date = new Date(millinSeconds)
    let hour = '0'
    let PM_AM = 'PM'
    let day = 'Tuesday'
    let mounth = 'January'
    let shortMounthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
    let mounthArr = ['January','February','March','April','May','June','July','August','September','October','November','December']
    let week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    let shortWeek = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
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
    const { data, record_date, show } = this.props
    return (
      <div className='myfile_download_records' style={{display: show ? 'flex' : 'none'}}>
        <div className='record_date'>
          <img className='record_date_img' alt='date' src={date}></img>
          {this.changeTime(record_date)}
        </div>
        <div className='record_file'>
          {data.rows.map((item,index) => {
            return <MyFileRecord key={index} data={item} showToast={this.showToast} />
          })}
        </div>
      </div>
    )
  }
}

export default MyFileRecords