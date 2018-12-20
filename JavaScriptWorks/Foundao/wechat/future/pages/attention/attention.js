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
        attention_none: false,

        //粉丝喜欢
        fans_page: 1,
        fans_more: true,
        fans_list: [],
        fans_none: false,

        isIpx: false,
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
            const options = {
                op: 'pv',
                wz: 'my_follow',
            }
            app.statistics_pv(options)

            if (!this.data.hasInit) {
                console.log('未初始化')
                this.data.hasInit = true
            } else {
                console.log('已初始化')
            }

            this.setData({
                attention_page: 1,
                attention_more: true,
                attention_list: [],
                attention_none: false,
                fans_page: 1,
                fans_more: true,
                fans_list: [],
                fans_none: false,
            })

            this.getMyAttention()
            this.getMyFans()
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

        wx.showLoading({
            mask: true
        })
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
                        //判断第一页有无数据
                        if (attention_page === 1) {
                            this.setData({
                                attention_list: [],
                                attention_none: true
                            })
                        } else {
                            this.setData({
                                attention_none: false
                            })
                        }
                        return
                    }
                    //设置作品数组
                    this.data.attention_page++;
                    this.setData({
                        attention_list: this.data.attention_list.concat(data.data)
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

        wx.showLoading({
            mask: true
        })
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
                        //判断第一页有无数据
                        if (fans_page === 1) {
                            this.setData({
                                fans_none: true
                            })
                        } else {
                            this.setData({
                                fans_none: false
                            })
                        }
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
    cancel(e, my_uuid) {
        var other_data = e.currentTarget.dataset.data;

        // wx.showLoading({
        //     mask: true
        // })
        // this.data.loading_num++;

        wx.request({
            url: api.del_fabulous,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                type: 1,
                uuid: my_uuid || other_data.other_uuid,               //用户uuid
                // video_uuid: cur_video.video_uuid,
                // select_id: cur_video.id,            //自增id
            },
            success: (resp) => {
                const {data} = resp;
                if (parseInt(data.code) === 0) {
                    app.pubSub.emit('refreshStatus', my_uuid || other_data.other_uuid, 1)
                    //更新数据
                    if (my_uuid) {        //粉丝列表
                        var temp_data = Tool.copyObj(this.data.fans_list)
                        for (var i = 0; i < temp_data.length; i++) {
                            if (temp_data[i].my_uuid == my_uuid) {
                                temp_data[i].guanzhu = 2
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
                        }, 2000)
                    } else {         //关注列表
                        var temp_data = Tool.copyObj(this.data.attention_list)
                        for (var i = 0; i < temp_data.length; i++) {
                            if (temp_data[i].other_uuid == other_data.other_uuid) {
                                temp_data.splice(i, 1)
                                break
                            }
                        }
                        this.setData({
                            attention_list: temp_data,
                            attention_none: temp_data.length > 0 ? false : true,
                        })
                        //刷新关注列表
                        setTimeout(() => {
                            this.data.fans_page = 1;
                            this.data.fans_list = [];
                            this.data.fans_more = true;
                            this.getMyFans();
                        }, 2000)
                    }


                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
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

    //关注（关注粉丝）
    attention(e) {
        var other_data = e.currentTarget.dataset.data;

        // wx.showLoading({
        //     mask: true
        // })
        // this.data.loading_num++;


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
                    app.pubSub.emit('refreshStatus', other_data.my_uuid, 2)
                    //更新数据
                    var temp_data = Tool.copyObj(this.data.fans_list)
                    for (var i = 0; i < temp_data.length; i++) {
                        if (temp_data[i].other_uuid == other_data.other_uuid) {
                            temp_data[i].guanzhu = 3
                            break
                        }
                    }
                    this.setData({
                        fans_list: temp_data,
                        attention_none: false,
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
                // this.data.loading_num--;
                // if (this.data.loading_num == 0) {
                //     wx.hideLoading()
                // }
            }
        })
    },

    // 粉丝关注或取关
    fans_click(e) {
        var other_data = e.currentTarget.dataset.data;

        if (other_data.guanzhu == 3) {      //取关
            this.cancel(e, other_data.my_uuid)
        } else {             //关注
            this.attention(e)
        }
    },

    //前往其他用户页
    goUser(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/otherUser/otherUser?user_uuid=' + id
        })
    },

})