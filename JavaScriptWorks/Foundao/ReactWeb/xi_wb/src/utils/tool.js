const jQuery = window.jQuery;

/* eslint-disable */
var Tool = {
  addEventHandler: (target, type, fn) => {
    if (target.addEventListener) {
      target.addEventListener(type, fn);
    } else {
      target.attachEvent('on' + type, fn);
    }
  },
  removeEventHandler: (target, type, fn) => {
    if (target.removeEventListener) {
      target.removeEventListener(type, fn);
    } else {
      target.detachEvent('on' + type, fn);
    }
  },
  // 检查当前是否是手机环境
  isPc: function () {
    var os = function () {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
      };
    }();
    // console.log(os);
    return os.isPc
  },
  timeModel(time) {
    var time = Math.round(parseFloat(time));
    var second = parseInt(time % 60);
    var minute = parseInt((time - second) / 60) % 60;

    var res = this._addZero(minute) + ":" + this._addZero(second);
    return res
  },
  // 精确到帧
  timeModel_zhen(time) {
    var t = Math.floor(parseFloat(time));//秒数取整
    var zhen = Math.floor((time - t) * 1000 / 40);//帧数
    var second = parseInt(t % 60);
    var minute = parseInt((time - second) / 60) % 60;

    var res = this._addZero(minute) + ":" + this._addZero(second) + ":" + this._addZero(zhen);
    return res
  },
  fen_miao(time) {
    var time = Math.round(parseFloat(time));
    var second = parseInt(time % 60);
    var minute = parseInt((time - second) / 60) % 60;

    var res = ((minute === 0) ? '' : (minute + '分')) + second + '秒';
    return res
  },
  _addZero(obj) {
    if (obj < 10)
      return "0" + obj;
    else
      return obj;
  },
  getVideoModel(name) {
    var n = name.split('?')[0];
    var end = n.lastIndexOf('.');
    return n.substring(end + 1);
  },
  timeFormat(num) {
    num = parseInt(num)
    if (!isNaN(num) && num) {
      var hour = Math.floor(num / 3600)
      var min = Math.floor((num - hour * 3600) / 60)
      var second = num % 60
      return (hour ? this._addZero(hour) + ':' : '') + this._addZero(min) + ':' + this._addZero(second)
    } else {
      return 0
    }
  },
  getRequest() {
    var url = decodeURI(window.location.href);
    var theRequest = new Object();
    var start = url.lastIndexOf("?");//ios现在是两个问号
    if (start != -1) {
      var str = url.substr(start + 1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        var e = strs[i].indexOf('=');
        theRequest[strs[i].substring(0, e)] = unescape(strs[i].substring(e + 1));
      }
    }
    return theRequest;
  },
  width(ele) {
    if (ele instanceof jQuery) {
      return ele[0].getBoundingClientRect().width;
    } else {
      return ele.getBoundingClientRect().width;
    }
  },
  height(ele) {
    if (ele instanceof jQuery) {
      return ele[0].getBoundingClientRect().height;
    } else {
      return ele.getBoundingClientRect().height;
    }
  },
  left(ele) {
    if (ele instanceof jQuery) {
      return ele[0].getBoundingClientRect().left;
    } else {
      return ele.getBoundingClientRect().left;
    }
  },
  hexToRgba: (hex, opacity) => {
    return "rgba(" + window.parseInt("0x" + hex.slice(1, 3)) + "," + window.parseInt("0x" + hex.slice(3, 5)) + "," + window.parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
  },
  // rgba -> 16进制 + 透明度
  rgbaToHex: (color) => {
    const rgba = color.split(',');
    const r = parseInt(rgba[0].split('(')[1], 10);
    const g = parseInt(rgba[1], 10);
    const b = parseInt(rgba[2], 10);
    const a = parseFloat(rgba[3].split(')')[0]);
    // const a = parseInt(rgba[3].split(')')[0]);

    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    const alpha = a * 100;
    return {
      hex,
      alpha
    };
  },
  /**bt转换成MB 获取 GB**/
  transformKb: (b) => {
    let B = parseInt(b);
    if (B / (1024 * 1024 * 1024) < 1) {
      return (B / 1024 / 1024).toFixed(1) + 'M'
    } else {
      return (B / (1024 * 1024 * 1024).toFixed(2)) + 'G'
    }
  },
  // rgb -> hex
  rgbToHex: (color) => {
    const rgb = color.split(',');
    const r = parseInt(rgb[0].split('(')[1], 10);
    const g = parseInt(rgb[1], 10);
    const b = parseInt(rgb[2].split(')')[0], 10);
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  },
  // rgba -> 16进制颜色 + 透明度(*255-> 16进制)
  rgbaToHex2: (color) => {
    const rgba = color.split(',');
    const r = parseInt(rgba[0].split('(')[1], 10);
    const g = parseInt(rgba[1], 10);
    const b = parseInt(rgba[2], 10);
    const a = parseFloat(rgba[3].split(')')[0]);
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    let alpha = parseInt(((1 - a) * 255), 10).toString(16);
    if (alpha === '0') {
      alpha = '00'
    }
    return hex + alpha;
  },
  deepClone: (obj) => {     // 对象中没有function
    return JSON.parse(JSON.stringify(obj));
  },
  isSafari: () => {
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  },
  // js获取鼠标点击事件的相对位置
  getOffsetXY: (evt) => {
    if (evt.offsetX && evt.offsetY) return {x: evt.offsetX, y: evt.offsetY};

    let ele = evt.target || evt.srcElement;
    let o = ele;

    let x = 0;
    let y = 0;
    while (o.offsetParent) {
      x += o.offsetLeft;
      y += o.offsetTop;
      o = o.offsetParent;
    }
    // 处理当元素处于滚动之后的情况
    let left = 0;
    let top = 0;
    while (ele.parentNode) {
      left += ele.scrollLeft;
      top += ele.scrollTop;
      ele = ele.parentNode;
    }
    return {x: evt.pageX + left - x, y: evt.pageY + top - y};
  },
  flashChecker: () => {
    var hasFlash = 0;　　　　 //是否安装了flash
    var flashVersion = 0;　　 //flash版本

    if (document.all) {
      var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      if (swf) {
        hasFlash = 1;
        VSwf = swf.GetVariable("$version");
        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
      }
    } else {
      if (navigator.plugins && navigator.plugins.length > 0) {
        var swf = navigator.plugins["Shockwave Flash"];
        if (swf) {
          hasFlash = 1;
          var words = swf.description.split(" ");
          for (var i = 0; i < words.length; ++i) {
            if (isNaN(parseInt(words[i]))) continue;
            flashVersion = parseInt(words[i]);
          }
        }
      }
    }
    return {f: hasFlash, v: flashVersion};
  },
  // 获取页面中url参数
  getParams: function (url) {
    if (!url) {
      url = window.location.href;
    }
    const theRequest = {};
    const start = url.indexOf("?");
    if (start !== -1) {
      const str = url.substr(start + 1);
      const strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },

  //邮箱格式
  isEmail: function (email) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(email)) {
      return true
    } else {
      return false
    }
  },
  // 设置本地用户信息
  setUserData_storage: function (userInfo = {}) {
    // console.log(1222)
    // console.log(userInfo,'25555')
    localStorage.setItem(this.isForeign() ? 'XI_U_F' : 'XI_U', JSON.stringify(userInfo));
    let name = this.isForeign() ? 'XI_U_F' : 'XI_U';
    this.setCookie(name, JSON.stringify(userInfo), 1)
  },

  // 获取storage 的用户信息
  getUserData_storage: function () {
    // const userInfo_string_escape = localStorage.getItem(this.isForeign() ? 'XI_U_F' : 'XI_U');
    let ab = this.getCookie(this.isForeign() ? 'XI_U_F' : 'XI_U');
    const userInfo_string_escape = JSON.parse(ab)
    // console.log(userInfo_string_escape,'11111')
    let userInfo = {};
    if (userInfo_string_escape) {
      userInfo = JSON.parse(userInfo_string_escape);
    }
    return userInfo;
  },
  getCookie: function (name) {
    // console.log('name',name)
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }

  },
  setCookie: function (name, value, day) {
    // console.log(1223)
    if (day !== 0) {     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      var expires = day * 24 * 60 * 60 * 1000;
      var date = new Date(+new Date() + expires);
      var do_str = document.domain;
      if (do_str.indexOf('enjoycut.com') >= 0) {
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/;domain=.enjoycut.com";
      } else if (do_str.indexOf('foundao.com') >= 0) {
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/;domain=.foundao.com";
      } else {
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/";//TODO:测试用
      }
    } else {
      document.cookie = name + "=" + escape(value) + ";path=/" + ";domain=.enjoycut.com";
    }
  },
  delCookie: function (name) {
    this.setCookie(name, ' ', -1);
  },
  isForeign: function () {
    return true //TODO:测试用
    var do_str = document.domain;
    if (do_str.indexOf('zh.enjoycut.com') >= 0) { // 中文
      return false;
    }
    if (do_str.indexOf('enjoycut.com') >= 0 || do_str.indexOf('www.enjoycut.com') >= 0 || do_str.indexOf('before.enjoycut.com') >= 0 || do_str.indexOf('enjoycut-en.foundao.com') >= 0) {
      return true
    } else {
      return false
    }
  },
  // 移除本地用户信息
  removeUserData_storage: function () {
    localStorage.removeItem(this.isForeign() ? 'XI_U_F' : 'XI_U');
    this.delCookie(this.isForeign() ? 'XI_U_F' : 'XI_U')
  },
  // 检测本地是否有网
  checkNetwork: function () {
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g' || connection.effectiveType === '4g') {
      return true
    } else {
      return false
    }
  },
  //base编码
  base64(str) {
    return window.btoa(str)
  },
  //去掉左右空格
  trim(str) {
    return jQuery.trim(str)
  },
  //去水印获取获取当前还能转几次
  getTimes: function () {
    var times = localStorage.getItem('times') * 1;
    var lastDate = localStorage.getItem('Date');
    var date = new Date(),
      d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    // console.log(d)
    // console.log(1222)
    if (!times) {
      localStorage.setItem('times', '3');
      localStorage.setItem('Date', d);
    }
    if (d !== lastDate) {
      localStorage.setItem('times', '3');
      localStorage.setItem('Date', d);
    }
    localStorage.setItem('times', times - 1);
  },
  // 显示loading
  show_loading: function () {
    const content_loading = document.querySelector('.content_loading');
    if (content_loading) {
      content_loading.style.display = 'block';
    }
  },
  // 隐藏loading
  hide_loading: function () {
    const content_loading = document.querySelector('.content_loading');
    if (content_loading) {
      content_loading.style.display = 'none';
    }
  },
};

export default Tool;