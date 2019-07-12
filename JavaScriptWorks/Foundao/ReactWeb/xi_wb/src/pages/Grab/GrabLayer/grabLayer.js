// import React, {Component,Fragment} from 'react';
// import './grabLayer.scss';
// import {connect} from 'react-redux';
// import {login, logout, show_loading, hide_loading} from './../../../redux/models/admin';
// import tools from './../../../utils/tool';
// import $ from 'jquery';
// import classNames from 'classnames';
// import API from './../../../API/grabApi';
// import {Message} from 'element-react';
//
// @connect(
//     state => ({admin: state.admin}),
//     {login, logout, show_loading, hide_loading}
// )
//
// class GrabLayer extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             step: 0,
//             percent: 0,
//             download_url: '',
//         };
//
//     }
//
//     componentWillMount() {
//         this.submitDownload()
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
//     // shouldComponentUpdate() {
//     //
//     // }
//
//     render() {
//         const {step, percent} = this.state;
//
//
//         return (
//             <div className="grabLayer">
//                 <div className="grabLayer-box">
//                     <div className="close-btn" onClick={() => {
//                         clearInterval(this.timer)
//                         this.props.close()
//                     }}></div>
//                     {
//                         step === 0 ? (
//                                 <div className="grabLayer-progress-box">
//                                     <div className="grabLayer-progress-out">
//                                         <div className="grabLayer-prgress" style={{width: percent + '%'}}></div>
//                                     </div>
//                                     <div className="grabLayer-prgress-tips">Preparing to download your video, please wait a second…</div>
//                                 </div>
//                             )
//                             : (
//                               <Fragment>
//                                   <div className="download-box" onClick={() => { this.props.close();}}>
//                                       Download
//                                       <a href={this.state.download_url}> </a>
//                                   </div>
//
//                                   <div className="grabLayer-prgress-tips">It' done! Now download and enjoy your video!</div>
//                               </Fragment>
//                             )
//                     }
//                     {/*<div className="gra-t-0">Thank you for using our free service. If you could click the ads, that*/}
//                     {/*would be a huge help.*/}
//                     {/*</div>*/}
//                     {/*广告位*/}
//                     {/*<div className="ad-box">*/}
//                     {/*<div className="ad-item">*/}
//                     {/*<div className="ad-title" style={{*/}
//                     {/*'WebkitBoxOrient': 'vertical'*/}
//                     {/*}}>He has a hard time because he is poor*/}
//                     {/*</div>*/}
//                     {/*</div>*/}
//                     {/*<div className="ad-item">*/}
//                     {/*<div className="ad-title" style={{*/}
//                     {/*'WebkitBoxOrient': 'vertical'*/}
//                     {/*}}>He has a hard time because he is poor He has a hard time because*/}
//                     {/*he is poor*/}
//                     {/*</div>*/}
//                     {/*</div>*/}
//                     {/*<div className="ad-item">*/}
//                     {/*<div className="ad-title" style={{*/}
//                     {/*'WebkitBoxOrient': 'vertical'*/}
//                     {/*}}>He has a hard time because he is poor*/}
//                     {/*</div>*/}
//                     {/*</div>*/}
//                     {/*</div>*/}
//                     {/*<div className="gra-t-1">Thank you for using our free service. If you could click the ads, that*/}
//                         {/*would be a huge help.*/}
//                     {/*</div>*/}
//                 </div>
//             </div>
//         );
//     }
//
//     submitDownload() {
//         const {src, tagId} = this.props.data;
//         const {type} = this.props;
//
//
//         $.ajax({
//             dataType: 'json',
//             type: 'get',
//             url: API.submitDownloadJob,
//             data: {
//                 url: tools.base64(this.props.website),
//                 tagId: tagId,
//                 type: type === 2 ? 2 : 1,//2是MP3
//             }
//         }).done((res) => {
//             if (parseInt(res.code) === 200) {
//                 this.getJobStatus(res.data.jobId)
//                 this.setState({
//                     percent: res.data.percent,
//                 })
//                 this.timer = setInterval(() => {
//                     this.getJobStatus(res.data.jobId)
//                 }, 1000)
//             }
//         })
//     }
//
//     getJobStatus(jobId) {
//         $.ajax({
//             dataType: 'json',
//             type: 'get',
//             url: API.getJobStatus,
//             data: {
//                 jobId: jobId
//             }
//         }).done((res) => {
//             if (parseInt(res.code) === 200) {
//                 this.setState({
//                     percent: res.data.percent,
//                 })
//                 if (parseInt(res.data.percent) === 100) {
//                     clearInterval(this.timer);
//                     this.setState({
//                         step: 1,
//                         download_url: res.data.downloadUrl
//                     });
//                     // window.open(res.data.downloadUrl)
//                 }
//             }
//         })
//     }
//
//
// }
//
// export default GrabLayer;