/**
 * Created by DELL on 2018/9/17.
 */
var host_url = '//api.newscctv.net/activity/gq_play_2018/';
var base_url = 'https://www.newscctv.net/tap2cdn/tapvol/activities/2018/2018music/';  // 项目根目录

// var _host = '//kjjy-test.foundao.com:88/xinhua_api/';   // api _host
var _host = '//kjjy-test.foundao.com:8099/';   // api _host
var _api = {
  dataFocus_detail: _host + 'dataFocus/articleDetail',   // 聚头条 详情
  articleDetails: _host + 'article/getArticleDetails',           //  稿件的详细内容 详情
  commentList: _host + '/comment/list',           //  评论列表
  cmsDataFocusArticle: _host + 'cms/getDataFocusArticle',   //预览聚头条详情
  cmsArticleDetails: _host + 'cms/getArticleDetails', //预览获取某篇稿件的详细内容
  preview_detail: _host+ '/home/index'  //预览主页详细内容
};
var _config = {
  appID: 'wx074c4003a03d3eb0',
  WXsharebaseIcon: base_url + 'images/wxShare.png',    // 微信分享页面
  WXsharebaseLink: base_url + 'share.html',    // 微信分享页面
  appBaseLink: base_url + 'index.html'    // 项目入口目录
};

var _isDevelopment = true;// 开发环境
var _hostname = window.location.hostname;
/*|| _hostname === 'www.newscctv.net'*/
if (_hostname === 'localhost' || _hostname === '192.168.21.193' || _hostname === 'cdn-live-ori.foundao.com') {
  _isDevelopment = true;
}