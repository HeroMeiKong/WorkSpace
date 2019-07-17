/* eslint-disable */
import React, {Component} from 'react';
import $ from 'jquery';
import {} from 'react-router-dom';
import './SingleCut.scss';

import BeforeCut from './BeforeCut/BeforeCut';
import MoreTools from '@/components/MoreTools/index';
import CutStep from '@/components/CutStep/CutStep';
import CutList from '@/components/CutList/CutList';
import CutPage from './CutPage/CutPage';
import {connect} from 'react-redux';
import MessageBoard from '../../components/MessageBoard/messageBoard'

@connect(
    state => ({admin: state.admin}),
    {}
)

class SingleCut extends Component {
  constructor (props) {
    super(props);
    this.state={
      CutReady:false,//是否上传完毕进入视频编辑
      curUrl:'',
      md5:'',
    }
  }
  componentDidMount() {
    // console.log(11111)
    window.scrollTo(0,0);
    $('body').addClass('as')
  }
  componentWillUnmount() {
    // console.log('组件准备吹灰')
    $('body').removeClass('as');
    this.setState = (state, callback) => {
      return;
    };
  }

  /**视频上传成功回调**/
  successUpload=(url,videoName,md5,token)=>{
    /** val 视频上传成功后返回的地址 **/
    // console.log('333333')
    this.setState({
      curUrl:url,
      md5:md5,
      CutReady:true,
      token:token
    })
  };
  /**清空编辑详细回调**/
  returnPage =()=>{
    // console.log('456')
    this.setState({
      CutReady:false,
      curUrl:'',
      md5:'',
    })
  }

  render() {
    const {CutReady , md5 ,curUrl,token } = this.state;
    // data={{curUrl:curUrl,md5:md5}}
    // data={{curUrl:'http://foundao.f3322.net:18080/org/a9efb96f941a9b6c23d3e89e88f9f7af.mp4',md5:'a9efb96f941a9b6c23d3e89e88f9f7af'}}
    // data={{curUrl:'http://foundao.f3322.net:18080/org/6b576e71429c7cc57ec1beb05ff23628.mp4',md5:'6b576e71429c7cc57ec1beb05ff23628'}}  9:16
    // console.log(CutReady,'CutReady')
    return (
      <div className='singleCut-box'>
        {CutReady ?
           <CutPage
             returnPage={this.returnPage}
             data={{curUrl:curUrl,md5:md5,token:token}}
           />
          :
          <BeforeCut uploadSuccess={this.successUpload}/>
        }
        <CutStep />
        <CutList type='singleCut'/>
        <MoreTools  type='singleCut'/>
          {
              this.props.admin.isForeign ? ( <MessageBoard id="3"/>) : ('')
          }
      </div>
    );
  }
}

export default SingleCut;
