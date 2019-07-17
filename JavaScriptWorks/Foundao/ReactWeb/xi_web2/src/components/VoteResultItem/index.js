/**
 * Created by DELL on 2019/3/28.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Progress} from 'element-react';

import './index.scss';


/* eslint-disable */
export default
class VoteResultItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {

  }

  componentDidMount() {

  }


  render() {
    const {index, data, total = 1} = this.props;
    const percent = (data.choose_total) / (total || 1) * 100;
    // const percent = index * 10 + 10;
    return (
      <div className="voteResultItem">
        <div className="item_index">选项{index + 1}</div>
        <div className="item_title limit-line1">{data.title}</div>
        <div className="item_num">{percent}% ({data.choose_total || 0}票)</div>
        <div className="item_percent">
          <Progress percentage={percent} showText={false}/>
        </div>

      </div>
    )
  }
}
VoteResultItem.propTypes = {};