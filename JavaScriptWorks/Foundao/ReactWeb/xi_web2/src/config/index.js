/**
 * Created by DELL on 2019/5/15.
 */
const h5_live_base = 'http://cdn-live.foundao.com/foundao_live/#/watch/';
// 获取h5url
function getH5_url(packageId) {
  return h5_live_base + packageId
}
export {getH5_url};