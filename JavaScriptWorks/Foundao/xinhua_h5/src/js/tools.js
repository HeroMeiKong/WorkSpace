/**
 * Created by DELL on 2018/9/17.
 */
var tools = {
  /*截取url参数。转化成obj形式*/
  getParams: function () {
    var url = decodeURI(window.location.href);
    var theRequest = {};
    var start = url.indexOf("?");
    // var start = url.lastIndexOf("?");// ios现在是两个问号
    if (start !== -1) {
      var str = url.substr(start + 1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },
  is_wxBrowser: function () {
    return /micromessenger/.test(navigator.userAgent.toLowerCase());
  },
  is_iOS: function () {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
  },
  is_android: function () {
    return /android/i.test(navigator.userAgent);
  },
  // 1000 -> 1k
  numToString: function (num) {
    var __zan = parseInt(num);
    if (__zan / 1000 >= 1) {
      __zan = (__zan / 1000).toFixed(1) + "k";
    }
    return __zan;
  }
};

/*
 * params: object
 *
 * object.url:   api地址 String， 不能为空
 * object.type:  请求方式 String， 默认get
 * object.async: 是否异步 Boolean，默认true
 * object.data:  请求数据 object， 默认{}
 * */
var httpRequest = function (obj) {
  var async = true; // 异步
  if (typeof(obj.async) === 'undefined') {
    async = true;
  } else {
    async = Boolean(obj.async);
  }
  var data = obj.data || {};
  return $.ajax({
    url: obj.url,
    type: obj.type || 'GET',
    headers: {
      'device-token': 'h5_deviceToken'
    },
    async: async,
    dataType: 'json',
    data: data
  })
};