/**
 * Created by DELL on 2019/5/13.
 */

import scenes1 from '@/assets/images/h5/scene1.png';
import scenes2 from '@/assets/images/h5/scene2.png';
import scenes3 from '@/assets/images/h5/scene3.png';
import scenes4 from '@/assets/images/h5/scene4.png';
import scenes5 from '@/assets/images/h5/scene5.png';
import scenes6 from '@/assets/images/h5/scene6.png';
const scenes = [
  {name: '横屏+图文', value: 'base-simple', img: scenes1, 'tips': '传统的直播包装模式，自定义直播场景功能，快速包装快速分发'},
  {name: '横屏+多机位', value: 'base', img: scenes2, tips: '多个直播镜头，任意切换镜头查看直播现场状况，感受现场的气氛'},
  {name: '横屏+主题背景', value: 'activity', img: scenes3, tips: '自定义背景图片，更直观的展示直播主题，打造个性化的直播包装'},
  {name: '竖屏+互动', value: 'interaction', img: scenes4, tips: '当下最流行的直播包装设计，提供多维度的互动方式，活跃直播气氛 (9：16直播)'},
  {name: '横屏+互动', value: 'interaction-horizontal', img: scenes6, tips: '当下最流行的直播包装设计，提供多维度的互动方式，活跃直播气氛 (16：9直播)'},
  {name: '纯音频', value: 'audio', img: scenes5, tips: '即将开放', disabled: true},
];

const menuType = [
  {name: '直播介绍', value: 'intro'},
  {name: '图文直播', value: 'it'},
  {name: '评论互动', value: 'comment'},
  {name: '聊天互动', value: 'chat'},
  {name: '视频', value: 'video'},
  {name: '榜单排行', value: 'rank'},
]
export {
  scenes, menuType
}