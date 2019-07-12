import React, {Component,Fragment} from 'react';
import './index.scss';

class Ad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link:'https://www.movavi.com/download-photoeditor/?afsrc=cj&usource=cj',
      desc:"Discover your creative Potential with Movavi Video Editor",
      showAD:true
    };

  }
  componentWillMount() {}
  closeAd=(e)=>{
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      showAD:false
    })
  }
  render() {
    const {link,desc,showAD} = this.state;
    const {classNames} = this.props;
    return (
      <Fragment>
        {showAD ?
          <div
            onClick={()=>window.gtag&&window.gtag('event', 'click', {'event_category': 'download_pc', 'event_label': 'advertising'})}
            className={ classNames ? classNames +" Ad-default":'Ad-default'}>
            <a href={link} target='_blank'>{desc}</a>
            <span className='CloseAd' onClick={this.closeAd}></span>
          </div>
          :""
        }
      </Fragment>


    );
  }
}

export default Ad;
