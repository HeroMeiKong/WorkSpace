var base_url = '';
var pro = '';
var _businessid = '';
var _websocketurl = '';
var _getAccessToken = '';
var _login = '';
var _article = '';


if (window.location.href.indexOf('tap2cdn') > 0) {
    base_url = 'https://api2.newscctv.net/qd5/api/';
    pro = 'https://';
    _businessid = 'sh_h5_ebfb0bca6a340bb09eb125e891c851b8';
    _websocketurl = 'wss://ws-live.newscctv.net:8443';
    _getAccessToken = 'https://api.newscctv.net/newscctv/api_2_6_1/auth/getAccessToken';
    _login = 'https://api.newscctv.net/newscctv/api_2_6_1/auth/login';
    _article = 'https://api.newscctv.net/newscctv2.61/boao/article-info.php';
} else if (window.location.href.indexOf('shanghe_test_testing') > 0) {
    base_url = 'https://test-api.newscctv.net/qd5/api/';
    pro = 'http://';
    _businessid = 'sh_h5_ebfb0bca6a340bb09eb125e891c851b8';
    _websocketurl = 'wss://ws-live.newscctv.net:8443';
    _getAccessToken = 'https://test-api.newscctv.net/cctvnewsplatform/api_2_6_1/auth/getAccessToken';
    _login = 'https://test-api.newscctv.net/cctvnewsplatform/api_2_6_1/auth/login';
    _article = 'https://test-api.newscctv.net/dyj_test/boao/article-info.php';
} else {
    base_url = 'https://test-api.newscctv.net/qd5/api/';
    pro = 'http://';
    _businessid = 'sh_h5_ebfb0bca6a340bb09eb125e891c851b8';
    _websocketurl = 'ws://ws-live.newscctv.net:8080';
    _getAccessToken = 'https://api.newscctv.net/newscctv/api_2_6_1/auth/getAccessToken';
    _login = 'https://api.newscctv.net/newscctv/api_2_6_1/auth/login';
    _article = 'https://test-api.newscctv.net/dyj_test/boao/article-info.php';
}


const Config = {
    FROM: {
        APP: 'APP',
        WX: 'WX',
        NONE: 'NONE',
    },
    URL: {
        getAccessToken: _getAccessToken,
        login: _login,
        qd_live: base_url + 'qd_live.php',
        graph_article: base_url + 'graph_article.php',
        comment_list: base_url + 'comment_list.php',
        comment: base_url + 'comment.php',
        praise: base_url + 'praise.php',
        init_upload: base_url + '/upload/init_upload.php',
        check_slice: base_url + '/upload/check_slice.php',
        chunk_upload: base_url + '/upload/chunk_upload.php',
        special: base_url + 'special.php',
        v_article: base_url + 'v_article.php',
        special_article: base_url + 'special_article.php',
        news_article: base_url + 'news_article.php',
        statistics: base_url + 'statistics.php',
        article: _article,
    },
    appid: 'wxf21152668632e942',
    // index_url: 'https://www.newscctv.net/dw/shanghe_test_testing/#/',
    index_url: 'https://www.newscctv.net/tap2cdn/video/activities/shanghe/#/',
    businessid: _businessid,
    websocketurl: _websocketurl,
    share_img: 'https://www.newscctv.net/dw/resource/shanghe.jpg',
    share_title: '聚焦上合 央视新闻48小时不间断直播',
    share_des: '6月8日14时—10日14时，央视新闻陪你看懂上合峰会。',
}

export default Config;