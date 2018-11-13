import api from './../../config/api';
import Tool from './../../utils/util';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasInit: false,//是否初始化
        select: 1,//1-关注,2-粉丝
        loading_num: 0,

        //关注作品
        attention_page: 1,
        attention_more: true,
        attention_list: [],

        //粉丝喜欢
        fans_page: 1,
        fans_more: true,
        fans_list: [],

        isIpx:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.select) {
            this.setData({
                select: options.select
            })
        }
        wx.getSystemInfo({
            success: (res) => {
                if (res.model.indexOf("iPhone X") > -1) {
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
            const options = {
                op: 'pv',
                wz: 'my_follow',
            }
            app.statistics_pv(options)

            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
                this.getMyAttention()
                this.getMyFans()
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
        const {select} = this.data
        if (select == 1) {
            //关注
            this.getMyAttention()
        } else {
            // 粉丝
            this.getMyFans()
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //
    // },

    //切换
    toggle(e) {
        var select = e.currentTarget.dataset.select;
        this.setData({
            select: select
        })
        if (select == 1) {
            const options = {
                op: 'pv',
                wz: 'my_follow',
            }
            app.statistics_pv(options)
        } else {
            const options = {
                op: 'pv',
                wz: 'my_is_follow',
            }
            app.statistics_pv(options)
        }

    },

    //获取我的关注
    getMyAttention() {
        const {attention_page, attention_list, attention_more} = this.data

        if (!attention_more) {
            return
        }

        wx.showLoading()
        this.data.loading_num++;

        wx.request({
            url: api.my_follow,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': attention_page,
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.data.attention_more = false
                        return
                    }
                    //设置作品数组
                    this.data.attention_page++;
                    this.setData({
                        attention_list: attention_list.concat(data.data)
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

    //获取我的粉丝
    getMyFans() {
        const {fans_page, fans_list, fans_more} = this.data

        if (!fans_more) {
            return
        }

        wx.showLoading()
        this.data.loading_num++;

        wx.request({
            url: api.my_is_follow,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                'page': fans_page,
            },
            success: (res) => {
                console.log(this)
                const {data} = res;
                if (parseInt(data.code) === 0) {
                    //判断是否有数据
                    if (data.data.length === 0) {
                        this.data.fans_more = false
                        return
                    }
                    //设置作品数组
                    this.data.fans_page++;
                    this.setData({
                        fans_list: fans_list.concat(data.data)
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

    //取消关注
    cancel(e) {
        var other_data = e.currentTarget.dataset.data;

        wx.showLoading()
        this.data.loading_num++;

        wx.request({
            url: api.del_fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: other_data.other_uuid,               //用户uuid
                // video_uuid: cur_video.video_uuid,
                // select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    //更新数据
                    var temp_data = Tool.copyObj(this.data.attention_list)
                    for (var i = 0; i < temp_data.length; i++) {
                        if (temp_data[i].other_uuid == other_data.other_uuid) {
                            temp_data.splice(i, 1)
                            break
                        }
                    }
                    this.setData({
                        attention_list: temp_data
                    })
                    //刷新关注列表
                    setTimeout(() => {
                        this.data.fans_page = 1;
                        this.data.fans_list = [];
                        this.data.fans_more = true;
                        this.getMyFans();
                    }, 1000)
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

    //关注
    attention(e) {
        var other_data = e.currentTarget.dataset.data;

        wx.showLoading()
        this.data.loading_num++;

        wx.request({
            url: api.fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: other_data.my_uuid,               //用户uuid
                // video_uuid: cur_video.video_uuid,
                // select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    //更新数据
                    var temp_data = Tool.copyObj(this.data.fans_list)
                    for (var i = 0; i < temp_data.length; i++) {
                        if (temp_data[i].other_uuid == other_data.other_uuid) {
                            temp_data[i].guanzhu = 3
                            break
                        }
                    }
                    this.setData({
                        fans_list: temp_data
                    })
                    //刷新关注列表
                    setTimeout(() => {
                        this.data.attention_page = 1;
                        this.data.attention_list = [];
                        this.data.attention_more = true;
                        this.getMyAttention();
                    }, 1000)
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

    //前往其他用户页
    goUser(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/otherUser/otherUser?user_uuid=' + id
        })
    },

})