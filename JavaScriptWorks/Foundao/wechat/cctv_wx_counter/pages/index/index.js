// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRule_flag: false,//显示游戏规则
        showGameTips_flag: false,//显示游戏提示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.onMusicTap();//进入页面创建背景音乐
  
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
        this.isFisrt()
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

    },

    //显示规则浮层
    showRule() {
        this.setData({
            showRule_flag: true
        })
    },
    //关闭规则浮层
    closeRule() {
        this.setData({
            showRule_flag: false
        })
    },

    //显示游戏提示浮层
    showGameTips() {
        this.setData({
            showGameTips_flag: true
        })
    },
    //关闭游戏提示浮层
    closeGameTips() {
        this.setData({
            showGameTips_flag: false
        })
    },

    // 点击地图
    go_map(event) {
        var map_id = event.currentTarget.dataset.id
        wx.showToast({
            title: '您选择了线路' + map_id
        })
    },

    //判断用户是否第一次打开app
    isFisrt() {
        var first_flag = parseInt(wx.getStorageSync('isFirst'));
        if (!first_flag) {
            wx.setStorageSync('isFirst', 1);
            this.showGameTips();
        }
    },

    /*创建背景音乐*/
    onMusicTap() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = '此时此刻';
    backgroundAudioManager.epname = '此时此刻';
    backgroundAudioManager.singer = '许巍';
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000';
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
    backgroundAudioManager.play();
    backgroundAudioManager.onPlay(() => {
      console.log("音乐播放开始");
    })
    backgroundAudioManager.onEnded(() => {
      console.log("音乐播放结束");
    })
  }

})