import React, { Component } from 'react'
import './purchase.scss'
import httpRequest from '@/utils/httpRequest'
import api from '@/config/api'
import tools from '@/utils/tools'
import { Link } from 'react-router-dom'
import Versions from './Versions/Versions'
// import PayCard from '@/components/PayCard/PayCard'
import Loading from '@/components/Loading/Loading'

class Purchase extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      showPay: false,
      version: 0,//套餐id
    }
  }

  componentDidMount () {
    const parameter = this.props.location.search
    if(parameter){
      console.log('支付成功，开始扣钱')
      const arr = this.changeToObject(parameter)
      httpRequest({
        type: 'POST',
        url: api.pay,
        data: {
          success: arr[0],
          paymentId: arr[1],
          token: tools.getUserData_storage().token,
          PayerID: arr[3]
        }
      }).done(res => {
        console.log(res)
        alert('支付成功，欢迎您的使用！')
        setTimeout(() => {
          // window.location.href = 'http://localhost:3000/#/'
          // window.location.href = 'https://cd.foundao.com:10081/foundao/dolphin/#/'
          window.location.href = 'https://www.convert-mp4.com/react_prj/#/'
        },1000)
      })
    } else {
      console.log('还未支付！')
    }
  }

  changeToObject = (str) => {
    const arr = str.split('&')
    const length = arr.length
    let newArr = []
    for(let i=0;i<length;i++){
      newArr[i] = arr[i].split('=')[1]
    }
    // console.log(newArr)
    return newArr
  }

  showPay = (el) => {
    console.log('showLogin')
    this.setState({
      showPay: true,
      version: el
    })
    this.submitOrder(el)
  }

  hiddenPay = (e) => {
    if(e.target.className === 'pay_wrapper'){
      //如果点击外面就隐藏
      this.setState({
        showPay: false
      })
    }
  }
  
  submitOrder = (version) => {
    console.log('submitOrder')
    console.log('version',version)
    this.setState({
      isLoading: true
    })
    httpRequest({
      type: 'POST',
      url: api.create_order,
      data: {
        goods_id: version,
        token: tools.getUserData_storage().token
      }
    }).done(res => {
      console.log(res)
      if(res.code === '0'){
        httpRequest({
          type: 'POST',
          url: api.payment,
          data: {
            order_id: res.data.order_id,
            token: tools.getUserData_storage().token,
            // return_url: 'http://localhost:3000/#/purchase'
            // return_url: 'https://cd.foundao.com:10081/foundao/dolphin/#/purchase'
            return_url: 'https://www.convert-mp4.com/react_prj/#/purchase'
          }
        }).done(res => {
          if(res.code === '0'){
            window.location.href = res.data
            this.setState({
              isLoading: false
            })
          }
        })
      } else {
        alert(res.msg)
        this.setState({
          isLoading: false
        })
      }
    })
  }

  render () {
    const { isLoading } = this.state
    return(
      <div className='purchase'>
        {isLoading ? <Loading /> : ''}
        <div className='purchase_content'>
          <h1>Want to convert more videos?<br/>Or beyond the 50MB limit?</h1>
          <div className='purchase_tip'>RECOMMANDED</div>
          <Versions callBack={this.showPay} />
          <p className='purchase_notes'>Need something custom? <Link to='' >Contact us.</Link></p>
          <p className='purchase_notes'>We also have additional plan provide more than 2T capacity.</p>
        </div>
        {/* {showPay ? <PayCard callBack={this.hiddenPay} order={this.submitOrder} /> : ''} */}
      </div>
    )
  }
}

export default Purchase