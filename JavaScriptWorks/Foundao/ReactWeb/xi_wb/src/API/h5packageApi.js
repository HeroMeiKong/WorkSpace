/**
 * Created by DELL on 2019/5/13.
 */
import {API_BASE} from './baseConfig';
const base = API_BASE;  //非转码接口

export default {
  packageList: base + 'live/package/index', //【H5包装】列表
  packageEdit: base + 'live/package/edit', //【H5包装】新增
  packageStatus: base + 'live/package/status', //【H5包装】新增
  packageDetail: base + 'live/index/detail', //【H5包装】新增


  editMaster: base + 'live/index/editMaster', // 主镜头-编辑
  editNotice: base + 'live/index/editNotice', // 直播预告-编辑|新增
  editSlave: base + 'live/index/editSlave', // 【直播】分镜头-编辑|新增
  slaveStatus: base + 'live/index/slaveStatus', // 【直播】分镜头-状态
  noticeStatus: base + 'live/index/noticeStatus', // 【直播】直播预告-状态 删除
  editUser: base + 'live/it/editUser', // 【图文直播】人员新增|编辑
  allUser: base + 'live/it/allUser', // 【图文直播】人员列表
  userStatus: base + 'live/it/userStatus', // 【图文直播】人员列表
  imgLiveList: base + 'live/it/index', // 【图文直播】列表
  imgLiveEdit: base + 'live/it/edit', // 【图文直播】新增|编辑
  imgLiveStatus: base + 'live/it/status', // 【图文直播】状态

  //直播间管理-评论审核
  commentList: base + 'live/comment/index', // 评论审核列表
  commentCheck: base + 'live/comment/check', // 审核-通过|不通过
  commentDelete: base + 'live/comment/status', // 状态-删除
  commentTop: base + 'live/comment/top', // 评论审核置顶

  LiveMonitorOnlineList: base + 'live/index/onlineList', // 直播监控-在线列表
  chatHistory: base + 'live/chat/history', // 直播监控-聊天历史记录
  chatForbid: base + 'live/chat/forbid', // 直播监控-禁言
  chatForbidList: base + 'live/chat/forbidList', // 直播监控-禁言名单
  chatAdminChat: base + 'live/chat/adminChat', // 直播监控-禁言名单
  downloadOnlineList: base + 'upload/download/onlineList', // 直播监控-禁言名单


  //H5页面管理
  BaseInfoManger: base + 'live/package/editBase', //基础信息设置-保存
  menuSetList: base + 'live/package/allMenu', // 页面菜单设置列表
  menuSetStatus: base + 'live/package/menuStatus',// 页面菜单设置-菜单状态
  menuSetSave: base + 'live/package/editAllMenu', //页面菜单设置-菜单保存
  videoList: base + 'live/video/index',         //【精彩视频】列表
  videoEdit: base + 'live/video/edit',          //【精彩视频】新增|编辑
  videoStatus: base + 'live/video/status',        //【精彩视频】删除
  editShare: base + 'live/package/editShare',        //【精彩视频】删除

  // 广告
  ad_mainStatus: base + 'live/poster/mainStatus',        //【广告】广告总开关
  ad_list: base + 'live/poster/index',                   //【广告】列表
  ad_edit: base + 'live/poster/edit',                    //【广告】新增|编辑
  ad_status: base + 'live/poster/status',                //【广告】状态|编辑

  // 投票
  voteList: base + 'live/vote/index',                //  列表
  editVote: base + 'live/vote/editVote',                //  列表
  voteStatus: base + 'live/vote/status',                //  列表
  voteStatistics: base + 'live/vote/statistics',                //  列表

  // 答题
  questionList: base + 'live/question/index',                   //  列表
  questionDetail: base + 'live/question/detail',                //  详情
  questionMainEdit: base + 'live/question/editMain',            // 题库-新增|编辑
  questionMainStatus: base + 'live/question/mainStatus',        // 题库-状态-删除
  questionItemEdit: base + 'live/question/edit',                // 题目-新增|编辑
  questionItemStatus: base + 'live/question/status',            // 题目-新增|编辑
  questionSelect: base + 'live/question/select',                // 题库-下啦列表
  questionCorrectList: base + 'live/question/correctList',      // 题库-所以竞猜记录


  // 点赞 【打赏】
  zanIconList: base + 'live/package/zanIconList',      // 点赞所有样式
  setZanIcon: base + 'live/package/setZanIcon',      // 设置点赞样式
  giftListAll: base + 'live/gift/giftList',          // 【打赏】礼物列表
  openGift: base + 'live/package/openGift',          // 【打赏】礼物列表
  editGift: base + 'live/gift/editGift',          // 【打赏】礼物列表
  giftStatus: base + 'live/gift/giftStatus',          // 【打赏】礼物列表
  // 礼物
  // 商品
  goodsList: base + 'live/gift/goodList',          // 【商品】列表
  editGood: base + 'live/gift/editGood',          // 【商品】新增|编辑
  goodStatus: base + 'live/gift/goodStatus',          // 【商品】状态-删除|上线|下线
  // 竞猜
  correctList: base + 'live/correct/index',                // 题目-新增|编辑
  publishCorrect: base + 'live/correct/publishCorrect',    // 【竞答】发起竞答
  giftList: base + 'live/correct/giftList',                // 【竞答】领奖列表
  correctResult: base + 'live/correct/result',             // 【竞答】答题情况

  /*推流i*/
  pushList: base + 'live/push/all',                        // 新建推流
  pushEdit: base + 'live/push/edit',                        // 推流编辑
  pushAction: base + 'live/push/pushAction',                // 推流操作


  // 统计
  count_goodMain: base + 'stats/user/goodMain',                     // 购物汇总
  count_goodList: base + 'stats/user/goodList',                     // 购物列表
  count_moneyMain: base + 'stats/user/moneyMain',                   // 打赏汇总
  count_moneyList: base + 'stats/user/moneyList',                   // 打赏列表
  count_liveMain: base + 'stats/user/liveMain',                   // 总览
  count_watchTime: base + 'stats/user/watchTime',                   // 【直播间】观看时长统计
  count_h5userArea: base + 'stats/user/h5userArea',                   // 【直播间】观看时长统计
  // ks3上传
  ks3Upload: base + 'upload/index/ksInfo', //图片上传
  // WSS : 'wss://cd.foundao.com/foundao_api_zh_wss', // ws
  // WSS : 'wss://cd.foundao.com:10081/foundao_api_zh_wss', // ws
  WSS: 'ws://enjoycut-zh.foundao.com:10080/foundao_api_zh_wss', // ws

}