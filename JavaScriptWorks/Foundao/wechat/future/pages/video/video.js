const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';
import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false,//是否初始化
        hasPlayed: false,
        playing: false,
        time: 0,
        showVideo: false,
        progress: 0,
        loading_num: 0,
        // btnStatus: false,
        show_share: false,
        show_select: false,
        show_poster: false,
        ctx: null,
        userInfo: {},
        qr_code_url: '',
        is_user: 0,
        examine: 1,

        video_uuid: '',

        cur_video: {
            is_zan: 1
        },

        isIpx: false,
        fit: false,

        loaded: false,

        showDoLayer: false,

        isSending: false,

        noAuth: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        if (options.video_uuid) {
            this.data.video_uuid = options.video_uuid
            this.data.video_id = options.id
            this.setData({
                is_user: options.user || 0,
                examine: options.examine || 1
            })
        } else if (options.scene) {
            this.data.scene = options.scene
        }
        else {
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
        this.videoContext = wx.createVideoContext('video', this)
        // 初始化canvas
        this.createCanvas();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.isAuth(
            () => {
                if (!this.data.hasInit) {
                    console.log('未初始化')
                    this.data.hasInit = true
                    this.getVideoData();
                } else {
                    console.log('已初始化')
                    this.playVideo();
                }
            },
            () => {
                this.setData({
                    noAuth: true,
                }, () => {
                    this.getVideoData()
                })
            }
        )
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.pauseVideo();
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
        // 统计
        const options = {
            op: 'share',
            wz: 'video_detail',
            uniqueid: this.data.video_uuid,
            id: this.data.cur_video.id,
            source: 'ugc',
        }
        app.statistics_pv(options)
        if (this.data.is_user && this.data.examine == 1) {
            return {
                title: app.globalData.shareText,
                path: '/pages/index/index',
                imageUrl: this.data.cur_video.share_pic || app.globalData.shareImg,
            }
        }
        console.log('分享地址：')
        console.log('/pages/video/video?scene=sucai_' + this.data.cur_video.id)
        return {
            title: this.data.cur_video.video_desc,
            path: '/pages/video/video?scene=sucai_' + this.data.cur_video.id,
            imageUrl: this.data.cur_video.share_pic || this.data.cur_video.pic,
        }

    },

    // vv
    vv() {
        // 统计
        const options = {
            op: 'vv',
            wz: 'video_detail',
            uniqueid: this.data.cur_video.video_uuid,
            id: this.data.cur_video.id,
            source: 'ugc'
        }
        app.statistics_pv(options)
    },

    // 监听视频播放
    bindplay() {
        console.log('bindplay')
        this.setData({
            playing: true,
            hasPlayed: true,
        })
        this.vv()
    },

    // 监听视频暂停
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

    // 监听视频时间变化
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
    },

    // 停止视频
    stopVideo() {
        console.log("stopVideo")
        this.videoContext.stop()
    },

    // 点击视频，播放or暂停视频
    videoClick() {
        // console.log('video click')
        if (this.data.playing) {
            this.pauseVideo()
        } else {
            this.playVideo()
        }
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

    // 获取二维码
    get_erCode(fun) {
        const loginSessionKey = wx.getStorageSync('loginSessionKey');
        const wxRequest = promisify(wx.request);

        var wangchun = [1, 3];
        var is_wangchun = wangchun.includes(parseInt(this.data.cur_video.is_wangchun));

        wxRequest({
            url: api.wangchun_poster_qrcode,
            method: 'POST',
            header: {
                "auth-token": loginSessionKey
            },
            data: {
                material_id: this.data.cur_video.video_uuid,
                page: 'pages/video/video',
                scene: 'sucai_' + this.data.cur_video.id,
                width: 188,           // 二维码的宽度
                auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
                line_color: {"r": "255", "g": "216", "b": "146"},
                is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
            },
            // wxRequest({
            //     url: api.poster_qrcode,
            //     method: 'POST',
            //     header: {
            //         "auth-token": loginSessionKey
            //     },
            //     data: {
            //         material_id: this.data.cur_video.video_uuid,
            //         path: '/pages/video/video?video_uuid=' + this.data.cur_video.video_uuid + '&id=' + this.data.cur_video.id,
            //         // path: 'pages/dubbing/dubbing',
            //         // path: 'pages/video/video',
            //         width: 188,           // 二维码的宽度
            //         auto_color: false,      // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
            //         line_color: {"r": "255", "g": "216", "b": "146"},
            //         is_hyaline: false,   // 是否需要透明底色， is_hyaline 为true时，生成透明底色的小程序码
            //     },
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

    // 获取视频数据
    getVideoData() {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        var url = '';
        var temp_data = {};
        if (this.data.video_uuid) {         //video_uuid
            url = this.data.is_user == 1 ? api.video_topics : api.video_topic;
            temp_data = {
                video_uuid: this.data.video_uuid,
                id: this.data.video_id,
                is_user: this.data.is_user ? 1 : 0,
            }
        } else {
            url = api.view_share_sucai
            temp_data = {
                id: this.data.scene,
            }
        }

        wx.request({
            url: url,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: temp_data,
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    if (data.data.length == 0) {
                        this.goBack()
                    }
                    const {width2, height2} = data.data;
                    var fit_temp = false;
                    if (width2 / height2 < 0.6) {
                        fit_temp = true
                    } else {
                        fit_temp = false
                    }
                    //防止点赞状态下，数量为1
                    if (data.data.is_zan == 2 && data.data.count_material_love <= 0) {
                        data.data.count_material_love = 1
                    }
                    if (data.data.is_zan == 2 && data.data.count_material_love_10 <= 0) {
                        data.data.count_material_love_10 = 1
                    }
                    this.setData({
                        cur_video: data.data,
                        fit: fit_temp,
                    }, () => {
                        this.setData({
                            loaded: true
                        })
                        // 统计
                        const options = {
                            op: 'pv',
                            wz: 'video_detail',
                            uniqueid: this.data.video_uuid,
                            id: this.data.cur_video.id,
                            source: 'ugc'
                        }
                        app.statistics_pv(options)
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
                    this.refreshStatus(this.data.cur_video.uuid, 2)
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
                    this.refreshStatus(this.data.cur_video.uuid, 1)
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
                this.data.isSending = false
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

    //  关闭海报浮层
    close_poster_layer() {
        this.setData({
            show_share: false,
            show_poster: false,
        });
    },

    // 生成画布对象
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
        var _this = this;
        const canvas_width = 750;
        const canvas_height = 1238;
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

            getImage({src: 'https://s-js.sports.cctv.com/host/resource/future/bgPoster.png'}).then(res_bg => {
                const posterBg_img = res_bg.path;  // 背景图片
                getImage4({src: 'https://s-js.sports.cctv.com/host/resource/future/poster_0.png'}).then(resp_phone => {
                    const posterBg_img_phone = resp_phone.path;  // 相机图片
                    getImage1({src: ((cur_video.share_pic || cur_video.pic).replace('http://', 'https://') + '')}).then(res_poster => {
                        var bg_img = res_poster.path;  // 封面图
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
                                ctx.drawImage(bg_img, 195, 250, 160, 140);
                                ctx.restore();

                                // 绘制手机
                                ctx.drawImage(posterBg_img_phone, 33, 49, 343, 455, 0, 0, resp_phone.path.width, resp_phone.path.height);
                                ctx.restore();

                                //绘制封面图
                                // ctx.drawImage(bg_img, 133, 126, 165, 241, sx, sy, sWidth, sHeight);

                                // 绘制头像
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(160 + 28, 52 + 28, 28, 0, Math.PI * 2, false);
                                ctx.clip();
                                ctx.drawImage(user_img, 160, 52, 56, 56);
                                ctx.restore();


                                // 绘制名称
                                ctx.font = "bold";
                                ctx.setFillStyle('#A48764');
                                ctx.setFontSize(14);
                                ctx.setTextBaseline('top')
                                ctx.setTextAlign('center')
                                ctx.fillText(cur_video.nick_name, 186, 116);

                                // 绘制描述
                                var all_str = cur_video.video_desc;
                                ctx.setFillStyle('#BA2228');
                                ctx.setFontSize(14);
                                ctx.setTextBaseline('top');
                                ctx.setTextAlign('left')
                                if (all_str.length <= 20) {
                                    ctx.fillText(all_str, 53, 141);
                                } else {
                                    const stringArr = Tool.stringToArr(all_str, 20);
                                    stringArr.forEach((item, index) => {
                                        ctx.fillText(item, 53, 141 + (index * 16));
                                    });
                                }

                                ctx.setFillStyle('#A48764');
                                ctx.setFontSize(13);
                                ctx.setTextBaseline('top')
                                ctx.fillText('「长按图片识别二维码查看」', 53, 182);


                                // 绘制二维码
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(38 + 35, 528 + 35, 37, 0, Math.PI * 2, false);
                                ctx.setFillStyle('#fff')
                                ctx.fill()
                                ctx.clip();
                                ctx.drawImage(qr_img, 38, 528, 70, 70);
                                // ctx.drawImage(qr_img, 40, 520, 66, 66);
                                ctx.restore();


                                // // 绘制底部文字
                                ctx.font = "bold";
                                ctx.setFillStyle('#FFD792');
                                ctx.setFontSize(13);
                                ctx.setTextBaseline('top')
                                if (_this.data.cur_video.sub_title == app.globalData.wangchun_title) {
                                    ctx.fillText('四小福送吉祥，想要喜提你的小福？', 118, 548);
                                    ctx.fillText('扫码开启偶邦湃友人工智能', 118, 564);
                                } else {
                                    ctx.fillText('长按小程序，一起来「逗牛短视频」', 118, 548);
                                    ctx.fillText('挑战大咖吧！', 118, 564);
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
            console.log(resp.tempFilePath);
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

    // 前往录音页
    challenge() {
        app.aldstat.sendEvent('进入配音', '视频页进入')
        wx.navigateTo({
            url: '/pages/dubbing/dubbing?video_uuid=' + this.data.cur_video.video_uuid
        })
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

    // 切换到个人主页
    switchToUser() {
        this.pauseVideo()
        wx.switchTab({
            url: '/pages/user/user'
        })
    },

    //更新主页的点赞数据
    refreshVideo(video_uuid, status) {
        var pages = getCurrentPages();
        for (var i = 0; i < pages.length; i++) {
            var page_temp = pages[i]
            if (page_temp.route == 'pages/index/index') {
                page_temp.refreshVideo(video_uuid, status)
                return
            }
        }
    },

    //更新主页的关注数据
    refreshStatus(user_uuid, status) {
        var pages = getCurrentPages();
        for (var i = 0; i < pages.length; i++) {
            var page_temp = pages[i]
            if (page_temp.route == 'pages/index/index') {
                page_temp.refreshStatus(user_uuid, status)
                return
            }
        }
    },

    // 切换到选择功能页
    switchToRecordList() {
        this.pauseVideo();
        wx.switchTab({
            url: '/pages/dubbingUpload/dubbingUpload'
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

    //关闭拍摄+本地上传浮层
    openDo() {
        if (this.isCecece()) {
            this.openCecece()
        } else {
            this.setData({
                showDoLayer: true
            })
        }
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

    noclose_poster() {

    },

    //删除视频
    deleteVideo() {
        var _this = this
        const {cur_video} = this.data;

        wx.showModal({
            title: '提示',
            content: '确定删除该视频？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.request({
                        url: api.del_person_material,
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            "auth-token": wx.getStorageSync('loginSessionKey'),
                        },
                        data: {
                            id: cur_video.id,
                            uuid: cur_video.video_uuid,
                        },
                        success: (resp) => {
                            const {data} = resp;
                            if (parseInt(data.code) === 0) {
                                _this.goBack();
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
                            // this.data.loading_num--;
                            // if (this.data.loading_num == 0) {
                            //     wx.hideLoading()
                            // }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })


    },

    openZhufu() {
        wx.navigateTo({
            url: '/pages/newYear/newYear'
        })
    },

    join() {
        if (this.data.cur_video.sub_title == app.globalData.wangchun_title) {
            wx.navigateTo({
                url: '/pages/newYear/newYear'
            })
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            })
        }

    },

    isCecece() {
        return (this.data.cur_video.sub_title == app.globalData.cecece_title) ? true : false
    },

    isPPP() {
        return (this.data.cur_video.sub_title == app.globalData.ppp_title) ? true : false
    },

    openCecece() {
        wx.navigateTo({
            url: '/pages/superTest/superTest'
        })
    },

    openPPP() {
        wx.navigateTo({
            url: '/pages/ppp/ppp'
        })
    },
})