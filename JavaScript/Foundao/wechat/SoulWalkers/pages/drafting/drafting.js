// pages/drafting/drafting.js
let oldBox , newBox = { x: 0, y: 0 }, mouse = {}, box = { width: 200, height: 100, x: 10, y: 0, backgroundColor: 'yellow' }
let lock = false,device
// wx.setEnableDebug({
//   enableDebug: true,
//   success: function (res) { },
//   fail: function (res) { },
//   complete: function (res) { },
// })
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
  GetDistance(loc1x,loc1y,loc2x,loc2y) {
    loc1x = Math.abs(loc1x - loc2x)
    loc1y = Math.abs(loc1y - loc2y)
    return Math.hypot(loc1x * loc1x + loc1y * loc1y)
  },
  battenTap(e) {
    console.log('mousedown')
    oldBox = box
    mouse.x = e.changedTouches[0].pageX
    console.log(e)
    mouse.y = e.changedTouches[0].pageY
    lock = true;
  },
  battenMove(e) {
    if (lock) {
      console.log('mousemove')
      newBox.x = e.changedTouches[0].pageX - mouse.x + oldBox.x
      newBox.y = e.changedTouches[0].pageY - mouse.y + oldBox.y
      //if (this.GetDistance(newBox.x, newBox.y, e.currentTarget.offsetLeft, e.currentTarget.offsetTop) > 10) {
        console.log(this.GetDistance(newBox.x, newBox.y, e.currentTarget.offsetLeft, e.currentTarget.offsetTop))
        this.setData({
          box: { x: newBox.x, y: newBox.y, width: box.width, height: box.height, backgroundColor: box.backgroundColor }
        })
      //}
    }
  },
  battenEnd(e) {
    lock = false;
    console.log('mouseup')
    oldBox.x = newBox.x
    oldBox.y = newBox.y
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