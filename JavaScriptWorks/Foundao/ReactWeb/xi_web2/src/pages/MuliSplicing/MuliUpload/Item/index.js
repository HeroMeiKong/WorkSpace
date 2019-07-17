import React, {Component} from 'react';
import { sortable } from 'react-sortable';
import './index.scss';
class Item extends Component {
  constructor (props) {
    super(props);
    this.state={

    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <li className='item-upload' {...this.props}>
        {this.props.children}
      </li>
    );
  }
}
export default sortable(Item);
