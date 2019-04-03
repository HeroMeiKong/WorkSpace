var Tool = {
    timeModel(time) {
        var time = Math.round(parseFloat(time));
        var second = parseInt(time % 60);
        var minute = parseInt((time - second) / 60) % 60;

        var res = this._addZero(minute) + ":" + this._addZero(second);
        return res
    },
    fen_miao(time) {
        var time = Math.round(parseFloat(time));
        var second = parseInt(time % 60);
        var minute = parseInt((time - second) / 60) % 60;

        var res = ((minute === 0) ? '' : (minute + '分')) + second + '秒';
        return res
    },
    _addZero(obj) {
        if (obj < 10)
            return "0" + obj;
        else
            return obj;
    },
    addEventHandler(target, type, fn) {
        if (target.addEventListener) {
            target.addEventListener(type, fn);
        } else {
            target.attachEvent('on' + type, fn);
        }
    },
    removeEventHandler(target, type, fn) {
        if (target.removeEventListener) {
            target.removeEventListener(type, fn);
        } else {
            target.detachEvent('on' + type, fn);
        }
    },
    getVideoModel(name) {
        var n = name.split('?')[0];
        var end = n.lastIndexOf('.');
        return n.substring(end + 1);
    },
    timeFormat(num) {
        num = parseInt(num)
        if (!isNaN(num) && num) {
            var hour = Math.floor(num / 3600)
            var min = Math.floor((num - hour * 3600) / 60)
            var second = num % 60
            // return (hour ? this._addZero(hour) + ':' : '') + this._addZero(min) + ':' + this._addZero(second)
            return this._addZero(hour) + ':' + this._addZero(min) + ':' + this._addZero(second)
        } else {
            return '00:00:00'
        }
    },

    getRequest() {
        var url = decodeURI(window.location.href);
        var theRequest = new Object();
        var start = url.lastIndexOf("?");//ios现在是两个问号
        var end = url.lastIndexOf("#");
        if (start != -1) {
            var str = '';
            if (end > start) {
                str = url.substring(start + 1, end);
            } else {
                str = url.substr(start + 1);
            }
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var e = strs[i].indexOf('=');
                theRequest[strs[i].substring(0, e)] = unescape(strs[i].substring(e + 1));
            }
        }
        return theRequest;
    },

    RandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.floor(Rand * Range); //舍去
        return num;
    },
    is_wxBrowser: function () {
        return /micromessenger/.test(navigator.userAgent.toLowerCase());
    },
    is_iOS: function () {
        return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    is_android: function () {
        return /android/i.test(navigator.userAgent);
    },
    is_shici: function () {
        return /CntvCBox/i.test(navigator.userAgent);
    },
    jumpToApp (vtype, mid) {
        this.openApp("cntvcbox://app.cntv.cn/" + "?vtype=" + vtype + "&mid=" + mid, `../download/index.html?vtype=23&mid=${mid}&type=1`);
    },
    openApp(clientUrl, fail) {
        var newurl = encodeURIComponent(clientUrl);
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=cn.cntv&ios_scheme='+newurl+'&android_schema='+newurl;
    },

    /*获取客户端传回来的值
    * userId 用户id
    * verifycode  用户的verifycode
    * isSubed  是否关注   0 未关注  1 关注
    * */
    appCallBackGetUser(userId,verifycode,isSubed){
        let userInfo = {
            userId:userId,
            isSubed:isSubed
        };
        document.cookie ="verifycode="+verifycode;//cookie
        window.localStorage.setItem("user_info",JSON.stringify(userInfo))
    }
};

export default Tool;