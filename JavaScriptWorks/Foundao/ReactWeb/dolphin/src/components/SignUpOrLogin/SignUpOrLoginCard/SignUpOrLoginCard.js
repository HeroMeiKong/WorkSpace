import React, { Component, Fragment } from 'react'
import './SignUpOrLoginCard.scss'
import api from '@/config/api';
import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tools'
import sha512 from 'js-sha512'
import { connect } from 'react-redux';
import { login } from '@/redux/models/admin'
const email_img = require('@/assets/images/youxiang_icon@2x.png')
const password_img = require('@/assets/images/suo_icon@2x.png')
const defaultAvatar = require('@/assets/images/touxiang_icon@2x.png')

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
      forgot: false,//忘记密码
      state: 0,//忘记密码第一步
      code: '',//验证码
      resetPassword: '',//重制密码
      resetConfirmation: '',
      resetSamePassword: true,//
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
    let id = e.target.id
    let value = e.target.value
    this.setState({
      [key]: e.target.value
    },() => {
      if(id === 'email' || id === 'newEmail'){
        this.checkEmail(value)
      } else if(id === 'password' || id === 'resetpassword'){
        this.checkPassword(id)
      } else {
        if(this.state.newPassword === this.state.newConfirmation){
          this.setState({
            isRightNewPassword: true,
            samePassword: true
          })
        } else if(this.state.resetPassword === this.state.resetConfirmation){
          this.setState({
            resetSamePassword: true
          })
        }
      }
    })
  }
  
  triggerFather = () => {
    //登录成功触发父类方法
    this.props.callBack()
  }

  create = () => {
    const that = this
    if(this.state.newConfirmation === '' || this.state.newEmail === ''){
      this.props.showToast('please verify your email address or password!')
    } else {
      if(this.state.newPassword === this.state.newConfirmation){
        this.props.loading(true)//显示loading
        httpRequest({
          type: 'POST',
          url: api.signup,
          data: {
            user_account: that.state.newEmail,
            user_passwd: that.state.newPassword
          }
        }).done( res => {
          if(res.code === '0'){
            this.props.loading(false)//隐藏loading
            this.setState({
              SignUpOrLogin: true,
            })
          } else {
            this.props.showToast(res.msg)
            this.props.loading(false)//隐藏loading
          }
        }).fail( err => {
          this.props.showToast(err)
          this.props.loading(false)//隐藏loading
        })
      } else {
        this.props.showToast('The password is different twice.')
      }
    }
  }

  login = (e) => {
    const that = this
    if(this.state.email !== '' && this.state.password !== ''){
      this.props.loading(true)//显示loading
      httpRequest({
        type: 'POST',
        url: api.login,
        data: {
          user_from: that.state.type,
          user_account: that.state.email,
          user_passwd: sha512(that.state.password)
        }
      }).done( res => {
        if(res.code === '0'){
          that.triggerFather()
          let data = res.data
          if(!res.data.user_avatar){
            data.user_avatar = defaultAvatar
          }
          tools.setUserData_storage(data)
          this.props.getUserStorage(data)
          this.setState({
            userInfo: res.data
          })
        } else {
          this.props.loading(false)//隐藏loading
          this.props.showToast("please verify your email address or password!")
          that.setState({
            isRightPassword: false
          })
        }
      }).fail( err => {
        this.props.showToast(err)
      })
    } else {
      this.props.showToast('please verify your email address or password!')
    }
  }

  checkEmail = (obj) => {
    // let reg = new RegExp("/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/"); //正则表达式
    let reg = /^([a-zA-Z0-9_-]|[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-])+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
    if(obj === ""){ //输入不能为空
    }else if(!reg.test(obj)){ //正则验证不通过，格式不对
    　　this.setState({
          isRightEmail: false
        })
    }else{
      this.setState({
        isRightEmail: true
      })
    }
  }

  checkPassword = (id) => {
    if(id === 'password'){
      if(this.state.newPassword === this.state.newConfirmation){
        this.setState({
          isRightNewPassword: true,
          samePassword: true
        })
      } else {
        this.setState({
          isRightNewPassword: false,
          samePassword: false,
        })
      }
    } else {
      if(this.state.resetPassword === this.state.resetConfirmation){
        this.setState({
          resetSamePassword: true
        })
      } else {
        this.setState({
          resetSamePassword: false,
        })
      }
    }
  }

  forgot (value) {
    this.setState({
      forgot: value
    })
    if(!value){
      this.setState({
        state: 0
      })
    }
  }

  nextStep (value) {
    if(value === 1 && this.state.email === ''){
      this.props.showToast('Please enter an email address!')
    } else if(value === 2 && this.state.code === ''){
      this.props.showToast('Please enter your code!')
    } else if(value === 3 && this.state.resetConfirmation === ''){
      this.props.showToast('Please enter your password!')
    } else {
      if(this.state.isRightEmail){
        if(value === 3){
          httpRequest({
            type: 'POST',
            url: api.resetPassword,
            data: {
              user_account: this.state.email,
              step: value,
              code: this.state.code,
              user_passwd: this.state.resetConfirmation
            }
          }).done(res => {
            if(res.code === '0'){
              this.props.showToast('Setup successfully!Please login！')
              this.setState({
                state: 0,
                forgot: false
              })
            } else {
              this.props.showToast(res.msg)
            }
          }).fail(res => {
            this.props.showToast(res.msg)
          })
        } else {
          if(value === 1){
            httpRequest({
              type: 'POST',
              url: api.resetPassword,
              data: {
                user_account: this.state.email,
                step: value,
              }
            }).done(res => {
              if(res.code === '0'){
                this.props.showToast('Please enter the vertification code that you can find in your email!')
                this.setState({
                  state: value
                })
              } else {
                this.props.showToast(res.msg)
              }
            }).fail(res => {
              this.props.showToast(res.msg)
            })
          } else if(value === 2){
            httpRequest({
              type: 'POST',
              url: api.resetPassword,
              data: {
                user_account: this.state.email,
                step: value,
                code: this.state.code
              }
            }).done(res => {
              if(res.code === '0'){
                this.props.showToast('Please setup a new password！')
                this.setState({
                  state: value
                })
              } else {
                this.props.showToast(res.msg)
              }
            }).fail(res => {
              this.props.showToast(res.msg)
            })
          }
        }
      } else {
        this.props.showToast("Invalid email address!")
      }
    }
  }

  renderSignUp = () => {
    const {newEmail, newPassword, newConfirmation} = this.state
    return (
      <Fragment>
        {this.state.forgot ? this.renderForgot() : 
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
            <div className='sol_content_other_inner' onClick={this.forgot.bind(this,true)}>Forgot password?</div>
            <div className='sol_content_other_inner' onClick={this.changeCreateAccount}>Sign in</div>
          </div>
          <div className="sol_content_button" onClick={this.create}>SIGN UP</div>
        </div>}
      </Fragment>
    )
  }
  renderLogin = () => {
    const {email, password} = this.state
    return (
      <Fragment>
        {this.state.forgot ? this.renderForgot() : 
        <div className="sol_content">
          <div className="sol_content_title">login in your ID</div>
          <div className="sol_content_box">
            <div className="sol_content_inner">
              <img alt='email' src={email_img} className="sol_content_img"></img>
              <input id='email' type='email' className="sol_content_input" placeholder='Your e-mail' value={email} onChange={this.handleChange.bind(this,'email')} />
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
            <div className='sol_content_other_inner' onClick={this.forgot.bind(this,true)}>Forgot password?</div>
          </div>
          <div className="sol_content_button" onClick={this.login}>SIGN IN</div>
          <div className="sol_content_create" onClick={this.changeLogin}>Not a member?<p>Create an account</p></div>
        </div>}
      </Fragment>
    )
  }
  renderForgot = () => {
    const {email, code, resetPassword, resetConfirmation} = this.state
    if(this.state.state === 0){
      return (
        <div className="sol_content">
          <div className="sol_content_title">Forgot your Password?<br/>Enter your email address：</div>
          <div className="sol_content_box">
            <div className="sol_content_inner">
              <img alt='email' src={email_img} className="sol_content_img"></img>
              <input id='email' type='email' className="sol_content_input" placeholder='Your e-mail' value={email} onChange={this.handleChange.bind(this,'email')} />
            </div>
            <div className="sol_content_tip">{this.state.isRightEmail ? '' : 'Enter the correct email'}</div>
          </div>
          <div className="sol_content_button" onClick={this.nextStep.bind(this,1)}>NEXT STEP</div>
          <p className='backto_login' onClick={this.forgot.bind(this,false)}>Back to signin</p>
        </div>
      )
    } else if(this.state.state === 1){
      return (
        <div className="sol_content">
          <div className="sol_content_title">Your verification code was sent to: <br/>{email}</div>
          <div className="sol_content_box">
            <div className="sol_content_inner">
              <img alt='email' src={email_img} className="sol_content_img"></img>
              <input className="sol_content_input" placeholder='Enter verification code' value={code} onChange={this.handleChange.bind(this,'code')} />
            </div>
            <div className="sol_content_tip">{this.state.isRightEmail ? '' : 'Enter the correct email'}</div>
          </div>
          <div className="sol_content_button" onClick={this.nextStep.bind(this,2)}>NEXT STEP</div>
          <p className='backto_login' onClick={this.forgot.bind(this,false)}>Back to signin</p>
        </div>
      )
    } else {
      return (
        <div className="sol_content">
          <div className="sol_content_title">Reset password</div>
          <div className="sol_content_box">
            <div className="sol_content_inner">
              <img alt='password' src={password_img} className="sol_content_img"></img>
              <input type='password' className="sol_content_input" placeholder='Password' value={resetPassword} onChange={this.handleChange.bind(this,'resetPassword')} />
            </div>
            <div className="sol_content_tip">{this.state.resetSamePassword ? '' : 'Enter the correct Password'}</div>
          </div>
          <div className="sol_content_box">
            <div className="sol_content_inner">
              <img alt='password' src={password_img} className="sol_content_img"></img>
              <input type='password' id='resetpassword' className="sol_content_input" placeholder='Password confirmation' value={resetConfirmation} onChange={this.handleChange.bind(this,'resetConfirmation')} />
            </div>
            <div className="sol_content_tip">{this.state.resetSamePassword ? '' : 'Not same as Password'}</div>
          </div>
          <div className="sol_content_button" onClick={this.nextStep.bind(this,3)}>NEXT STEP</div>
          <p className='backto_login' onClick={this.forgot.bind(this,false)}>Back to signin</p>
        </div>
      )
    }
  }
  render () {
    // const { sol } = this.props
    const { SignUpOrLogin} = this.state;
    return <div>{SignUpOrLogin ? this.renderLogin() : this.renderSignUp() }</div>
  }
}

export default connect(state => ({
  userInfos: state.admin
}),{
  login
})(SignUpOrLoginCard);