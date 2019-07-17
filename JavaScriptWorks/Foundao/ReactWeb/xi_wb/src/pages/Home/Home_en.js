import React, {Component} from 'react';
import './home_en.scss';
import {Link} from "react-router-dom";
import videoCut from '../../assets/home/video-cut.png';
import videoMeger from  '../../assets/home/video-joiner.png';
import videoCovent from '../../assets/home/video-convent.png';
import addWatermark from '../../assets/home/add-watermark.png';
import removeWatermark from '../../assets/home/remove-watermark.png';
import weclipIcon from '../../assets/home/weclip-icon.png';
import xivideo from '../../assets/home/xivideo-icon.png';
import jiaopian from '../../assets/home/jp-icon.png';
class Home_en extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList:[
        {
          title:"Video Cutter",
          pic : videoCut,
          desc:'The easiest way to cut out a section of a video',
          link:'/trim'
        },
        {
          title:"Video Joiner",
          pic : videoMeger,
          desc:'Mrege multiple video files into a single track',
          link:'/merge'
        },
        {
          title:"Video Converter",
          pic : videoCovent,
          desc:'Convert video files online from one format into MP4',
          link:'/convert'
        },
        {
          title:"Add Watermark",
          pic : addWatermark,
          desc:'Add watermark online with pictures and dynamic effect',
          link:'/watermark'
        },
        {
          title:"Remove Watermark",
          pic : removeWatermark,
          desc:'Remove watermark from videos',
          link:'/remove'
        }
      ],
      toolsList : [
        // {
        //   title:'weclip',
        //   desc:'Short video production artifact',
        //   content:'weclip - Electronic commodities brand promotion of short video production artifact',
        //   link:'',
        //   icon:weclipIcon
        // },
        {
          title:"Enjoy Cut",
          desc:'One button video packaging',
          content:'Excellent tool to make perfect vlog，an essential assistant for mobile life.',
          link:'https://itunes.apple.com/cn/app/%E5%96%9C%E8%A7%86%E9%A2%91-%E6%9E%81%E7%AE%80%E7%9F%AD%E8%A7%86%E9%A2%91%E6%8B%8D%E6%91%84%E7%BC%96%E8%BE%91%E5%88%B6%E4%BD%9C/id1369648773?mt=8',
          icon:xivideo
        },
        {
          title:'JPER',
          desc:'Mobile video professional assistant',
          content:'Professional video clip tool for PMD, contains short-video-based community of high quality',
          link:'https://itunes.apple.com/cn/app/%E8%95%89%E7%89%87-%E7%9F%AD%E8%A7%86%E9%A2%91%E6%8B%8D%E6%91%84%E5%89%AA%E8%BE%91%E5%87%BA%E7%94%B5%E5%BD%B1%E5%A4%A7%E7%89%87/id1235972800?mt=8',
          icon:jiaopian
        }
      ]
    }
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  render() {
    const {productList,toolsList} = this.state ;
    let page = sessionStorage.getItem('page');
    return (
      <div className='home-page-en'>
        <div className='left-box'>
          <div className='left-icon'></div>
          <h2 className='left-title'>Free Web Tools</h2>
          <p className='left-desc'>Our tools are easy to use, safe, free and run in the browser</p>
        </div>
        <div className='right-box'>
          <div className='product-box'>
            <ul>
              {
                productList.map(item=>{
                  if (item.link==='/convert'&&page==='converter') {
                    item.link='/converter'
                  }
                  return <li className='product-item' key={item.title}>
                    <img className='item-pic' src={item.pic} alt={item.title}/>
                    <h3 className='item-name'>{item.title}</h3>
                    <p className='item-desc'>{item.desc}</p>
                    <Link to={item.link} target='_blank'/>
                  </li>
                })
              }
            </ul>
          </div>
          <div className='tools-box'>
              <ul>
                {toolsList.map(item=>{
                  return <li className='tools-item' key={item.title}>
                    <div className='item-header'>
                      <img src={item.icon} alt={item.title}/>
                      <div className='item-info'>
                        <h3>{item.title}</h3>
                        <h4>{item.desc}</h4>
                      </div>
                      <p className='item-content'>{item.content}</p>
                    </div>
                    <a href={item.link} target='_blank'>{item.title}</a>
                  </li>
                })

                }

              </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Home_en;
