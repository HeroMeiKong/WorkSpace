/**
 * Created by DELL on 2018/8/29.
 */
import tool from './tool';
// import {Notification} from 'element-react';
// import $ from 'jquery';
const $ = window.jQuery;
window.is_expired = false; // 是否登录过期了 防止同时请求多个接口，弹出多个过期提示
export default  function httpRequest(options, admin) {
  const {url, type = 'POST', dataType = 'json', data = {}, async = true} = options;
  let ajax_data = {...data};
  if (admin) {
    if (admin.isLogin) {  // 登陆了传token
      ajax_data = {...data, token: admin.token};
    } else {             // 未登录传x_sid
      ajax_data = {...data, sid: admin.sid};
    }
  }
  const userInfo = tool.getUserData_storage();
  if (userInfo.token) {
    ajax_data.token = userInfo.token;
  }
  return $.ajax({
    url: url,
    type: type.toUpperCase(),
    dataType: dataType,
    async: async,
    data: ajax_data,

  }).done(resp => {
    if (resp.code === '-1000') { // 登录过期
      if(!window.is_expired){
        window.is_expired = true;
        // Notification({
        //   title: '登录过期',
        //   message: 'token已失效，请重新登录',
        //   type: 'error',
        // });
        setTimeout(function () {
          tool.removeUserData_storage();
          const current_url = encodeURIComponent(window.location.href);
          window.is_expired = false;
          window.location.href = window.location.origin + '/user/login?callback=' + current_url;
        }, 1500);
        return false;
      }
    }
  })
}