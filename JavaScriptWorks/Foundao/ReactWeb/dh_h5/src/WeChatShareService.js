import $ from 'jquery'
export default class WeChatShareService {
  /**
   *  WeChatShareService 微信分享工具类，用于分享到朋友圈，发送给朋友
   *  接口地址 http://appms.app.cntvwb.cn/appms/wxjs/getsign.do
   * @requires jquery
   * @param title {String} title  分享的标题
   * @param imgUrl {String} imgUrl  分享的图片地址
   * @param desc {String} desc  分享的描述
   */
  constructor(title, imgUrl, desc,link) {
    var locatUrl = encodeURI(window.location.href.split('#')[0]);
    link = link || window.location.href;
    alert(locatUrl)
    var url = "http://appms.app.cntvwb.cn/appms/wxjs/getsign.do";
    var data_weixin = {appid: "wx6736e1ee7f82ba26", url: locatUrl, f: "jsonp"};
    $.ajax({
      url: url,
      type: "get",
      data: data_weixin,
      dataType: 'jsonp',
      jsonp: "cb",
      jsonpCallback :"wx_sign_cb",
      success: function (_data) {
        console.log(_data);
        window.wx.config({
          debug: true,
          appId: "wx6736e1ee7f82ba26",
          timestamp: _data.data.timestamp,
          nonceStr: _data.data.nonceStr,
          signature: _data.data.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
          ]
        });
      },
      timeout: 10000,
      error: function () {
      }
    });
    window.wx.ready(function () {
      // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
      window.wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link,
        imgUrl: imgUrl, // 分享图标
        type: 'link' // 分享类型,music、video或link，不填默认为link
      });
      window.wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link,
        imgUrl: imgUrl, // 分享图标
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  }
  /**
   * 修改分享内容
   * @param title {String} title  分享的标题
   * @param imgUrl {String} imgUrl  分享的图片地址
   * @param desc {String} desc  分享的描述
   * @param link {String} link  分享的url地址
   */
  changeShareContent(title, imgUrl, desc, link) {
    link = link || window.location.href;
    window.wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link,
      imgUrl: imgUrl, // 分享图标
      type: 'link' // 分享类型,music、video或link，不填默认为link
    });
    window.wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link,
      imgUrl: imgUrl, // 分享图标
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  };

}
