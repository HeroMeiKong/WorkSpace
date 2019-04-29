/**
 * Created by DELL on 2019/3/29.
 */
/* eslint-disable */
import _api from '@/config/api';

/* eslint-disable */
function ajax(url, fnSucc, fnFailed) {
  if (window.XMLHttpRequest) {
    var oAjax = new XMLHttpRequest();
  }
  else {
    var oAjax = new window.ActiveXObject("Microsoft.XMLHTTP");//IE6浏览器创建ajax对象
  }
  oAjax.open("GET", url, true);//把要读取的参数的传过来。
  oAjax.send();
  oAjax.onreadystatechange = function () {
    if (oAjax.readyState == 4) {
      if (oAjax.status == 200) {
        if (fnSucc) {
          fnSucc(oAjax.responseText);//成功的时候调用这个方法
        }
      }
      else {
        if (fnFailed) {
          fnFailed(oAjax.status);
        }
      }
    }
  };
}

export default
function startTransCode(options) {
  const {transSuccess, transFail, transProgress, transOptions = {}} = options;
  let g_total_time = 0;      // 转码时间
  let g_trans_progress = 0; // 转码进度
  let g_trans_md5 = ''; // 转码md5

  const trans_begin = (trans_md5) => {
    g_trans_md5 = trans_md5;
    g_total_time = 0;
    g_trans_progress = 0;
    trans_wait();
  };
  const trans_fail = (msg) => {
    if (transFail) {
      transFail(msg)
    }
  };

  const trans_wait = () => {
    var url = _api.transCodeStatus + '?transMD5=' + g_trans_md5 + '&lastProgress=' + g_trans_progress;
    if (g_trans_progress < 100) {
      g_total_time = g_total_time + 1;
    }
    ajax(url, trans_status, trans_fail);
  };
  // 转码状态
  const trans_status = (s) => {
    g_trans_progress = parseInt(s);
    if (g_trans_progress < 0) {
      let errorText = '';
      switch (g_trans_progress) {
        case -1:
          errorText = '转码失败，请重试';
          break;
        case -2:
          errorText = '转码失败：转码文件没找到';
          break;
        case -3:
          errorText = '转码失败：不支持的文件格式';
          break;
        case -4:
          errorText = '转码失败：文件没有流信息';
          break;
        case -5:
          errorText = '转码失败：没找到音视频流';
          break;
        case -6:
          errorText = '转码失败：视频播放时长为负值';
          break;
        case -7:
          errorText = '转码失败：没有适配的音频解码器';
          break;
        case -8:
          errorText = '转码失败：没有适配的视频解码器';
          break;
        case -9:
          errorText = '转码失败：音频解码器打开失败';
          break;
        case -10:
          errorText = '转码失败：视频解码器打开失败';
          break;
        case -11:
          errorText = '转码失败：时长为零';
          break;
        default:
          errorText = '转码失败，错误值:' + g_trans_progress;
          break;
      }
      trans_fail(errorText);
    } else if (g_trans_progress < 100) {
      setTimeout(trans_wait, 1000);
      showTransProgress(g_trans_progress);
      showTransStatus('转码:' + g_total_time + '秒, 当前进度:' + g_trans_progress + '%');
    } else if (g_trans_progress === 100) {
      showTransProgress("100");
      showTransStatus('转码:' + g_total_time + '秒完成, 正在封装文件....');
      //trans_wait();
      setTimeout(trans_wait, 1000);
    }
    else if (g_trans_progress === 200) {
      //200, 转码完成
      showTransProgress("100");
      showTransStatus('转码:' + g_total_time + '秒完成, 恭喜您, 可以访问转码后文件啦！！');
      var url = _api.downloadVideo + g_trans_md5;
      ajax(url, trans_result, trans_fail);
    } else {
      alert("trans_status:" + s);
    }
  };
  // 转码完毕
  const trans_result = (s) => {
    if (transSuccess) {
      transSuccess(s)
    }
    showTransProgress("100");
    showTransStatus('转码时间:' + g_total_time + '秒, 下载地址:' + s);
  };
  // 转码状态
  const showTransStatus = () => {

  };
  // 转码进度
  const showTransProgress = (msg) => {
    if (transProgress) {
      transProgress(msg)
    }
  };
  const optionsJson = JSON.stringify(transOptions);
  const url = `${_api.startTransCode }?t_json=${optionsJson}`;
  ajax(url, trans_begin, trans_fail);
}