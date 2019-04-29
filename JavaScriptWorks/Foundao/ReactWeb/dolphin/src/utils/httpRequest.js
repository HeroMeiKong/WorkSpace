/**
 * Created by DELL on 2017/12/27.
 */
import $ from 'jquery';
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

  const data = obj.data || {};
  return $.ajax({
    url: obj.url,
    type: obj.type || 'GET',
    async: async,
    dataType: obj.dataType || 'json',
    data: data,
  }).done(resp=> {
  }).fail(err => {
  });
};