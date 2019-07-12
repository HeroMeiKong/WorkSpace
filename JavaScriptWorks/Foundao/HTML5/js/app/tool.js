/**
 * Created by Mars on 17/4/12.
 // */


var getVideoWidth = function (time) {
    return parseFloat(time) * 5;
    // return decimal(parseFloat(time)*6.2,6);
}
var getVideoTime = function (px) {
    return parseFloat(px) / 5;
    // return decimal(parseFloat(px)/6.2,6);
}

var addZero = function (obj) {
    if (obj < 10)
        return '0' + obj;
    else
        return obj;
};
var decimal = function (num, v) {
    var vv = Math.pow(10, v);
    return Math.round(num * vv) / vv;
};
var pxToFloat = function (px) {
    return parseFloat(px.substring(0, px.length - 2));
}
//将75s转化为01:15
var timeModel = function (time) {
    var time = Math.round(parseFloat(time));
    var second = parseInt(time / 60) % 60;
    var minute = parseInt((time - second) % 60);

    var res = addZero(minute) + ":" + addZero(second);
    return res
}

var _getRequest = function () {
    var url = decodeURI(window.location.href);
    var theRequest = new Object();
    var start = url.lastIndexOf("?");//ios现在是两个问号
    if (start != -1) {
        var str = url.substr(start + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var e = strs[i].indexOf('=');
            theRequest[strs[i].substring(0, e)] = unescape(strs[i].substring(e + 1));
        }
    }
    return theRequest;
};

var _deleteCode = function () {
    var params = _getRequest()
    //console.log(params)
    var arr = []
    for (var attr in params) {
        if (attr !== 'code' && attr !== 'state') {
            arr.push(attr + '=' + params[attr])
        }
    }
    return window.location.href.split('?')[0] + '?' + arr.join('&')
};

var makeSign = function (obj) {
    //将value值都改为字符串，如果数组长度为0，则移除该属性
    if (obj.hasOwnProperty('videos') && obj.videos.length > 0) {
        for (var i = 0; i < obj.videos.length; i++) {
            convertToStr(obj.videos[i]);
        }
        obj.videos = JSON.stringify(obj.videos);
    }
    if (obj.hasOwnProperty('layers') && obj.layers.length > 0) {
        for (var i = 0; i < obj.layers.length; i++) {
            convertToStr(obj.layers[i]);
        }
        obj.layers = JSON.stringify(obj.layers);
    } else {
        delete obj.layers;
    }
    if (obj.hasOwnProperty('voices') && obj.voices.length > 0) {
        for (var i = 0; i < obj.voices.length; i++) {
            convertToStr(obj.voices[i]);
        }
        obj.voices = JSON.stringify(obj.voices);
    } else {
        delete obj.voices;
    }

    convertToStr(obj);

    //对象转化为数组
    var arr = [];
    for (var item in obj) {
        arr.push(item + '=' + obj[item]);
    }
    //按字典排序
    arr = arr.sort();
    //数组转化为字符串
    var str = arr.join('&');
    //大小写
    str = str.toLocaleUpperCase();
    // console.log('sign before md5:');
    // console.log(str);
    var md5 = $.md5(str + 'JPER_API');
    return $.md5(md5.substring(0, 30));
}


var convertToStr = function (obj) {
    for (var item in obj) {
        if (typeof(obj[item]) == 'object') {
            convertToStr(obj[item]);
        } else {
            obj[item] = obj[item].toString();
        }
    }
}


var _dateFormat = function (second) {
    var date = new Date(second * 1000)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    return year + '.' + _addZero(month) + '.' + _addZero(day) + '  ' + _addZero(hour) + ':' + _addZero(min)
};
//获取时间格式
var getTImeModel = function (timestamp) {
    var date = new Date(timestamp)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return _addZero(month) + '月' + _addZero(day) + '日     ' + _addZero(hour) + ':' + _addZero(min) + ':' + _addZero(sec);
};
var _addZero = function (obj) {
    if (obj < 10)
        return "0" + obj;
    else
        return obj;
};

var _removeLocalStorage = function () {
    localStorage.removeItem('user');
    localStorage.removeItem('serverTime');
};

var _getSeverTime = function () {
    if (localStorage['serverTime']) {
        return Date.parse(new Date()) / 1000 + parseInt(localStorage['serverTime']);
    } else {
        console.log('use localTime')
        return Date.parse(new Date()) / 1000;
    }

};

var getFileType = function (o) {//通过第二种方式获取文件名
    var arr = o.split('.');//通过\分隔字符串，成字符串数组
    return arr[arr.length - 1];//取最后一个，就是文件名
}

// setInterval(function() {
//    console.log(document.body.scrollLeft );
// }, 1000)

var _width = function (ele) {
    if (ele instanceof jQuery) {
        return ele[0].getBoundingClientRect().width;
    } else {
        return ele.getBoundingClientRect().width;
    }

}

var _height = function (ele) {
    if (ele instanceof jQuery) {
        return ele[0].getBoundingClientRect().height;
    } else {
        return ele.getBoundingClientRect().height;
    }
}

var _left = function (ele) {
    if (ele instanceof jQuery) {
        return ele[0].getBoundingClientRect().left;
    } else {
        return ele.getBoundingClientRect().left;
    }

}

var randomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

var unicodeToChinese = function (str) {
    // str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
    //     return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    // });
    // str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
    //     return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    // });
    // str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
    //     return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    // });
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

var _getMouseX = function (e, t) {
    return e.originalEvent.x - t.offset().left + $(document).scrollLeft() + t.scrollLeft();
}


var specialID_arr_g = [];//id数组，全局
var _createID = function () {
    var id = Date.parse(new Date());
    return _diffId(id)
}

//判断id是否已存在，如果不存在，则push,否则+1
var _diffId = function (id) {
    if ($.inArray(id, specialID_arr_g) >= 0) {
        return Math.max.apply(null, specialID_arr_g) + 1;
    } else {
        return id
    }
}

var _userAgent = function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 0;
    } else if (/(Android)/i.test(navigator.userAgent)) {
        return 1;
    }
}

var _isWeiXin = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

var _countLength = function (str) {
    var inputLength = 0;
    //给一个变量来记录长度
    for (var i = 0; i < str.length; i++) {
        var countCode = str.charCodeAt(i);
        //返回指定位置的字符的Unicode编码
        //判断是不是ASCII码,Unicode码前128个字符是ASCII码
        if (countCode >= 0 && countCode <= 128) {
            inputLength++;
        } else {
            inputLength += 2;
            //如果是扩展码，则一次+2
        }
    }
    return inputLength;
}

var _matrName_MaxLength = function (value, num, input) {
    if (_countLength(value) > num) {
        var str = value;
        while (_countLength(str) > num) {
            str = str.substring(0, str.length - 1)
        }
        input.val(str);
    }
}

var isEmpt = function (value) {
    if (value.replace(/(^\s*)|(\s*$)/g, '') == '') {
        return true
    } else {
        return false
    }
}

var emailCheck = function (value) {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

var codeCheck = function (value) {
    var reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[+=~.,><!@#$%^&*()_-])[a-zA-Z\d+=~!.,><@#$%^&*()_-]{12,20}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

var mobileCheck = function (value) {
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

var isCardNo = function (value) {
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{17}(\d|X|x)$)/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

var matrName = function (value) {
    var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{4,30}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

//获取时间量格式
var getTimeModel_timeProgress = function (time) {
    var hour = parseInt(time / 3600);
    var min = parseInt((time - hour * 3600) / 60);
    var sec = parseInt(time - hour * 3600 - min * 60);
    return _addZero(hour) + ':' + _addZero(min) + ':' + _addZero(sec);
}

var _funcUrlDel = function (name) {
    var loca = window.location;
    var baseUrl = loca.origin + loca.pathname + "?";
    var query = loca.search.substr(1);
    if (query.indexOf(name) > -1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            var e = arr[i].indexOf('=');
            obj[arr[i].substring(0, e)] = unescape(arr[i].substring(e + 1));
        }
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return url
    } else {
        return window.location
    }
}

var isWebview = function () {
    var ua = navigator.userAgent;
    var platform = navigator.platform;
    var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    var webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);

    return webview;
}

var _dateFormat_new = function (second_obj, second_now) {
    if (!second_now) {
        second_now = Math.round(new Date().getTime() / 1000)
    }

    var time_sub = second_now - second_obj; //时间差

    var year_time = 365 * 24 * 60 * 60;
    var month_time = 30 * 24 * 60 * 60;
    var day_time = 24 * 60 * 60;
    var hour_time = 60 * 60;
    var min_time = 60;


    var year = Math.floor(time_sub / year_time);
    var month = Math.floor((time_sub - year * year_time) / month_time);
    var day = Math.floor((time_sub - year * year_time - month * month_time) / day_time);
    var hour = Math.floor((time_sub - year * year_time - month * month_time - day * day_time) / hour_time);
    var min = Math.floor((time_sub - year * year_time - month * month_time - day * day_time - hour * hour_time) / min_time);

    return year > 0 ? (year + "年之前") : (month > 0 ? (month + "月之前") : (day > 0 ? (day + "天之前") : (hour > 0 ? (hour + "小时之前") : (min > 0 ? (min + "分钟之前") : "刚刚"))))
};


//后台时间秒=》毫秒
var timeChange = function (list) {
    $.each(list, function (index, obj) {
        if (obj.hasOwnProperty('t')) {
            obj.t = obj.t * 1000;
        }
    })
    return list
}