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
        loading_num: 0,//loading
        id: '',

        top_info: {},//头部信息

        //视频列表
        video_page: 1,
        video_more: true,
        video_list: [],

        isIpx: false,

        showChoose:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.data.id = options.id
        } else {
            wx.redirectTo({
                url: '/pages/subjectIndex/subjectIndex'
            })
        }
        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
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
        app.isAuth(() => {
            // 统计
            const options = {
                op: 'pv',
                wz: 'topic_one_list',
            }
            app.statistics_pv(options)
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.getTopInfo()
                this.getVideoList()
            } else {
                console.log('已初始化')
            }

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
        this.getVideoList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // 统计
        const options = {
            op: 'share',
            wz: 'topic_one_list',
        }
        app.statistics_pv(options)
        return {
            title: '玩转#' + this.data.top_info.sub_title + '，我在逗牛短视频等你！',
            path: '/pages/subject/subject?id=' + this.data.id,
            imageUrl: this.data.top_info.sub_pic,
        }
    },

    // 获取头部数据
    getTopInfo() {
        wx.showLoading()
        this.data.loading_num++;

        const {id} = this.data;
        wx.request({
            url: api.one_topic,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                topic_id: id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    this.setData({
                        top_info: data.data
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

    // 获取视频列表
    getVideoList(fun) {
        if (!this.data.video_more) {
            return
        }

        wx.showLoading()
        this.data.loading_num++;

        wx.request({
            url: api.topic_class,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                topic_id: this.data.id,
                page: this.data.video_page,
            },
            success: (res) => {
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.setData({
                            video_more: false
                        })
                        return
                    }
                    //设置视频数组
                    var temp_video_list = Tool.copyObj(this.data.video_list)
                    temp_video_list = temp_video_list.concat(data.data)
                    this.setData({
                        video_list: temp_video_list,
                        video_page: this.data.video_page + 1
                    }, () => {
                        //第一次回调，播放视频
                        fun && fun();
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

    // 前往视频页
    goVideo(e) {
        var data = e.currentTarget.dataset.data;
        wx.navigateTo({
            url: '/pages/video/video?video_uuid=' + data.video_uuid + '&id=' + data.id,
        })
    },

    // 前往用户页
    goUser(e) {
        var data = e.currentTarget.dataset.data;
        if (data.is_user == 1) {
            this.switchToUser()
        } else {
            wx.navigateTo({
                url: '/pages/otherUser/otherUser?user_uuid=' + data.uuid
            })
        }
    },

    // 返回
    goBack(e) {
        console.log(getCurrentPages())
        if (getCurrentPages().length === 1) {
            wx.navigateTo({
                url: '/pages/index/index',
            })
            return
        }
        wx.navigateBack({
            delta: 1
        })
    },

    // 切换到个人主页
    switchToUser() {
        wx.redirectTo({
            url: '/pages/user/user'
        })
    },

    switchToUpload(){
        wx.redirectTo({
            url: '/pages/dubbingUpload/dubbingUpload'
        })
    },

    rightNow(){
        this.setData({
            showChoose:true
        })
    },

    closeChoose(){
        this.setData({
            showChoose:false
        })
    },

    switchToRecord(){
        wx.navigateTo({
            url: '/pages/recordList/recordList',
        })
    },

    switchToCamera(){
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=camera'
        })
    },

    switchToUpload(){
        wx.navigateTo({
            url: '/pages/preview/preview?usermethod=album'
        })
    },
})