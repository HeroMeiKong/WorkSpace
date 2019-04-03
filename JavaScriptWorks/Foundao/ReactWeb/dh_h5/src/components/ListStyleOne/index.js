import React, {Component} from 'react';
import './index.scss';
export default class List2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],//推荐页所有数据

    };
  }
  componentDidMount() {

  }
  render() {
    const {data} = this.props;
    let listData = data?data:[];
    return (
      <div className='listStyleOne-box'>
        <ul>
          {listData.map((item,index)=>{
            // console.log(item)
            return <li key={'list'+index}>
              {item.vtype/1===1 ?
                <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId}></a>
                :
                item.vtype/1===3 ?
                  <a href={"http://app.cctv.com/special/cbox/detail/index.html?guid="+item.vid+"&mid=17aQfAjy0815&vsid="+item.vsetId}></a>
                  :
                  item.vtype/1===7 ?
                    <a href={item.pcUrl}></a>
                    :
                    item.vtype/1===8 ?
                      <a href={"http://app.cctv.com/special/cbox/newlive/index.html?channel="+item.channelId}></a>
                      :
                      item.vtype/1===23 ?
                        <a href={"http://cbox.cntv.cn/special/cbox/fastvideo/index.html?id="+item.vsetPageid+"&guid="+item.vid+"vtype=47"}></a>
                        :
                        ""
              }
              <div className='list-pic'>
                <img src={item.imgUrl} alt={item.title}/>
              </div>
              <div className='list-info'>
                <h2 className='limit-line2 '>{item.title}</h2>
                <p className='video-brief limit-line1'>{item.brief}</p>
              </div>
            </li>
          })}
        </ul>
      </div>
    )
  }
}