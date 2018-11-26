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

        //推荐位
        recommend_list: [],
        // "id":                   //自增ID
        // "sub_title":            //话题标题
        // "sub_pic":              //话题图片
        // "sub_desc":             //话题描述


        // 话题列表
        subject_list: [],

        isIpx:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        app.isAuth(() => {
            // 统计
            const options = {
                op: 'pv',
                wz: 'topic_list',
            }
            app.statistics_pv(options)
            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.getRecommend();
                this.getSubjectList();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // 统计
        const options = {
            op: 'share',
            wz: 'topic_list',
        }
        app.statistics_pv(options)
        return {
            title: '我在PK解说员里玩配音拍视频，现在邀你来玩哦~',
            path: '/pages/subjectIndex/subjectIndex',
            imageUrl: app.globalData.shareImg,
        }
    },

    // 获取推荐信息
    getRecommend() {
      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.topic_recommend,
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
                        recommend_list: data.data
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

    // 获取展示列表
    getSubjectList() {
      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.topic_home,
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
                        subject_list: data.data
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

    // 前往话题详情页
    more(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/subject/subject?id=' + id
        })
    },

    //前往视频页
    goVideo(e) {
        var data = e.currentTarget.dataset.data;
        wx.navigateTo({
            url: '/pages/video/video?video_uuid=' + data.video_uuid + '&id=' + data.id
        })
    },

    //返回
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
})