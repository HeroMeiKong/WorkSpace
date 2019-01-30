const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const copyObj = (a) => {
    var c = {};
    c = JSON.parse(JSON.stringify(a));
    return c;
}

const toFix = (value) => {
    return value.toFixed(2)//此处2为保留两位小数
}

const stringToArr = (string = '', str_length = 15) => {
    const arr = [];
    const arr_length = Math.ceil(string.length / str_length);
    for (let i = 0; i < arr_length; i++) {
        arr.push(string.slice(i * str_length, (i + 1) * str_length));
    }
    return arr;
}



module.exports = {
    formatTime: formatTime,
    copyObj: copyObj,
    stringToArr: stringToArr,
}
