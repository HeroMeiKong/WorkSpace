/**
 * Created by DELL on 2018/8/11.
 */
module.exports = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
};
/*
* 微信api异步链式调用
* */

/*
*
* const promisify = require('./promisify')
 const getSystemInfo = promisify(wx.getSystemInfo)
 getSystemInfo().then(res=>{
 // success
 console.log(res)
 }).catch(res=>{

 })
 */