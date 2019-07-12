import React, {Component} from 'react';
import VoteResultItem from '@/components/VoteResultItem'

/*竞猜结果*/
export default
class GuesItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  render() {
    const {data = {}} = this.props;
    const {options = []} = data;
    return (
      <div className="vote_percent">
        <h2>{data.title}</h2>
        <div className="result_list">
          {options.map((item, index) => {
            return <VoteResultItem key={index}
                                   total={data.all_choose_total / 1}
                                   index={index}
                                   data={item}/>
          })}
        </div>
      </div>
    );
  }
}