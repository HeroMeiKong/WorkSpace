import React, { Component } from 'react'
import './SignUpOrLoginCard.scss'
import api from '@/config/api';
import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tools'
import sha512 from 'js-sha512'
import { connect } from 'react-redux';
import { login } from '@/redux/models/admin'
const email_img = require('@/assets/images/youxiang_icon@2x.png')
const password_img = require('@/assets/images/suo_icon@2x.png')

class SignUpOrLoginCard extends Component {
  constructor () {
    super()
    this.state = {
      SignUpOrLogin: true,
      newEmail: '',
      newPassword: '',
      newConfirmation: '',
      email: '',
      password: '',
      type: 4,//用户邮箱类型
      userInfo: {},//用户信息
      isRightEmail: true,//Email格式是否正确
      isRightNewPassword: true,//password格式是否正确
      samePassword: true,//密码是否一样
      isRightPassword: true,//password是否正确
    }
  }

  changeCreateAccount = () => {
    this.setState({
      SignUpOrLogin: true,
      isRightEmail: true,
    })
  }

  changeLogin = () => {
    this.setState({
      SignUpOrLogin: false,
      isRightEmail: true,
    })
  }

  handleChange = (key,e) => {
    if(e.target.id === 'email' || e.target.id === 'newEmail'){
      this.checkEmail(e)
    } else if(e.target.id === 'password'){
      this.checkPassword(e)
    }
    this.setState({
      [key]: e.target.value
    })
  }

  triggerFather = () => {
    //登录成功触发父类方法
    this.props.callBack()
  }

  create = () => {
    const that = this
    if(this.state.newPassword === this.state.newConfirmation){
      httpRequest({
        type: 'POST',
        url: api.signup,
        data: {
          user_account: that.state.newEmail,
          user_passwd: that.state.newPassword
        }
      }).done( res => {
        console.log('注册信息：',res)
        if(res.code === '0'){
          alert('注册成功！')
          this.setState({
            SignUpOrLogin: true,
          })
        } else {
          alert(res.msg)
        }
      }).fail( err => {
        console.log(err)
      })
    } else {
      alert('两次密码不一样！')
    }
  }

  login = (e) => {
    const that = this
    httpRequest({
      type: 'POST',
      url: api.login,
      data: {
        user_from: that.state.type,
        user_account: that.state.email,
        user_passwd: sha512(that.state.password)
      }
    }).done( res => {
      console.log('登录信息',res)
      if(res.code === '0'){
        that.triggerFather()
        tools.setUserData_storage(res.data)
        this.props.login(res.data)
        this.setState({
          userInfo: res.data
        })
      } else {
        that.setState({
          isRightPassword: false
        })
      }
    }).fail( err => {
      console.log(err)
    })
  }

  checkEmail = (e) => {
    // let reg = new RegExp("/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/"); //正则表达式
    let reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
    let obj = e.target.value
    console.log(obj)
    if(obj === ""){ //输入不能为空
    　　alert("输入不能为空!");
    }else if(!reg.test(obj)){ //正则验证不通过，格式不对
      console.log('fail')
    　　this.setState({
          isRightEmail: false
        })
    }else{
      console.log('success')
      this.setState({
        isRightEmail: true
      })
    }
  }

  checkPassword = (e) => {
    if(this.state.newPassword === this.state.newConfirmation){
      console.log('两次密码不一样！')
      this.setState({
        isRightNewPassword: false,
        samePassword: false
      })
    } else {
      this.setState({
        isRightNewPassword: true,
        samePassword: true
      })
    }
  }

  renderSignUp = (newEmail,newPassword,newConfirmation) => {
    return (
      <div className="sol_content">
        <div className="sol_content_title">Create an account</div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={email_img} className="sol_content_img"></img>
            <input id='newEmail' className="sol_content_input" placeholder='Your e-mail' value={newEmail} onChange={this.handleChange.bind(this,'newEmail')} />
          </div>
          <div className="sol_content_tip">{this.state.isRightEmail ? '' : 'Enter the correct email'}</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='password' src={password_img} className="sol_content_img"></img>
            <input type='password' className="sol_content_input" placeholder='Password' value={newPassword} onChange={this.handleChange.bind(this,'newPassword')} />
          </div>
          <div className="sol_content_tip">{this.state.isRightNewPassword ? '' : 'Enter the correct Password'}</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='password' src={password_img} className="sol_content_img"></img>
            <input type='password' id='password' className="sol_content_input" placeholder='Password confirmation' value={newConfirmation} onChange={this.handleChange.bind(this,'newConfirmation')} />
          </div>
          <div className="sol_content_tip">{this.state.samePassword ? '' : 'Not same as Password'}</div>
        </div>
        <div className="sol_content_other sol_content_other_signup">
          <div className='sol_content_other_inner'>Forgot password?</div>
          <div className='sol_content_other_inner' onClick={this.changeCreateAccount}>Login</div>
        </div>
        <div className="sol_content_button" onClick={this.create}>Create</div>
      </div>
    )
  }
  renderLogin = (email, password) => {
    return (
      <div className="sol_content">
        <div className="sol_content_title">login in your ID</div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={email_img} className="sol_content_img"></img>
            <input id='email' className="sol_content_input" placeholder='Your e-mail' value={email} onChange={this.handleChange.bind(this,'email')} />
          </div>
          <div className="sol_content_tip">{this.state.isRightEmail ? '' : 'Enter the correct email'}</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='password' src={password_img} className="sol_content_img"></img>
            <input type='password' className="sol_content_input" placeholder='Password' value={password} onChange={this.handleChange.bind(this,'password')} />
          </div>
          <div className="sol_content_tip">{this.state.isRightPassword ? '' : 'Enter the correct Password'}</div>
        </div>
        <div className="sol_content_other sol_content_other_login">
          <div className='sol_content_other_inner'>Forgot password?</div>
        </div>
        <div className="sol_content_button" onClick={this.login}>LOGIN</div>
        <div className="sol_content_create" onClick={this.changeLogin}>Not a member?<p>Create an account</p></div>
      </div>
    )
  }
  render () {
    // const { sol } = this.props
    const { SignUpOrLogin, newEmail, newPassword, newConfirmation, email, password } = this.state;
    return <div>{SignUpOrLogin ? this.renderLogin(email, password) : this.renderSignUp(newEmail,newPassword,newConfirmation) }</div>
  }
}

export default connect(state => ({
  userInfos: state.admin
}),{
  login
})(SignUpOrLoginCard);