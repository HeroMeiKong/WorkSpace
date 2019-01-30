// pages/superTest/superTest.js
const promisify = require('../../utils/promisify');
import api from './../../config/api';
import Tool from './../../utils/util';

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
    showPoster: 'none',
    fromX: 0, //第一张图片动画
    pic: '',
    makerVideoId: '',
    ctx: null,
    cur_video: {},
    qr_code_url: '',
    canvas_poster_url: '',
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
    this.createCanvas();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
      app.isAuth(() => {
          if (!this.data.hasInit) {
              console.log('未初始化')
              this.data.hasInit = true
          } else {
              console.log('已初始化')
          }
      })

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
                    pic: res1.data.data.gunalian_img_url,
                  })
                  that.data.cur_video.share_pic = res1.data.data.share_pic
                  that.data.cur_video.nick_pic = res1.data.data.nick_pic
                  that.data.cur_video.nick_name = res1.data.data.nick_name
                  that.data.cur_video.video_desc = res1.data.data.video_title
                  that.data.cur_video.video_uuid = res1.data.data.video_uuid
                  that.data.cur_video.id = res1.data.data.id
                  videoSrc = res1.data.data.video_url
                  const timer1 = setTimeout(() => {
                    clearTimeout(timer1)
                    that.setData({
                      showFirst: 'none',
                      showCover: 'none',
                      showSecond: 'none',
                      changeimage: true,
                      showThird: 'flex',
                      makerVideoId: res1.data.data.job_id,
                      cur_video: that.data.cur_video,
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
    var that = this
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
          wx.request({
            url: api.wangchun_poster_qrcode,
            // url: api.poster_qrcode,
            method: 'POST',
            header: {
              "auth-token": wx.getStorageSync('loginSessionKey'),
            },
            data: {
                material_id: that.data.cur_video.video_uuid,
                page: 'pages/video/video',
                scene: 'sucai_'+that.data.cur_video.id,
                // material_id: res.data.data.video_uuid,
                // path: '/pages/video/video?video_uuid=' + res.data.data.video_uuid + '&id=' + res.data.data.id,
                width: 188,
                auto_color: false,
                line_color: {"r": "255", "g": "216", "b": "146"},
                is_hyaline: false,
            },
            success: (resp) => {
              console.log('生成二维码成功！')
              that.data.qr_code_url = resp.data.data.file_path.replace('http://', 'https://');
              that.create_poster()
              that.setData({
                cur_video: that.data.cur_video,
                qr_code_url: that.data.qr_code_url,
              })
            },
            fail: (resp) => {
              console.log('生成二维码失败！')
            }
          })
          this.setData({
            showFirst: 'none',
            showSecond: 'none',
            changeimage: true,
            showThird: 'flex',
          })
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
    // 创建画布对象
  createCanvas() {
    console.log('createCanvas')
    this.data.ctx = wx.createCanvasContext('canvas_poster');
  },
  // 生成海报
  create_poster() {
    var _this = this
    // const canvas_width = 750;
    // const canvas_height = 1238;
    const {userInfo, cur_video} = this.data;

    wx.showLoading({
        title: '测试结果生成中'
    });
        const getImage = promisify(wx.getImageInfo);
        const getImage1 = promisify(wx.getImageInfo);
        const getImage2 = promisify(wx.getImageInfo);
        const getImage3 = promisify(wx.getImageInfo);
        const getImage4 = promisify(wx.getImageInfo);

        var ctx = this.data.ctx;
        // ctx.setFillStyle('#FFD892');
        // ctx.fillRect(0, 0, 750, 1238);
        ctx.setFillStyle('#a32b30');

        getImage({src: 'https://s-js.sports.cctv.com/host/resource/future/bgPoster.png'}).then(res_bg => {
            const posterBg_img = res_bg.path;  // 背景图片
            getImage4({src: 'https://s-js.sports.cctv.com/host/resource/future/poster_0.png'}).then(resp_phone => {
                const posterBg_img_phone = resp_phone.path;  // 相机图片
                getImage1({src: ((_this.data.cur_video.share_pic).replace('http://', 'https://') + '')}).then(res_poster => {
                    var bg_img = res_poster.path;  // 封面图
                    getImage2({src: _this.data.qr_code_url}).then(res_QR => {
                        const qr_img = res_QR.path; // 二维码
                        getImage3({src: cur_video.nick_pic.replace('http://', 'https://')}).then(re_user => {
                            const user_img = re_user.path; // 头像

                            ////////////////////////开始绘制 ////////////////////////

                            // 绘制背景图
                            ctx.save();
                            ctx.drawImage(posterBg_img, 0, 0, 375, 619, 0, 0, res_bg.path.width, res_bg.path.height);

                            //绘制封面图
                            ctx.rotate(5 * Math.PI / 180);
                            ctx.drawImage(bg_img, 190, 250, 160, 140);
                            ctx.restore();

                            // 绘制手机
                            ctx.drawImage(posterBg_img_phone, 33, 49, 343, 455, 0, 0, resp_phone.path.width, resp_phone.path.height);
                            ctx.restore();

                            //绘制封面图
                            // ctx.drawImage(bg_img, 133, 126, 165, 241, sx, sy, sWidth, sHeight);

                            // 绘制头像
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(160 + 28, 52 + 28, 28, 0, Math.PI * 2, false);
                            ctx.clip();
                            ctx.drawImage(user_img, 160, 52, 56, 56);
                            ctx.restore();


                            // 绘制名称
                            ctx.font = "bold";
                            ctx.setFillStyle('#A48764');
                            ctx.setFontSize(14);
                            ctx.setTextBaseline('top')
                            ctx.setTextAlign('center')
                            ctx.fillText(cur_video.nick_name, 186, 116);

                            // 绘制描述
                            var all_str = cur_video.video_desc;
                            ctx.setFillStyle('#BA2228');
                            ctx.setFontSize(14);
                            ctx.setTextBaseline('top');
                            ctx.setTextAlign('left')
                            if (all_str.length <= 20) {
                                ctx.fillText(all_str, 53, 141);
                            } else {
                                const stringArr = Tool.stringToArr(all_str, 20);
                                stringArr.forEach((item, index) => {
                                    ctx.setFillStyle('#BA2228');
                                    ctx.setTextAlign('left')
                                    ctx.fillText(item, 53, 141 + (index * 16));
                                });
                            }

                            ctx.setFillStyle('#A48764');
                            ctx.setFontSize(13);
                            ctx.setTextBaseline('top')
                            ctx.setTextAlign('left')
                            ctx.fillText('「长按图片识别二维码查看」', 53, 182);


                            // 绘制二维码
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(38 + 35, 528 + 35, 37, 0, Math.PI * 2, false);
                            ctx.setFillStyle('#fff')
                            ctx.fill()
                            ctx.clip();
                            ctx.drawImage(qr_img, 38, 528, 70, 70);
                            // ctx.drawImage(qr_img, 40, 520, 66, 66);
                            ctx.restore();


                            // // 绘制底部文字
                            ctx.font = "bold";
                            ctx.setFillStyle('#FFD792');
                            ctx.setFontSize(13);
                            ctx.setTextBaseline('top')
                            ctx.fillText('四小福送吉祥，想要喜提你的小福？', 118, 548);
                            ctx.fillText('扫码开启偶邦湃友人工智能', 118, 564);
                            ctx.draw(false, this.create_poster_image);
                        })
                    })

                })
            })

        })


  },

  // 生成海报图片
  create_poster_image() {
      console.log('生成海报图片');
      const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
      canvasToTempFilePath({
          canvasId: 'canvas_poster',
          fileType: 'png',
          quality: 1.0,
          destWidth: 750 * 2,
          destHeight: 1238 * 2,
      }, this).then(resp => {
          // console.log(resp.tempFilePath);
          this.setData({
              canvas_poster_url: resp.tempFilePath,
              showFirst: 'none',
              showSecond: 'none',
              changeimage: true,
              showThird: 'flex',
              showPoster: 'flex',
          });
          wx.hideLoading();
      }).catch(err => {
          console.log('err:', err)
          // canvas_poster_url
      });
  },

  // 保存海报
  save_poster() {
      const getSetting = promisify(wx.getSetting);
      // 判断用户是否有保存文件的权限
      getSetting().then(resp => {
          if (!resp.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: () => {
                      // 用户已经同意小程序使用录音功能，后续调用 接口不会弹窗询问
                      this.save_photo_sure();
                      console.log('用户同意保存');
                  },
                  fail: () => {
                      console.log('用户不同意保存');
                      wx.showModal({
                          title: '提示',
                          content: '逗牛短视频 申请获得保存图片到相册的权限',
                          success(res) {
                              if (res.confirm) {
                                  wx.openSetting({})
                                  console.log('用户点击确定')
                              } else if (res.cancel) {
                                  console.log('用户点击取消')
                              }
                          }
                      })
                      // wx.openSetting({
                      //     success(res) {
                      //         console.log(res)
                      //     },
                      //     fail(res) {
                      //         console.log(res)
                      //     }
                      // })
                      // this.showAuthorize('scope.writePhotosAlbum');
                  }
              })
          } else {
              // 直接保存
              this.save_photo_sure();
          }
      })

  },

  // 保存海报动作
  save_photo_sure() {
      const {canvas_poster_url} = this.data;
      wx.saveImageToPhotosAlbum({
          filePath: canvas_poster_url,
          success(res) {
              wx.showToast({
                  title: '保存成功'
              })
          }
      })
  },
  successBackHome (e) {
    console.log('successBackHome')
    wx.navigateBack({
      delta: 1
    })
    this.setData({
      showFirst: 'flex',
      showCover: 'none',
      showSecond: 'none',
      changeimage: true,
      showThird: 'none',
      showPoster: 'none',
    })
  },
  checkProgress (e) {
    console.log('checkProgress')
    wx.switchTab({
      url: '/pages/user/user'
    })
    this.setData({
      showFirst: 'flex',
      showCover: 'none',
      showSecond: 'none',
      changeimage: true,
      showThird: 'none',
      showPoster: 'none',
    })
  },
})