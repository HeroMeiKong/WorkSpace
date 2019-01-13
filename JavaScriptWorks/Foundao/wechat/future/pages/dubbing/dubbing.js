import api from './../../config/api';
import Tool from './../../utils/util';

const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';

const app = getApp()

const record_text = '为了提供更好的服务，请先开启录音功能';
const writePhotoAlbum_text = '为了提供更好的服务，请先开启保存到相册功能';
//let action = false
//let restartvideo = false
//let videotimeupdate = false

const STATUS = {
    READY: 'READY',
    RECORDING: 'RECORDING',
    PAUSE: 'PAUSE',
    OVER: 'OVER',
    COMPOSING: 'COMPOSING',
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        recorderManager: null,
        innerAudioContext: null,
        timer: null,             // 定时
        query_job_timer: null,  // 定时 查询视频合成状态
        ctx: null,             // canvas对象
        record_path: '',  // 录音后的文件
        isDubbing_flag: false,  // 是否在录音 -》 监听真实录音状态
        error_times: 0,      // 合成错误次数
        authSetting_type: '', // 验证权限的值
        qr_code_url: '',          // 二维码地址
        upload_url: '',          // 上传地址

        options: {
            duration: 10000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'mp3',
            frameSize: 50
        },

        // active_lyric: 0,   // 当前第几行歌词
        total_time: 10000,     // 总时间
        current_time: 0,   // 当前时间
        // video_url: '',   // 视频地址
        userInfo: {},
        // show_authorize: false, // 显示权限pannel
        // showVideo: true, // 显示video
        // hasUserInfo: false,
        muted: false,      // 静音
        isDubbing: false, // 录音中
        isPaused: false,  // 暂停中
        is_dubEnd: false,  // 录音完成
        show_compose_layer: false, // 显示合成浮层
        is_composeing: false,    // 合成中
        compose_success: false,    // 合成成功
        compose_error: false,      // 合成错误
        show_poster: false,        // 显示海报
        // lyric_animationData: {},    // 台词动画
        canvas_poster_url: '',      // 生成的海报
        // authorize_text: '为了提供更好的服务，请先开启录音功能',         // 授权提示内容
        // 字幕
        lyric: [],
        cur_lyricIndex: 0,
        lyric_0: '',
        lyric_1: '',
        lyric_2: '',
        lyric_3: '',
        // operate_list: [],   // 自定义配置文件
        //
        // canIUse: wx.canIUse('button.open-type.getUserInfo'),


        hasInit: '',
        loading_num: 0,
        video_uuid: '',
        playing: false,
        progress: 0,
        video_detail: {},
        //whichVideo: '',
        playing: false,
        showVideo: true,

        status: STATUS.READY,//0-未开始录音，1-开始录音计时，2-录音暂停，3-录音结束，4-合成中

        isIpx: false,
        break_record: false,
        fit: false,

        record_shake: false,
        stop_record_shake: false,
        continue_record_shake: false,

        countDown: -1,

        showPPP: false,//显示配配配
        PPP_Poster: [],//海报数据
        poster_index: 0,//海报数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.data.recorderManager = wx.getRecorderManager();        // 录音
        this.data.innerAudioContext = wx.createInnerAudioContext(); // 播放音频
        this.data.innerAudioContext.obeyMuteSwitch = false;  // 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
        if (options.video_uuid) {
            this.data.video_uuid = options.video_uuid
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            })
        }
        app.isFullScreen(() => {
            this.setData({
                isIpx: true
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 视频
        this.videoContext = wx.createVideoContext('video', this);
        //录音
        this.initRecord();
        // 音频
        this.initAudio();
        // 初始化canvas
        this.createCanvas();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow')
        // restartvideo = false
        // videotimeupdate = false
        // console.log(restartvideo)
        app.isAuth(() => {
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                wx.getUserInfo({
                    success: (res) => {
                        this.data.userInfo = res.userInfo
                        // var nickName = userInfo.nickName
                        // var avatarUrl = userInfo.avatarUrl
                        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        // var province = userInfo.province
                        // var city = userInfo.city
                        // var country = userInfo.country
                    }
                })
                this.getVideoData(this.data.video_uuid,()=>{
                    //获取配配配的模板
                    if (this.isPPP()) {
                        this.get_template_photo()
                    }
                });
            } else {
                console.log('已初始化')
            }

        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('onHide')
        if (this.data.isDubbing) {
            this.reRecord();
            this.breakRecord();
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('onUnload')
        if (this.data.isDubbing) {
            this.breakRecord();
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        // 统计
        const options = {
            op: 'share',
            wz: 'dub_datail',
            uniqueid: this.data.video_uuid,
            id: this.data.video_detail.video_id,
            source: 'material',
        }
        app.statistics_pv(options)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: this.data.video_detail.video_desc || '',
                path: '/pages/dubbing/dubbing?video_uuid=' + this.data.video_uuid,
                imageUrl: this.data.video_detail.video_share_pic || this.data.video_detail.video_small_pic,
            }
        } else if (res.from === 'menu') {
            return {
                title: this.data.video_detail.video_desc || '',
                path: '/pages/dubbing/dubbing?video_uuid=' + this.data.video_uuid,
                imageUrl: this.data.video_detail.video_share_pic || this.data.video_detail.video_small_pic,
            }
        }
    },

    // 视频播放事件
    bindplay() {
        // console.log('play')
        this.setData({
            playing: true
        })
    },

    // 视频暂停事件
    bindpause() {
        // console.log('pause')
        this.setData({
            playing: false
        })
    },

    // 视频加载事件
    bindwaiting(event) {
        // 视频出现缓冲
        console.log('视频出现缓冲 -- onWaiting');
        const {isDubbing, isDubbing_flag} = this.data;
        if (isDubbing || isDubbing_flag) {  // 正在录音
            console.log('视频在录音中出现缓冲 -- onWaiting');
            this.pauseRecord();
            this.stop_record_now();
            // this.reRecord();
            if (isDubbing_flag) {
                this.data.recorderManager.pause();
            }
            wx.showToast({
                title: '视频缓冲中...'
            });
            setTimeout(() => {
                this.videoContext.pause();
                this.videoContext.seek(0);
                wx.hideToast();
            }, 1000);
        }
    },

    // 视频结束事件
    bindended() {
        if (this.data.timer) {
            clearInterval(this.data.timer);
        }
    },

    // 视频时间进度事件
    bindtimeupdate(e) {
        console.log('bindtimeupdate')
        //videotimeupdate = true
        var p = e.detail.currentTime / e.detail.duration
        this.setData({
            progress: p
        })
    },

    // 播放视频
    playVideo() {
        console.log("playVideo")
        this.videoContext.play()
    },

    // 暂停视频
    pauseVideo() {
        console.log("pauseVideo")
        this.videoContext.pause()
    },

    // 停止视频
    stopVideo() {
        console.log("stopVideo")
        this.videoContext.stop()
    },

    // 点击视频，播放or播放
    videoClick() {
        // console.log('video click')
        if (this.data.playing) {
            this.pauseVideo()
        } else {
            this.playVideo()
        }
    },

    // 停止视频和轨道的播放
    stop_record_now() {
        this.data.isDubbing_flag = false;
        this.pauseVideo();
        this.stopInterval();
    },

    // 停止录音
    breakRecord() {
        this.data.break_record = true;
        this.data.recorderManager.stop();
    },

    // 获取视频数据
    getVideoData(video_uuid,fun) {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.dub_detail,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                video_uuid: video_uuid
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    const total_time = parseFloat(data.data.video_time) * 1000;
                    let lyric = [];
                    if (data.data.video_lines) {
                        data.data.video_lines.forEach((item, index) => {
                            lyric = lyric.concat(item);
                        });
                    }
                    const {width, height} = data.data;
                    var fit_temp = false;
                    if (width / height < 0.6) {
                        fit_temp = true
                    } else {
                        fit_temp = false
                    }
                    this.setData({
                        video_detail: data.data,
                        //whichVideo: data.data.transcode_video_url,
                        total_time: total_time,
                        lyric: lyric,
                        fit: fit_temp,
                    }, () => {
                        // 统计
                        const options = {
                            op: 'pv',
                            wz: 'dub_datail',
                            uniqueid: this.data.video_uuid,
                            id: this.data.video_detail.video_id,
                            source: 'material',
                        }
                        app.statistics_pv(options)
                        fun && fun()
                        // // // 提前缓冲音频
                        // setTimeout(() => {
                        //     wx.showLoading({
                        //         title: '视频加载中...'
                        //     });
                        //     this.videoContext.seek(0);
                        //     // 2s缓存视频时间
                        //     setTimeout(() => {
                        //         wx.hideLoading();
                        //         //初始化页面
                        //         this.page_init();
                        //     }, 2000);
                        // }, 1000);
                        //初始化页面
                        this.page_init();
                        this.initRecord_options(total_time);
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        app.initAuth()
                    }
                }
            },
            complete: () => {
                this.data.loading_num--;
                if (this.data.loading_num == 0) {
                    wx.hideLoading()
                }
            }
        })
    },

    // 初始化音频
    initAudio() {
        this.data.innerAudioContext.onError((res) => {
            console.log('播放error');
            console.log(res.errMsg);
            console.log(res.errCode);
        });
        this.data.innerAudioContext.onCanplay((res) => {
            console.log('onCanplay');
        });
        this.data.innerAudioContext.onPlay((res) => {
            console.log('onPlay');
        });
        this.data.innerAudioContext.onPause((res) => {
            console.log('onPause');
        });
        this.data.innerAudioContext.onStop((res) => {
            console.log('onStop');
        });
        // 音频自然播放结束事件
        this.data.innerAudioContext.onEnded((res) => {
            console.log('onEnded');
            wx.hideLoading();
            this.videoContext.pause();
        });
        this.data.innerAudioContext.onTimeUpdate((res) => {

        });
    },

    // 初始话录音
    initRecord() {
        // 录音
        this.data.recorderManager.onStart(() => {
            console.log('recorder start');
            this.data.isDubbing_flag = true;
            this.videoContext.play();
            this.startInterval();
        });
        this.data.recorderManager.onPause(() => {
            console.log('recorder pause');
            this.data.isDubbing_flag = false;
            this.videoContext.pause();
            this.stopInterval();
        });
        // 录音结束
        this.data.recorderManager.onStop((res) => {
            console.log('recorder stop');
            //restartvideo = true
            if (this.data.break_record) {       //主动停止
                this.data.break_record = false;
                this.videoContext.pause();
                return
            }
            console.log(res)
            this.data.isDubbing_flag = false;
            setTimeout(() => {
                const {tempFilePath} = res;
                this.setData({
                    is_dubEnd: true
                });
                this.record_success(tempFilePath);
            }, 0)
        });
        this.data.recorderManager.onFrameRecorded((res) => {
            // const { frameBuffer } = res;
            console.log('recorderManager onFrameRecorded')
        });
        this.data.recorderManager.onError((res) => {
            console.log('recorderManager onError')
            console.log(res.errMsg)
            this.data.recorderManager.stop();
            this.reRecord();
            wx.showToast({
                title: res.errMsg,
                icon: 'none'
            })
        });
    },

    // 开始轮询
    startInterval() {
        if (this.data.timer) {
            clearInterval(this.data.timer);
        }
        this.data.timer = setInterval(this.timeAdd, 100);
        // console.log(action)
        // console.log(videotimeupdate)
        // console.log(restartvideo)
    },

    // 停止轮询
    stopInterval() {
        clearInterval(this.data.timer);
    },

    // 计时
    timeAdd() {
        //if (action && videotimeupdate) {
        const {total_time} = this.data;
        const step = 100;
        const {current_time} = this.data;
        const now_time = current_time + step;
        if (now_time <= total_time) {
            this.check_lyric_position(now_time);
            this.setData({
                current_time: now_time
            })
        }
        //}
    },

    // 设置字幕
    check_lyric_position(now_time) {
        const {total_time, lyric = []} = this.data;
        const length = lyric.length;

        if (length === 0) {
            //没有台词
            return
        }

        // 每行歌词出现平均时间
        const equal_time = total_time / length;
        let now_active_index = Math.floor((now_time) / equal_time);

        var l_1 = lyric[now_active_index];

        //判断是否存在上句
        var l_0 = '';
        if (now_active_index !== 0) {
            l_0 = lyric[now_active_index - 1]
        }

        //判断是否存在下句
        var l_2 = '';
        var l_3 = '';
        if (now_active_index + 1 < length) {
            l_2 = lyric[now_active_index + 1]
        }
        if (now_active_index + 2 < length) {
            l_3 = lyric[now_active_index + 2]
        }

        this.setData({
            lyric_0: l_0,
            lyric_1: l_1,
            lyric_2: l_2,
            lyric_3: l_3,
        })

    },

    // 录音结束
    record_success: function (tempFilePath) {
        this.stopInterval();
        this.videoContext.pause();
        wx.hideLoading();
        wx.showToast({
            title: '录音完成',
            icon: 'success',
        });
        this.setData({
            isDubbing: false, // 录音中
            isPaused: false,  // 暂停中
        });
        this.data.record_path = tempFilePath;
        this.change_src(tempFilePath);
    },

    // 切换audio src
    change_src: function (src) {
        this.data.innerAudioContext.src = src;
    },

    //重新开始
    reStart() {
        this.breakRecord();
        this.reRecord();
    },

    // 重新录制
    reRecord() {
        wx.hideLoading();
        this.data.isDubbing_flag = false;
        clearInterval(this.data.timer);
        this.data.innerAudioContext.pause();
        this.videoContext.pause();
        this.videoContext.seek(0);
        this.data.innerAudioContext.seek(0);

        this.setData({
            current_time: 0,
            muted: false, // 静音
            isDubbing: false, // 录音中
            isPaused: false,  // 暂停中
            is_dubEnd: false,  // 录音完成？
            show_compose_layer: false, // 显示合成浮层
            is_composeing: false,    // 合成中
            compose_success: false,    // 合成成功
            compose_error: false,      // 合成错误
            cur_lyricIndex: 0,
            lyric_0: '',
            lyric_1: '',
            lyric_2: '',
            lyric_3: '',
            // active_lyric: 0,
            // lyric_animationData: this.animation.export()
        }, () => {
            setTimeout(() => {
                this.playVideo()
            }, 500)
        })
    },

    // 合成
    compose() {
        app.aldstat.sendEvent('开始合成', '点击开始合成按钮')
        this.data.innerAudioContext.pause();
        this.videoContext.pause();
        if (this.isPPP()) {
            this.showPPP_fun()
        } else {
            this.uploadFile();
        }
    },

    // 播放录音 -> 预览
    playVoice: function () {
        clearInterval(this.data.timer);
        this.setData({
            muted: true,
            current_time: 0
        });
        console.log(this.data.record_path, 'this.record_path');
        if (this.data.record_path) {
            this.videoContext.seek(0);
            this.data.innerAudioContext.seek(0);
            setTimeout(() => {
                this.startInterval();
                this.data.innerAudioContext.play();
                this.videoContext.play();
            }, 500)
        }
    },

    // 上传
    uploadFile(isPPP) {
        const {record_path} = this.data;
        if (!record_path) {
            wx.showToast({
                title: '请先录制音频',
                icon: 'none'
            });
        } else {
            this.show_compose();
            wx.showLoading({
                title: '音频上传中...'
            });
            const loginSessionKey = wx.getStorageSync('loginSessionKey');
            const uploadTask = wx.uploadFile({
                url: api.upload,
                filePath: record_path,
                name: 'filename',
                header: {
                    "auth-token": loginSessionKey,
                    "content-type": "multipart/form-data"
                },
                formData: {
                    upload_type: 'audio',
                    filename: record_path,
                },
                success: (res) => {
                    const data = JSON.parse(res.data);
                    if (data.code === 0) {
                        this.data.upload_url = data.data.access_url;
                        if (isPPP) {
                            this.submit_photo_dub(this.data.upload_url);
                        } else {
                            this.composeAjax(this.data.upload_url);
                        }
                        wx.showLoading({
                            title: '合成中...'
                        });
                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none'
                        });
                        setTimeout(() => {
                            this.compose_fail();
                        }, 1000);
                    }
                },
                fail: () => {
                    this.compose_fail();
                }
            });
            // 监听上传进度
            // uploadTask.onProgressUpdate((progress, totalBytesSent, totalBytesExpectedToSend) => {
            //
            // });
        }
    },

    // 合成请求
    composeAjax(upload_url) {
        const {video_detail} = this.data;
        // 开发者服务器登录
        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        wx.request({
            url: api.submit_exmaine,
            method: 'POST',
            header: {
                "auth-token": loginSessionKey,
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                video_uuid: video_detail.video_uuid,  // 素材id
                // music_id: video_detail.music_id,       // 音乐id
                audio_url: upload_url                // 录音地址
            },
            success: (resp) => {
                const {code, data, msg} = resp.data;
                if (code === 0) {
                    this.job_id = data.job_id;
                    // 查询视频合成状态
                    this.query_video_status_fun(data.job_id);
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none'
                    });
                    this.compose_fail();
                }
            },
            fail: () => {
                wx.showToast({
                    title: '内部服务器错误',
                    icon: 'none'
                });
                this.compose_fail();
            }
        })
    },

    // 显示合成浮层
    show_compose() {
        this.setData({
            show_compose_layer: true,
            is_composeing: true,
            compose_error: false
        });
    },

    // 合成失败
    compose_fail() {
        this.data.error_times = 0;
        wx.hideLoading();
        this.setData({
            is_composeing: false,
            compose_error: true,
        })
    },

    // 合成成功
    compose_success_fun() {
        this.data.error_times = 0;
        wx.hideLoading();
        this.setData({
            is_composeing: false,
            compose_success: true,
        })
    },

    // 返回首页
    backhome() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    // 查看进度
    toDetail() {
        // 跳转到视频详情页
        this.pauseVideo();
        wx.switchTab({
            url: '/pages/user/user'
        })
    },

    // 重新提交
    reCompose() {
        console.log('重新提交');
        this.uploadFile();
    },

    // 关闭合成浮层
    closeCompose_layer() {
        this.setData({
            show_compose_layer: false
        })
    },

    // 查询视频合成状态
    query_video_status_fun(job_id) {
        httpRequest({
            url: api.query_video_status,
            method: 'POST',
            data: {
                job_id: job_id,  // 工程id
            },
            success: (resp) => {
                const {code, data, msg} = resp.data;
                if (code === 0) {
                    if (data.is_complete === 0) {   // 处理中
                        this.data.error_times = 0;  // 重置错误次数
                        this.data.query_job_timer = setTimeout(() => {
                            this.query_video_status_fun(job_id);
                        }, 1500);
                    } else if (data.is_complete === 1) {  // 处理成功
                        this.compose_success_fun();
                    } else if (data.is_complete === 2) {  // 处理失败
                        this.data.error_times++;
                        if (this.data.error_times < 3) {              // 连续三次出现错误才能判定真正的合成失败
                            this.data.query_job_timer = setTimeout(() => {
                                this.query_video_status_fun(job_id);
                            }, 1500);
                        } else {
                            this.compose_fail();
                        }
                    }
                } else {
                    this.data.error_times++;
                    if (this.data.error_times < 3) {               // 连续三次出现错误才能判定真正的合成失败
                        this.data.query_job_timer = setTimeout(() => {
                            this.query_video_status_fun(job_id);
                        }, 1500);
                    } else {
                        wx.showToast({
                            title: msg,
                            icon: 'none'
                        });
                        this.compose_fail();
                    }
                }
            },
            error: () => {
                wx.showToast({
                    title: '内部服务器错误',
                    icon: 'none'
                });
                this.compose_fail();
            }
        })
    },

    // 开始录音
    startRecord() {
        app.aldstat.sendEvent('开始配音', '点击配音按钮')
        //this.videoContext.stop()
        // 防止用户短时间内多次触发录音
        if (this.data.record_shake) {
            console.log('record_shake')
            return
        } else {
            this.data.record_shake = true
            setTimeout(() => {
                this.data.record_shake = false
            }, 1000)
        }

        const getSetting = promisify(wx.getSetting);
        // 判断用户是否有录音权限
        getSetting().then(resp => {
            if (!resp.authSetting['scope.record']) {
                wx.authorize({
                    scope: 'scope.record',
                    success: () => {
                        // 用户已经同意小程序使用录音功能，后续调用 接口不会弹窗询问
                        this.start_record_real();
                        console.log('用户同意录音');
                    },
                    fail: () => {
                        console.log('用户不同意录音');
                        wx.openSetting({
                            success(res) {
                                console.log(res)
                            },
                            fail(res) {
                                console.log(res)
                            }
                        })
                    }
                })
            } else {
                // 直接保存
                this.start_record_real();
            }
        })
    },

    //倒计时
    countDown_fun(fun) {
        // 显示计时
        this.setData({
            showCountDown: true,
            countDown: 3
        }, () => {
            // 开启字幕
            this.check_lyric_position(0);
            // 开启计时器
            this.countDown_timer = setInterval(() => {
                var temp_countDown = this.data.countDown - 1;
                if (temp_countDown == -1) {         //结束计时
                    this.setData({
                        showCountDown: false
                    })
                    clearInterval(this.countDown_timer)
                    fun && fun()
                }
                //刷新时间
                this.setData({
                    countDown: temp_countDown,
                })
            }, 1000)
        })
    },

    // 开始真正的录音
    start_record_real() {
        //回到期起点
        this.videoContext.seek(0);
        this.pauseVideo();
        this.countDown_fun(() => {
            this.setData({
                //whichVideo: this.data.video_detail.transcode_no_music_zimu_video,
                muted: true,
                isDubbing: true
            });
            setTimeout(() => {
                // this.videoContext.seek(0);
                this.data.recorderManager.start(this.data.options);
            }, 0);
        })
    },

    // 暂停录音
    pauseRecord() {
        if (this.data.stop_record_shake) {
            console.log('stop_record_shake')
            return
        } else {
            this.data.stop_record_shake = true
            setTimeout(() => {
                this.data.stop_record_shake = false
            }, 1000)
        }
        this.setData({
            isPaused: true
        });
        this.data.recorderManager.pause();
        this.stopInterval();
    },

    // 继续录音
    continueRecord() {
        if (this.data.continue_record_shake) {
            console.log('continue_record_shake')
            return
        } else {
            this.data.continue_record_shake = true
            setTimeout(() => {
                this.data.continue_record_shake = false
            }, 1000)
        }
        console.log('继续录音');
        this.setData({
            isPaused: false
        });
        this.data.recorderManager.resume();
        this.playVideo()
        this.startInterval();
    },

    // 初始化音频选项
    initRecord_options(total) {
        this.data.options.duration = total;
    },

    // 页面初始化
    page_init() {
        // 授权录音
        this.authorize_record();
        //获取二维码
        // this.get_erCode()
    },

    // 获取二维码
    get_erCode(fun) {

        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        const wxRequest = promisify(wx.request);

        wxRequest({
            url: api.poster_qrcode,
            method: 'POST',
            header: {
                "auth-token": loginSessionKey
            },
            data: {
                material_id: this.data.video_uuid,
                path: 'pages/dubbing/dubbing?video_uuid=' + this.data.video_uuid,
                // path: 'pages/dubbing/dubbing',
                // path: 'pages/index/index',
                width: 188,           // 二维码的宽度
                auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
                line_color: {"r": "0", "g": "0", "b": "0"},
                is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
            },
        }).then(resp => {
            const {code, data, msg} = resp.data;
            if (code === 0) {
                console.log('二维码地址：' + data.file_path)
                this.data.qr_code_url = data.file_path.replace('http://', 'https://');
                fun && fun()
            } else {
                wx.showToast({
                    title: msg,
                    icon: 'none'
                })
            }
        })
    },

    // 主动触发录音权限
    authorize_record() {
        // const _this = this;
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success() {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            console.log('已授权');
                        },
                        fail: () => {
                            // this.showAuthorize('scope.record');
                        }
                    })
                }
            },
        });
    },

    // 创建canvas
    createCanvas() {
        this.data.ctx = wx.createCanvasContext('canvas_poster');
    },

    roundRect(ctx, x, y, w, h, r) {
        // 开始绘制
        ctx.save();
        ctx.beginPath()
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        // 这里是使用 fill 还是 stroke都可以，二选一即可
        // ctx.setFillStyle('transparent')
        ctx.setStrokeStyle('transparent')
        // 左上角
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2)

        // border-top
        // ctx.lineTo(x + r, y)
        // ctx.lineTo(x + w - r, y)
        ctx.lineTo(x + w - r, y)
        // 右上角
        ctx.arc(x + w - r, y + r, r, Math.PI * 3 / 2, Math.PI * 2)

        // border-right
        ctx.lineTo(x + w, y + h)

        // border-bottom
        ctx.lineTo(x, y + h)

        // border-left
        ctx.lineTo(x, y - r)

        // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
        ctx.fill()
        // ctx.stroke()
        ctx.closePath()
        // 剪切
        ctx.clip()
    },

    // 生成海报
    create_poster() {
        const canvas_width = 750;
        const canvas_height = 1238;
        const {video_name, video_small_pic, sub_title, first_pic3, video_desc, video_share_pic} = this.data.video_detail;

        wx.showLoading({
            title: '海报生成中'
        });

        //获取二维码
        this.get_erCode(() => {
            const getImage = promisify(wx.getImageInfo);
            const getImage1 = promisify(wx.getImageInfo);
            const getImage2 = promisify(wx.getImageInfo);
            const getImage3 = promisify(wx.getImageInfo);

            var ctx = this.data.ctx;
            // ctx.setFillStyle('#FFD892');
            // ctx.fillRect(0, 0, 750, 1238);
            ctx.setFillStyle('#a32b30');

            getImage({src: 'https://s-js.sports.cctv.com/host/resource/future/1bg2@2x.png'}).then(resp => {
                const posterBg_img = resp.path;  // 背景图片
                getImage1({src: (video_share_pic || video_small_pic).replace('http://', 'https://')}).then(resp => {
                    const bg_img = resp.path;  // 封面图
                    const bg_width = resp.width;
                    const bg_height = resp.height;
                    var sx = 0;
                    var sy = 0;
                    var sWidth = 0;
                    var sHeight = 0;
                    if (bg_width / bg_height > 1.3345) {
                        sy = 0
                        sx = (bg_width - bg_height * 1.3345) / 2
                        sHeight = bg_height;
                        sWidth = bg_height * 1.3345;
                    } else {
                        sx = 0
                        sy = (bg_height - bg_width / 1.3345 ) / 2
                        sWidth = bg_width;
                        sHeight = bg_width / 1.3345;
                    }
                    getImage2({src: this.data.qr_code_url}).then(res => {
                        const qr_img = res.path; // 二维码
                        getImage3({src: this.data.userInfo.avatarUrl}).then(re => {
                            const user_img = re.path; // 二维码

                            //开始绘制

                            // 绘制背景图
                            ctx.drawImage(posterBg_img, 0, 0, resp.path.width, resp.path.height, 0, 0, 375, 619);

                            //绘制封面图
                            this.roundRect(ctx, 30, 55, 315, 236, 7)
                            var dx = 30;
                            var dy = 55;
                            // if (sWidth < 315) {
                            //     dx = dx + ((315 - sWidth) / 2)
                            // }
                            // if (sHeight < 236) {
                            //     dy = dy + ((236 - sHeight) / 2)
                            // }
                            ctx.drawImage(bg_img, sx, sy, sWidth, sHeight, dx, dy, 315, 236);
                            ctx.restore();

                            // 绘制头像
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(43 + 32, 256 + 32, 32, 0, Math.PI * 2, false);
                            ctx.clip();
                            ctx.drawImage(user_img, 43, 256, 64, 64);
                            ctx.restore();

                            // 绘制二维码
                            ctx.save();
                            ctx.beginPath();
                            ctx.drawImage(qr_img, 48, 457, 94, 94);
                            ctx.restore();

                            // 绘制名称
                            ctx.font = "bold";
                            ctx.setFillStyle('#FFD792');
                            ctx.setFontSize(17);
                            ctx.setTextBaseline('top')
                            ctx.fillText(this.data.userInfo.nickName, 115, 300);

                            // 绘制描述
                            const stringArr = Tool.stringToArr('#' + sub_title + ' ' + (video_desc || ''), 14);
                            ctx.setFillStyle('#FFD792');
                            ctx.setFontSize(15);
                            ctx.setTextBaseline('top');
                            stringArr.forEach((item, index) => {
                                ctx.fillText(item, 115, 326 + (index * 21));
                            });

                            // 绘制底部文字
                            ctx.setFillStyle('#FFD792');
                            ctx.setFontSize(14);
                            ctx.setTextBaseline('top');
                            ctx.fillText('长按小程序，一起来', 160, 486);
                            ctx.fillText('「逗牛短视频」挑战大咖吧！', 160, 508);

                            ctx.draw(false, this.create_poster_image);
                        })
                    })

                })
            })
        });
    },

    // 生成海报图片
    create_poster_image() {
        console.log('生成海报图片');
        const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
        canvasToTempFilePath({
            canvasId: 'canvas_poster',
            fileType: 'png',
            quality: 1.0,
            destWidth: 750 * 2,
            destHeight: 1238 * 2,
        }, this).then(resp => {
            console.log(resp.tempFilePath);
            this.setData({
                canvas_poster_url: resp.tempFilePath,
                show_poster: true,
            });
            wx.hideLoading();
        }).catch(err => {
            console.log('err:', err)
            // canvas_poster_url
        });
    },

    // 保存海报
    save_poster() {

        const getSetting = promisify(wx.getSetting);
        // 判断用户是否有保存文件的权限
        getSetting().then(resp => {
            if (!resp.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: () => {
                        // 用户已经同意小程序使用录音功能，后续调用 接口不会弹窗询问
                        this.save_photo_sure();
                        console.log('用户同意保存');
                    },
                    fail: () => {
                        console.log('用户不同意保存');
                        wx.openSetting({
                            success(res) {
                                console.log(res)
                            },
                            fail(res) {
                                console.log(res)
                            }
                        })
                        // this.showAuthorize('scope.writePhotosAlbum');
                    }
                })
            } else {
                // 直接保存
                this.save_photo_sure();
            }
        })

    },

    //  保存海报动作
    save_photo_sure() {
        const {canvas_poster_url} = this.data;
        wx.saveImageToPhotosAlbum({
            filePath: canvas_poster_url,
            success(res) {
                wx.showToast({
                    title: '保存成功'
                })
            }
        })
    },

    //  关闭海报浮层
    close_poster_layer() {
        this.setData({
            show_poster: false
        });
    },

    // 返回
    goBack(e) {
        console.log(getCurrentPages())
        if (getCurrentPages().length === 1) {
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },
    // bindwaiting(e) {
    //     console.log('bindwaiting')
    //     if (restartvideo) {
    //         action = true
    //     } else {
    //         action = false
    //     }
    // },
    // bindprogress(e) {
    //     console.log('bindprogress')
    //     action = true
    // }
    //防止冒泡
    noclose_poster() {
    },

    // 获取相框模板
    get_template_photo(fun) {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.template_photo,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                page: 1
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.setData({
                        PPP_Poster: data.data
                    }, () => {
                        fun && fun()
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        app.initAuth()
                    }
                }
            },
            complete: () => {
                this.data.loading_num--;
                if (this.data.loading_num == 0) {
                    wx.hideLoading()
                }
            }
        })
    },

    // 相框模板和配音合成
    submit_photo_dub(upload_url) {
        const {video_detail, PPP_Poster, poster_index} = this.data;

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.submit_photo_dub,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                video_uuid: video_detail.video_uuid,        // 素材id
                audio_url: upload_url,                // 录音地址
                photo_frame: PPP_Poster[poster_index].moban_url,     //模板图
            },
            success: (resp) => {
                const {code, data, msg} = resp.data;
                if (code === 0) {
                    this.job_id = data.job_id;
                    // 查询视频合成状态
                    this.query_template_photo(data.job_id, data.move_name, data.video_url);
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none'
                    });
                    this.compose_fail();
                }
            },
            complete: () => {
                this.data.loading_num--;
                if (this.data.loading_num == 0) {
                    wx.hideLoading()
                }
            }
        })
    },

    // 查询相框和配音合成状况
    query_template_photo(job_id, move_name, video_url) {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        httpRequest({
            url: api.query_template_photo,
            method: 'POST',
            data: {
                job_id: job_id,  // 工程id
                move_name: move_name,
                video_url: video_url,
            },
            success: (resp) => {
                const {code, data, msg} = resp.data;
                if (code == -1) {   // 处理中
                    this.data.error_times = 0;  // 重置错误次数
                    this.data.query_job_timer = setTimeout(() => {
                        this.query_template_photo(job_id, move_name, video_url);
                    }, 1500);
                } else if (code === 0) {  // 处理成功
                    this.compose_success_fun();
                } else if (code === -2) {  // 处理失败
                    this.data.error_times++;
                    if (this.data.error_times < 3) {              // 连续三次出现错误才能判定真正的合成失败
                        this.data.query_job_timer = setTimeout(() => {
                            this.query_template_photo(job_id, move_name, video_url);
                        }, 1500);
                    } else {
                        this.compose_fail();
                    }
                }
            },
            error: () => {
                wx.showToast({
                    title: '内部服务器错误',
                    icon: 'none'
                });
                this.compose_fail();
            },
            complete: () => {
                this.data.loading_num--;
                if (this.data.loading_num == 0) {
                    wx.hideLoading()
                }
            }
        })
    },

    //是否是配配配所属
    isPPP() {
        if(this.data.video_detail.sub_title === "超级配配配"){
            return true
        }else {
            return false
        }

    },

    // 显示配配配
    showPPP_fun() {
        this.setData({
            showPPP: true
        })
    },

    // 显示配配配
    hidePPP_fun() {
        this.setData({
            showPPP: false
        })
    },

    //配配配——不选
    PPP_cancel() {
        this.hidePPP_fun()
        this.uploadFile()
    },

    //配配配——不选
    PPP_ok() {
        this.hidePPP_fun()
        this.uploadFile(true)
    },

    //左滑
    swiper_left() {
        const {poster_index, PPP_Poster} = this.data;
        if (poster_index === 0) {
            this.setData({
                poster_index: PPP_Poster.length - 1
            })
        } else {
            this.setData({
                poster_index: poster_index - 1
            })
        }
    },

    //右滑
    swiper_right() {
        const {poster_index, PPP_Poster} = this.data;
        if (poster_index === PPP_Poster.length - 1) {
            this.setData({
                poster_index: 0
            })
        } else {
            this.setData({
                poster_index: poster_index + 1
            })
        }
    },
})