import React, {Component} from 'react';
import { sortable } from 'react-sortable';
class Item extends Component {
  constructor (props) {
    super(props);
    this.state={
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className='video-Item'  {...this.props}>
        {this.props.children}
      </div>
    );
  }
}
export default sortable(Item);
