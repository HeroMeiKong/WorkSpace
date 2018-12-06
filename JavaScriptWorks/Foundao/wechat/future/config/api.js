/**
 * Created by DELL on 2018/8/9.
 */
const host = 'https://a-js.sports.cctv.com/host/api/';
const hostTest = 'https://web-happy.foundao.com/host/api/api/';
const prehostTest = 'https://a-js.sports.cctv.com/test_host/api/';
export default {

    // //登录
    // login_auth: host + 'login_auth.php',

    // //首页
    // home_page_selection: host + 'home_page_selection.php',  //精选视频
    // fabulous: host + 'fabulous.php',        //点赞关注
    // del_fabulous: host + 'del_fabulous.php',        //点赞关注
    // poster_qrcode: host + 'poster_qrcode.php',        //小程序
    // types: host + 'topic/types.php',        //分类查询
    // type_video: host + 'topic/type_video.php',  //首页分类视频

    // // 话题
    // topic_recommend: host + 'topic/topic_recommend.php',    //轮播图
    // topic_home: host + 'topic/topic_home.php',      //话题主页
    // one_topic: host + 'topic/one_topic.php',            //话题
    // topic_class: host + 'topic/topic_class.php',            //话题列表

    // //配音列表
    // dub: host + 'dub/dub.php',
    // dub_type: host + 'dub/dub_type.php',    //话题列表
    // dub_type_list: host + 'dub/dub_type_list.php',    //话题配音列表
    // dub_detail: host + 'dub/dub_detail.php',    //单个配音详情
    // submit_exmaine: host + 'dub/submit_exmaine.php',    //录音提交接口
    // query_video_status: host + 'dub/query_video_status.php',    //录音提交接口
    // upload: host + 'upload.php',    //上传

    // //视频详情
    // video_topic: host + 'topic/video_topic.php',
    // video_topics: host + 'topic/video_topics.php',

    // //个人主页
    // my_home: host + 'person/my_home.php',           //我的主页
    // my_material: host + 'person/my_material.php',       //我的作品
    // my_love: host + 'person/my_love.php',       //我的喜欢
    // update_autograph: host + 'person/update_autograph.php',       //编辑个性签名
    // my_follow: host + 'person/my_follow.php',       //我的关注列表
    // my_is_follow: host + 'person/my_is_follow.php',       //我的粉丝列表
    // other_home: host + 'person/other_home.php',       //他人主页
    // other_material: host + 'person/other_material.php',       //他人作品


    // //统计
    // statistics_pv: host + 'statistics_pv.php',       //配音视频点击
    // statistics_click: host + 'statistics_click.php',       //原始视频点击


    // // 待定
    // topic_class: host + 'topic/topic_class.php',    //话题分类
    // type_sub: host + 'topic/type_sub.php',      //话题




    //预上线
    //登录
    login_auth: prehostTest + 'login_auth.php',

    //首页
    home_page_selection: prehostTest + 'home_page_selection.php',  //精选视频
    fabulous: prehostTest + 'fabulous.php',        //点赞关注
    del_fabulous: prehostTest + 'del_fabulous.php',        //点赞关注
    poster_qrcode: prehostTest + 'poster_qrcode.php',        //小程序
    types: prehostTest + 'topic/types.php',        //分类查询
    type_video: prehostTest + 'topic/type_video.php',  //首页分类视频

    // 话题
    topic_recommend: prehostTest + 'topic/topic_recommend.php',    //轮播图
    topic_home: prehostTest + 'topic/topic_home.php',      //话题主页
    one_topic: prehostTest + 'topic/one_topic.php',            //话题
    topic_class: prehostTest + 'topic/topic_class.php',            //话题列表

    //配音列表
    dub: prehostTest + 'dub/dub.php',
    dub_type: prehostTest + 'dub/dub_type.php',    //话题列表
    dub_type_list: prehostTest + 'dub/dub_type_list.php',    //话题配音列表
    dub_detail: prehostTest + 'dub/dub_detail.php',    //单个配音详情
    submit_exmaine: prehostTest + 'dub/submit_exmaine.php',    //录音提交接口
    query_video_status: prehostTest + 'dub/query_video_status.php',    //录音提交接口
    upload: prehostTest + 'upload.php',    //上传

    //视频详情
    video_topic: prehostTest + 'topic/video_topic.php',
    video_topics: prehostTest + 'topic/video_topics.php',

    //个人主页
    my_home: prehostTest + 'person/my_home.php',           //我的主页
    my_material: prehostTest + 'person/my_material.php',       //我的作品
    my_love: prehostTest + 'person/my_love.php',       //我的喜欢
    update_autograph: prehostTest + 'person/update_autograph.php',       //编辑个性签名
    my_follow: prehostTest + 'person/my_follow.php',       //我的关注列表
    my_is_follow: prehostTest + 'person/my_is_follow.php',       //我的粉丝列表
    other_home: prehostTest + 'person/other_home.php',       //他人主页
    other_material: prehostTest + 'person/other_material.php',       //他人作品


    //统计
    statistics_pv: prehostTest + 'statistics_pv.php',       //配音视频点击
    statistics_click: prehostTest + 'statistics_click.php',       //原始视频点击


    // 待定
    topic_class: prehostTest + 'topic/topic_class.php',    //话题分类
    type_sub: prehostTest + 'topic/type_sub.php',      //话题

    //上传视频
    //upload_cover: host + 'upload_cover.php',          //上传视频
    upload_cover: prehostTest + 'upload_cover.php',
    sticker_type: prehostTest + 'video/sticker_type.php',//贴纸分类
    sticker: prehostTest + 'video/sticker.php',          //贴纸查询
    //upload_test: host + 'video/get_video_cover.php',//上传视频测试
    //upload_submit: host + 'video/user_upload_submit.php',//提交视频待处理
    //get_submit: host + 'video/get_submit_job.php',  //轮询接口，查看视频处理进程
    upload_test: prehostTest + 'video/get_video_cover.php',
    upload_submit: prehostTest + 'video/user_upload_submit.php',
    get_submit: prehostTest + 'video/get_submit_job.php',
    music_type: prehostTest + 'video/music_type.php', //音效分类
    music: prehostTest + 'video/music.php',          //音效查询
    topic_sub: prehostTest + 'video/type_sub.php'    //话题选择
}