import React, { Component } from 'react';
import './DownloadRecords.scss'
import DownloadRecord from './DownloadRecord/DownloadRecord'
const date = require('@/assets/images/date_icon@2x.png')

class DownloadRecords extends Component {
  render () {
    const { record_date } = this.props
    return (
      <div className='download_records'>
        <div className='record_date'>
          <img className='record_date_img' alt='date' src={date}></img>
          {record_date}
        </div>
        <div className='record_file'>
          <DownloadRecord fileName='VIDEO345' />
          <DownloadRecord fileName='family video' />
          <DownloadRecord fileName='18107943186' />
          <DownloadRecord fileName='Savanah Wieg…' />
          <DownloadRecord fileName='Dena Hagenes' />
          <DownloadRecord fileName='Dena Hagenes' />
        </div>
      </div>
    )
  }
}

export default DownloadRecords