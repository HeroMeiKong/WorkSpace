// component/musicControl/musicControl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlay:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*判断背景播放状态 */
    getState: function () {
      const _this = this;
      let ti;
      ti = setInterval(function () {
        wx.getBackgroundAudioPlayerState({
          success(res) {
            clearInterval(ti)
            const state = res.status;
            console.log(state)
            if (state === 0) {
              /*当前暂停状态  改成播放状态*/
              _this.setData({
                isPlay: true
              })
              wx.playBackgroundAudio();
            } else if (state === 1) {
              /*当前播放状态  改成暂停状态*/
              _this.setData({
                isPlay: false
              })
              wx.pauseBackgroundAudio();
            } else {
              /*当前没有播放器在播放 */
              return
            }
          }, fail(res) { }
        })
      }, 500)

    },
  }
})
