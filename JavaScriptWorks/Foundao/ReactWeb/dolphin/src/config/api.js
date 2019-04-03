/**
 * Created by DELL on 2018/10/8.
 */
import {API_HOST} from './baseConfig';

const host = API_HOST;

/*
 * package 配置代理
 * "proxy": "http://cms-live.foundao.com/"
 * */

export default {
  // =============所有api在此处管理============

  // 系统管理
  login: host + 'systemUser/login',                 // 用户登录
  webSorket: 'ws://foundao.f3322.net:5001/',       // ws
  startTransCode: host + 'Transcode',              // 开始转码
  transCodeStatus: host + 'TranscodeStatus',       // 转码状态
  downloadVideo: host + 'DownloadVideo',           // 下载
  qureyMeidiaInfo: host + 'QureyMeidiaInfo' //查询视频详细信息
}