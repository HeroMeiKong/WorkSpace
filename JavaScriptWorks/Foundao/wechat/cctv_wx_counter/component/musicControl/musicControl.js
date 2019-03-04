// component/musicControl/musicControl.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        isPlay: true
    },
    pageLifetimes: {
        show() {
            // 页面被展示
            if (app.globalData.music_state) {
                //正在播放
                this.setData({
                    isPlay: true
                })
            } else {
                this.setData({
                    isPlay: false
                })
            }
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
            if (app.globalData.music_state) {
                //正在播放
                app.globalData.backgroundAudioManager.pause()
                this.setData({
                    isPlay: false
                })
            } else {
                //暂停中
                app.globalData.backgroundAudioManager.play()
                this.setData({
                    isPlay: true
                })
            }
        },
    }
})
