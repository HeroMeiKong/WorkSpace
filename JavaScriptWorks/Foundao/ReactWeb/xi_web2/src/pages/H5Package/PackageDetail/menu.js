/**
 * Created by DELL on 2019/5/7.
 */
import loadable from '@/utils/loadable'

// import LiveDetail from './LiveDetail';
// import LiveCamera from './LiveCamera';
// import LiveMonitor from './LiveMonitor';
// import ImgLive from './ImgLive';
// import Comment from './Comment';
// import BaseInfo from './h5Manage/BaseInfo';
// import MenuSet from './h5Manage/MenuSet';
// import Marketing from './h5Manage/Marketing';
// import Vote from './h5Manage/Vote';
// import Questions from './h5Manage/Question';
// import Guesses from './h5Manage/Guesses';
// import VoteResult from './h5Manage/Vote/VoteResult';
// import QuestionEdit from './h5Manage/Question/QuestionEdit';
// import QuestionDetail from './h5Manage/Question/QuestionDetail';
// import GuessDetail from './h5Manage/Guesses/GuessDetail';
// import GuessPrize from './h5Manage/Guesses/GuessPrize';
// import ZanConfig from './ZanConfig';
// import Reward from './Reward'; // 互动打赏
// import GoodsConfig from './GoodsConfig'; // 商品配置

const LiveDetail = loadable(() => import('./LiveDetail'));
const LiveCamera = loadable(() => import('./LiveCamera'));
const LiveMonitor = loadable(() => import('./LiveMonitor'));
const ImgLive = loadable(() => import('./ImgLive'));
const Comment = loadable(() => import('./Comment'));
const BaseInfo = loadable(() => import('./h5Manage/BaseInfo'));
const MenuSet = loadable(() => import('./h5Manage/MenuSet'));
const Marketing = loadable(() => import('./h5Manage/Marketing'));
const Vote = loadable(() => import('./h5Manage/Vote'));
const Questions = loadable(() => import('./h5Manage/Question'));
const Guesses = loadable(() => import('./h5Manage/Guesses'));
const VoteResult = loadable(() => import('./h5Manage/Vote/VoteResult'));
const QuestionEdit = loadable(() => import('./h5Manage/Question/QuestionEdit'));
const QuestionDetail = loadable(() => import('./h5Manage/Question/QuestionDetail'));
const GuessDetail = loadable(() => import('./h5Manage/Guesses/GuessDetail'));
const GuessPrize = loadable(() => import('./h5Manage/Guesses/GuessPrize'));
const ZanConfig = loadable(() => import('./ZanConfig'));
const Reward = loadable(() => import('./Reward'));
const GoodsConfig = loadable(() => import('./GoodsConfig'));

// import VideoLib from './VideoLib'; // 视频库
/*
* @name 菜单名
* @path 路径
* @component 组件
* @template 那些模板有
* @children 子路由
* */
const all = ['base','base-simple','interaction', 'activity', 'interaction-horizontal']; // 所有权限
const noInteraction = ['base','base-simple', 'activity'];                               // 没有互动权限
const onlyInteraction = ['interaction','interaction-horizontal'];                       // 只有互动的权限
const menus = [
  {
    name: '直播间管理',template: [...all], children: [
    {name: '直播详情', path: 'liveDetail', component: LiveDetail, template: [...all],},
    {name: '直播镜头', path: 'liveCamera', component: LiveCamera, template: [...all],},
    {name: '直播监控', path: 'liveMonitor', component: LiveMonitor, template: [...all],},
    {name: '图文直播', path: 'imgLive', component: ImgLive, template: [...noInteraction],},
    {name: '评论审核', path: 'comment', component: Comment, template: [...all],},
  ]
  },
  // {name: '视频库管理', path: 'videoLib',component: VideoLib},
  {
    name: 'H5页面管理',
    template: [...all],
    children: [
    {name: '基础信息设置', path: 'baseInfo', component: BaseInfo, template: [...all],},
    {name: '页面菜单设置', path: 'menu', component: MenuSet, template: [...noInteraction],},
    {name: '推广设置', path: 'marketing', component: Marketing, template: [...all],},
    {name: '投票结果', path: 'vote/result', component: VoteResult, hide: true, template: [...noInteraction],},
    {name: '互动投票', path: 'vote', component: Vote, template: [...noInteraction],},
    {name: '编辑题库', path: 'question/edit', component: QuestionEdit,  hide: true, template: [...all],},
    {name: '查看题库', path: 'question/detail', component: QuestionDetail,  hide: true, template: [...all],},
    {name: '互动答题', path: 'question', component: Questions, template: [...noInteraction],},

    {name: '答题情况', path: 'guesses/detail', component: GuessDetail, hide: true, template: [...all],},
    {name: '领取记录', path: 'guesses/prize', component: GuessPrize, hide: true, template: [...all],},
    {name: '竞答记录', path: 'guesses', component: Guesses, template: [...noInteraction],},
  ]
  },
  {name: '点赞互动', path: 'zan',component: ZanConfig, template: [...all],},
  {name: '互动打赏', path: 'reward',component: Reward, template: [...onlyInteraction],},
  {name: '商品配置', path: 'goods',component: GoodsConfig, template: [...onlyInteraction],},
];
export default menus;