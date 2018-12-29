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

        //热门话题
        special_page: 1,
        special_scroll: 0,
        special_more: true,
        special_list: [],

        //分类
        type_list: [],
        type_data: {
            // '0': {
            //     page: 1,
            //     list: [],
            //     more: true,
            //     scroll: 0,
            // }
        },

        //当前选择的类型和数组
        cur_type: 0,
        cur_list: [],
        scrollTop: 0,

        isIpx: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.isFullScreen(()=>{
            this.setData({
                isIpx: true
            })
        })
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
                this.data.hasInit = true;
                this.getRecommend();
                this.getTypes();
                this.getSubjectList(() => {
                    //显示精选
                    this.setData({
                        cur_list: this.data.special_list
                    })
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
            title: 'Show配音玩视频，热门话题任你选！',
            path: '/pages/subjectIndex/subjectIndex',
            imageUrl: app.globalData.shareImg,
        }
    },

    // 分类查询
    getTypes() {
        wx.showLoading({
            mask: true
        })
        this.data.loading_num++;

        wx.request({
            url: api.topic_fenlie,
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
                        type_list: data.data
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

    // 切换到精选
    switchSpecial() {
        const {cur_type, type_data, special_index, special_list, special_scroll} = this.data
        // //关闭展开列表
        // this.closeType()
        if (cur_type == 0) {
            return
        } else {
            this.setData({
                cur_type: 0,
                cur_list: special_list,
                scrollTop: special_scroll,
            })
        }
    },

    // 切换类型
    switchType(event) {
        const {cur_type, type_data} = this.data
        var data = event.currentTarget.dataset.data

        // //关闭展开列表
        // this.closeType()

        if (data.id == cur_type) {
            return
        } else {
            this.setData({
                cur_type: data.id
            })
        }
        //判断缓存中是否有改类型
        if (type_data.hasOwnProperty(data.id)) {
            //如果有切换视频
            this.setData({
                cur_list: type_data[data.id].list,
                scrollTop: type_data[data.id].scroll
            })
        } else {
            //如果没有则需要去取
            this.getTypeVideoList(data.id)
            this.setData({
                scrollTop: 0
            })
        }
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
            url: api.topic_fenlie_list,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': temp_data.page,
                'type_id': type_id
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    var temp_type_data = Tool.copyObj(type_data)
                    //判断是否有数据
                    if (data.data.length === 0) {
                        temp_type_data[type_id].more = false
                        this.setData({
                            type_data: temp_type_data,
                        })
                        return
                    }
                    //设置视频数组
                    temp_type_data[type_id].list = temp_type_data[type_id].list.concat(data.data);
                    temp_type_data[type_id].page++;
                    // temp_data.list = temp_data.list.concat(data.data.data);
                    this.setData({
                        type_data: temp_type_data,
                        cur_list: temp_type_data[type_id].list,
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

    // 获取推荐信息
    getRecommend() {
        wx.showLoading({
            mask: true
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
    getSubjectList(fun) {
        wx.showLoading({
            mask: true
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
                        special_list: data.data
                    }, () => {
                        //第一次回调
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