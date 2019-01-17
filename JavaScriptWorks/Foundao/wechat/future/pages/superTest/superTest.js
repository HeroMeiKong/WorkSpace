// pages/superTest/superTest.js
import api from './../../config/api';
let videoSrc = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: 'defaultmodel',
    showFirst: 'flex',
    showCover: 'none',
    showSecond: 'none',
    changeimage: true,
    showThird: 'none',
    fromX: 0, //第一张图片动画
    pic: '',
    makerVideoId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf("iPhone X") > -1 || res.model.indexOf("iPhone11") > -1) {
          //iphoneX
          that.data.models = 'iphoneX'
        } else if (res.model.indexOf("BLA-AL00") > -1) {
          //huaweimate10plus
          that.data.models = 'huaweimate10plus'
        } else if (res.model.indexOf("ONEPLUS A5010") > -1) {
          //OnePlus5T
          that.data.models = 'oneplus5t'
        } else if (res.model.indexOf("MI 8") > -1) {
          //xiaomi8
          that.data.models = 'xiaomi8'
        } else {

        }
        that.setData({
          models: that.data.models,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    this.setData({
      showFirst: 'flex',
      showSecond: 'none',
      changeimage: true,
      showThird: 'none',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
  },
  shooting(e) {
    console.log('shooting')
    let that = this
    const timetocover = setTimeout(() => {
      that.setData({
        showFirst: 'none',
        showCover: 'flex',
      })
      clearTimeout(timetocover)
    }, 2000)
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
        console.log('拍摄视频')
        console.log(res)
        const videoSize = (res.size / (1024 * 1024)).toFixed(2)
        if (videoSize > 100) {
          wx.showToast({
            title: '上传的视频大小不能超过100M！',
            icon: 'none',
            duration: 1500,
            mask: true
          })
          that.setData({
            showFirst: 'flex',
            showSecond: 'none',
            changeimage: true,
          })
        } else {
          if (res.duration > 30) {
            wx.showToast({
              title: '上传的视频拍摄时间不能大于30秒！',
              icon: 'none',
              duration: 3500,
              mask: true
            })
            that.setData({
              showFirst: 'flex',
              showSecond: 'none',
              changeimage: true,
            })
          } else if (res.duration < 5) {
            wx.showToast({
              title: '上传的视频拍摄时间不能低于5秒！',
              icon: 'none',
              duration: 3500,
              mask: true
            })
            that.setData({
              showFirst: 'flex',
              showSecond: 'none',
              changeimage: true,
            })
          } else {
            //上传视频， 取得视频服务器地址
            console.log('发送上传视频请求')
            that.setData({
              showFirst: 'none',
              showCover: 'none',
              showSecond: 'flex',
            })
            //请求视频合成
            wx.request({
              url: api.mixVideo,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                "auth-token": wx.getStorageSync('loginSessionKey'),
              },
              success: (res1) => {
                //设置第一张图对动画！
                let x = 0
                const times = setInterval(() => {
                  x = x + 534
                  if (x > 11282) {
                    console.log('ahahah')
                    clearInterval(times)
                    that.setData({
                      changeimage: false,
                    })
                  } else {
                    that.setData({
                      fromX: x
                    })
                  }
                }, 100)
                if (res1.data.code === 0) {
                  console.log('视频合成成功')
                  //查询视频合成情况
                  that.setData({
                    pic: res1.data.data.video_guanlian_pic,
                  })
                  videoSrc = res1.data.data.video_url
                  const timer1 = setTimeout(() => {
                    clearTimeout(timer1)
                    that.setData({
                      showFirst: 'none',
                      showCover: 'none',
                      showSecond: 'none',
                      changeimage: true,
                      showThird: 'flex',
                      makerVideoId: res1.data.data.job_id
                    })
                  },5000)
                } else {
                  wx.showToast({
                    title: '视频合成失败！',
                    icon: 'fail',
                    duration: 1500,
                    mask: true,
                    success: (result) => {
                      // const timers = setTimeout(()=>{
                      //   wx.navigateBack({
                      //     delta: 1
                      //   });
                      //   clearTimeout(timers)
                      // },1500)
                    },
                  });
                  that.setData({
                    showFirst: 'flex',
                    showSecond: 'none',
                    changeimage: true,
                  })
                }
              },
              fail(e) {
                console.log(e)
                wx.showToast({
                  title: '视频合成失败！',
                  icon: 'fail',
                  duration: 1500,
                  mask: true,
                  success: (result) => {
                    // const timers = setTimeout(()=>{
                    //   wx.navigateBack({
                    //     delta: 1
                    //   });
                    //   clearTimeout(timers)
                    // },1500)
                  },
                });
                that.setData({
                  showFirst: 'flex',
                  showSecond: 'none',
                  changeimage: true,
                })
              }
            })
          }
        }
      },
      fail: function (e) {
        console.log(e)
        that.setData({
          showFirst: 'flex',
          showCover: 'none',
        })
      },
      complete: function (e) {
        console.log('我的错我的错我的错')
      }
    })
    // wx.chooseVideo({
    //   sourceType: ['camera'],
    //   maxDuration: 30,
    //   camera: 'back',
    //   success: function (res) {
    //     console.log('拍摄视频')
    //     console.log(res)
    //     const videoSize = (res.size / (1024 * 1024)).toFixed(2)
    //     // wx.saveVideoToPhotosAlbum({
    //     //   filePath: res.tempFilePath,
    //     //   success(res) {
    //     //     console.log(res)
    //     //   },
    //     //   fail(res) {
    //     //     console.log(res.errMsg)
    //     //   }
    //     // })
    //     if (videoSize > 100) {
    //       wx.showToast({
    //         title: '上传的视频大小不能超过100M！',
    //         icon: 'none',
    //         duration: 1500,
    //         mask: true
    //       })
    //       // const timers = setTimeout(() => {
    //       //   wx.navigateBack({
    //       //     delta: 1
    //       //   });
    //       //   clearTimeout(timers)
    //       // }, 1500)
    //     } else {
    //       if (res.duration > 30) {
    //         wx.showToast({
    //           title: '上传的视频拍摄时间不能大于30秒！',
    //           icon: 'none',
    //           duration: 3500,
    //           mask: true
    //         })
    //         // const timers = setTimeout(() => {
    //         //   wx.navigateBack({
    //         //     delta: 1
    //         //   });
    //         //   clearTimeout(timers)
    //         // }, 1500)
    //       } else if (res.duration < 5) {
    //         wx.showToast({
    //           title: '上传的视频拍摄时间不能低于5秒！',
    //           icon: 'none',
    //           duration: 3500,
    //           mask: true
    //         })
    //         // const timers = setTimeout(() => {
    //         //   wx.navigateBack({
    //         //     delta: 1
    //         //   });
    //         //   clearTimeout(timers)
    //         // }, 1500)
    //       } else {
    //         //上传视频， 取得视频服务器地址
    //         console.log('发送上传视频请求')
    //         // that.setData({
    //         //   showFirst: 'none',
    //         //   showSecond: 'flex',
    //         //   changeimage: true,
    //         // })
    //         wx.uploadFile({
    //           url: api.upload,
    //           filePath: res.tempFilePath,
    //           name: 'filename',
    //           header: {
    //             'content-type': 'multipart/form-data',
    //             "auth-token": wx.getStorageSync('loginSessionKey'),
    //           },
    //           formData: {
    //             upload_type: 'tmp1',
    //             filename: res.tempFilePath,
    //           },
    //           success(resp) {
    //             const data = JSON.parse(resp.data)
    //             const timer0 = setTimeout(()=>{
    //               that.setData({
    //                 changeimage: false,
    //               })
    //               clearTimeout(timer0)
    //             },2000)
    //             that.setData({
    //               showFirst: 'none',
    //               showCover: 'none',
    //               showSecond: 'flex',
    //             })
    //             //请求视频合成
    //             wx.request({
    //               url: api.mixVideo,
    //               method: 'POST',
    //               header: {
    //                   'content-type': 'application/x-www-form-urlencoded',
    //                   "auth-token": wx.getStorageSync('loginSessionKey'),
    //               },
    //               data: {
    //                 video_url: data.data.file_path
    //               },
    //               success: (res1) => {
    //                 //设置第一张图对动画！
    //                 let x = 0
    //                 const times = setInterval(()=>{
    //                   x = x + 534
    //                   if(x > 11282){
    //                     console.log('ahahah')
    //                     clearInterval(times)
    //                   } else {
    //                     that.setData({
    //                       fromX: x
    //                     })
    //                   }
    //                 },100)
    //                 if(res1.data.code === 0){
    //                   console.log('视频合成成功')
    //                   //查询视频合成情况
    //                   that.setData({
    //                     pic: res1.data.data.guanlian_img_url
    //                   })
    //                   let requestTimes = 1
    //                   var timer = setInterval(()=>{
    //                     requestTimes++
    //                     if(requestTimes > 13){
    //                       clearInterval(timer)
    //                       wx.showToast({
    //                         title: '视频合成失败！',
    //                         icon: 'fail',
    //                         duration: 1500,
    //                         mask: true,
    //                         success: (result)=>{
    //                           // const timers = setTimeout(()=>{
    //                           //   wx.navigateBack({
    //                           //     delta: 1
    //                           //   });
    //                           //   clearTimeout(timers)
    //                           // },1500)
    //                         },
    //                       });
    //                       that.setData({
    //                         showFirst: 'flex',
    //                         showSecond: 'none',
    //                         changeimage: true,
    //                       })
    //                     } else {
    //                       wx.request({
    //                         url: api.searchVideo,
    //                         method: 'POST',
    //                         header: {
    //                             'content-type': 'application/x-www-form-urlencoded',
    //                             "auth-token": wx.getStorageSync('loginSessionKey'),
    //                         },
    //                         data: {
    //                           job_id: res1.data.data.job_id,
    //                           move_name: res1.data.data.move_name,
    //                           video_url: res1.data.data.video_url,
    //                           guanlian_img_url: res1.data.data.guanlian_img_url
    //                         },
    //                         success: (res2) => {
    //                           console.log(res2)
    //                           if(res2.data.code === 0){
    //                             videoSrc = res2.data.data.video_url
    //                             clearTimeout(timer)
    //                             that.setData({
    //                               showFirst: 'none',
    //                               showCover: 'none',
    //                               showSecond: 'none',
    //                               changeimage: true,
    //                               showThird: 'flex',
    //                               makerVideoId: res2.data.data.job_id
    //                             })
    //                           }
    //                         },
    //                         fail: (e) => {
    //                           console.log(e)
    //                           clearInterval(timer)
    //                           wx.showToast({
    //                             title: '视频合成失败！',
    //                             icon: 'fail',
    //                             duration: 1500,
    //                             mask: true,
    //                             // success: (result)=>{
    //                             //   const timers = setTimeout(()=>{
    //                             //     wx.navigateBack({
    //                             //       delta: 1
    //                             //     });
    //                             //     clearTimeout(timers)
    //                             //   },1500)
    //                             // },
    //                           });
    //                           that.setData({
    //                             showFirst: 'flex',
    //                             showCover: 'none',
    //                             showSecond: 'none',
    //                             changeimage: true,
    //                           })
    //                         },
    //                         complete: () => {
    //                           console.log('我又发了一次')
    //                         }
    //                       })
    //                     }
    //                   },5000)
    //                 } else {
    //                   wx.showToast({
    //                   title: '视频合成失败！',
    //                   icon: 'fail',
    //                   duration: 1500,
    //                   mask: true,
    //                   success: (result)=>{
    //                     // const timers = setTimeout(()=>{
    //                     //   wx.navigateBack({
    //                     //     delta: 1
    //                     //   });
    //                     //   clearTimeout(timers)
    //                     // },1500)
    //                   },
    //                   });
    //                   that.setData({
    //                     showFirst: 'flex',
    //                     showSecond: 'none',
    //                     changeimage: true,
    //                   })
    //                 }
    //               },
    //               fail(e) {
    //                 console.log(e)
    //                 wx.showToast({
    //                   title: '视频合成失败！',
    //                   icon: 'fail',
    //                   duration: 1500,
    //                   mask: true,
    //                   success: (result)=>{
    //                     // const timers = setTimeout(()=>{
    //                     //   wx.navigateBack({
    //                     //     delta: 1
    //                     //   });
    //                     //   clearTimeout(timers)
    //                     // },1500)
    //                   },
    //                 });
    //                 that.setData({
    //                   showFirst: 'flex',
    //                   showSecond: 'none',
    //                   changeimage: true,
    //                 })
    //               }
    //             })
    //           },
    //           fail(e) {
    //             console.log(e)
    //             that.setData({
    //               showFirst: 'flex',
    //               showCover: 'none',
    //               showSecond: 'none',
    //               changeimage: true,
    //             })
    //           }
    //         })
    //       }
    //     }
    //   },
    //   fail: function (e) {
    //     console.log(e)
    //     that.setData({
    //       showFirst: 'flex',
    //       showCover: 'none',
    //     })
    //     // wx.navigateBack({
    //     //   delta: 1
    //     // });
    //   },
    //   complete: function (e) {
    //     console.log('我的错我的错我的错')
    //   }
    // })
  },
  preview(e) {
    console.log('preview')
    wx.navigateTo({
      url: '/pages/testVideo/testVideo?videourl=' + videoSrc
    })
  },
  compose(e) {
    console.log('compose')
    wx.request({
      url: api.makerVideo,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "auth-token": wx.getStorageSync('loginSessionKey'),
      },
      data: {
        job_id: this.data.makerVideoId,
      },
      success: (res2) => {
        if (res2.data.code === 0) {
          wx.showToast({
            title: '视频提交成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          const timers = setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
            this.setData({
              showFirst: 'flex',
              showSecond: 'none',
              changeimage: true,
              showThird: 'none',
            })
            clearTimeout(timers)
          }, 1500)
        }
      },
      fail: (e) => {
        console.log(e)
        wx.showToast({
          title: '请求发送失败！',
          icon: 'fail',
          duration: 1500,
          mask: true,
        });
      },
    })
  },
})