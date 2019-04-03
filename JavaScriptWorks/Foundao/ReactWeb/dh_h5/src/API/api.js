let host = 'http://m.app.cctv.com/json/jsonp?url=';
let cb = '&cb=';
// let zs = ' http://media.app.cctv.com/';
let zs = 'http://media.app.cntvwb.cn/';
let cs = 'http://115.182.9.167/';
export default {
  // recommendList : host + 'http://cbox.cntv.cn/json2015/moban60/shicishouye/index.json'+cb,//测试数据

  recommendList :  host + 'http://cbox.cntv.cn/json2015/fenleierjiye/caijing/duihua/dh/index.json'+cb,
  pageHeader:zs + 'vapi/media/info.do?mid=17aQfAjy0815&client=h5'+cb,
  onlinePerson:host+'https://common.itv.cctv.com/scdhht/totalv2'+cb,
  sub : zs + 'vapi/media/sub.do?mid=17aQfAjy0815&client=h5' ,
  unsub : zs + 'vapi/media/unsub.do?mid=17aQfAjy0815&client=h5',
}