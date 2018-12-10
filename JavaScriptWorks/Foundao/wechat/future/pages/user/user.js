import api from './../../config/api';
import util from './../../utils/util';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        real_userInfo: {},
        hasInit: false,//是否初始化
        loading_num: 0,
        select: 1,//1-作品，2-喜欢

        //用户作品
        product_page: 1,
        product_more: true,
        product_list: [],
        product_none: false,

        //喜欢
        like_page: 1,
        like_more: true,
        like_list: [],
        like_none: false,

        isIpx: false,

        hideTips: true,

        product_no_more: false,
        like_no_more: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
                    console.log('use iphone X')
                    this.setData({
                        isIpx: true
                    })
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.showTabBar();
        app.isAuth(() => {
            const options = {
                op: 'pv',
                wz: 'my_material',
            }
            app.statistics_pv(options)

            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
            } else {
                console.log('已初始化')
            }
            this.setData({
                product_page: 1,
                product_more: true,
                product_list: [],
                like_page: 1,
                like_more: true,
                like_list: [],
            })

            //获取个人信息
            this.getMyInfo()
            //获取我的作品
            this.getMyProduct()
            //获取我的喜欢
            this.getMyLike()
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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
        const {select} = this.data
        if (select == 1) {
            // 作品
            this.getMyProduct()
        } else {
            // 喜欢
            this.getMyLike()
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //
    // },

    // 获取我的作品
    getMyInfo: function () {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.getUserInfo({
            success: (res) => {
                this.setData({
                    real_userInfo: res.userInfo
                })
            }
        })

        wx.request({
            url: api.my_home,
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
                        userInfo: data.data
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

    // 获取我的作品
    getMyProduct: function () {
        const {product_page, product_list, product_more, userInfo} = this.data

        if (!product_more) {
            return
        }

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.my_material,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': product_page,
                // 'uuid': userInfo.uuid,
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.data.product_more = false
                        //判断第一页有无数据
                        if (product_page === 1) {
                            this.setData({
                                product_none: true
                            })
                        } else {
                            this.setData({
                                product_none: false,
                                product_no_more: true,
                            })
                        }
                        return
                    }
                    //设置作品数组
                    this.data.product_page++;
                    this.setData({
                        product_list: product_list.concat(data.data)
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
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

    // 获取我的喜欢
    getMyLike: function () {
        const {like_page, like_list, like_more, userInfo} = this.data

        if (!like_more) {
            return
        }

        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.my_love,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': like_page,
                // 'uuid': userInfo.uuid,
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.data.like_more = false
                        //判断第一页有无数据
                        if (like_page === 1) {
                            this.setData({
                                like_none: true
                            })
                        } else {
                            this.setData({
                                like_none: false,
                                like_no_more: true,
                            })
                        }
                        return
                    }
                    //设置作品数组
                    this.data.like_page++;
                    this.setData({
                        like_list: like_list.concat(data.data)
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
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

    // 切换
    toggle(e) {
        var select = e.currentTarget.dataset.select;
        this.setData({
            select: select
        })
    },

    // 前往关注页
    goAttention(e) {
        var select = e.currentTarget.dataset.select;
        wx.navigateTo({
            url: '/pages/attention/attention?select=' + select
        })
    },

    // 前往视频
    goVideo(e) {
        var data = e.currentTarget.dataset.data;
        var user = e.currentTarget.dataset.user;
        // if (data.hasOwnProperty('examine') && data.examine != 3) {
        //     return
        // }
        var examine = data.examine || 1; //3为通过，2为待审核，1为弃用
        wx.navigateTo({
            url: '/pages/video/video?video_uuid=' + data.video_uuid + '&id=' + data.id + (user ? ('&user=1&examine=' + examine) : ''),
        })

    },

    // 监听个人简介输入，限制输入字数
    numLimit(e) {
        var value = e.detail.value

        if (value.length > 30) {
            // wx.showToast({
            //     title: '不能超过30字'
            // })
            this.data.userInfo.user_autograph = value.slice(0, 30)
            this.setData({
                userInfo: this.data.userInfo,
                hideTips: false,
            })
        }
    },

    // 更新个人简介
    updateContent(e) {
        var value = e.detail.value

        if (value == this.data.userInfo.user_autograph) {
            return
        } else {
            wx.showLoading({
                mask: true
            })
            this.data.loading_num++;

            wx.request({
                url: api.update_autograph,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    "auth-token": wx.getStorageSync('loginSessionKey'),
                },
                data: {
                    autograph: value
                },
                success: (resp) => {
                    const {data} = resp;
                    if (parseInt(data.code) === 0) {
                        var userInfo = util.copyObj(this.data.userInfo) //深度复制
                        userInfo.user_autograph = value
                        this.setData({
                            userInfo: userInfo
                        })
                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none'
                        })
                    }
                },
                complete: () => {
                    this.data.loading_num--;
                    if (this.data.loading_num == 0) {
                        wx.hideLoading()
                    }
                }
            })
        }
    }
})