// pages/drafting/drafting.js
var batten = wx.createSelectorQuery().select('.controls')
let oldBox, newBox = { x: 0, y: 0 }, mouse = {}, box = { width: 200, height: 100, x: 0, y: 0, backgroundColor: 'yellow'}
let lock = false
Page({
  tapName: function (event) {
    console.log(event)
  },
  /**
   * 页面的初始数据
   */
  play() {
    this.videoCtx.play()
  },
  pause() {
    this.videoCtx.pause()
  },
  data: {
    box: box
  },
  battenTap(e) {
    console.log('mousedown')
    oldBox = e.currentTarget
    mouse.x = e.changedTouches[0].pageX
    mouse.y = e.changedTouches[0].pageY
    console.log(mouse)
    lock = true;
  },
  battenMove(e) {
    console.log(e.changedTouches[0])
    if (lock) {
      console.log('mousemove')
      newBox.x = e.changedTouches[0].pageX - mouse.x + oldBox.offsetLeft
      newBox.y = e.changedTouches[0].pageY - mouse.y + oldBox.offsetTop
      this.setData({
        box: { x: newBox.x, y: newBox.y, width: box.width, height: box.height, backgroundColor:box.backgroundColor}
      })
      console.log(newBox)
    }
  },
  battenEnd() {
    lock = false;
    console.log('mouseup')
    oldBox.offsetLeft = newBox.x
    oldBox.offsetTop = newBox.y

    console.log('newBox')
    console.log(newBox)
    console.log('oldBox')
    console.log(oldBox)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoCtx = wx.createVideoContext('myVideo')

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})