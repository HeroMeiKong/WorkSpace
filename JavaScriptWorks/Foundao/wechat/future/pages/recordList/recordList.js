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
        open: false,

        //精选
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

        isIpx:false,

        no_more:false,
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
        wx.showTabBar();
        app.isAuth(() => {
            const options = {
                op: 'pv',
                wz: 'dub',
            }
            app.statistics_pv(options)

            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.getTypes();
                this.getSpecialVideoList(() => {
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
        const options = {
            op: 'share',
            wz: 'dub',
        }
        app.statistics_pv(options)
        return {
            title: app.globalData.shareText,
            path: '/pages/recordList/recordList',
            imageUrl: app.globalData.shareImg,
        }
    },

    // 分类查询
    getTypes() {
      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.dub_type,
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

    // 获取精选视频
    getSpecialVideoList(fun) {
        if (!this.data.special_more) {
            return
        }

      wx.showLoading({
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.dub,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                page: this.data.special_page,
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
                    //设置视频数组
                    var temp_special_list = Tool.copyObj(this.data.special_list)
                    temp_special_list = temp_special_list.concat(data.data)
                    this.setData({
                        cur_list: temp_special_list,
                        special_list: temp_special_list,
                        special_page: this.data.special_page + 1
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
            mask:true
        })
        this.data.loading_num++;

        wx.request({
            url: api.dub_type_list,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': temp_data.page,
                'type_sub': type_id,
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

    // 展开列表
    openType() {
        this.setData({
            open: true
        })
    },

    // 展开列表
    closeType() {
        this.setData({
            open: false
        })
    },

    // 切换类型
    switchType(event) {
        const {cur_type, type_data} = this.data
        var data = event.currentTarget.dataset.data

        //关闭展开列表
       this.closeType()

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

    // 切换到精选
    switchSpecial() {
        const {cur_type, type_data, special_index, special_list, special_scroll} = this.data
        //关闭展开列表
        this.closeType()
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

    // 加载数据
    uploadData() {
        const {cur_type} = this.data
        if (cur_type == 0) {
            this.getSpecialVideoList();
        } else {
            this.getTypeVideoList(cur_type)
        }
    },

    // 滑动事件
    scroll(event) {
        const {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} = event.detail;
        const {cur_type, type_data} = this.data
        console.log(scrollTop)
        //记录当前的scrollTop
        if (cur_type == 0) {
            this.data.special_scroll = scrollTop
        } else {
            type_data[cur_type].scroll = scrollTop
        }
    },

    //前往录音页
    goDub(e) {
        var data = e.currentTarget.dataset.data;
        wx.navigateTo({
            url: '/pages/dubbing/dubbing?video_uuid=' + data.video_uuid
        })
    }
})