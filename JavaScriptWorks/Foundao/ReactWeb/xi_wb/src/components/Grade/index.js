import React, {Component,Fragment} from 'react';
import './index.scss';
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import {Message} from 'element-react'
class Grade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currGrade:0,
      showTips:true,
      OkTips:false
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }
  hoverStart=(item)=>{
    const {OkTips} = this.state;
    if (OkTips) {
      return
    }
    this.setState({
      currGrade:item
    })
  }
  outStart=()=>{
    const {OkTips} = this.state;
    if (OkTips) {
      return
    }
    this.setState({
      currGrade:0
    })
  }
  clickStart=(item)=>{
    const {OkTips} = this.state;
    const {type} = this.props;
    if (OkTips) {
      return
    }
    this.setState({
      OkTips:true
    })
    setTimeout(()=>{
      this.setState({
        showTips:false
      })
    },1000)
    httpRequest({
      typo:'POST',
      url:API.poststar,
      data:{
        star:item,
        trans_type:type||1,
        up_token: this.props.token || ''
      }
    }).done(res=>{}).fail(res=>{})
  }
  render() {
    const {currGrade ,showTips,OkTips} = this.state ;
    const {tipsMessage} = this.props;
    let message='';
    if (tipsMessage){
      message =tipsMessage
    } else {
      message ='Rate Our Convert Speed!'
    }
    return (
      <Fragment>
        {showTips ?
          <div className='GradeDefault'>
            <span className='close-icon' onClick={()=>{this.setState({showTips:false})}}></span>
            <p>{OkTips?'Thank You!':message}</p>
            <ul>
              {[1,2,3,4,5].map((item)=>{
                return  <li key={'start'+item}
                            onMouseOver={this.hoverStart.bind(this,item)}
                            onMouseOut={this.outStart.bind(this,item)}
                            onClick={this.clickStart.bind(this,item)}
                            className={currGrade>=item?'active':""}
                >
                  <p>{item===1?"Hated it":
                    item===2 ? "Disliked it":
                      item===3 ? "It's okay":
                        item===4?"Liked it":"Loved it"

                  }</p>
                </li>
              })}
            </ul>
          </div>
          :""
        }
      </Fragment>

    )
  }
}

export default Grade;
