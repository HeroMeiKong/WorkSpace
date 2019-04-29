import React, { Component } from 'react'
import './user.scss'
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
    }
  }
  updateCapacity = () => {
    let capacity = tools.getCapacity_storage().capacity/(1024*1024) || 0
    let used_capacity = tools.getCapacity_storage().used_capacity/(1024*1024) || 0
    let percent = 0
    if(used_capacity === 0){
      percent = 0
    } else {
      percent = used_capacity/capacity
    }
    switch (capacity>=1024) {
      case true:
        capacity = capacity/1024 + 'T'
        break;
      default:
        capacity = capacity + 'T'
        break;
    }
    console.log(capacity)
    return {capacity ,used_capacity, percent}
  }
  render () {
    const { isLoading } = this.state
    const {capacity ,used_capacity, percent} = this.updateCapacity()
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