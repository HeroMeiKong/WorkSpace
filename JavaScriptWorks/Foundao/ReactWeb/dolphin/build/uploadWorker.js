/**
 * Created by DELL on 2019/3/28.
 */

/*Web Worker 有自己的全局对象，不是主线程的window，
 而是一个专门为 Worker 定制的全局对象。
 因此定义在window上面的对象和方法不是全部都可以使用
 */


/*
 *self代表子线程自身，即子线程的全局对象 等同于self
 * self.name： Worker 的名字。该属性只读，由构造函数指定。
 *self.onmessage：指定message事件的监听函数。
 *self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
 *self.close()：关闭 Worker 线程。
 *self.postMessage()：向产生这个 Worker 线程发送消息。
 *self.importScripts()：加载 JS 脚本。
 *
 * */
/* eslint-disable */

// function A() {

// md5
!function () {
  "use strict";
  function t(t) {
    if (t) d[0] = d[16] = d[1] = d[2] = d[3] = d[4] = d[5] = d[6] = d[7] = d[8] = d[9] = d[10] = d[11] = d[12] = d[13] = d[14] = d[15] = 0, this.blocks = d, this.buffer8 = l; else if (a) {
      var r = new ArrayBuffer(68);
      this.buffer8 = new Uint8Array(r), this.blocks = new Uint32Array(r)
    } else this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0
  }

  var r = "input is invalid type", e = "object" == typeof window, i = e ? window : {};
  i.JS_MD5_NO_WINDOW && (e = !1);
  var s = !e && "object" == typeof self,
    h = !i.JS_MD5_NO_NODE_JS && "object" == typeof process && process.versions && process.versions.node;
  h ? i = global : s && (i = self);
  var f = !i.JS_MD5_NO_COMMON_JS && "object" == typeof module && module.exports,
    o = "function" == typeof define && define.amd, a = !i.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
    n = "0123456789abcdef".split(""), u = [128, 32768, 8388608, -2147483648], y = [0, 8, 16, 24],
    c = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"],
    p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), d = [], l;
  if (a) {
    var A = new ArrayBuffer(68);
    l = new Uint8Array(A), d = new Uint32Array(A)
  }
  !i.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) {
    return "[object Array]" === Object.prototype.toString.call(t)
  }), !a || !i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) {
    return "object" == typeof t && t.buffer && t.buffer.constructor === ArrayBuffer
  });
  var b = function (r) {
    return function (e) {
      return new t(!0).update(e)[r]()
    }
  }, v = function () {
    var r = b("hex");
    h && (r = w(r)), r.create = function () {
      return new t
    }, r.update = function (t) {
      return r.create().update(t)
    };
    for (var e = 0; e < c.length; ++e) {
      var i = c[e];
      r[i] = b(i)
    }
    return r
  }, w = function (t) {
    var e = eval("require('crypto')"), i = eval("require('buffer').Buffer"), s = function (s) {
      if ("string" == typeof s)return e.createHash("md5").update(s, "utf8").digest("hex");
      if (null === s || void 0 === s)throw r;
      return s.constructor === ArrayBuffer && (s = new Uint8Array(s)), Array.isArray(s) || ArrayBuffer.isView(s) || s.constructor === i ? e.createHash("md5").update(new i(s)).digest("hex") : t(s)
    };
    return s
  };
  t.prototype.update = function (t) {
    if (!this.finalized) {
      var e, i = typeof t;
      if ("string" !== i) {
        if ("object" !== i)throw r;
        if (null === t)throw r;
        if (a && t.constructor === ArrayBuffer) t = new Uint8Array(t); else if (!(Array.isArray(t) || a && ArrayBuffer.isView(t)))throw r;
        e = !0
      }
      for (var s, h, f = 0, o = t.length, n = this.blocks, u = this.buffer8; f < o;) {
        if (this.hashed && (this.hashed = !1, n[0] = n[16], n[16] = n[1] = n[2] = n[3] = n[4] = n[5] = n[6] = n[7] = n[8] = n[9] = n[10] = n[11] = n[12] = n[13] = n[14] = n[15] = 0), e)if (a)for (h = this.start; f < o && h < 64; ++f)u[h++] = t[f]; else for (h = this.start; f < o && h < 64; ++f)n[h >> 2] |= t[f] << y[3 & h++]; else if (a)for (h = this.start; f < o && h < 64; ++f)(s = t.charCodeAt(f)) < 128 ? u[h++] = s : s < 2048 ? (u[h++] = 192 | s >> 6, u[h++] = 128 | 63 & s) : s < 55296 || s >= 57344 ? (u[h++] = 224 | s >> 12, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), u[h++] = 240 | s >> 18, u[h++] = 128 | s >> 12 & 63, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s); else for (h = this.start; f < o && h < 64; ++f)(s = t.charCodeAt(f)) < 128 ? n[h >> 2] |= s << y[3 & h++] : s < 2048 ? (n[h >> 2] |= (192 | s >> 6) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : s < 55296 || s >= 57344 ? (n[h >> 2] |= (224 | s >> 12) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), n[h >> 2] |= (240 | s >> 18) << y[3 & h++], n[h >> 2] |= (128 | s >> 12 & 63) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]);
        this.lastByteIndex = h, this.bytes += h - this.start, h >= 64 ? (this.start = h - 64, this.hash(), this.hashed = !0) : this.start = h
      }
      return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this
    }
  }, t.prototype.finalize = function () {
    if (!this.finalized) {
      this.finalized = !0;
      var t = this.blocks, r = this.lastByteIndex;
      t[r >> 2] |= u[3 & r], r >= 56 && (this.hashed || this.hash(), t[0] = t[16], t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.bytes << 3, t[15] = this.hBytes << 3 | this.bytes >>> 29, this.hash()
    }
  }, t.prototype.hash = function () {
    var t, r, e, i, s, h, f = this.blocks;
    this.first ? r = ((r = ((t = ((t = f[0] - 680876937) << 7 | t >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (i = ((i = (-1732584194 ^ 2004318071 & t) + f[1] - 117830708) << 12 | i >>> 20) + t << 0) & (-271733879 ^ t)) + f[2] - 1126478375) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1316259209) << 22 | r >>> 10) + e << 0 : (t = this.h0, r = this.h1, e = this.h2, r = ((r += ((t = ((t += ((i = this.h3) ^ r & (e ^ i)) + f[0] - 680876936) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[1] - 389564586) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[2] + 606105819) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1044525330) << 22 | r >>> 10) + e << 0), r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[4] - 176418897) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[5] + 1200080426) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[6] - 1473231341) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[7] - 45705983) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[8] + 1770035416) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[9] - 1958414417) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[10] - 42063) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[11] - 1990404162) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[12] + 1804603682) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[13] - 40341101) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[14] - 1502002290) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[15] + 1236535329) << 22 | r >>> 10) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[1] - 165796510) << 5 | t >>> 27) + r << 0) ^ r)) + f[6] - 1069501632) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[11] + 643717713) << 14 | e >>> 18) + i << 0) ^ i)) + f[0] - 373897302) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[5] - 701558691) << 5 | t >>> 27) + r << 0) ^ r)) + f[10] + 38016083) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[15] - 660478335) << 14 | e >>> 18) + i << 0) ^ i)) + f[4] - 405537848) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[9] + 568446438) << 5 | t >>> 27) + r << 0) ^ r)) + f[14] - 1019803690) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[3] - 187363961) << 14 | e >>> 18) + i << 0) ^ i)) + f[8] + 1163531501) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[13] - 1444681467) << 5 | t >>> 27) + r << 0) ^ r)) + f[2] - 51403784) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[7] + 1735328473) << 14 | e >>> 18) + i << 0) ^ i)) + f[12] - 1926607734) << 20 | r >>> 12) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[5] - 378558) << 4 | t >>> 28) + r << 0)) + f[8] - 2022574463) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[11] + 1839030562) << 16 | e >>> 16) + i << 0)) + f[14] - 35309556) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[1] - 1530992060) << 4 | t >>> 28) + r << 0)) + f[4] + 1272893353) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[7] - 155497632) << 16 | e >>> 16) + i << 0)) + f[10] - 1094730640) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[13] + 681279174) << 4 | t >>> 28) + r << 0)) + f[0] - 358537222) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[3] - 722521979) << 16 | e >>> 16) + i << 0)) + f[6] + 76029189) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[9] - 640364487) << 4 | t >>> 28) + r << 0)) + f[12] - 421815835) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[15] + 530742520) << 16 | e >>> 16) + i << 0)) + f[2] - 995338651) << 23 | r >>> 9) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[0] - 198630844) << 6 | t >>> 26) + r << 0) | ~e)) + f[7] + 1126891415) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[14] - 1416354905) << 15 | e >>> 17) + i << 0) | ~t)) + f[5] - 57434055) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[12] + 1700485571) << 6 | t >>> 26) + r << 0) | ~e)) + f[3] - 1894986606) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[10] - 1051523) << 15 | e >>> 17) + i << 0) | ~t)) + f[1] - 2054922799) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[8] + 1873313359) << 6 | t >>> 26) + r << 0) | ~e)) + f[15] - 30611744) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[6] - 1560198380) << 15 | e >>> 17) + i << 0) | ~t)) + f[13] + 1309151649) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[4] - 145523070) << 6 | t >>> 26) + r << 0) | ~e)) + f[11] - 1120210379) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[2] + 718787259) << 15 | e >>> 17) + i << 0) | ~t)) + f[9] - 343485551) << 21 | r >>> 11) + e << 0, this.first ? (this.h0 = t + 1732584193 << 0, this.h1 = r - 271733879 << 0, this.h2 = e - 1732584194 << 0, this.h3 = i + 271733878 << 0, this.first = !1) : (this.h0 = this.h0 + t << 0, this.h1 = this.h1 + r << 0, this.h2 = this.h2 + e << 0, this.h3 = this.h3 + i << 0)
  }, t.prototype.hex = function () {
    this.finalize();
    var t = this.h0, r = this.h1, e = this.h2, i = this.h3;
    return n[t >> 4 & 15] + n[15 & t] + n[t >> 12 & 15] + n[t >> 8 & 15] + n[t >> 20 & 15] + n[t >> 16 & 15] + n[t >> 28 & 15] + n[t >> 24 & 15] + n[r >> 4 & 15] + n[15 & r] + n[r >> 12 & 15] + n[r >> 8 & 15] + n[r >> 20 & 15] + n[r >> 16 & 15] + n[r >> 28 & 15] + n[r >> 24 & 15] + n[e >> 4 & 15] + n[15 & e] + n[e >> 12 & 15] + n[e >> 8 & 15] + n[e >> 20 & 15] + n[e >> 16 & 15] + n[e >> 28 & 15] + n[e >> 24 & 15] + n[i >> 4 & 15] + n[15 & i] + n[i >> 12 & 15] + n[i >> 8 & 15] + n[i >> 20 & 15] + n[i >> 16 & 15] + n[i >> 28 & 15] + n[i >> 24 & 15]
  }, t.prototype.toString = t.prototype.hex, t.prototype.digest = function () {
    this.finalize();
    var t = this.h0, r = this.h1, e = this.h2, i = this.h3;
    return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & i, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255]
  }, t.prototype.array = t.prototype.digest, t.prototype.arrayBuffer = function () {
    this.finalize();
    var t = new ArrayBuffer(16), r = new Uint32Array(t);
    return r[0] = this.h0, r[1] = this.h1, r[2] = this.h2, r[3] = this.h3, t
  }, t.prototype.buffer = t.prototype.arrayBuffer, t.prototype.base64 = function () {
    for (var t, r, e, i = "", s = this.array(), h = 0; h < 15;)t = s[h++], r = s[h++], e = s[h++], i += p[t >>> 2] + p[63 & (t << 4 | r >>> 4)] + p[63 & (r << 2 | e >>> 6)] + p[63 & e];
    return t = s[h], i += p[t >>> 2] + p[t << 4 & 63] + "=="
  };
  var _ = v();
  f ? module.exports = _ : (i.md5 = _, o && define(function () {
    return _
  }))
}();
var g_uploader = null;
var g_up_token = ''; // 上传文件token
self.addEventListener('message', function (e) {
  var json = e.data;
  switch (json.cmd) {
    case 'init':
      if (json.usr != null && json.ps != null && json.url != null && json.f != null) {
        g_uploader = new Uploader(json.id, json.usr, json.ps, json.url, json.f);
        //uploader.start();
      }
      break;
    case 'start':
      if (g_uploader != null) {
        g_up_token = json.data;

        g_uploader.start();
      }
      break;
    case 'stop':
      if (g_uploader != null) {
        g_uploader.stop();
      }
      break;
  }
}, false);
function Uploader(id, usr, ps, url, file) {
  g_id = id;
  g_user = usr;
  g_pass = ps;

  g_url = url;
  g_file = file;
  g_reader = new FileReader();
  g_step = 1024 * 128; // 128k
  g_loaded = 0;
  g_writed = 0;
  g_start = 0;
  g_partsize = 0;
  g_partend = 0;
  g_filename = file.name;
  g_total = file.size;
  g_enableRead = false;
  g_part = 1024;
  g_checked = false;
  g_finished = false;
  lockReconnect = false;//避免重复连接
  g_md5 = null;
  g_ws = null;
  this.initMd5();
}

Uploader.prototype = (function () {
  /******私有方法定义*****/
  function initMd5() {
    var len = 0;
    var counter = 0;
    var buffer = new ArrayBuffer(g_part * 2 + 4); // 最后的4个字节留给文件长度
    var intArr = new Uint8Array(buffer);
    // onload该事件在读取操作完成时触发。
    g_reader.onload = function (e) {
      counter = counter + 1;
      var buf = g_reader.result;
      intArr.set(new Uint8Array(buf), len);
      len = len + e.loaded;
      if (g_total > g_part && counter < 2) {
        var blob = g_file.slice(g_total - g_part, g_total);
        g_reader.readAsArrayBuffer(blob);
      } else {
        //追加文件长度信息，防止头尾一致中间插数据的文件
        intArr[len] = (g_total & 0xff000000) >> 24;
        intArr[len + 1] = (g_total & 0x00ff0000) >> 16;
        intArr[len + 2] = (g_total & 0x0000ff00) >> 8;
        intArr[len + 3] = (g_total & 0x000000ff);
        g_md5 = md5(buffer.slice(0, len + 4));
        // console.log("md5:" + g_md5);
        var obj = {};
        obj["msg"] = "md5";
        obj["data"] = g_md5; // g_md5 ???
        postMessage(obj);
        bindReader();
      }
    }
    var blob = g_file.slice(0, g_part);
    g_reader.readAsArrayBuffer(blob); // 开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
  }

  function requestCheck() {
    if (!g_checked) {
      var seconds = parseInt(new Date().getTime() / 1000);
      // var checkstr = md5(seconds + g_pass);
      var checkstr = md5(seconds + g_up_token);
      // console.log(g_up_token, '3');
      var info = '{"id":"' + g_id + '","msg":"check","data":{"user":"' + g_user + '","token":"' + g_up_token + '","salt":"' + seconds + '","check":"' + checkstr + '","md5":"' + g_md5 + '","name":"' + g_filename + '","size":"' + g_total + '"}}';
      //console.log("send:" + info);
      if (g_ws != null) {
        if (g_ws.readyState === 1) { // 1 - 表示连接已建立，可以进行通信。
          //连接成功
          g_ws.send(info, {binary: false});
        } else {
          setTimeout(requestCheck, 1000);
        }
      }

    }
  }

  function requestUpload() {
    var info = '{"id":"' + g_id + '","msg":"upload"}';
    if (g_checked) {
      //console.log("send:" + info);
      if (g_ws != null) {
        if (g_ws.readyState === 1) {
          //连接成功
          g_ws.send(info, {binary: false});
        } else {
          setTimeout(requestUpload, 1000);
        }
      }
    }
  }

  // 读取文件字节并上传 循环调用
  function readBlob() {
    //console.log("readBlob, g_start:" + g_start + ", g_step:" + g_step + ", g_partend:" + g_partend);
    var blob;
    var read_end = g_partend;
    if (g_start + g_step < g_partend) { // 读取到指定位置
      read_end = g_start + g_step;
    }
    blob = g_file.slice(g_start, read_end);
    g_reader.readAsArrayBuffer(blob);
  }

  function bindReader() {
    g_reader.onload = function (e) {
      if (g_enableRead == false)
        return;
      if (g_ws != null) {
        // 只读属性 bufferedAmount 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。
        if (g_ws.bufferedAmount > g_step * 10)
          setTimeout(function () {
            loadSuccess(e.loaded);
          }, 100);
        else
          loadSuccess(e.loaded);
      }
    }
  }

  function loadSuccess(loaded) {
    var blob = g_reader.result; // 文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。
    if (g_ws != null) {
      // console.log("send blob");
      // console.log(blob);
      g_ws.send(blob, {binary: true});
      g_loaded += loaded;
      g_start += loaded;
      sendProgress();
      if (g_loaded < g_partsize)
        readBlob();
    }
  }

  // 发送上传进度
  function sendProgress() {
    var sended = g_start - g_ws.bufferedAmount;
    var sendSuccessPercent = sended / g_total; // 发送成功比例
    // var sendPercent = g_start / g_total;       //  发送比例
    var progress = (sendSuccessPercent * 100).toFixed(2);
    var message = {"msg": "progress", "data": {"writed": sended, "progress": progress}};
    // 通知显示上传进度
    postMessage(message);
  }

  function openWebSocket() {
    try {
      if (g_ws != null) {
        g_ws.close();
        g_ws = null;
      }
      g_ws = new WebSocket(g_url);
      g_ws.binaryType = "arraybuffer";
      g_ws.onmessage = function (evt) {
        onMessage(evt);
      };
      g_ws.onopen = function (evt) {
        onOpen(evt);
      };
      g_ws.onclose = function (evt) {
        onClose(evt);
        reconnect();
      };
      g_ws.onerror = function (evt) {
        onError(evt);
        reconnect();
      };
    } catch (e) {
      reconnect();
    }
  }

  function onMessage(evt) {
    if (typeof(evt.data) === 'string' || evt.data instanceof String) {
      //console.log("Received data string: " + evt.data);
      var obj = JSON.parse(evt.data);
      obj["id"] = g_id;
      if (obj["msg"]) {
        switch (obj["msg"]) {
          case "try":
            reconnect();
            //requestUpload();
            break;
          case "found":
            g_loaded = parseInt(obj["data"]["step"]);
            g_start = parseInt(obj["data"]["start"]);
            g_partsize = parseInt(obj["data"]["size"]);
            g_partend = g_start + g_partsize;
            g_start = g_start + g_loaded;
            // console.log("found, g_start:" + g_start);
            readBlob();
            break;
          case "partfinish":
            requestUpload();
            break;
          case "finish":
            //alert("upload finished");
            g_finished = true;
            break;
          case "check":
            //{"id":"xxx","msg":"check","data":"ok/fail"}
            // console.log("check");
            if (obj["data"] == "ok") {
              // console.log("check ok");
              g_checked = true;
              requestUpload();
            } else {
              g_checked = false;
              // console.log("check failed");
            }
            break;
          case "uploaded":
            //广播服务器端的存储字节数以及百分比进度, 获取数据后,返回的消息
            //{"id":"xxx","msg":"uploaded","data":{"writed":"234234","progress":"10"}}
            g_writed = parseInt(obj["data"]["writed"]);
            g_progress = parseInt(obj["data"]["progress"]);
            //console.log("file uploaded size:" + obj["data"]["writed"] + ", progress:" + obj["data"]["progress"]);
            break;
          default:
            break;
        }
        postMessage(obj);
      }
    }
  }

  function onOpen(evt) {
    //console.log("CONNECTED");
    requestCheck();
    var info = '{"id":"' + g_id + '","msg":"net","data":"CONNECTED"}';
    postMessage(JSON.parse(info));
  }

  function onClose(evt) {
    //console.log("DISCONNECTED");
    g_ws = null;
    g_checked = false;
    var info = '{"id":"' + g_id + '","msg":"net","data":"DISCONNECTED"}';
    postMessage(JSON.parse(info));
  }

  function onError(evt) {
    //console.log("ERROR");
    g_ws.close();
    g_ws = null;
    g_checked = false;
    var info = '{"id":"' + g_id + '","msg":"net","data":"ERROR"}';
    postMessage(JSON.parse(info));
  }

  function reconnect() {
    console.log("reconnect");
    //如果文件已经上传成功，默认不再自动建立服务器连接
    if (g_finished) return;
    if (lockReconnect) return;
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function () {
      openWebSocket();
      lockReconnect = false;
    }, 2000);
  }

  function privateMethod(param) {
    // console.log("in private method");
    // console.log(param);
    // console.log(g_url);
  }

  return {//返回一个原型对象
    constructor: Uploader,
    /*******公有方法*******/
    init: function (id, user, pass, url, file) {
      g_finished = false;
      g_id = id;
      g_user = user;
      g_pass = pass;
      g_url = url;
      g_file = file;
      g_total = g_file.size;
      g_filename = g_file.name;
      initMd5();
    },

    initMd5: function () {
      initMd5();
    },

    start: function () {
      var that = this;
      if (g_md5 == null) {  // gmd5 ???
        setTimeout(function () {
          that.start();
        }, 1000);
      } else {
        g_enableRead = true;
        openWebSocket();
      }
    },

    stop: function () {
      g_enableRead = false;
      g_reader.abort();
    },

    publicMethod: function () {
      console.log("-------public Method-------");
      this._(privateMethod)('param from pubicMethod');
      console.log("-------end of Public Method-------");
    },

    //返回一个函数，该函数的this绑定到当前对象
    _: function (fun) {
      var that = this;
      return function () {
        return fun.apply(that, arguments);//注意return
      }
    }
  }
})();//立刻执行
// self.close()用于在 Worker 内部关闭自身


