/**
 * Created by DELL on 2019/5/15.
 */
const h5_live_base = 'http://cdn-live.foundao.com/foundao_live/#/watch/';
// 获取h5url
function getH5_url(packageId) {
  return h5_live_base + packageId
}
// 中国省份
export const province = [
  '北京',
  '天津',
  '上海',
  '重庆',
  '河北',
  '河南',
  '云南',
  '辽宁',
  '黑龙江',
  '湖南',
  '安徽',
  '山东',
  '新疆',
  '江苏',
  '浙江',
  '江西',
  '湖北',
  '广西',
  '甘肃',
  '山西',
  '内蒙古',
  '陕西',
  '吉林',
  '福建',
  '贵州',
  '广东',
  '青海',
  '西藏',
  '四川',
  '宁夏',
  '海南',
  '台湾',
  '香港',
  '澳门',
];
export {getH5_url};