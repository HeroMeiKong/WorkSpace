// const host = 'https://a-js.sports.cctv.com/host/api/';          //线上版本
// const host = 'https://web-happy.foundao.com/host/api/api/';   //开发版本
const host = 'https://a-js.sports.cctv.com/calorie/api/';  //体验版本

export default {
    //登录
    login_auth: host + 'login_auth.php',
    getUserCalorie: host + 'get_user_wx_run.php',//获取用户卡路里（前端）
    backGetUserCalorie: host + 'user_select_way/get_user_wx_run.php',//获取用户卡路里（后端）
    selectRoute: host + 'user_select_way/user_select_way.php',//用户选择路线
    userWayDetail: host + 'user_select_way/user_way_detail.php',//用户站点详情
    yesterdayCalorieJudge : host + 'user_select_way/yesterday_calorie_judge.php',//昨日卡路里判断
}