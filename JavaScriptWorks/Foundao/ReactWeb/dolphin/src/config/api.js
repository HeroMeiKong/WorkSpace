/**
 * Created by DELL on 2018/10/8.
 */
// import {API_HOST} from './baseConfig';

// const host = API_HOST;
// const https = 'https://cd.foundao.com:10081/' //预上线转码服务器
// const https = 'https://www.convert-mp4.com/' //线上转码服务器
// 
// const hosts = 'https://cd.foundao.com:10081/foundao_api/'//预上线
// const hosts = 'https://www.convert-mp4.com/api/'//线上

/*
 * package 配置代理
 * "proxy": "http://cms-live.foundao.com/"
 * */

const _hostname = window.location.hostname;

// let _environment = 'test'; // 环境变量 online/pre/test -> 正式/预上线/测试

const test_config = {  // 测试环境配置
  API_TRANS: 'https://cd.foundao.com:10081/',
  API_BASE: 'https://cd.foundao.com:10081/foundao_api/',
  WSS: 'wss://cd.foundao.com:10081/sock/',
  return_url: 'https://cd.foundao.com:10081/foundao/dolphin/',
  return_url_user: 'https://cd.foundao.com:10081/foundao/dolphin/#/user',
  return_url_purchase: 'https://cd.foundao.com:10081/foundao/dolphin/#/purchase'
};

const online_config = {  // 正式环境配置
  API_TRANS: 'https://www.convert-mp4.com/',
  API_BASE: 'https://www.convert-mp4.com/api/',
  WSS: 'wss://www.convert-mp4.com/sock/',
  return_url: 'https://www.convert-mp4.com/',
  return_url_user: 'https://www.convert-mp4.com/user',
  return_url_purchase: 'https://www.convert-mp4.com/purchase'
};

let _config = test_config;  // 默认测试环境

if (_hostname === 'www.convert-mp4.com') {
  _config = online_config;
}
const hosts = _config.API_BASE
const https = _config.API_TRANS
const webSorket = _config.WSS
const return_url = _config.return_url
const return_url_user = _config.return_url_user
const return_url_purchase = _config.return_url_purchase
export default {
  // =============所有api在此处管理============

  // return_url: 'https://cd.foundao.com:10081/foundao/dolphin/',//预上线返回url
  // return_url: 'https://www.convert-mp4.com/',//线上返回url
  return_url,
  return_url_user,
  return_url_purchase,
  getServerTime: 'cgi/sys/get_server_time',

  // 系统管理
  // login: host + 'systemUser/login',              // 用户登录
  get_auth_url: hosts + 'login/get_auth_url',     //第三方登录获取授权登录地址
  getUploadToken: hosts + 'cgi/upload/get_token', //获取每次上传的token
  login: hosts + 'login/dologin',                 // 用户登录
  signout: hosts + 'login/out',                   //用户退出登录
  signup: hosts + 'register/email',               //邮箱注册
  getToken: hosts + 'user/upload/get_token',      //获取上传令牌
  uploadPic: hosts + 'cgi/upload/single',         //上传图片
  getGoods: hosts + 'cgi/transcode/package',      //获取套餐
  create_order: hosts + 'order/index/create_order',//订单提交
  payment: hosts + 'order/index/payment?',        //获取支付预处理接口
  pay: hosts + 'order/index/pay',                 //支付执行
  get_storage_size: hosts + 'resource/transcode/get_storage_size',//用户套餐量及使用量
  downloadFile: hosts + 'cgi/resource/get_download',//转码文件下载
  resetPassword: hosts + 'login/get_back_pwd',//重制邮箱密码
  get_lists: hosts + 'resource/transcode/get_lists',//转码的文件列表
  statistics: hosts + 'cgi/stats/h?sid=4791957956777099048',
  // webSorket: 'wss://cd.foundao.com:10081/sock/', //预上线wss
  // webSorket: 'wss://www.convert-mp4.com/sock/', //线上wss
  webSorket,
  startTransCode: https + 'Transcode',              // 开始转码
  transCodeStatus: https + 'TranscodeStatus',       // 转码状态
  downloadVideo: https + 'DownloadVideo?transMD5=',           // 下载
  qureyMeidiaInfo: https + 'QueryMediaInfo', //查询视频详细信息
  GetInFilePath: https + 'GetInFilePath',//查询视频地址
}