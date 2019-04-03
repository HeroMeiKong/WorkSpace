import React, { Component } from 'react';
import './Versions.scss'
import Version from './Version/Version'

class Versions extends Component {
  triggerFather = () => {
    this.props.callBack()
  } 
  render () {
    return (
      <div className='versions'>
        <Version version='START' price='1' capacity='1G' duration='1 week'  callBack={this.triggerFather} />
        <Version version='PRO' price='5' capacity='50G' duration='1 week'  callBack={this.triggerFather} />
        <Version version='TEAM' price='10' capacity='200G' duration='1 week'  callBack={this.triggerFather} />
        <Version version='ENTERPRISE' price='20' capacity='800G' duration='1 week' callBack={this.triggerFather} />
        <Version version='ULTIMATE' price='35' capacity='2T' duration='1 week' callBack={this.triggerFather} />
      </div>
    )
  }
}

export default Versions