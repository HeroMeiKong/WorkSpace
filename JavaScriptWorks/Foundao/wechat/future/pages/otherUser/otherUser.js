const promisify = require('../../utils/promisify');
import httpRequest from '../../utils/httpRequest';


import api from './../../config/api';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_uuid: '',
        userInfo: {},
        other_userInfo: {},
        // count: 0,
        hasInit: false,//是否初始化
        loading_num: 0,

        //用户作品
        product_page: 1,
        product_more: true,
        product_list: [],


        isIpx:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.user_uuid) {
            this.data.user_uuid = options.user_uuid
        } else {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }

        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
                    this.setData({
                        isIpx:true
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
            // 统计
            const options = {
                op: 'pv',
                wz: 'other_home',
            }
            app.statistics_pv(options)
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true


            } else {
                console.log('已初始化')
            }

            //获取用户信息
            this.getUserInfo()
            //获取作品
            this.getUserProduct()

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

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //
    // },

    // 获取用户信息
    getUserInfo() {
      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.other_home,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                uuid: this.data.user_uuid,
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.setData({
                        // count: data.count,
                        other_userInfo: data.data
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

    // 获取我的作品
    getUserProduct: function () {
        const {product_page, product_list, product_more} = this.data

      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.other_material,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': product_page,
                uuid: this.data.user_uuid,
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.data.product_more = false
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

    // 关注
    fabulous() {
      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        const {other_userInfo} = this.data;

        wx.request({
            url: api.fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: this.data.other_userInfo.uuid,               //用户uuid
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.data.other_userInfo.guanzhu = 2
                    this.setData({
                        other_userInfo: this.data.other_userInfo
                    })
                    this.refreshStatus(this.data.other_userInfo.uuid,2)
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

    // 取消关注
    del_fabulous() {
      wx.showLoading({
            mask:true
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
                uuid: this.data.other_userInfo.uuid,               //用户uuid
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.data.other_userInfo.guanzhu = 1
                    this.setData({
                        other_userInfo: this.data.other_userInfo
                    })
                    this.refreshStatus(this.data.other_userInfo.uuid,1)
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

    // 前往视频
    goVideo(e) {
        var data = e.currentTarget.dataset.data;
        wx.navigateTo({
            url: '/pages/video/video?video_uuid=' + data.video_uuid + '&id=' + data.id,
    })
    },

    // 返回
    goBack(e) {
        // console.log(getCurrentPages())
        if (getCurrentPages().length === 1) {
            wx.navigateTo({
                url: '/pages/index/index',
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },

    //更新主页的关注数据
    refreshStatus(user_uuid,status){
        var pages = getCurrentPages();
        for(var i=0;i<pages.length;i++){
            var page_temp = pages[i]
            if(page_temp.route == 'pages/index/index'){
                page_temp.refreshStatus(user_uuid,status)
                return
            }
        }
    },

})