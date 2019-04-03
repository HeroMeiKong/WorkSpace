import React, { Component } from 'react'
import './SignUpOrLoginCard.scss'
const facebook = require('@/assets/images/MP4_icon@2x.png')

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
    }
  }
  changeCreateAccount = () => {
    this.setState({
      SignUpOrLogin: true
    })
  }
  changeLogin = () => {
    this.setState({
      SignUpOrLogin: false
    })
  }
  handleChange = (key,e) => {
    this.setState({
      [key]: e.target.value
    })
  }
  renderSignUp = (newEmail,newPassword,newConfirmation) => {
    return (
      <div className="sol_content">
        <div className="sol_content_title">Create an account</div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={facebook} className="sol_content_img"></img>
            <input className="sol_content_input" placeholder='Your e-mail' value={newEmail} onChange={this.handleChange.bind(this,'newEmail')} />
          </div>
          <div className="sol_content_tip">Enter the correct email</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={facebook} className="sol_content_img"></img>
            <input className="sol_content_input" placeholder='Password' value={newPassword} onChange={this.handleChange.bind(this,'newPassword')} />
          </div>
          <div className="sol_content_tip">Enter the correct Password</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={facebook} className="sol_content_img"></img>
            <input className="sol_content_input" placeholder='Password confirmation' value={newConfirmation} onChange={this.handleChange.bind(this,'newConfirmation')} />
          </div>
          <div className="sol_content_tip">Not same as Password</div>
        </div>
        <div className="sol_content_other sol_content_other_signup">
          <div className='sol_content_other_inner'>Forgot password?</div>
          <div className='sol_content_other_inner' onClick={this.changeLogin}>Login</div>
        </div>
        <div className="sol_content_button">Create</div>
      </div>
    )
  }
  renderLogin = (email, password) => {
    return (
      <div className="sol_content">
        <div className="sol_content_title">login in your ID</div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={facebook} className="sol_content_img"></img>
            <input className="sol_content_input" placeholder='Your e-mail' value={email} onChange={this.handleChange.bind(this,'email')} />
          </div>
          <div className="sol_content_tip">Enter the correct email</div>
        </div>
        <div className="sol_content_box">
          <div className="sol_content_inner">
            <img alt='email' src={facebook} className="sol_content_img"></img>
            <input className="sol_content_input" placeholder='Password' value={password} onChange={this.handleChange.bind(this,'password')} />
          </div>
          <div className="sol_content_tip">Enter the correct Password</div>
        </div>
        <div className="sol_content_other sol_content_other_login">
          <div className='sol_content_other_inner'>Forgot password?</div>
        </div>
        <div className="sol_content_button">LOG IN</div>
        <div className="sol_content_create" onClick={this.changeCreateAccount}>Not a member?<p>Create an account</p></div>
      </div>
    )
  }
  render () {
    // const { sol } = this.props
    const { SignUpOrLogin, newEmail, newPassword, newConfirmation, email, password } = this.state;
    return <div>{SignUpOrLogin ? this.renderLogin(email, password) : this.renderSignUp(newEmail,newPassword,newConfirmation) }</div>
  }
}

export default SignUpOrLoginCard