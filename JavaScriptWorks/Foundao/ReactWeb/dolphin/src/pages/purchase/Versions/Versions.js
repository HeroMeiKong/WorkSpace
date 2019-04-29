import React, { Component } from 'react';
import './Versions.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import Version from './Version/Version'

class Versions extends Component {
  constructor(){
    super()
    this.state = {
      versions: [],
      reset_versions: []
    }
  }

  componentDidMount() {
    this.getVersions()
  }

  getVersions = () => {
    httpRequest({
      url: api.getGoods,
    }).done(res => {
      if(res.code === '0'){
        this.setState({
          versions: res.data,
          reset_versions: this.resetValue(res.data)
        })
      } else {
        alert(res.msg)
      }
    }).fail(res => {
      alert(res.msg)
    })
  }

  resetValue = (arr) => {
    const length = arr.length
    let newArr = arr
    for(let i=0;i<length;i++){
      newArr[i].price = parseInt(arr[i].price)
      if(arr[i].capacity >= 1000){
        newArr[i].capacity = arr[i].capacity/1000 + 'T'
      } else if(arr[i].capacity < 1000){
        newArr[i].capacity = arr[i].capacity + 'G'
      }
    }
    for(let j=0;j<length;j++){
      const time = arr[j]/86400 //多少天
      if(time < 31){
        newArr[j].time = time%7 + 'week'
      } else {
        if(time >= 31 && time < 366){
          newArr[j].time = time%31 + 'mouth'
        } else {
          newArr[j].time = time%366 + 'year'
        }
      }
    }
    return newArr
  }

  triggerFather (el) {
    this.props.callBack(el)
  }
  render () {
    const { reset_versions } = this.state
    return (
      <div className='versions'>
        {reset_versions.map((item,index) => {
          return <Version key={index} version={item.title} price={item.price} capacity={item.capacity} duration='1 week'  callBack={this.triggerFather.bind(this,item.id)} />
        })}
        {/* <Version version='START' price='0' capacity='1G' duration='1 week'  callBack={this.triggerFather.bind(this,1)} />
        <Version version='PRO' price='4' capacity='50G' duration='1 week'  callBack={this.triggerFather.bind(this,2)} />
        <Version version='TEAM' price='9' capacity='200G' duration='1 week'  callBack={this.triggerFather.bind(this,3)} />
        <Version version='ENTERPRISE' price='19' capacity='800G' duration='1 week' callBack={this.triggerFather.bind(this,4)} />
        <Version version='ULTIMATE' price='34' capacity='2T' duration='1 week' callBack={this.triggerFather.bind(this,5)} /> */}
      </div>
    )
  }
}

export default Versions