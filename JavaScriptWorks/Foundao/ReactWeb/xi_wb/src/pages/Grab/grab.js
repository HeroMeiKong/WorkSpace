// import React, {Component ,Fragment} from 'react';
// import './grab.scss';
// import {connect} from 'react-redux';
// import {login, logout, show_loading, hide_loading} from './../../redux/models/admin';
// import icon_easy from './../../assets/grab/icon_easy@2x.png';
// import icon_free from './../../assets/grab/icon_free@2x.png';
// import icon_safely from './../../assets/grab/icon_safely@2x.png';
// import loading from './../../assets/grab/loading.gif';
// import tools from './../../utils/tool';
// import $ from 'jquery';
// import classNames from 'classnames';
// import API from './../../API/grabApi';
// import {Message} from 'element-react';
// import GrabLayer from './GrabLayer/grabLayer';
//
// @connect(
//     state => ({admin: state.admin}),
//     {login, logout, show_loading, hide_loading}
// )
//
// class Grab extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             website: 'https://www.youtube.com/watch?v=qIcTM8WXFjk',
//             result_select: 0,
//             grab_data: null,
//             showAnalyzing: false,
//             showAd: false,
//             // showResult: false,
//             result_data: null,
//             result_list: [],
//             result_list_noSound: [],
//             cur_list: [],
//             isFirst:true,//是否是第一次点击输入框
//             showFail:false,
//         };
//     }
//
//     componentWillMount() {
//
//     }
//
//     componentDidMount() {
//
//     }
//
//     componentWillUnmount() {
//
//     }
//
//     render() {
//         const {grab_data, showAnalyzing, showAd, result_data, result_select,showFail,
//             result_list, result_list_noSound, cur_list ,isFirst} = this.state;
//
//         return (
//             <div className="grab-page">
//                 {
//                     grab_data ? <GrabLayer website={this.state.website} close={() => {
//                         this.setState({
//                             grab_data: null
//                         })
//                     }} type={result_select} data={grab_data}/> : ''
//                 }
//
//                 <div className="grab-heart-box">
//                     {/*Title*/}
//                     <div className="grab-title">It’s FREE! Download video from Youtube in seconds</div>
//                     {/*输入框*/}
//                     <div className="grab-link-box">
//                         <input type="text" className="grab-input-box" placeholder="Search or paste link here…"
//                                value={this.state.website}
//                                onChange={(e) => {
//                                    this.setState({
//                                        website: e.target.value
//                                    })
//                                }}
//                                onFocus={()=>{
//                                    if (isFirst){
//                                        this.setState({
//                                            website: '',
//                                            isFirst : false
//                                        })
//                                    }
//                                }}
//                                onKeyPress={(e) => {
//                                    if (e.charCode === 13) {
//                                        this.analyze();
//                                    }
//                                }}/>
//                         <button className="grab-input-download" onClick={() => {
//                             this.analyze()
//                         }}>GET!
//                         </button>
//                     </div>
//                     {/*提示*/}
//                     <div className="grab-tips">By using this website, you accept our <a href="/userTerms">Terms of
//                         Service</a> and agree not to download Copyright content.
//                     </div>
//
//                     {/*分析进度*/}
//                     {
//                         showAnalyzing ? (
//                             <div className="analyze-box">
//                                 {/*<div className="analyze-progress-box">*/}
//                                 {/*<div className="analyze-prgress" style={{width: '50' + '%'}}></div>*/}
//                                 {/*</div>*/}
//                                 <div className="loading-gif"></div>
//                                 <div className="analyze-loading-box"></div>
//                                 <div className="analyze-tips">Analyzing your video…</div>
//                             </div>
//                         ) : ''
//                     }
//                     {/**没有抓到视频提示**/}
//                     {
//                         showFail ? <div className="analyze-box">
//                           <div className="loading-fail"></div>
//                         <div className="analyze-tips" style={{color:"#FF5452"}}>We can’t find any video in the URL , please try something else</div>
//                         </div> : ''
//                     }
//
//                     {/*广告位*/}
//                     {
//                         showAd ? (
//                             <div className="ad-box">
//                                 <div className="ad-item">
//                                     <div className="ad-title">He has a hard time because he is poor</div>
//                                 </div>
//                                 <div className="ad-item">
//                                     <div className="ad-title">He has a hard time because he is poor He has a hard time
//                                         because
//                                         he is poor
//                                     </div>
//                                 </div>
//                                 <div className="ad-item">
//                                     <div className="ad-title">He has a hard time because he is poor</div>
//                                 </div>
//                             </div>
//                         ) : ''
//                     }
//                     {/*爬虫结果*/}
//                     {
//                         result_data ? (
//                             <div className="result-box">
//                                 <div className="result-show-box">
//                                     <div className="result-poster" style={{
//                                         backgroundImage: 'url(' + result_data.cover + ')'
//                                     }}></div>
//                                     <div className="result-title">{result_data.title}</div>
//                                     <div className="result-duration">
//                                         Duration: {tools.timeModel_zhen(result_data.stream[0].duration)}</div>
//                                 </div>
//                                 <div className="result-form-box">
//                                     {/*标签页*/}
//                                     <div className="result-select">
//                                         <div
//                                             className={classNames("result-select-label", this.state.result_select === 0 ? 'selected' : '')}
//                                             onClick={() => {
//                                                 this.setState({
//                                                     result_select: 0,
//                                                     cur_list: result_list
//                                                 })
//                                             }}>
//                                             Video with sound
//                                         </div>
//                                         <div
//                                             className={classNames("result-select-label", this.state.result_select === 1 ? 'selected' : '')}
//                                             onClick={() => {
//                                                 this.setState({
//                                                     result_select: 1,
//                                                     cur_list: result_list_noSound
//                                                 })
//                                             }}>
//                                             Video without sound
//                                         </div>
//                                         <div className={classNames("result-select-label", this.state.result_select === 2 ? 'selected' : '')}
//                                             onClick={() => {
//                                                 this.setState({
//                                                     result_select: 2,
//                                                     cur_list: result_list,
//                                                 })
//                                             }}>
//                                             Only mp3
//                                         </div>
//                                     </div>
//                                     {/*表格头*/}
//                                     {
//                                        cur_list.length>0?
//                                           <div className="result-form-title-box result-form">
//                                               <div className="result-title">Resoultion</div>
//                                               <div className="result-title">File size</div>
//                                               <div className="result-title">Download</div>
//                                           </div>
//                                           : <p className='noSound_tips'>
//                                              {
//                                                  result_select===0 ?
//                                                    "we can't find any video on this URL"
//                                                    : result_select===1 ?
//                                                    "we can't find any mute video on this URL"
//                                                    :
//                                                    "we can't find any mp3 file"
//                                              }
//                                           </p>
//                                     }
//                                     {
//                                         cur_list.map((item, index) => {
//                                             return (
//                                                 <div className="result-form-detail-box result-form" key={index}>
//                                                     <div className="result-title">{item.quality}</div>
//                                                     <div  className="result-title">{tools.transformKb(result_select === 2 ? item.audioSize : item.size)}</div>
//                                                     <div className="result-title">
//                                                         <div className="reuslt-download-btn"
//                                                              onClick={()=>{this.setState({grab_data: item})}}>
//                                                             Download
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )
//                                         })
//                                     }
//                                 </div>
//                             </div>
//                         ) : ''
//                     }
//
//
//                     {/*宣传语*/}
//                     <div className="ad-slogan">We also support more than 800+ websites video download , like
//                         Twitter/Facebook/Instagram…
//                     </div>
//                     {/*特点*/}
//                     <div className="special-box">
//                         <div className="special-item">
//                             <div className="special-item-image"
//                                  style={{backgroundImage: 'url(' + icon_free + ')'}}></div>
//                             <div className="special-item-t-0">Free</div>
//                             <div className="special-item-t-1">Download anything, <br/>pay nothing</div>
//                         </div>
//                         <div className="special-item">
//                             <div className="special-item-image"
//                                  style={{backgroundImage: 'url(' + icon_easy + ')'}}></div>
//                             <div className="special-item-t-0">Easy</div>
//                             <div className="special-item-t-1">Paste an URL,<br/> then everything is done!</div>
//                         </div>
//                         <div className="special-item">
//                             <div className="special-item-image"
//                                  style={{backgroundImage: 'url(' + icon_safely + ')'}}></div>
//                             <div className="special-item-t-0">Safely</div>
//                             <div className="special-item-t-1">We don’t track you,<br/> no accounts required</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     filter() {
//         const {stream} = this.state.result_data;
//         var list = []
//         var list_noSound = []
//         stream.map((item, index) => {
//             if (item.hasAudio == 1) {
//                 list.push(item)
//             } else {
//                 list_noSound.push(item)
//             }
//         })
//         this.setState({
//             result_list: list,
//             result_list_noSound: list_noSound,
//             cur_list: list
//         })
//     }
//
//     //发送分析
//     analyze() {
//         if (tools.trim(this.state.website) === '') {
//             Message('Please Enter link');
//             return
//         }
//         // this.props.show_loading();
//         this.setState({
//             showFail:false,
//             showAnalyzing: true,
//             result_data: null
//         });
//         $.ajax({
//             dataType: 'json',
//             type: 'get',
//             url: API.analyze,
//             data: {
//                 url: tools.base64(this.state.website),
//             }
//         }).done((res) => {
//             // this.props.hide_loading();
//             this.setState({
//                 showAnalyzing: false
//             })
//             if (parseInt(res.code) === 200) {
//                 if (res.data.stream.length > 0) {
//                     this.setState({
//                         result_data: res.data
//                     }, () => {
//                         this.filter()
//                     })
//
//                 }else {
//                     this.setState({
//                         showFail:true
//                     })
//                 }
//             }
//         })
//     }
// }
//
// export default Grab;