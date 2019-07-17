/**
 * Created by DELL on 2018/11/15.
 */
/*cms打包时间 打包时node脚本自动获取*/
/*eslint-disable no-undef */

/*基础配置， 主要配置cms api地址 和h5预览页地址*/
const _hostname = window.location.hostname;

let _environment = 'test'; // 环境变量 online/pre/test -> 正式/预上线/测试

// 国内测试环境配置
const test_config = {
    API_TRANS: '//cd.foundao.com:10080/Trans/api/',
    API_BASE: '//cd.foundao.com:10080/foundao_api_zh/',
    WS: 'ws://cd.foundao.com:10080/sock/'
};

// 国内正式环境配置
const online_config = {
    API_TRANS: '//zh.enjoycut.com:11080/Trans/api/',
    API_BASE: '//zh.enjoycut.com:11080/api/',
    WS: 'ws://zh.enjoycut.com:11080/sock/'
};

// 国内预上线配置(暂时没有)
const before_online_config = {
    API_TRANS: '//zh.enjoycut.com:11080/Trans/api/',
    API_BASE: '//zh.enjoycut.com:11080/api/',
    WS: 'ws://zh.enjoycut.com:11080/sock/'
};

// 国外测试环境配置
const test_config_foreign = {
    API_TRANS: '//cd.foundao.com:10080/Trans/api/',
    API_BASE: '//cd.foundao.com:10080/foundao_api_zh/',
    API_MESSAGE: '//cd.foundao.com:10080/message/api/api/',
    WS: 'ws://cd.foundao.com:10080/sock/'
};

// 国外正式环境配置
const online_config_foreign = {
    API_TRANS: '//www.enjoycut.com/Trans/api/',
    API_BASE: '//www.enjoycut.com/api/',
    API_MESSAGE: '//wallpaper.convert-mp4.com/message/api/api/',
    WS: 'wss://www.enjoycut.com/sock/'
};

// 国外预上线环境配置
const ready_config_foreign = {  // 国外正式环境配置
    API_TRANS: '//before.enjoycut.com/Trans/api/',
    API_BASE: '//before.enjoycut.com/api/',
    API_MESSAGE: '//wallpaper.convert-mp4.com/message/api/api/',
    WS: 'wss://before.enjoycut.com/sock/'
};


let _config = test_config;
let return_f = '//enjoycut-en.foundao.com:10090/return.html';


//国内正式版
if (_hostname === 'zh.enjoycut.com' || _hostname === 'enjoycut.cn') {
    _config = online_config;
    _environment = 'online';
    return_f = '//zh.enjoycut.com/return.html'
}

//国内测试版
if (_hostname === 'enjoycut-zh.foundao.com') {
    _config = test_config;
    _environment = 'test';
    return_f = '//enjoycut-zh.foundao.com/return.html'
}

// 国外正式版
if ((_hostname === 'enjoycut.com') ||  (_hostname === 'www.enjoycut.com') || (_hostname.indexOf('.enjoycut.com')!==-1&&_hostname !== 'before.enjoycut.com'&&_hostname !== 'zh.enjoycut.com')) {
    _config = online_config_foreign;
    _environment = 'online';
    return_f = 'https://www.enjoycut.com/return.html'
}

//国外预上线环境
if (_hostname === 'before.enjoycut.com') {
    _config = ready_config_foreign;
    _environment = 'pre';
    return_f = 'https://before.enjoycut.com/return.html'
}

//国外测试版
if (_hostname === 'enjoycut-en.foundao.com') {
    _config = test_config_foreign;
    _environment = 'test';
    return_f = 'https://enjoycut-en.foundao.com/return.html'
}


const API_TRANS = _config.API_TRANS; //  转码接口
const API_BASE = _config.API_BASE;   //   非转码接口
const API_MESSAGE = _config.API_MESSAGE||''; // 留言板接口
const WS = _config.WS;
const RETURN_F = return_f;


export {API_TRANS, API_BASE , API_MESSAGE , WS, _environment, RETURN_F}