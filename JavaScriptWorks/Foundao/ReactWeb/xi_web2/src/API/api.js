import {API_TRANS, API_BASE, WS, RETURN_F, API_MESSAGE} from './baseConfig';
import h5package from './h5packageApi';

const host = API_TRANS;  //转码接口
const base = API_BASE;  //非转码接口
const message = API_MESSAGE;//留言板接口
const ws = WS

/*
* package 配置代理
* "proxy": "http://cms-live.foundao.com/"
* */
// =============所有api在此处管理============

const apiList = {
  getUploadToken: base + 'cgi/upload/get_token', //获取上传文件token
  getClipUploadToken: base + 'm/clip/cgi/upload/get_token',//获取单段视频裁剪上传token
  mulisplicingToken: base + 'm/mulisplicing/cgi/upload/get_token',//获取多段拼接上传token
  watermarkToken: base + 'm/watermark/cgi/upload/get_token',//获取加水印上传token
  removewaterToken : base + 'm/remove/cgi/upload/get_token',//去水印上传token
  webSorket: ws,       // ws
  startTransCode: host + 'Transcode',              // 开始转码
  transCodeStatus: host + 'TranscodeStatus',       // 转码状态
  downloadVideo: base + 'cgi/resource/get_download',           // 下载
  qureyMeidiaInfo: host + 'QueryMediaInfo', //查询视频详细信息
  GetInFilePath: host + 'GetInFilePath',//获取视频链接
  // get_now_package: base + 'resource/transcode/get_now_package',  //获取用户当前转码套餐信息
  get_now_package: base + 'user/serve/get_vip_info',  //获取用户当前转码套餐信息
  create_order: base + 'order/index/create_order', //订单提交
  payment: base + 'order/index/payment', //支付接口
  pay: base + 'order/index/pay',//paypal支付接口
  query_order: base + 'order/index/query', //查询订单状态
  get_auth_url: base + 'login/get_auth_url',     //第三方登录获取授权登录地址
  loginOut: base + 'login/out',// 安全退出登录
  userPackage: base + 'cgi/transcode/package', // 获取商品套餐
  get_server_time: base + 'cgi/sys/get_server_time',
  get_download_url: host + 'DownloadVideo', //获取下载所需的视频地址
  trans_num: base + 'cgi/resource/trans_number', //处理业务次数
  pv_tj: base + 'cgi/stats/h?sid=4791957956777099047', //pv统计
  pv_tj_h5package: base + 'cgi/stats/h?sid=4791957956777099044', // h5直播包装pv统计
  delete_vip: base + 'cgi/sys/del_vip', //删除vip
  upload_img: base + 'cgi/upload/single', //上传单文件图片
  save_moudle: base + 'm/watermark/resource/templet/save', //保存模板
  moudle_list: base + 'm/watermark/resource/templet/get_lists', //模板列表
  delete_moudle: base + 'm/watermark/resource/templet/del', //删除模板
  get_orders_state: base + 'order/index/get_orders_state', //查询多个订单是否支付
  bind_order: base + 'order/process/bind', //绑定订单
  get_dynamicsWatermaker: base + 'm/watermark/cgi/trans/convert',// 提交拓道杨彬的处理视频系统的动态水印
  get_status: base + 'm/watermark/cgi/trans/get_status',//查询拓道杨彬的处理视频系统的任务状态
  msgboard_add: base + 'bbs/msgboard/add',//提交留言板
  masternote: base + 'bbs/masternote/latest',//站长记事本最新一条
  msgboard_list: base + 'bbs/msgboard/lists',//留言板列表
  masternotes: base + 'bbs/masternote/lists',//站长记事列表
  getWatermarkMeal: base + 'm/watermark/cgi/transcode/package',//水印VIP商品
  getVipForwatermark: base + 'm/watermark/user/serve/get_vip_info',//获取当前自己水印VIP服务信息
  up_end: base + 'stats/resource/up_end',//上传成功统计

  /**多段拼接**/
  muli_get_vip_info: base + 'm/mulisplicing/user/serve/get_vip_info',//获取当前自己多段拼接VIP服务信息
  getMuliPackage: base + 'm/mulisplicing/cgi/transcode/package',//多段拼接VIP商品
  VideoConcat: host + 'VideoConcat',//拼接视频
  VideoConcatStatus: host + 'VideoConcatStatus',//请求拼接进度
  GetConcatOutPath: host + 'GetConcatOutPath',//请求拼接的输出视频

  /*评价*/
  poststar:base + 'stats/resource/set_star',//评价
  starTimes : base + 'stats/resource/star',//评分弹窗出现的次数

  /**去水印**/
  removeGetVipInfo : base + 'm/remove/user/serve/get_vip_info',//获取当前自己去水印VIP服务信息
  removePage : base + "m/remove/cgi/transcode/package",//去水印商品信息

  /*以下为直播包装接口*/
  ...h5package,

  //留言板
  submit_message: message + 'message/submit_message.php',
  get_message: message + 'message/get_message.php',
  get_project: message + 'message/get_project.php',


  //回调地址
  return_url: RETURN_F,


  //抓站
  grab_analyze: base + 'crawler/analyze',
  grab_submitDownloadJob: base + 'crawler/submitDownloadJob',
  grab_getJobStatus: base + 'crawler/getJobStatus',

  //登录注册
  send_mobile_code: base + 'register/get_mobile_captcha',
  is_register: base + 'register/is_register',
  check_mobile: base + 'login/get_back_pwd',
  get_captcha: base + 'register/get_chart_captcha',
  mobile_register: base + 'register/mobile',
  email_register: base + 'register/email',
  login: base + 'login/dologin',
};

export default apiList