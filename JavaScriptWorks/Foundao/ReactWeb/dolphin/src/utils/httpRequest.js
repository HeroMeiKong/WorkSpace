/**
 * Created by DELL on 2017/12/27.
 */
import $ from 'jquery';
// import NProgress from 'nprogress';
// import {Notification} from 'element-react';
import tools from './tools';
/*
 * params: object
 *
 * object.url:   api地址 String， 不能为空
 * object.type:  请求方式 String， 默认get
 * object.async: 是否异步 Boolean，默认true
 * object.data:  请求数据 object， 默认{}
 * */
export default function httpRequest(obj) {
  let async = true; // 异步
  if (typeof(obj.async) === 'undefined') {
    async = true;
  } else {
    async = Boolean(obj.async);
  }

  let token = '';
  let user_uuid = '';
  const userInfo = tools.getUserData_storage();

  if (userInfo.token) {
    token = userInfo.token;
    user_uuid = userInfo.user_uuid;
  }
  const data = obj.data || {};
  // data.userUuid = user_uuid;
  // data.token = token;
  localStorage.setItem('xinhua_lastOperation', new Date().getTime());
  // NProgress.start();
  return $.ajax({
    url: obj.url,
    type: obj.type || 'GET',
    // headers: {
    //   'token': token,
    //   'userUuid': user_uuid,
    // },
    async: async,
    dataType: 'json',
    data: data,
  }).done(resp=> {
    // if (resp.code === -1001) { // 登录过期
    //   Notification({
    //     title: '登录过期',
    //     message: 'token已失效，请重新登录',
    //     type: 'error',
    //   });
    //   setTimeout(function () {
    //     tools.removeUserData_storage();
    //     window.location.href = window.location.pathname;
    //   }, 1500);
    //   return false;
    // }
    // NProgress.done();  // 加载完成
  }).fail(err => {
    // NProgress.done();  // 加载完成
  });
};