import React, { Component } from 'react'
import './user.scss'
import Header from '@/components/Header/Header'
import BottomBar from '@/components/BottomBar/BottomBar'
import DownloadRecords from './DownloadRecords/DownloadRecords'

class User extends Component {
  render () {
    return(
      <div className='wrapper'>
        <Header />
        <div className='wrapper_content'>
          <div className='content'>
            <div className='myplan'>
              <h1>MY PLAN</h1>
              <div className='line'></div>
              <h2>Correct Plan：50G</h2>
              <p>Membership Capacity</p>
              <div className='progress'>
                <div className='used'></div>
              </div>
              <p>38/50G</p>
              <div className='upgrade'>Upgrade</div>
            </div>
            <div className='myplan'>
              <h1>MY FILES</h1>
              <div className='line'></div>
              <DownloadRecords record_date='4PM Friday 22March'/>
              <DownloadRecords record_date='11AM Thursday 21March'/>
            </div>
          </div>
          <BottomBar />
        </div>
      </div>
    )
  }
}

export default User