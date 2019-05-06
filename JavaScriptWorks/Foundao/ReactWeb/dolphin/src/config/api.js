/**
 * Created by DELL on 2018/10/8.
 */
// import {API_HOST} from './baseConfig';

// const host = API_HOST;
const https = 'https://cd.foundao.com:10081/' //转码服务器

// const hosts = 'http://cd.foundao.com:10080/foundao_api/' //本地
const hosts = 'https://cd.foundao.com:10081/foundao_api/'//预上线
// const hosts = 'https://www.convert-mp4.com/api/'//线上

/*
 * package 配置代理
 * "proxy": "http://cms-live.foundao.com/"
 * */

export default {
  // =============所有api在此处管理============

  // return_url: 'http://localhost:3000/',//返回url
  return_url: 'https://cd.foundao.com:10081/foundao/dolphin/',//返回url
  // return_url: 'https://www.convert-mp4.com/react_prj/',//返回url

  // 系统管理
  // login: host + 'systemUser/login',                 // 用户登录
  get_auth_url: hosts + 'login/get_auth_url',//第三方登录获取授权登录地址
  getUploadToken: hosts + 'cgi/upload/get_token',//获取每次上传的token
  login: hosts + 'login/dologin',                 // 用户登录
  signup: hosts + 'register/email',//邮箱注册
  getToken: hosts + 'user/upload/get_token',//获取上传令牌
  uploadPic: hosts + 'cgi/upload/single',//上传图片
  getGoods: hosts + 'cgi/transcode/package',//获取套餐
  create_order: hosts + 'order/index/create_order',//订单提交
  payment: hosts + 'order/index/payment?',//获取支付预处理接口
  pay: hosts + 'order/index/pay',//支付执行
  get_storage_size: hosts + 'resource/transcode/get_storage_size',//用户套餐量及使用量
  downloadFile: hosts + 'cgi/resource/get_download',//转码文件下载
  resetPassword: hosts + 'login/get_back_pwd',//重制邮箱密码
  get_lists: hosts + 'resource/transcode/get_lists',//转码的文件列表
  // webSorket: 'ws://foundao.f3322.net:5001/',       // ws
  // webSorket: 'ws://foundao.f3322.net:15001/',       // ws
  webSorket: 'wss://cd.foundao.com:10081/sock/', //wss
  startTransCode: https + 'Transcode',              // 开始转码
  transCodeStatus: https + 'TranscodeStatus',       // 转码状态
  downloadVideo: https + 'DownloadVideo?transMD5=',           // 下载
  qureyMeidiaInfo: https + 'QueryMediaInfo', //查询视频详细信息
  GetInFilePath: https + 'GetInFilePath',//查询视频地址
}