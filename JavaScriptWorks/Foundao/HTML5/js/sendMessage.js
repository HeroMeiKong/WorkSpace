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
const ready_config_foreign = { // 国外正式环境配置
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
if ((_hostname === 'enjoycut.com') || (_hostname === 'www.enjoycut.com') || (_hostname.indexOf('.enjoycut.com') !== -1 && _hostname !== 'before.enjoycut.com' && _hostname !== 'zh.enjoycut.com')) {
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
const API_BASE = _config.API_BASE; //   非转码接口
const API_MESSAGE = _config.API_MESSAGE || ''; // 留言板接口
const WS = _config.WS;
const RETURN_F = return_f;

let showOrHidden = false
let sendSuccess = false
let boxOrImage = false
let sendmessage_open = $('.sendmessage_open')
let sendmessage_success = $('#sendmessage_success')
let sendmessage_start = $('#sendmessage_start')
let userBox = $('#user-box')
let userImage = $('#user-Image')
let nickName = $('#user_nickName')
let question = ''
let email = ''


const current_url = encodeURIComponent(window.location.href)
const origin = window.location.origin
const userInfo = getUserData_storage()

checkUser()

function getUserInfo() {
  if (userInfo && userInfo.token) {
    return userInfo.user_nickname || 'enjoycut'
  }
  return 'enjoycut'
}

loginOut = () => {
    $.ajax({
        url: API_BASE + 'login/out',
        dataType: 'json',
        type: 'POST',
        data: {
            token: userInfo.token
        }
    }).done(() => {
        boxOrImage = false
        userBox.css({ 'display': boxOrImage ? 'none' : 'flex' })
        userImage.css({ 'display': boxOrImage ? 'flex' : 'none' })
        window.location.reload()
    }).fail(() => {
        boxOrImage = false
        userBox.css({ 'display': boxOrImage ? 'none' : 'flex' })
        userImage.css({ 'display': boxOrImage ? 'flex' : 'none' })
        window.location.reload()
    })
}

function getUserData_storage() {
    // const userInfo_string_escape = localStorage.getItem(this.isForeign() ? 'XI_U_F' : 'XI_U');
    let ab = getCookie('XI_U_F')
    const userInfo_string_escape = JSON.parse(ab)
    let userInfo = {};
    if (userInfo_string_escape) {
        userInfo = JSON.parse(userInfo_string_escape);
    }
    return userInfo;
}

// 移除本地用户信息
removeUserData_storage = () => {
    localStorage.removeItem('XI_U_F')
    this.delCookie('XI_U_F')
}

delCookie = (name) => {
    this.setCookie(name, ' ', -1);
}

function getCookie(name) {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }

}

setCookie = (name, value, day) => {
    // console.log(1223)
    if (day !== 0) { //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        var expires = day * 24 * 60 * 60 * 1000;
        var date = new Date(+new Date() + expires);
        var do_str = document.domain;
        if (do_str.indexOf('enjoycut.com') >= 0) {
            document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/;domain=.enjoycut.com";
        } else if (do_str.indexOf('foundao.com') >= 0) {
            document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/;domain=.foundao.com";
        } else {
            document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString() + ";path=/"; //TODO:测试用
        }
    } else {
        document.cookie = name + "=" + escape(value) + ";path=/" + ";domain=.enjoycut.com";
    }
}

goLogin = () => {
    window.open(origin + `/user/login?callback=${current_url}`)
}

register = () => {
    window.open(origin + `/user/register?callback=${current_url}`);
}

function checkUser() {
    handel_pv();//统计
    if (userInfo && userInfo.token) {
        boxOrImage = true
        nickName[0].textContent = this.getUserInfo()
    } else {
        boxOrImage = false
    }
    userBox.css({ 'display': boxOrImage ? 'none' : 'flex' })
    userImage.css({ 'display': boxOrImage ? 'flex' : 'none' })
}

clickMe = () => {
    showOrHidden = !showOrHidden
    sendmessage_open.css({ 'display': showOrHidden ? 'none' : 'flex' })
    sendmessage_start.css({ 'display': showOrHidden ? 'flex' : 'none' })
}

checkShow = () => {
    sendmessage_open.css({ 'display': showOrHidden ? 'none' : 'flex' })
    sendmessage_success.css({ 'display': sendSuccess ? 'flex' : 'none' })
    sendmessage_start.css({ 'display': showOrHidden && !sendSuccess ? 'flex' : 'none' })
}

changeUrl = () => {
    let url = window.location.href
    window.open(url + '/masterNote')
}

changeText = (el) => {
    if (el.value.length > 1000) {
        messageBox('最多输入1000个字符！')
    } else {
        if (el.className === 'sendmessage_message') {
            question = el.value
        } else {
            email = el.value
        }
    }
}

sendMessage = () => {
    if (email === '') {
        this.messageBox('邮箱地址不能为空！')
    } else if (question === '') {
        this.messageBox('问题不能为空！')
    } else {
        $.ajax({
            url: API_BASE + 'bbs/msgboard/add',
            dataType: 'json',
            type: 'POST',
            data: {
                email,
                question
            }
        }).done((res) => {
            if (res.code / 1 === 0) {
                // this.messageBox('保存成功！')
                sendSuccess = true
                this.checkShow()
                const time = setTimeout(() => {
                    // window.location.reload()
                    clearTimeout(time)
                    showOrHidden = false
                    sendSuccess = false
                    this.checkShow()
                }, 1000)
            } else {
                this.messageBox(res.msg)
            }
        }).fail(() => {
            this.messageBox('内部服务器错误！')
        })
    }
}

messageBox = (msg, time) => {
    const messageBoxBg = $('#Message_box_bg')
    const messageBox = $('#Message_box')
    messageBoxBg.fadeIn()
    messageBox.html(msg)
    setTimeout(function() {
        messageBoxBg.fadeOut(function() {
            messageBox.html('')
        })
    }, time || 2000)
}

function handel_pv() {
    let api_url = API_BASE + 'cgi/stats/h?sid=4791957956777099047';
    const script_dom = '<script id="tj_id" src="' + api_url + '" type="text/javascript"></script>';
    const tj_id = $('#tj_id');
    if (tj_id) {
      tj_id.remove()
    }
    $('body').append(script_dom);
 };