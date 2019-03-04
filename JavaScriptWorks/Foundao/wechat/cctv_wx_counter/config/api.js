// const host = 'https://a-js.sports.cctv.com/calorie/api/';          //正式环境
const host = 'https://a-js.sports.cctv.com/calorie_test/api/';   //测试环境
// const host = 'http://62.234.180.229/calorie_test/api/';  //开发环境

export default {
    //登录
    login_auth: host + 'login_auth.php',
    getUserCalorie: host + 'get_user_wx_run.php',//获取用户卡路里（前端）
    backGetUserCalorie: host + 'user_select_way/get_user_wx_run.php',//获取用户卡路里（后端）
    selectRoute: host + 'user_select_way/user_select_way.php',//用户选择路线
    userWayDetail: host + 'user_select_way/user_way_detail.php',//用户站点详情
    yesterdayCalorieJudge : host + 'user_select_way/yesterday_calorie_judge.php',//昨日卡路里判断
    add_calorie : host + 'add_calorie.php',//答题、看资讯获取卡路里
    calorie_rank: host + 'calorie_rank.php', //卡路里排行榜
    updateAcc : host + 'status/change_card_notify_status.php',//修改加速卡的状态
    arriveNumber : host + 'arrive_rank.php',//到达终点的排名
    updateUserNameAndAvatar: host + 'user_select_way/update_user_name_pic.php',//更新用户头像和呢称
    simpleInfo : host + 'user_select_way/simple_user_map_info.php',//用户简单信息【地图详情】
    main_home: host + 'main/home.php',//全部数据
    getfwqtime: host + 'time.php',//获取服务器时间
}