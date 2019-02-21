// pages/map/map.js
const promisify = require('../../utils/promisify');
import api from './../../config/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      onlinePerson:0,//在线人数
      wd:1,//屏幕比例
      userName:"",//用户名
      avatarUrl:"",//用户头像
      totalCalorie:0,//总卡路里
      mapHeight:'0rpx',//进度条高度
      marskTop:'0rpx',//marsk标记top值
      marskLeft: '0rpx',//marsk标记Left值
      isFirstIn:'false',//是否是第一次进入
      currSpecail:'',//特殊站点海报
      isNewsList:false,//是否显示新闻列表
      qucord:'https://s-js.sports.cctv.com/host/resource/map/hb-taiyuan.jpg',//小程序码
      userLevel:0,//用户当前等级
      hasAccNum:0,//有几张加速卡
      currSite:'',//当前站点名字
      arriveSoon:'',//即将到达站点
      isSpecialSite:false,//是否是特殊站点
      istips:false,//是否弹出提示用户分享
      isArrive:true,//是否到达
      chaCalorie:0,//差多少卡路里到达下一站
      isShowDialog:false,//是否显示弹窗
      isShowAccDialog:true,//是否显示加速卡
      mapType:1,//地图ID
      isLastSecond:false,//倒数第二站
      poster_url:'',
      isReturn:false,//是否是未达目标返回
      activityLevel:5,//当前活动进行的天数
      isanswer:false,//用户今天是否答题
      mapStation:{//地图站点名字
        xibei:['乌鲁木齐', '吐鲁番', '银川', '西宁', '兰州', '嘉峪关', '西安', '宝鸡', '咸阳', '人民大会堂'],
        huabei:['呼和浩特', '鄂尔多斯市', '乌兰察布', '太原', '大同', '长治', '石家庄', '秦皇岛', '天津', '人民大会堂'],
        dongbei:['呼伦贝尔', '赤峰', '哈尔滨', '齐齐哈尔', '佳木斯', '长春', '松原', '沈阳', '大连', '人民大会堂'],
        huadong: ['福州', '厦门', '南昌', '宜春', '杭州', '合肥', '上海', '南京', '济南', '人民大会堂'],
        huanan: ['海口', '三亚', '香港', '澳门', '桂林', '南宁', '广州', '珠海', '湛江', '人民大会堂'],
        xinan: ['拉萨', '昆明', '大理', '丽江', '贵阳', '遵义', '重庆', '成都', '攀枝花', '人民大会堂']
      },
      mapOption:{
        xibeiOption: [
          { height: '0rpx', top: "1040rpx", left: "440rpx" },
          { height: '130rpx', top: "930rpx", left: "297rpx" },
          { height: '240rpx', top: "820rpx", left: "405rpx" },
          { height: '340rpx', top: "720rpx", left: "278rpx" },
          { height: '440rpx', top: "620rpx", left: "408rpx" },
          { height: '540rpx', top: "520rpx", left: "278rpx" },
          { height: '650rpx', top: "410rpx", left: "418rpx" },
          { height: '740rpx', top: "320rpx", left: "299rpx" },
          { height: '820rpx', top: "240rpx", left: "418rpx" },
          { height: '940rpx', top: "128rpx", left: "314rpx" },
          ],
        huabeiOption: [
          { height: "0rpx", top: "1050rpx", left: "390rpx" }, 
          { height: "150rpx", top: "910rpx", left: "447rpx" }, 
          { height: "238rpx", top: "830rpx", left: "306rpx" }, 
          { height: "320rpx", top: "740rpx", left: "418rpx" }, 
          { height: "410rpx", top: "652rpx", left: "302rpx" }, 
          { height: "508rpx", top: "554rpx", left: "408rpx" }, 
          { height: "604rpx", top: "454rpx", left: "250rpx" }, 
          { height: "730rpx", top: "330rpx", left: "470rpx" }, 
          { height: "790rpx", top: "274rpx", left: "256rpx" }, 
          { height: "940rpx", top: "140rpx", left: "388rpx" }, 
        ],
        dongbeiOption: [
          { height: "0rpx", top: "1060rpx", left: "424rpx" },
          { height: "86rpx", top: "996rpx", left: "306rpx" },
          { height: "204rpx", top: "860rpx", left: "434rpx" },
          { height: "310rpx", top: "756rpx", left: "336rpx" },
          { height: "420rpx", top: "648rpx", left: "468rpx" },
          { height: "500rpx", top: "566rpx", left: "284rpx" },
          { height: "570rpx", top: "494rpx", left: "436rpx" },
          { height: "680rpx", top: "390rpx", left: "240rpx" },
          { height: "760rpx", top: "308rpx", left: "352rpx" },
          { height: "940rpx", top: "210rpx", left: "240rpx" }, 
        ],
        huadongOption: [
          { height: "0rpx", top: "1088rpx", left: "230rpx" },
          { height: "114rpx", top: "980rpx", left: "440rpx" },
          { height: "250rpx", top: "852rpx", left: "312rpx" },
          { height: "356rpx", top: "740rpx", left: "400rpx" },
          { height: "440rpx", top: "654rpx", left: "282rpx" },
          { height: "524rpx", top: "566rpx", left: "468rpx" },
          { height: "612rpx", top: "480rpx", left: "254rpx" },
          { height: "710rpx", top: "390rpx", left: "412rpx" },
          { height: "834rpx", top: "260rpx", left: "208rpx" },
          { height: "940rpx", top: "160rpx", left: "340rpx" }, 
        ],
        huananOption: [
          { height: "0rpx", top: "1088rpx", left: "260rpx" },
          { height: "86rpx", top: "1016rpx", left: "436rpx" },
          { height: "268rpx", top: "834rpx", left: "310rpx" },
          { height: "410rpx", top: "694rpx", left: "484rpx" },
          { height: "500rpx", top: "600rpx", left: "272rpx" },
          { height: "650rpx", top: "450rpx", left: "460rpx" },
          { height: "710rpx", top: "390rpx", left: "340rpx" },
          { height: "840rpx", top: "260rpx", left: "420rpx" },
          { height: "916rpx", top: "192rpx", left: "262rpx" },
          { height: "1000rpx", top: "114rpx", left: "340rpx" }, 
        ],
        xinanOption: [
          { height: "0rpx", top: "1070rpx", left: "520rpx" },
          { height: "144rpx", top: "950rpx", left: "276rpx" },
          { height: "268rpx", top: "828rpx", left: "440rpx" },
          { height: "404rpx", top: "688rpx", left: "270rpx" },
          { height: "494rpx", top: "600rpx", left: "416rpx" },
          { height: "566rpx", top: "530rpx", left: "260rpx" },
          { height: "680rpx", top: "414rpx", left: "472rpx" },
          { height: "776rpx", top: "316rpx", left: "278rpx" },
          { height: "840rpx", top: "252rpx", left: "364rpx" },
          { height: "1000rpx", top: "130rpx", left: "170rpx" }, 
        ]
      },
      mapSpecial:{
        xibeiSpecial:['https://s-js.sports.cctv.com/host/resource/map/xb-wulumuqi.jpg','https://s-js.sports.cctv.com/host/resource/map/xb-lanzhou.jpg'],
        huabeiSpecial:['https://s-js.sports.cctv.com/host/resource/map/hb-taiyuan.jpg','https://s-js.sports.cctv.com/host/resource/map/hb-qinhuangdao.jpg'],
        dongbeiSpecial:['https://s-js.sports.cctv.com/host/resource/map/db-chifeng.jpg','https://s-js.sports.cctv.com/host/resource/map/db-songyuan.jpg','https://s-js.sports.cctv.com/host/resource/map/db-dalian.jpg'],
        huadongSpecial:['https://s-js.sports.cctv.com/host/resource/map/hd-xiamen.jpg','https://s-js.sports.cctv.com/host/resource/map/hd-hangzhou.jpg'],
        huananSpecial:['https://s-js.sports.cctv.com/host/resource/map/hn-xiangguang.jpg','https://s-js.sports.cctv.com/host/resource/map/hn-guangzhou.jpg'],
        xinanSpecial:['https://s-js.sports.cctv.com/host/resource/map/xn-lasha.jpg','https://s-js.sports.cctv.com/host/resource/map/xn-dali.jpg','https://s-js.sports.cctv.com/host/resource/map/xn-chengdu.jpg']
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData);
    this.setData({
      userName:app.globalData.userInfo?app.globalData.userInfo.nickName:"",
      avatarUrl:app.globalData.userInfo.avatarUrl||app.globalData.default_avatarUrl,
      mapType:app.globalData.map_id*1,
    });
    /*判断是不是未到目标答题后返回*/
    // app.globalData.allData.q_type=1;
    if(app.globalData.allData.q_type){
      if (app.globalData.allData.q_type/1===1){
        this.setData({
          isReturn:true,
        });
        app.globalData.allData.q_type=4
      }else if (app.globalData.allData.q_type/1===3) {
        this.setData({
          isReturn:false
        });
        /*最后一站*/
        wx.redirectTo({
          url: '/pages/destination/destination'
        })
      }else {
        this.setData({
          isReturn:false
        });
      }
    }else {
      this.setData({
        isReturn:false
      });
      if (app.globalData.allData.site===9){
        /*判断倒数第二站*/
        this.setData({
          isLastSecond:true,
          isShowDialog:false
        })
      }else if(app.globalData.allData.site ===10){
        /*最后一站*/
        wx.redirectTo({
          url: '/pages/destination/destination'
        })
      }
    }
    this.judgeCalorieFuction();
    this.judgeTime();
      /*判断加速卡弹窗是否弹出*/
    if (app.globalData.allData){
      this.setData({
        hasAccNum:app.globalData.allData.card
      });
      if (app.globalData.allData.notice_card/1===1){
        this.setData({
          isShowAccDialog:true
        })
      }else {
        this.setData({
          isShowAccDialog:false
        })
      }
    }
    /*判断用户当前进度是否和活动进度相同 */
    if (app.globalData.allData.site*1<app.globalData.allData.today*1){
      this.setData({
        istips:true
      })
    } else {
      this.setData({
        istips:false
      })
    }
    this.getUserWayDetail();
    const wd = app.globalData.systemInfo.screenWidth / 375;
    this.setData({
      wd:wd,
      userLevel:app.globalData.allData ? app.globalData.allData.site - 1 : 0
    },function () {
      const {userLevel} = this.data;
      this.setMapData(userLevel);//生成地图数据

    });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      //右上角转发
      return {
        title: '“两会”走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },

  /*判断用户昨日卡路里是否达标*/
  judgeCalorieFuction:function(){
    wx.request({
      url:api.yesterdayCalorieJudge,
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('loginSessionKey')
      },
      success:(res)=>{
        // console.log(res.data.data.cha)
        if (res.data.data.cha/1===0){
          this.setData({
            chaCalorie:res.data.data.cha,
            isArrive:true
          })
        } else {
          this.setData({
            chaCalorie:res.data.data.cha,
            isArrive:false
          })
        }

      }
    })
  },
  /*设置当前时间*/
  setCurrDate:function(){
    let currTime  = new Date();
    let cuurDate = currTime.getFullYear()+'-'+(currTime.getMonth()+1)+'-'+currTime.getDate();
    wx.setStorage({
      key:"lastLoginDate",
      data:cuurDate
    });
  },
  //判断当前时间是不是当天第一次进入
  judgeTime:function(){
    try {
      const res =  wx.getStorageSync('successAnswer');
      if (res===true){
        this.setData({
          isanswer:true,
        })
      }else {
        this.setData({
          isanswer:false,
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    wx.getStorage({
      key: 'lastLoginDate',
      success: res => {
        // console.log(res.data);
        let lastDate = res.data;
        let currTime  = new Date();
        let cuurDate = currTime.getFullYear()+'-'+(currTime.getMonth()+1)+'-'+currTime.getDate();
        if (lastDate===cuurDate){
          this.setData({
            isFirstIn:false
            // isFirstIn:true
          });
        } else {
          this.setData({
            isFirstIn:true,
            isanswer:false,
          });
          wx.setStorage({
            key:"lastLoginDate",
            data:cuurDate
          });
        }
      },
      fail:res=>{
        this.setData({
          isFirstIn:true
        });
        this.setCurrDate()
        // console.log(res,'没有获取')
        // if (res.errMsg==='getStorage:fail:data not found') {
        //
        // }
      }
    });
  },

  /*获取用户信息*/
  getUserWayDetail:function(){
    wx.request({
      url:api.userWayDetail,
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('loginSessionKey')
      },
      success:(res)=>{
        // console.log(res.data)
        this.setData({
          onlinePerson:res.data.data.online_people,
          totalCalorie:res.data.data.calorie
        })
      }
    })
  },
  /* 查看排行榜按钮 */
  gotoRank:function(){
    wx.navigateTo({
      url: '/pages/rank/rank',
    });
  },
  /*更换路线 */
  changeRoad:function(){
    app.globalData.ischange=true;
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
  /*去答题*/
  gotoQuestion:function(){
    const {isanswer}=this.data;
    this.setData({
      isShowDialog:false
    });
    if (isanswer===false){
      wx.navigateTo({
        url: '/pages/question/question?iid='+99023,
      });
    }else {
      wx.showToast({
        title: '你今天已经答过题了',
        duration: 2000
      })
    }
    return false;
  },
  /*看资讯*/
  gotoSeeNews:function(){
    // console.log(122);
    let _this = this;
    let nowTime = new Date();
    let nowDate = nowTime.getFullYear()+'-'+(nowTime.getMonth()+1)+'-'+
      nowTime.getDate()+' '+nowTime.getHours()+':'+nowTime.getMinutes()+':'+nowTime.getSeconds()
    wx.request({
      url : api.add_calorie,
      method:'post',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('loginSessionKey')
      },
      data:{
        type:3,
        date:nowDate,
        value:'{"qid":1}'
      },
      success:res=>{
        console.log(res.data.code);
        if (res.data.code===0){
          _this.setData({
            isNewsList:true,
            isShowDialog:false
          })
        }else{
          wx.showToast({
            title: res.data.errMsg,
            duration: 2000
          })
        }
      }

    })
  },
  /*去留言页面*/
  askForMinister:function(){
    wx.navigateTo({
      url: '/pages/suggest/suggest',
    });
  },
  /* 地图数据生成 */
  setMapData:function(level){
    const { mapType, mapOption ,mapStation} = this.data;//获取当前地图ID
    if(mapType === 2){
       /* 西北区 */
      this.setData({
        mapHeight: mapOption.xibeiOption[level].height,
        marskTop: mapOption.xibeiOption[level].top,
        marskLeft: mapOption.xibeiOption[level].left,
        currSite: mapStation.xibei[level],
        arriveSoon:mapStation.xibei[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        /*需要判断是不是要显示*/
        this.setData({
          isShowDialog:true
        });
      })
    }else if(mapType === 3){
      /* 华北区 */
      this.setData({
        mapHeight: mapOption.huabeiOption[level].height,
        marskTop: mapOption.huabeiOption[level].top,
        marskLeft: mapOption.huabeiOption[level].left,
        currSite: mapStation.huabei[level],
        arriveSoon:mapStation.huabei[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        this.setData({
          isShowDialog:true
        });
      })
    }else if(mapType === 1){
      /* 东北区 */
      this.setData({
        mapHeight: mapOption.dongbeiOption[level].height,
        marskTop: mapOption.dongbeiOption[level].top,
        marskLeft: mapOption.dongbeiOption[level].left,
        currSite: mapStation.dongbei[level],
        arriveSoon:mapStation.dongbei[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        this.setData({
          isShowDialog:true
        });
      })
    }else if(mapType === 4){
      /* 华东区 */
      this.setData({
        mapHeight: mapOption.huadongOption[level].height,
        marskTop: mapOption.huadongOption[level].top,
        marskLeft: mapOption.huadongOption[level].left,
        currSite: mapStation.huadong[level],
        arriveSoon:mapStation.huadong[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        this.setData({
          isShowDialog:true
        });
      })
    }else if(mapType === 6){
      /*华南区 */
      this.setData({
        mapHeight: mapOption.huananOption[level].height,
        marskTop: mapOption.huananOption[level].top,
        marskLeft: mapOption.huananOption[level].left,
        currSite: mapStation.huanan[level],
        arriveSoon:mapStation.huanan[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        this.setData({
          isShowDialog:true
        });
      })
    }else if(mapType === 5){
      /* 西南区 */
      this.setData({
        mapHeight: mapOption.xinanOption[level].height,
        marskTop: mapOption.xinanOption[level].top,
        marskLeft: mapOption.xinanOption[level].left,
        currSite: mapStation.xinan[level],
        arriveSoon:mapStation.xinan[level+1]||'',
      },function () {
        this.setSpecialSite(level);
        this.setData({
          isShowDialog:true
        });
      })
    }
  },

  /*特殊站点海报*/
  setSpecialSite:function(level){
    const { mapType, mapSpecial ,currSite} = this.data;//获取当前地图ID
    // console.log('进来',level)

    if(mapType === 2){
      /* 西北区 */
      if (level/1===0){
        this.setData({
          currSpecail:mapSpecial.xibeiSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===4) {
        this.setData({
          currSpecail:mapSpecial.xibeiSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }

    }else if(mapType === 3){
      /* 华北区 */
      if (level/1===3){
        this.setData({
          currSpecail:mapSpecial.huabeiSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===7) {
        this.setData({
          currSpecail:mapSpecial.huabeiSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }
    }else if(mapType === 1){
      /* 东北区 */
      if (level/1===1){
        this.setData({
          currSpecail:mapSpecial.dongbeiSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===6) {
        this.setData({
          currSpecail:mapSpecial.dongbeiSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else if (level/1===8) {
        this.setData({
          currSpecail:mapSpecial.dongbeiSpecial[2],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }
    }else if(mapType === 4){
      /* 华东区 */
      if (level/1===1){
        this.setData({
          currSpecail:mapSpecial.huadongSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===4) {
        this.setData({
          currSpecail:mapSpecial.huadongSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }
    }else if(mapType === 6){
      /*华南区 */
      if (level/1===2){
        this.setData({
          currSpecail:mapSpecial.huananSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===6) {
        this.setData({
          currSpecail:mapSpecial.huananSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }

    }else if(mapType === 5){
      /* 西南区 */
      if (level/1===0){
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[0],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===2) {
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      } else if (level/1===7) {
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[1],
          isSpecialSite:true
        },function () {
          this.createSpecialSite();
        })
      }else {
        this.setData({
          isSpecialSite:false
        })
      }
    }
  },

  /*关闭弹窗*/
  closePopup:function(){
    wx.hideLoading()
    this.setData({
      isShowDialog:false,
      isReturn:false
    })
  },
  /*关闭加速卡弹窗*/
  closeAccPopup:function(){
    /*修改加速卡弹窗提示*/
    wx.request({
      url:api.updateAcc,
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('loginSessionKey')
      },
      method: 'POST',
      success:res=>{}
    });
    this.setData({
      isShowAccDialog:false
    })
  },
  /*关闭提示弹窗*/
  closeTipsPopup:function(){
    this.setData({
      istips:false
    })
  },
  /*关闭新闻列表弹窗*/
  closeNewsList:function(){
    this.setData({
      isNewsList:false
    })
  },
  /*关闭倒数第二站提示*/
  closelastTips:function(){
    this.setData({
      isLastSecond:false
    })
  },
  /*生成特殊站点海报*/
  createSpecialSite:function () {
    const {wd,currSpecail,qucord} = this.data;
    // console.log('生成特殊站点海报');
    // console.log(currSpecail,'currSpecail');
    const ctx = wx.createCanvasContext('specialCanvas');
    var _this = this;
    const getBgImg = promisify(wx.getImageInfo);
    const getTopImg = promisify(wx.getImageInfo);

    getBgImg({src : currSpecail}).then(res=>{
      const bg_url = res.path;
      getTopImg({src : qucord}).then(res=>{
        const top_url = res.path;
        //  开始绘制
        ctx.drawImage(bg_url,5*wd,5*wd,250*wd,445*wd,0,0,bg_url.width,bg_url.height);
        ctx.save();
        ctx.drawImage(top_url,191*wd,385*wd,44*wd,44*wd,0,0,top_url.width,top_url.height);
        ctx.save();

        ctx.draw(false,_this.create_poster_image())
      }).catch(err =>{
        console.log('err:', err)
      })
    })
  },
  /*生成海报*/
  create_poster_image() {
    wx.showLoading({
      title: '加载中...'
    });
    var _this = this;
    setTimeout(function () {
      const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
      canvasToTempFilePath({
        canvasId: 'specialCanvas',
        x: 0, //画布区域左上角的横坐标
        y: 0, // 画布区域左上角的纵坐
        width: 520*2, //画布区域宽度
        height: 910*2, //画布区域高度
        fileType: 'jpg', //输出图片的格式
        quality: 1.0,//图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理
        destWidth: 500, //输出的图片的宽度,width*屏幕像素密度
        destHeight: 890
      }).then(res => {
        console.log(res.tempFilePath);
        wx.hideLoading()
        _this.setData({
          poster_url: res.tempFilePath  //生成文件的临时路径
        })
      }).catch(err => {
        wx.hideLoading()
        console.log('err:', err)
      })
    },500)
    setTimeout(function () {
      wx.hideLoading()
    },600)

  },
  /*保存海报*/
  savePoster:function () {
    var _this = this
    const getSetting = promisify(wx.getSetting)  //获取用户的当前设置
    getSetting().then(res=>{
      if(!res.authSetting['scope.writePhotosAlbum']){ //如果未授权照片功能
        wx.authorize({
          scope : 'scope.writePhotosAlbum',
          success : ()=> {
            _this.save_photo_sure()
          },
          fail : ()=> {
            wx.showModal({
              title: '提示',
              content: '燃烧卡路里 申请获得保存图片到相册的权限',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({})
                  // console.log('用户点击确定')
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
          }
        })
      }else {
        _this.save_photo_sure()  //直接保存
      }
    })
    return false
  },

  //确认保存
  save_photo_sure (){
    var _this = this
    wx.showLoading()
    wx.saveImageToPhotosAlbum({
      filePath:_this.data.poster_url,
      success : res =>{
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon : 'success',
          duration : 2000
        })
      },
      fail : err =>{
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon : 'none',
          mask : true
        })
      }
    })
  },
});