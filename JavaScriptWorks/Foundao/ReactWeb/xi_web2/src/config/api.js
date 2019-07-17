var url = '';
var host_url = '';
const _hostname = window.location.hostname;

url = '//cd.foundao.com:10080/foundao_api_zh';
host_url = 'https://www.foundao.enjoycut.com/';

if (_hostname === 'foundao.enjoycut.com' || _hostname === 'enjoycut.cn') {
    url = '//foundao.enjoycut.com/api';
}

const API = {
    kind: {
        SINGLECUT: "SINGLECUT",
        WATER: "WATER",
        MULTCUT: "MULTCUT",
        LIB: 'LIB',
        MONITOR: 'MONITOR'
    },
    URL: {
        init_upload: url + '/upload/init_upload.php',
        no_login_init_upload: url + '/no_login/init_upload.php',
        check_slice: url + '/upload/check_slice.php',
        no_login_check_slice: url + '/no_login/check_slice.php',
        chunk_upload: url + '/upload/chunk_upload.php',
        no_login_chunk_upload: url + '/no_login/chunk_upload.php',
        save_material: url + '/user/save_material.php',
        cut_video: url + '/video/cut_video.php',
        no_login_cut_video: url + '/no_login/video_cut.php',
        job_status: url + '/video/job_status.php',
        no_login_job_status: url + '/no_login/job_status.php',
        video_info: url + '/video/video_info.php',
        no_login_video_info: url + '/no_login/video_info.php',
        add_watermark: url + '/video/add_watermark.php',
        no_login_add_watermark: url + '/no_login/video_watermark.php',
        merge_video: url + '/video/merge_video.php',
        no_login_merge_video: url + '/no_login/video_merge.php',
        download: url + '/user/download.php',
        no_login_download: url + '/no_login/download.php',
        send_mobile_code: url + '/register/get_mobile_captcha',
        mobile_register: url + '/register/mobile',
        email_register: url + '/register/email',
        login: url + '/login/dologin',
        check_mobile: url + '/login/get_back_pwd',
        reset_password: url + '/login/reset_password.php',
        get_captcha: url + '/register/get_chart_captcha',
        no_login: url + '/no_login/tempuser.php',
        no_login_save_material: url + '/no_login/save_material.php',
        ttl_check: url + '/user/ttl_check.php',
        user_info: url + '/user/user_info.php',
        complaint: url + '/user/complaint.php',
        is_register: url + '/register/is_register',
        home_material: url + '/user/home_material.php',
        no_login_home_material: url + '/no_login/home_material.php',


        //支付
        a_page_order_pay: `${url}/order/a_page_order_pay.php`,
        a_order_query: `${url}/order/a_order_query.php`,
        store_calc: `${url}/order/store_calc.php`,

        //绝对地址
        pay_return: `${host_url}/return`,


        //登录ws
        wsURL: 'ws://ws.enjoycut.com:8880/?app_sign=81174f2ec1f8d2bd8aaf118b964a0ca0',
        login_qrcode: `${url}/login/login_qrcode.php`,  // 登录

        //用户
        company_fields: `${url}/login/company_fields.php`,
        complete_company_info: `${url}/user/complete_company_info.php`,
        change_head_image: `${url}/user/change_head_image.php`,
        contact_admin: `${url}/user/contact_admin.php`,


    }
};


export default API;