// 抖音极速版 2021-07-19 更新

// 定义常量，根据规则手动改修改

// 执行自动刷抖音极速版
autoImplementDY();

// 自动刷抖音函数
function autoImplementDY() {
  launchApp();
}

// 检测当前任务状态
function checkTaskStatus() {}

// 关闭弹窗（升级、活动等）
function closePopup() {}

// 打开抖音极速版
function launchApp(){
  let isLauchApp = false;
  while(!isLauchApp){
    log("尝试启动");
    launchPackage("com.ss.android.ugc.aweme.lite");
    sleep(8000);
    isLauchApp=id("com.ss.android.ugc.aweme.lite:id/kh").findOnce();
    log("启动id: ", isLauchApp);
  }
  let mesbox=id("com.ss.android.ugc.aweme.lite:id/al3").findOnce();
  if(mesbox){
    mesbox.click();
  }
  log("已启动");
}

// 退出抖音极速版
function quitApp() {}

// 滑动视频
function swiperVideo() {}
