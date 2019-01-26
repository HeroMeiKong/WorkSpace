const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false,//是否初始化
        first_init: false,//第一次加载数据
        hasPlayed: false,
        playing: false,//视频播放状态
        animationData: {},//动画
        win_height: 0,//屏幕高度
        touchDotX: 0,
        touchDotY: 0,
        interval: null,//触发定时器
        touchTime: 0,//触摸时间
        hideVideo: false,//隐藏视频
        progress: 0,//时间进度
        btnStatus: false,//弹出框状态
        hideDiyTabBar: true,//隐藏自定义tabbar
        loading_num: 0,//loading
        show_share: false,
        show_select: false,
        show_poster: false,
        ctx: null,
        userInfo: {},
        qr_code_url: '',
        first_uuid: '',

        //精选
        special_page: 1,
        special_index: 0,
        special_more: true,
        special_list: [],

        cur_video: {
            // is_follow: 1,
            // video_url: 'https://www.newscctv.net/dw/resource/future/s.mp4',
        },

        //当前播放视频
        cur_type: 0,//0为精选，其余为分类

        //分类
        type_list: [],
        type_data: {
            // '0': {
            //     page: 1,
            //     list: [],
            //     index: 0,
            //     more: true,
            // }
        },

        isIpx: false,
        isIpx_bottom: false,
        fit: false,

        switch_time: 800,
        swiper_list: [],
        swiper_current: 0,

        showDoLayer: false,

        select_show: false,

        isSending: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('index onLoad')
        wx.hideShareMenu()
        app.pubSub.on('refreshStatus', (user_uuid, status) => {
            this.refreshStatus(user_uuid, status);
        });
        app.pubSub.on('refreshVideo', (video_uuid, status) => {
            this.refreshVideo(video_uuid, status);
        });
        if (options.video_uuid) {
            this.data.first_uuid = options.video_uuid
            this.data.first_id = options.id
        }
        if (options.select_id) {
            this.data.select_id = options.select_id
        }
        app.isFullScreen(() => {
            this.setData({
                isIpx: true
            })
        })
        app.isPhoneX(() => {
            this.setData({
                isIpx_bottom: true
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('index onReady')
        this.videoContext = wx.createVideoContext('video', this)
        // 初始化canvas
        this.createCanvas();

        wx.getSystemInfo({
            success: (res) => {
                // console.log(res.windowHeight)
                this.setData({
                    win_height: res.windowHeight
                })
            }
        })

        var animation = wx.createAnimation({
            timingFunction: 'ease',
        })

        this.animation = animation
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log('onShow')
        this.hideTabBar()
        app.isAuth(() => {
            //统计
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.setData({
                    userInfo: app.globalData.userInfo
                })
                // wx.getUserInfo({
                //     success: (res) => {
                //         this.data.userInfo = res.userInfo       //用微信返回的用户信息（最新），不用后台给的
                //         // var nickName = userInfo.nickName
                //         // var avatarUrl = userInfo.avatarUrl
                //         // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                //         // var province = userInfo.province
                //         // var city = userInfo.city
                //         // var country = userInfo.country
                //     }
                // })
                this.getTypes(() => {
                    if (this.data.first_uuid) {
                        // console.log('first_uuid:')
                        // console.log(this.data.first_uuid)
                        // console.log('first_id:')
                        // console.log(this.data.first_id)
                        //如果是分享入口
                        this.getVideoData(this.data.first_uuid, this.data.first_id, () => {
                            this.getSpecialVideoList(() => {
                                this.refreshSwiper(this.data.special_list)
                                this.switchVideo(this.data.special_list[0], 0, true)
                            });
                        })
                    } else {
                        this.getSpecialVideoList(() => {
                            this.refreshSwiper(this.data.special_list)
                            //如果有select_id并且分类里含有select_id，则自动选择到改分类
                            if (this.data.select_id && this.containTypeId(this.data.select_id)) {
                                this.switchType_fun(this.data.select_id)
                                //显示出覆盖层
                                this.setData({
                                    first_init: true
                                })
                            } else {
                                this.switchVideo(this.data.special_list[0], 0, true)
                            }
                        });
                    }
                });


                // setTimeout(() => {
                //获取二维码
                // this.get_erCode()
                // }, 2000)
            } else {
                console.log('已初始化')
                this.playVideo();
            }

        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.pauseVideo();
        // this.stopVideo();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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
        const options = {
            op: 'share',
            wz: 'home_page',
            id: this.data.cur_video.id,
            uniqueid: this.data.cur_video.video_uuid,
            source: 'ugc',
        }
        console.log('分享统计：')
        console.log(options)
        app.statistics_pv(options)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: this.data.cur_video.video_desc,
                path: '/pages/index/index?&video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
                imageUrl: this.data.cur_video.share_pic || this.data.cur_video.pic,
            }
        } else if (res.from === 'menu') {
            return {
                title: this.data.cur_video.video_desc,
                path: '/pages/index/index?&video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
                imageUrl: this.data.cur_video.share_pic || this.data.cur_video.pic,
            }
        }
    },

    //获取视频数据
    getVideoData(video_uuid, id, fun) {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.video_topic,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                video_uuid: video_uuid,
                id: id,
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    if (data.data.length !== 0) {
                        this.data.special_list.push(data.data);
                    }
                    fun && fun()
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 获取二维码
    get_erCode(fun) {
        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        const wxRequest = promisify(wx.request);

        var wangchun = [1, 3];
        var is_wangchun = wangchun.includes(parseInt(this.data.cur_video.is_wangchun));

        wxRequest({
            url: api.poster_qrcode,
            method: 'POST',
            header: {
                "auth-token": loginSessionKey
            },
            data: {
                material_id: this.data.cur_video.video_uuid,
                // material_id: '1',
                path: '/pages/index/index?video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
                // path: 'pages/dubbing/dubbing',
                // path: 'pages/index/index',
                width: 188,           // 二维码的宽度
                auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
                line_color: {"r": "255", "g": "255", "b": "255"},
                // line_color: {"r": "0", "g": "0", "b": "1"},
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

    // 监控视频播放
    bindplay() {
        console.log('bindplay')
        this.setData({
            playing: true,
            hasPlayed: true,
        })
        var pages = getCurrentPages();
        if (pages[pages.length - 1].route != 'pages/index/index') {
            this.pauseVideo()
        }
        this.vv()
    },

    // vv
    vv() {
        // 统计
        const options = {
            op: 'vv',
            wz: 'home_page',
            uniqueid: this.data.cur_video.video_uuid,
            id: this.data.cur_video.id,
            source: 'ugc'
        }
        app.statistics_pv(options)
    },

    // 监控视频暂停
    bindpause() {
        console.log('bindpause')
        this.setData({
            playing: false
        })
    },

    bindwaiting() {
        console.log('bindwaiting')
        this.setData({
            playing: true
        })
    },

    // 监控视频播放进度
    bindtimeupdate(e) {
        var p = e.detail.currentTime / e.detail.duration;
        if (p < this.data.progress) {
            this.vv()
        }
        this.setData({
            progress: p
        })
    },

    // 播放视频
    playVideo() {
        console.log("playVideo")
        this.hideBtn()
        this.videoContext.play()
    },

    // 暂停视频
    pauseVideo() {
        console.log("pauseVideo")
        this.videoContext.pause()
        this.setData({
            playing: false
        })
    },

    // 停止视频
    stopVideo() {
        console.log("stopVideo")
        this.videoContext.stop()
    },

    // 点击视频
    videoClick() {
        // console.log('video click')
        if (this.data.playing) {
            this.pauseVideo()
        } else {
            this.playVideo()
        }
    },

    // 隐藏原生tabbar，并显示自定义tabbar
    hideTabBar() {
        wx.hideTabBar();
        setTimeout(() => {
            this.showDiyTabBar();
        }, 1000)
    },

    // 显示自定义tabbar
    showDiyTabBar() {
        this.setData({
            hideDiyTabBar: false
        })
    },

    // 隐藏自定义tabbar
    hideDiyTabBar() {
        this.setData({
            hideDiyTabBar: true
        })
    },


    // 切换到录音页
    switchToDubbing() {
        // wx.navigateTo({
        //   url: '/pages/recordList/recordList'
        // })
    },

    // 切换到选择功能页
    switchToRecordList() {
        this.pauseVideo();
        wx.switchTab({
            url: '/pages/dubbingUpload/dubbingUpload'
        })
    },

    // 切换到个人主页
    switchToUser() {
        this.pauseVideo();
        wx.switchTab({
            url: '/pages/user/user'
        })
    },

    // 打开关闭按钮
    toggleBtn() {
        if (this.data.btnStatus) {
            this.hideBtn()
        } else {
            this.showBtn()
        }
    },

    // 收起按钮
    hideBtn() {
        this.setData({
            btnStatus: false
        })
    },

    // 收起按钮
    showBtn() {
        this.setData({
            btnStatus: true
        })
    },

    // 获取精选视频
    getSpecialVideoList(fun) {
        if (!this.data.special_more) {
            return
        }

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.home_page_selection,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                page: this.data.special_page,
                small_selection: this.data.small_selection,
                small_ordinary: this.data.small_ordinary,
            },
            success: (res) => {
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.setData({
                            special_more: false
                        })
                        return
                    }
                    if (this.data.first_uuid) {
                        //排重
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].video_uuid == this.data.first_uuid) {
                                data.data.splice(i, 1)
                                break
                            }
                        }
                    }
                    //设置视频数组
                    this.setData({
                        special_list: this.data.special_list.concat(data.data),
                        special_page: ++this.data.special_page,
                    }, () => {
                        //第一次回调，播放视频
                        fun && fun();
                        //计算最小id
                        for (var i = this.data.special_list.length - 1; i >= 0; i--) {
                            var temp = this.data.special_list[i]
                            if (parseInt(temp.quality) === 2) {
                                //普通id
                                this.data.small_selection = temp.id
                                break
                            }
                        }
                        for (var i = this.data.special_list.length - 1; i >= 0; i--) {
                            var temp = this.data.special_list[i]
                            if (parseInt(temp.quality) === 1) {
                                //普通id
                                this.data.small_ordinary = temp.id
                                break
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 获取分类列表
    getTypeVideoList(type_id) {
        const {type_data} = this.data

        //判断是否有数据
        if (type_data.hasOwnProperty(type_id) && !type_data[type_id].more) {
            return
        }

        //如果没有该分类需要创建对象
        var isFirst = false
        if (!type_data.hasOwnProperty(type_id)) {
            isFirst = true
            type_data[type_id] = {
                page: 1,
                list: [],
                index: 0,
                more: true,
            }
        }

        var temp_data = type_data[type_id]

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.type_video,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': temp_data.page,
                'type_id': type_id,
            },
            success: (res) => {
                // console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        temp_data.more = false
                        return
                    }
                    //设置视频数组
                    temp_data.list = temp_data.list.concat(data.data);
                    temp_data.page++;

                    //如果是第一次，播放视频
                    if (isFirst) {
                        this.refreshSwiper(temp_data.list, 0)
                        this.switchVideo(temp_data.list[0], 0)
                    } else {
                        this.refreshSwiper(temp_data.list, -2)
                    }

                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 分类查询
    getTypes(fun) {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.types,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {},
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.setData({
                        type_list: data.data.splice(0, 3)
                    }, () => {
                        fun && fun()
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 切换类型
    switchType(event) {
        var data = event.currentTarget.dataset.data
        this.switchType_fun(data.id)
    },

    // 根据id切换类型
    switchType_fun(id) {
        const {cur_type, type_data} = this.data
        if (id == cur_type || !this.containTypeId(id)) {
            return
        } else {
            this.setData({
                cur_type: id
            })
        }
        //判断视频数据是否存在
        if (type_data.hasOwnProperty(id)) {
            //如果有切换视频
            var index = type_data[id].index
            var video_data = type_data[id].list[index]
            this.refreshSwiper(type_data[id].list, index)
            this.switchVideo(video_data, index)
        } else {
            //如果没有则需要去取
            this.getTypeVideoList(id)
        }
    },

    // 分类列表是否含有相应id
    containTypeId(id) {
        const {type_list} = this.data
        for (var i = 0; i < type_list.length; i++) {
            if (type_list[i].id == id) {
                return true
            }
        }
        return false
    },


    // 切换到精选
    switchSpecial() {
        const {special_index, special_list, cur_type} = this.data
        if (cur_type == 0) {
            return
        }
        this.setData({
            cur_type: 0
        })
        this.refreshSwiper(special_list, special_index)
        this.switchVideo(special_list[special_index], special_index)
    },


    // 关注
    fabulous() {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        const {cur_video} = this.data;
        wx.request({
            url: api.fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: cur_video.uuid,               //用户uuid
                video_uuid: cur_video.video_uuid,
                select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.data.cur_video.is_follow = 2
                    this.setData({
                        cur_video: this.data.cur_video
                    })
                    this.refreshStatus(cur_video.uuid, 2)
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 取消关注
    del_fabulous() {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        const {cur_video} = this.data;
        wx.request({
            url: api.del_fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: cur_video.uuid,               //用户uuid
                video_uuid: cur_video.video_uuid,
                select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.data.cur_video.is_follow = 1
                    this.setData({
                        cur_video: this.data.cur_video
                    })
                    this.refreshStatus(cur_video.uuid, 1)
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
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

    // 喜欢
    like() {
        // wx.showLoading({
        //     mask: true
        // })
        // this.data.loading_num++;

        if (this.data.isSending) {
            return
        } else {
            this.data.isSending = true
        }

        const {cur_video} = this.data;
        wx.request({
            url: api.fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 0,
                uuid: cur_video.uuid,               //用户uuid
                video_uuid: cur_video.video_uuid,
                select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                this.data.isSending = false;
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.data.cur_video.is_zan = 2;
                    this.data.cur_video.count_material_love++;
                    this.data.cur_video.count_material_love_10++;
                    this.setData({
                        cur_video: this.data.cur_video
                    })
                    this.refreshVideo(cur_video.video_uuid, 2)
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
                        app.initAuth()
                    }
                }
            },
            complete: () => {
                // this.data.loading_num--;
                // if (this.data.loading_num == 0) {
                //     wx.hideLoading()
                // }
            }
        })
    },

    // 不喜欢
    dislike() {
        if (this.data.isSending) {
            return
        } else {
            this.data.isSending = true
        }
        // wx.showLoading({
        //     mask: true
        // })
        // this.data.loading_num++;
        const {cur_video} = this.data;
        wx.request({
            url: api.del_fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 0,
                uuid: cur_video.uuid,               //用户uuid
                video_uuid: cur_video.video_uuid,
                select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                this.data.isSending = false;
                const {data} = resp;
                const {count_material_love, count_material_love_10} = this.data.cur_video;
                if (parseInt(data.code) === 0) {
                    this.data.cur_video.is_zan = 1;
                    if (count_material_love > 0) {
                        this.data.cur_video.count_material_love--;
                    }
                    if (count_material_love_10 > 0) {
                        this.data.cur_video.count_material_love_10--;
                    }
                    this.setData({
                        cur_video: this.data.cur_video
                    })
                    this.refreshVideo(cur_video.video_uuid, 1)
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                    if (data.code == -1001) {
                        this.data.hasInit = false
                        app.initAuth()
                    }
                }
            },
            complete: () => {
                // this.data.loading_num--;
                // if (this.data.loading_num == 0) {
                //     wx.hideLoading()
                // }
            }
        })
    },

    // 分享
    share() {
        this.setData({
            show_share: true,
            show_select: true,
            show_poster: false,
        })
    },

    // 关闭海报浮层
    close_poster_layer() {
        this.setData({
            show_share: false,
            show_poster: false,
        });
    },

    // 创建画布对象
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
        var _this = this
        // const canvas_width = 750;
        // const canvas_height = 1238;
        const {userInfo, cur_video} = this.data;

        wx.showLoading({
            title: '海报生成中'
        });

        //获取二维码
        this.get_erCode(() => {
            const getImage = promisify(wx.getImageInfo);
            const getImage1 = promisify(wx.getImageInfo);
            const getImage2 = promisify(wx.getImageInfo);
            const getImage3 = promisify(wx.getImageInfo);
            const getImage4 = promisify(wx.getImageInfo);

            var ctx = this.data.ctx;
            // ctx.setFillStyle('#FFD892');
            // ctx.fillRect(0, 0, 750, 1238);
            ctx.setFillStyle('#a32b30');

            getImage({src: 'https://s-js.sports.cctv.com/host/resource/future/bg@2x_0.png'}).then(res_bg => {
                const posterBg_img = res_bg.path;  // 背景图片
                getImage4({src: 'https://s-js.sports.cctv.com/host/resource/future/4qipao@2x.png'}).then(resp_phone => {
                    const posterBg_img_phone = resp_phone.path;  // 相机图片
                    getImage1({src: ((cur_video.share_pic || cur_video.pic).replace('http://', 'https://') + '')}).then(res_poster => {
                        var bg_img = res_poster.path;  // 封面图
                        var bg_width = res_poster.width;
                        var bg_height = res_poster.height;
                        var sx = 0;
                        var sy = 0;
                        var sWidth = 0;
                        var sHeight = 0;
                        if (bg_width > 165) {
                            var scale = bg_width / 165
                            bg_width = 165
                            bg_height = bg_height / scale
                        }
                        if (bg_height > 241) {
                            var scale = bg_height / 241
                            bg_height = 241
                            bg_width = bg_width / scale
                        }
                        if (bg_width / bg_height > 0.68) {
                            sy = 0
                            sx = (bg_width - bg_height * 0.68) / 2
                            sHeight = bg_height;
                            sWidth = bg_height * 0.68;
                        } else {
                            sx = 0
                            sy = (bg_height - bg_width / 0.68) / 2
                            sWidth = bg_width;
                            sHeight = bg_width / 0.68;
                        }
                        getImage2({src: this.data.qr_code_url}).then(res_QR => {
                            const qr_img = res_QR.path; // 二维码
                            getImage3({src: cur_video.nick_pic.replace('http://', 'https://')}).then(re_user => {
                                const user_img = re_user.path; // 头像

                                ////////////////////////开始绘制 ////////////////////////

                                // 绘制背景图
                                ctx.save();
                                ctx.drawImage(posterBg_img, 0, 0, 375, 619, 0, 0, res_bg.path.width, res_bg.path.height);

                                //绘制封面图
                                ctx.rotate(5 * Math.PI / 180);
                                ctx.drawImage(bg_img, 190, 190, 165, 241);
                                ctx.restore();

                                // 绘制手机
                                ctx.drawImage(posterBg_img_phone, 133, 126, 235, 358, 0, 0, resp_phone.path.width, resp_phone.path.height);
                                ctx.restore();

                                //绘制封面图
                                // ctx.drawImage(bg_img, 133, 126, 165, 241, sx, sy, sWidth, sHeight);

                                // 绘制头像
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(160 + 13, 137 + 13, 13, 0, Math.PI * 2, false);
                                ctx.clip();
                                ctx.drawImage(user_img, 160, 137, 26, 26);
                                ctx.restore();


                                // 绘制名称
                                ctx.font = "bold";
                                ctx.setFillStyle('#BA2228');
                                ctx.setFontSize(14);
                                ctx.setTextBaseline('top')
                                ctx.fillText(cur_video.nick_name, 195, 142);

                                // 绘制描述
                                var all_str = '#' + cur_video.sub_title + ' ' + cur_video.video_desc;
                                ctx.setFillStyle('#BA2228');
                                ctx.setFontSize(12);
                                ctx.setTextBaseline('top');
                                if (all_str.length <= 16) {
                                    ctx.fillText(all_str, 160, 180);
                                } else {
                                    const stringArr = Tool.stringToArr(all_str, 16);
                                    stringArr.forEach((item, index) => {
                                        ctx.fillText(item, 160, 168 + (index * 16));
                                    });
                                }


                                // 绘制二维码
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(53 + 27, 526 + 27, 27, 0, Math.PI * 2, false);
                                ctx.clip();
                                ctx.drawImage(qr_img, 53, 526, 54, 54);
                                ctx.restore();


                                // // 绘制底部文字
                                ctx.font = "bold";
                                ctx.setFillStyle('#FFD792');
                                ctx.setFontSize(13);
                                ctx.setTextBaseline('top')
                                if (_this.data.cur_video.sub_title == app.globalData.wangchun_title) {
                                    ctx.fillText('四小福送吉祥，想要喜提你的小福？', 119, 538);
                                    ctx.fillText('扫码开启偶邦湃友人工智能', 119, 556);
                                } else {
                                    ctx.fillText('长按小程序，一起来「逗牛短视频」', 119, 538);
                                    ctx.fillText('挑战大咖吧！', 119, 556);
                                }


                                ctx.draw(false, this.create_poster_image);
                            })
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
            // console.log(resp.tempFilePath);
            this.setData({
                canvas_poster_url: resp.tempFilePath,
                show_poster: true,
                show_select: false,
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
                        wx.showModal({
                            title: '提示',
                            content: '逗牛短视频 申请获得保存图片到相册的权限',
                            success(res) {
                                if (res.confirm) {
                                    wx.openSetting({})
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                        // wx.openSetting({
                        //     success(res) {
                        //         console.log(res)
                        //     },
                        //     fail(res) {
                        //         console.log(res)
                        //     }
                        // })
                        // this.showAuthorize('scope.writePhotosAlbum');
                    }
                })
            } else {
                // 直接保存
                this.save_photo_sure();
            }
        })

    },

    // 保存海报动作
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

    // 前往配音页
    challenge() {
        app.aldstat.sendEvent('进入配音', '首页进入')
        wx.navigateTo({
            url: '/pages/dubbing/dubbing?video_uuid=' + this.data.cur_video.video_uuid
        })
    },

    // 前往用户页
    goUser() {
        if (this.data.cur_video.is_user == 1) {
            this.switchToUser()
        } else {
            wx.navigateTo({
                url: '/pages/otherUser/otherUser?user_uuid=' + this.data.cur_video.uuid
            })
        }
    },

    // 前往话题页
    goSubject() {
        wx.navigateTo({
            url: '/pages/subjectIndex/subjectIndex'
        })
    },

    // 前往话题详情页
    goSubjectDetail() {
        // if (this.data.cur_video.sub_title == '网春大拜年') {
        //     wx.navigateTo({
        //         url: '/pages/subject/subject?id=999'
        //     })
        // } else {
        wx.navigateTo({
            url: '/pages/subject/subject?id=' + this.data.cur_video.join_type_sub
        })
        // }
    },

    // 更新其他视频里的关注状态
    refreshStatus(user_uuid, status) {
        if (user_uuid == this.data.cur_video.uuid) {//就是当前该视频
            this.data.cur_video.is_follow = status
            this.setData({
                cur_video: this.data.cur_video
            })
        }
        for (var i = 0; i < this.data.special_list.length; i++) {
            var temp = this.data.special_list[i]
            if (user_uuid == temp.uuid) {
                temp.is_follow = status
            }
        }
        for (var name in this.data.type_data) {
            var type_data_temp = this.data.type_data[name];
            for (var i = 0; i < type_data_temp.length; i++) {
                var temp = type_data_temp[i]
                if (user_uuid == temp.uuid) {
                    temp.is_follow = status
                }
            }
        }
    },

    // 更新其他视频里的点赞状态
    refreshVideo(video_uuid, status) {
        if (video_uuid == this.data.cur_video.video_uuid) { //就是当前该视频
            this.data.cur_video.is_zan = status
            this.setData({
                cur_video: this.data.cur_video
            })
        }
        for (var i = 0; i < this.data.special_list.length; i++) {
            var temp = this.data.special_list[i]
            if (video_uuid == temp.video_uuid) {
                temp.is_zan = status
            }
        }
        for (var name in this.data.type_data) {
            var type_data_temp = this.data.type_data[name];
            for (var i = 0; i < type_data_temp.length; i++) {
                var temp = type_data_temp[i]
                if (video_uuid == temp.video_uuid) {
                    temp.is_zan = status
                }
            }
        }
    },


    ///////////////////////滑动相关///////////////////////
    // 切换视频
    switchVideo(data, index, isfirst) {
        const {width2, height2} = data;
        var fit_temp = false;   //播放器适配方式
        if (width2 / height2 < 0.6) {
            fit_temp = true
        } else {
            fit_temp = false
        }
        this.setData({
            fit: fit_temp
        }, () => {
            if (data.is_zan == 2 && data.count_material_love <= 0) {
                data.count_material_love = 1
            }
            if (data.is_zan == 2 && data.count_material_love_10 <= 0) {
                data.count_material_love_10 = 1
            }
            if (isfirst) {
                console.log('swiper_current isfirst')
                //第一次初始化
                this.setData({
                    // playing: true,
                    cur_video: data,
                    fit: fit_temp,
                }, () => {
                    // 统计
                    const options = {
                        op: 'pv',
                        wz: 'home_page',
                        uniqueid: this.data.cur_video.video_uuid,
                        id: this.data.cur_video.id,
                        source: 'ugc'
                    }
                    app.statistics_pv(options)
                    //显示视频上的所有元素
                    this.setData({
                        first_init: true
                    })
                })
            } else {
                //隐藏视频，重置视频源，并滑动swiper;滑动结束后，显示视频
                console.log('swiper_current:')
                console.log(index)
                this.setData({
                    // playing: true,
                    cur_video: data,
                    fit: fit_temp,
                    hideVideo: true,
                    swiper_current: index || 0
                }, () => {
                    // 统计
                    const options = {
                        op: 'pv',
                        wz: 'home_page',
                        uniqueid: this.data.cur_video.video_uuid,
                        id: this.data.cur_video.id,
                        source: 'ugc'
                    }
                    app.statistics_pv(options)
                    // 显示视频
                    setTimeout(() => {
                        this.setData({
                            hideVideo: false
                        }, () => {
                            // this.playVideo()
                            setTimeout(() => {
                                this.playVideo()
                            }, 500)
                        })
                    }, this.data.switch_time)
                })
            }

        })
    },

    // 下滑
    moveDown() {
        const {cur_type, special_index, special_list, type_data} = this.data;
        //判断下滑是否还有数据
        if (parseInt(cur_type) === 0) {
            //精选
            if (special_index === 0) {
                //到顶
                console.log('到顶')
                return
            } else {
                this.switchVideo(special_list[special_index - 1], special_index - 1)
                this.data.special_index--
            }
        } else {
            //分类
            var temp_cur_data = type_data[cur_type]
            if (temp_cur_data.index === 0) {
                //到顶
                console.log('到顶')
                return
            } else {
                this.switchVideo(temp_cur_data.list[temp_cur_data.index - 1], temp_cur_data.index - 1)
                type_data[cur_type].index--
            }
        }
    },

    // 上滑
    moveUp() {
        const {cur_type, special_index, special_list, type_data} = this.data;
        //判断下滑是否还有数据
        if (parseInt(cur_type) === 0) {
            //精选
            if (special_index === special_list.length - 1) {
                //到底
                console.log('到底')
                return
            } else {
                this.switchVideo(special_list[special_index + 1], special_index + 1)
                this.data.special_index++
            }
            //判断是否加载更多
            if (special_index > special_list.length - 10) {
                this.getSpecialVideoList(() => {
                    this.refreshSwiper(this.data.special_list, -2)
                })
            }
        } else {
            //分类
            var temp_cur_data = type_data[cur_type]
            if (temp_cur_data.index === temp_cur_data.list.length - 1) {
                //到底
                console.log('到底')
                return
            } else {
                this.switchVideo(temp_cur_data.list[temp_cur_data.index + 1], temp_cur_data.index + 1)
                type_data[cur_type].index++
            }
            //判断是否加载更多
            if (temp_cur_data.index > temp_cur_data.list.length - 10) {
                this.getTypeVideoList(cur_type)
            }
        }
    },

    // 触摸开始事件
    touchStart: function (e) {
        this.data.touchDotX = e.touches[0].pageX; // 获取触摸时的原点
        this.data.touchDotY = e.touches[0].pageY;
        // 使用js计时器记录时间
        this.data.interval = setInterval(() => {
            this.data.touchTime++;
        }, 100);
    },

    // 触摸结束事件
    touchEnd: function (e) {
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - this.data.touchDotX;
        let tmY = touchMoveY - this.data.touchDotY;
        if (this.data.touchTime < 20) {
            let absX = Math.abs(tmX);
            let absY = Math.abs(tmY);
            if (absX > 1 * absY) {
                if (tmX < -10) {
                    console.log("左滑")
                    this.switchToRecordList()
                } else if (tmX > 10) {
                    console.log("右滑")
                }
            }
            if (absY > absX * 1) {
                if (tmY < -1) {
                    console.log("上滑")
                    this.moveUp()
                } else if (tmY > 1) {
                    console.log("下滑")
                    this.moveDown()
                }

            }
        }
        clearInterval(this.data.interval); // 清除setInterval
        this.data.interval = null;
        this.data.touchTime = 0;
    },

    // 刷新swiper
    refreshSwiper(list, index) {
        var pic_list = []
        for (var i = 0; i < list.length; i++) {
            pic_list.push(list[i].first_pic3 || list[i].pic)
        }
        // -2只增加list,不操作swiper
        if (index == -2) {
            setTimeout(() => {
                this.setData({
                    swiper_list: pic_list,
                })
            }, 1000)
        } else {
            this.setData({
                swiper_list: pic_list,
                swiper_current: index || 0
            })
        }
    },

    bindprogress() {
        console.log('bindprogress')
        // this.playVideo()
    },


    //关闭拍摄+本地上传浮层
    openDo() {
        this.setData({
            showDoLayer: true
        })
    },
    closeDo() {
        this.setData({
            showDoLayer: false
        })
    },
    switchToCamera() {
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=camera'
        })
    },

    switchToUpload() {
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=album'
        })
    },

    openZhufu() {
        wx.navigateTo({
            url: '/pages/newYear/newYear'
        })
    },

    noclose_poster() {

    },
})























