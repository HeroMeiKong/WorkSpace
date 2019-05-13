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
      reset_versions: [{capacity: "1G",currency: "USD",id: "1",price: 1,time: "",title: "STARTER"},
      {capacity: "50G",currency: "USD",id: "1",price: 2,time: "",title: "STARTER"},
      {capacity: "200G",currency: "USD",id: "1",price: 3,time: "",title: "STARTER"},
      {capacity: "800G",currency: "USD",id: "1",price: 4,time: "",title: "STARTER"},
      {capacity: "2T",currency: "USD",id: "1",price: 5,time: "",title: "STARTER"}]
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
        this.showToast(res.msg)
      }
    }).fail(res => {
      this.showToast(res.msg)
    })
  }

  resetValue = (arr) => {
    const length = arr.length
    let newArr = arr
    let priceArr = []
    for(let i=0;i<length;i++){
      priceArr = arr[i].price.split('.')
      newArr[i].price = priceArr[0]
      if(priceArr.length > 1) {
        newArr[i].pricesmall = priceArr[1]
      }
      if(arr[i].capacity >= 1000){
        newArr[i].capacity = (arr[i].capacity/1000).toFixed(0) + 'T'
      } else if(arr[i].capacity < 1000){
        newArr[i].capacity = arr[i].capacity + 'G'
      }
    }
    for(let j=0;j<length;j++){
      const time = (arr[j].time-0)/86400 //多少天
      if(time < 31){
        newArr[j].time = parseInt(time/7) + time%7 + ' week'
      } else {
        if(time >= 31 && time < 366){
          newArr[j].time = parseInt(time/31) + time%31 + ' mouth'
        } else {
          newArr[j].time = parseInt(time/366) + time%366 + ' year'
        }
      }
    }
    return newArr
  }

  triggerFatherIsLogin (el) {
    this.props.callBack(el,'isLogin')
  }

  triggerFatherNoLogin (el) {
    this.props.callBack(el,'noLogin')
  }

  showToast = (text) => {
    this.props.showToast(text)
  }

  showSigin = () => {
    this.props.showSigin()
  }

  render () {
    const { reset_versions } = this.state
    return (
      <div className='versions'>
        {reset_versions.map((item,index) => {
          return <Version key={index} version={item.title} price={item.price} pricesmall={item.pricesmall} capacity={item.capacity} duration={item.time} 
          which={index} callBack={this.triggerFatherIsLogin.bind(this,item.id)} showToast={this.showToast} showSigin={this.showSigin} 
          callBackWay={this.triggerFatherNoLogin.bind(this,item.id)} />
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