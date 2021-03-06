!(function() {
  window.hardwareInfo = '';
  // 获取 IOS 硬件信息
  function getIOSInfo() {
    console.log('getIOSInfo');
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.getHardwareParameter
    ) {
      window.webkit.messageHandlers.getHardwareParameter.postMessage(getVersion());
    }
    // iOS 这里是没得返回值的, 返回值在下面的方法里参数
  }
  // 获取 IOS 硬件信息回调(方法名字固定的不要改)
  window.getHardwareParameterCallback = function(param) {
    // 这里是 iOS 给前端的数据
    window.hardwareInfo = param;
  };
  // 获取 Android 硬件信息
  function getAndroidInfo() {
    console.log('getAndroidInfo');
    if (android) return android.getHardwareParameter(getVersion());
    return 'ssss';
  }
  // 获取 PC 硬件信息
  function getPCInfo() {
    console.log('getPCInfo');
    return 'getPCInfo success!' + getVersion();
  }
  // 监听获取按钮
  window.getHardwareInfo = function() {
    //判断访问终端
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //判断iPhone|iPad|iPod|iOS
      getIOSInfo();
    } else if (/(Android)/i.test(navigator.userAgent)) {
      //判断Android
      window.hardwareInfo = getAndroidInfo();
    } else {
      //pc
      window.hardwareInfo = getPCInfo();
    }
    if (window.hardwareInfo) return window.hardwareInfo;
    return '';
  };
  // 获取版本号
  function getVersion() {
    return 'V0.0.1';
  }
})();
