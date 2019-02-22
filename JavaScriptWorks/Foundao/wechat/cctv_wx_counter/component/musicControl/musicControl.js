// component/musicControl/musicControl.js
const app = getApp();
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
  pageLifetimes: {
    show() {
      // 页面被展示
      let _this = this;
      wx.getBackgroundAudioPlayerState({
        success(res) {
          const state = res.status;
          if (state === 0) {
            /*当前暂停状态  改成播放状态*/
            _this.setData({
              isPlay: false
            })
          } else if (state === 1) {
            /*当前播放状态  改成暂停状态*/
            _this.setData({
              isPlay: true
            })
          } else {

            return
          }
        }, fail(res) { }
      })
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
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
            clearInterval(ti);
            const state = res.status;
            console.log(res);
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
              return false
            }
          }, fail(res) { }
        })
      }, 500)
    },
  }
})
