/* eslint-disable */
import React, {Component,Fragment} from 'react';

import {} from 'react-router-dom';

import './CutStep.scss';
class CutStep extends Component {
  constructor (props) {
    super(props);
    this.state={
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {

  }

  render() {
    const {type} = this.props;
    let msg='',stepMsg=[];
    if (type&&type==='muliSolicing'){
        msg=window.intl.get('如何通过简单的步骤在线拼接视频？'),
        stepMsg=[window.intl.get('添加多个视频'),window.intl.get('使用分割和多种转场效果在线编辑视频'),window.intl.get('选择输出格式并且保存下载')]
    } else if(type && type === 'watermark'){
      msg=window.intl.get('如何通过简单的步骤在线添加视频水印？'),
        stepMsg=[window.intl.get('添加视频'),window.intl.get('上传您的水印图片'),window.intl.get('保存并下载')]
    }else {
        msg=window.intl.get('如何通过简单的步骤在线编辑视频？'),
        stepMsg=[window.intl.get('添加视频'),window.intl.get('使用修剪旋转裁剪等在线编辑视频'),window.intl.get('选择输出格式并且保存下载')]
    }
    return (
      <div className='cutStep-box'>
        <h3>{msg}</h3>
        <ul>
          {stepMsg.map((item,index)=>{
              return <Fragment key={'step'+index+1}>
                <li>
                  <span>{index+1}</span>
                  <p>{item}</p>
                </li>
                {index<2 ? <li className='line'></li>
                  :""}
              </Fragment>
            })
          }


          {/*<li>*/}
            {/*<span>2</span>*/}
            {/*<p></p>*/}
          {/*</li>*/}
          {/*<li className='line'></li>*/}
          {/*<li>*/}
            {/*<span>3</span>*/}
            {/*<p></p>*/}
          {/*</li>*/}
        </ul>
      </div>
    );
  }
}

export default CutStep;
