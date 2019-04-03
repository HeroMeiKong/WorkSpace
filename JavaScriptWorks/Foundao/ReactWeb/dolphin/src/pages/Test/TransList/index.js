/**
 * Created by DELL on 2019/3/28.
 */
import React, {Component} from 'react'
import  TransItem from './TransItem';


export default
class TransList extends Component {
  constructor(props) {
    super(props);
    this.state = {}

  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  render() {
    const {uploadSuccessList} = this.props;

    return (
      <div>
        {uploadSuccessList.length < 1 ? '暂无数据' : (
          uploadSuccessList.map((item) => {
            return <TransItem key={item.fileMd5} data={item}/>
          })
        )}
      </div>
    )
  }
}