/**
 * Created by DELL on 2018/11/6.
 */
;(function () {
  var schemeUrl = {  // scheme地址
    android: '',
    iOS: ''
  };
  var downloadUrl = { // 下载地址
    android: '',
    iOS: ''
  };
  // var
  window.openApp = {
    is_wxBrowser: function () {
      return /micromessenger/.test(navigator.userAgent.toLowerCase());
    },
    is_iOS: function () {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    is_android: function () {
      return /android/i.test(navigator.userAgent);
    },
    open: function () {
      // 微信环境
      if (this.is_wxBrowser()) {
        this.openAppInWx();
      } else {                     // 非微信环境
        this.openAppNotInWx();
      }
    },
    // 非微信环境
    openAppNotInWx: function () {
      if (this.is_iOS()) {                 //  iOS
        window.location.href = schemeUrl.iOS; // 应跳到APP中相对应的详情页
        setTimeout(function () {
          location.href = downloadUrl.iOS;
        }, 2000);
      } else {                             // android
        var ifr = document.createElement('iframe');
        ifr.src = schemeUrl.android; // 应跳到APP中相对应的详情页
        ifr.style.display = 'none';
        var last = Date.now();
        document.body.appendChild(ifr);
        // 程序切换到后台，计时器会被推迟
        setTimeout(function () {
          document.body.removeChild(ifr);
          if (Date.now() - last <= 1500) {
            location.href = downloadUrl.android;    // 唤起失败，进入下载页
          } else {
            // 呼起成功
          }
        }, 1000);
      }
    },
    // 微信环境
    openAppInWx: function () {
      if (this.is_android()) { // android 直接通过应用宝 呼起app

      } else {                 // ios

      }
    }

  };
})();