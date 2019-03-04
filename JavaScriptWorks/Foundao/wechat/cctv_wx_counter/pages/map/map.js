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
      totalCalorie:0,//总步数
      mapHeight:'0rpx',//进度条高度
      marskTop:'0rpx',//marsk标记top值
      marskLeft: '0rpx',//marsk标记Left值
      isFirstIn:'false',//是否是第一次进入
      currSpecail:'',//特殊站点海报
      isNewsList:false,//是否显示新闻列表
      qucord:'https://s-js.sports.cctv.com/host/resource/map/eqcode_1.jpg',//小程序码
      userLevel:0,//用户当前等级
      isFirstplay:true,//用户是否是第一次进入游戏
      hasAccNum:1,//有几张加速卡
      currSite:'',//当前站点名字
      arriveSoon:'',//即将到达站点,
      isSpecialSite:false,//是否是特殊站点
      istips:false,//是否弹出提示用户分享
      isArrive:true,//是否到达
      chaCalorie:0,//差多少步数到达下一站
      isShowDialog:false,//是否显示弹窗
      isUserAcc:false,//是否使用加速卡
      isShowAccDialog:false,//是否显示加速卡
      mapType:1,//地图ID
      lastOpacity:'transparency0',//人民大会堂的透明度
      isLastSecond:false,//倒数第二站
      poster_url:'',
      isReturn:false,//是否是未达目标返回
      activityLevel:5,//当前活动进行的天数
      isanswer:false,//用户今天是否答题
      ismove:true,//用户今天是否前进了
      gamerule:false,
      dialogisShow:false,//当前弹窗是否关闭
      mapStation:{//地图站点名字
        xibei:['乌鲁木齐', '喀什', '酒泉', '西宁', '兰州', '银川', '嘉峪关', '咸阳','西安', '人民大会堂'],
        huabei:['呼和浩特', '包头', '大同', '太原', '郑州', '石家庄', '唐山', '天津', '北京', '人民大会堂'],
        dongbei:['吉林', '齐齐哈尔', '大庆', '哈尔滨', '长春', '抚顺', '沈阳', '鞍山', '大连', '人民大会堂'],
        huadong: ['台北', '福州', '南昌', '杭州', '宁波', '合肥', '上海', '南京', '济南', '人民大会堂'],
        huanan: ['海口', '香港', '澳门', '深圳', '珠海', '汕头', '广州', '长沙', '武汉', '人民大会堂'],
        xinan: ['拉萨', '丽江', '昆明', '贵阳', '南宁', '桂林', '重庆', '成都', '绵阳', '人民大会堂']
      },
      mapOption:{
        xibeiOption: [
          { height: '0rpx', top: "968rpx", left: "440rpx" },
          { height: '130rpx', top: "858rpx", left: "297rpx" },
          { height: '240rpx', top: "748rpx", left: "405rpx" },
          { height: '340rpx', top: "648rpx", left: "278rpx" },
          { height: '440rpx', top: "548rpx", left: "408rpx" },
          { height: '540rpx', top: "448rpx", left: "278rpx" },
          { height: '650rpx', top: "338rpx", left: "418rpx" },
          { height: '740rpx', top: "248rpx", left: "299rpx" },
          { height: '820rpx', top: "168rpx", left: "418rpx" },
          { height: '940rpx', top: "56rpx", left: "314rpx" },
          ],
        huabeiOption: [
          { height: "0rpx", top: "978rpx", left: "390rpx" },
          { height: "150rpx", top: "838rpx", left: "447rpx" },
          { height: "238rpx", top: "758rpx", left: "306rpx" },
          { height: "320rpx", top: "668rpx", left: "418rpx" },
          { height: "410rpx", top: "580rpx", left: "302rpx" },
          { height: "508rpx", top: "482rpx", left: "408rpx" },
          { height: "604rpx", top: "382rpx", left: "250rpx" },
          { height: "730rpx", top: "258rpx", left: "470rpx" },
          { height: "790rpx", top: "202rpx", left: "256rpx" },
          { height: "940rpx", top: "68rpx", left: "388rpx" },
        ],
        dongbeiOption: [
          { height: "0rpx", top: "988rpx", left: "424rpx" },
          { height: "86rpx", top: "924rpx", left: "306rpx" },
          { height: "204rpx", top: "788rpx", left: "434rpx" },
          { height: "310rpx", top: "684rpx", left: "336rpx" },
          { height: "420rpx", top: "576rpx", left: "468rpx" },
          { height: "500rpx", top: "494rpx", left: "284rpx" },
          { height: "570rpx", top: "422rpx", left: "436rpx" },
          { height: "680rpx", top: "318rpx", left: "240rpx" },
          { height: "760rpx", top: "236rpx", left: "352rpx" },
          { height: "940rpx", top: "138rpx", left: "240rpx" },
        ],
        huadongOption: [
          { height: "0rpx", top: "1016rpx", left: "230rpx" },
          { height: "114rpx", top: "908rpx", left: "440rpx" },
          { height: "250rpx", top: "780rpx", left: "312rpx" },
          { height: "356rpx", top: "668rpx", left: "400rpx" },
          { height: "440rpx", top: "582rpx", left: "282rpx" },
          { height: "524rpx", top: "494rpx", left: "468rpx" },
          { height: "612rpx", top: "408rpx", left: "254rpx" },
          { height: "710rpx", top: "318rpx", left: "412rpx" },
          { height: "834rpx", top: "188rpx", left: "208rpx" },
          { height: "940rpx", top: "88rpx", left: "340rpx" },
        ],
        huananOption: [
          { height: "0rpx", top: "1016rpx", left: "260rpx" },
          { height: "86rpx", top: "944rpx", left: "436rpx" },
          { height: "268rpx", top: "762rpx", left: "310rpx" },
          { height: "410rpx", top: "622rpx", left: "484rpx" },
          { height: "500rpx", top: "528rpx", left: "272rpx" },
          { height: "650rpx", top: "378rpx", left: "460rpx" },
          { height: "710rpx", top: "318rpx", left: "340rpx" },
          { height: "840rpx", top: "188rpx", left: "420rpx" },
          { height: "916rpx", top: "120rpx", left: "262rpx" },
          { height: "1000rpx", top: "42rpx", left: "340rpx" },
        ],
        xinanOption: [
          { height: "0rpx", top: "998rpx", left: "520rpx" },
          { height: "144rpx", top: "878rpx", left: "276rpx" },
          { height: "268rpx", top: "756rpx", left: "440rpx" },
          { height: "404rpx", top: "616rpx", left: "270rpx" },
          { height: "494rpx", top: "528rpx", left: "416rpx" },
          { height: "566rpx", top: "458rpx", left: "260rpx" },
          { height: "680rpx", top: "342rpx", left: "472rpx" },
          { height: "776rpx", top: "244rpx", left: "278rpx" },
          { height: "840rpx", top: "180rpx", left: "364rpx" },
          { height: "1000rpx", top: "58rpx", left: "170rpx" },
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
      answerIds : [101187,101188,101189,101190,101191,101192,101193,101194,101195,101196]
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
    this.judgeIsnextDay();
    this.getSimpleInfo();//获取站点数  用户今天是否走了站
    this.getUserWayDetail();//获取在线信息
    // this.initMap();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.ischange = '';
    let nd = new Date();
    const oldDate = nd.getFullYear()+'-'+(nd.getMonth()+1)+'-'+nd.getDate();
    app.globalData.oldDate= oldDate;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
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
        title: '两会，走起来',
        path: '/pages/index/index?share_uuid=' + app.globalData.allData.uuid,
        imageUrl: 'https://s-js.sports.cctv.com/host/resource/map/sharePic.png',
      }
    }
  },
  /*判断是否跨天*/
  judgeIsnextDay:function(){
    let oldDate = app.globalData.oldDate;
    console.log(oldDate,'oldDate');
    if (oldDate){
      wx.request({
        url:api.getfwqtime,
        success:res=>{
          console.log(res.data.data.date,'时间');
          let newdate = res.data.data.date;
          let jg = new Date(oldDate+' 00:00:00').getTime()===new Date(newdate+' 00:00:00').getTime();
          if (jg===false){
            wx.redirectTo({
              url: '/pages/index/index',
            });
          }else {
            return
          }
        }
      })
    }
  },
  /*初始化地图*/
  initMap:function() {
    this.setData({
      userName:app.globalData.userInfo?app.globalData.userInfo.nickName:"",
      avatarUrl:app.globalData.userInfo.avatarUrl||app.globalData.default_avatarUrl,
      mapType:app.globalData.map_id*1,
      // wd:wd,
      userLevel:app.globalData.allData ? app.globalData.allData.site - 1 : 0
    },function () {
      let {userLevel} = this.data;
      console.log(userLevel,'userLevel');
      if (userLevel>9){
        userLevel=9
      }
      this.setMapData(userLevel);//生成地图数据
      setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: 180
        });
      },500)

      this.init();//初始化判断
    });
  },
  /*进入判断*/
  init:function(){
    // if (app.globalData.allData.site>=10){
    //   wx.setStorageSync('dialogisShow', 'false');
    // }
    const {dialogisShow,isSpecialSite,isArrive ,isShowDialog, isUserAcc ,isReturn }=this.data;
    console.log(app.globalData);
    this.judgeCalorieFuction();//判断步数是否达标
    this.isCloseDialog();/*判断当前弹窗是否关闭*/
    this.judgeTime();//判断今天是否第一次进入
    this.transparency();/*人民大会堂透明度显示*/
    this.isFirst();/*判断用户是否是第一次进入小程序*/
    this.todayIsMove();/*判断用户今天是否移动*/
    this.jskfunctin();/*判断加速卡弹窗是否弹出*/
    this.siteIsWhere(); /*判断倒数第二站*/
    console.log(app.globalData.allData.notice_card,'加速卡信息');
    this.isAnswerReturn(); /*判断是不是未到目标答题后返回*/
    /*判断当前是否已经到达终点页或者活动最后一天*/
    if(app.globalData.allData.is_last_day/1===1||app.globalData.allData.site>=10){
      console.log('最后');
      // wx.setStorageSync('dialogisShow', 'false');
      this.setData({
        isShowDialog:false,
        isUserAcc:false,
        isReturn:false,
        dialogisShow:false,
        isLastSecond:false,
        isShowAccDialog:false,
        istips:false,
        isFirstIn:false
      });
    }
    if (app.globalData.isSeeNews/1===1){
      this.setData({
        isShowDialog:false,
        isUserAcc:false,
        isReturn:false,
        isShowAccDialog:false,
      });
    }
    app.globalData.currSite=this.data.currSite;
  },
  /*人民大会堂透明度显示*/
  transparency:function(){
    if (app.globalData.allData.site&&app.globalData.allData.site/1===8){
      this.setData({
        lastOpacity:'transparency1'
      })
    } else if (app.globalData.allData.site&&app.globalData.allData.site/1===9){
      this.setData({
        lastOpacity:'transparency2'
      })
    }else if (app.globalData.allData.site&&app.globalData.allData.site/1>=10){
      this.setData({
        lastOpacity:'transparency3'
      })
    }  else {
      this.setData({
        lastOpacity:'transparency0'
      })
    }
  },
  /*判断用户是否是第一次进入小程序*/
  isFirst:function(){
    if (app.globalData.allData.site<1){
      this.setData({
        isFirstplay:true
      })
    } else {
      this.setData({
        isFirstplay:false
      })
    }
  },
  /*判断当前弹窗是否关闭*/
  isCloseDialog:function(){
    if (app.globalData.allData.site===9&&app.globalData.allData.dati_site>=1){
      wx.setStorageSync('dialogisShow', 'false');
      this.setData({
        dialogisShow:false,
        isShowDialog:false
      })
    }else {
      const value = wx.getStorageSync('dialogisShow');
      console.log(value==='true','判断弹窗状态')
      if (!value||value==='true'){
        if (app.globalData.allData.site<10){
          wx.setStorageSync('dialogisShow', 'true');
          this.setData({
            dialogisShow:true
          })
        } else {
          wx.setStorageSync('dialogisShow', 'false');
          this.setData({
            dialogisShow:false
          })
        }
      }else{
        wx.setStorageSync('dialogisShow', 'false');
        this.setData({
          dialogisShow:false
        })
      }
    }

  },
  /*判断倒数第二站和最后一站*/
  siteIsWhere:function(){
    if (app.globalData.allData.site===9){
      this.setData({
        isLastSecond:true,
        isShowDialog:false,
        dialogisShow:false,
        isFirstIn:false
      })
    }else if(app.globalData.allData.site/1>=10){/*判断是否到达终点页*/
      app.globalData.allData.site=10;
      this.setData({
        isLastSecond:false,
        isShowDialog:false,
        dialogisShow:false,
        isFirstIn:false
      });
      /*最后一站  如果有inEnd值，说明是从终点页返回的，*/
      if (!app.globalData.inEnd){
        /*活动最后一天关闭所有弹窗*/
        console.log('关闭所有弹窗');
        this.setData({
          isShowDialog:false,
          isUserAcc:false,
          isReturn:false,
          dialogisShow:false,
          isLastSecond:false,
          isShowAccDialog:false,
          istips:false
        });
        wx.navigateTo({
          url: '/pages/destination/destination'
        })
      }
    }
  },
  /*判断是不是未到目标答题后返回*/
  isAnswerReturn:function(){
    // const {dialogisShow,isSpecialSite,isArrive , isUserAcc ,isReturn }=this.data;
    if (app.globalData.allData.site>=10){
      if (app.globalData.allData.site/1>=10){/*如果用户站点达到10，去终点页*/
        app.globalData.allData.site=10;
        this.setData({
          isShowDialog:false,
          isUserAcc:false,
          isReturn:false,
          dialogisShow:false,
          isLastSecond:false,
          isShowAccDialog:false,
          istips:false,
          isFirstIn:false,
          isArrive:true
        });
      }
    } else {
      if(app.globalData.q_type){
        app.globalData.allData.answer_status = '1';
        if (app.globalData.q_type/1===1){/*未完成答题返回q_type 1 */
          this.setData({
            isReturn:true,
            isArrive:true
          });
          app.globalData.q_type=4;
          if (app.globalData.allData.site/1>=10){/*如果用户站点达到10，去终点页*/
            app.globalData.allData.site=10;
            this.setData({
              isShowDialog:false,
              isUserAcc:false,
              isReturn:false,
              dialogisShow:false,
              isLastSecond:false,
              isShowAccDialog:false,
              istips:false
            });
          }
        }else if (app.globalData.q_type/1===3) {/* q_type 1 最后一天答题*/
          this.setData({
            isShowDialog:false,
            isUserAcc:false,
            isReturn:false,
            dialogisShow:false,
            isLastSecond:false,
            isShowAccDialog:false,
            istips:false
          });

        }else {
          this.setData({
            isReturn:false
          });
        }
      }else {
        this.setData({
          isReturn:false
        })
      }
    }
  },
  /*判断今天是否移动*/
  todayIsMove:function(){
    if (app.globalData.allData.today_is_move/1===1){
      if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
        this.setData({
          ismove:false,
          isShowDialog:false
        })
      }else {
        this.setData({
          ismove:true
        })
      }
    } else{
      this.setData({
        ismove:false,
        isShowDialog:false
      })
    }
  },
  /*判断加速卡弹窗是否弹出*/
  jskfunctin:function(){
    if (app.globalData.allData){
      this.setData({
        hasAccNum:app.globalData.allData.card
      });
      if (app.globalData.allData.notice_card/1===1){
        this.setData({
          isShowAccDialog:true,
          isUserAcc:true
        })
      }else {
        this.setData({
          isShowAccDialog:false,
        })
      }
    }
  },
  /*地图页获取当前用户进度，用户今天是否前进*/
  getSimpleInfo:function(){
    wx.request({
      url:api.simpleInfo,
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('loginSessionKey')
      },
      success:(res)=>{
        console.log(res,'重置allData值')
        app.globalData.allData.site=res.data.data.site>10?10:res.data.data.site;
        app.globalData.allData.today=res.data.data.today;
        app.globalData.allData.notice_card=res.data.data.notice_card;
        app.globalData.allData.card=res.data.data.card;
        app.globalData.allData.answer_status=res.data.data.answer_status;
        app.globalData.allData.dati_site=res.data.data.dati_site;
        app.globalData.allData.is_last_day=res.data.data.is_last_day;
        app.globalData.allData.is_need_share=res.data.data.is_need_share;
        app.globalData.allData.today_is_move=res.data.data.today_is_move;
        if (res.data.data.today_is_move/1===1){
          this.setData({
            ismove:true,
            userLevel:res.data.data.site-1
          },this.initMap())
        } else {
          this.setData({
            ismove:false,
            userLevel:res.data.data.site-1
          },this.initMap())
        }

      }
    })
  },
  /*判断用户昨日步数是否达标*/
  judgeCalorieFuction:function(){
    /*活动最后一天关闭所有弹窗*/
    if(app.globalData.allData.is_last_day/1===1 || app.globalData.allData.site>=10){
      console.log('活动最后一天')
      this.setData({
        isShowDialog:false,
        isUserAcc:false,
        isReturn:false,
        dialogisShow:false,
        isLastSecond:false,
        isShowAccDialog:false,
        istips:false,
        isArrive:true
      });
    }else {
      console.log('进入判断')
      if (app.globalData.allData.site>=10){
        this.setData({
          isArrive:true
        })
      }else {
        wx.request({
          url:api.yesterdayCalorieJudge,
          header:{
            'content-type':'application/x-www-form-urlencoded',
            'auth-token': wx.getStorageSync('loginSessionKey')
          },
          success:(res)=>{
            console.log(res,'差多少卡路里');
            if (res.data.data){
              if (res.data.data.cha/1===0){
                this.setData({
                  chaCalorie:res.data.data.cha,
                  isArrive:true
                })
              } else {
                app.globalData.chaCalorie=res.data.data.cha;
                this.setData({
                  chaCalorie:res.data.data.cha,
                  isArrive:false
                })
              }
            } else{}
          }
        })
      }
    }

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
  //判断当前时间是不是当天第一次进入o
  judgeTime:function(){
    if(app.globalData.allData.is_last_day/1===1 || app.globalData.allData.site>=10){
      this.setData({
        isShowDialog:false,
        isUserAcc:false,
        isReturn:false,
        dialogisShow:false,
        isLastSecond:false,
        isShowAccDialog:false,
        istips:false,
        isArrive:true,
        isFirstIn:false
      });
    }else {
      console.log('进入6')
      if (app.globalData.q_type&&app.globalData.q_type===3){
        console.log('进入2')
        this.setData({
          isShowDialog:false,
          isUserAcc:false,
          isReturn:false,
          dialogisShow:false,
          isLastSecond:false,
          isShowAccDialog:false,
          istips:false,
          isArrive:true,
          isFirstIn:false
        });
      } else {
        console.log('进入5')
        try {
          const res = app.globalData.allData.answer_status;
          console.log(res)
          if (res/1===1){
            console.log(111)
            this.setData({
              isanswer:true,
            })
          }else {
            this.setData({
              isanswer:false,
            })
          }
        } catch (e) {}
        if (app.globalData.allData.site===9&&app.globalData.allData.dati_site>=1){
          console.log('进入7');
          wx.setStorageSync('dialogisShow', 'false');
          this.setData({
            dialogisShow:false,
            isShowDialog:false
          })
        }
        wx.getStorage({
          key: 'lastLoginDate',
          success: res => {
            console.log('进入');
            if (app.globalData.allData.site===9&&app.globalData.allData.dati_site>=1){
              console.log('进入4');
              wx.setStorageSync('dialogisShow', 'false')
              this.setData({
                dialogisShow:false,
                isFirstIn:false
              })
            } else {
              let lastDate = res.data;
              let currTime  = new Date();
              let cuurDate = currTime.getFullYear()+'-'+(currTime.getMonth()+1)+'-'+currTime.getDate();
              if (lastDate===cuurDate){
                this.setData({
                  isFirstIn:false,
                  istips:false
                });
              } else {
                this.haveaward();
                this.setData({
                  isFirstIn:true,
                });
                /*判断是否需要分享*/
                if (app.globalData.allData.today>=10){
                  this.setData({
                    istips:false,
                  });
                } else {
                  if (app.globalData.allData.is_need_share/1===1){
                    this.setData({
                      istips:true,
                    });
                  } else {
                    this.setData({
                      istips:false,
                    });
                  }
                }

                /*判断当前是第几天*/
                if(app.globalData.allData.site<10){
                  wx.setStorageSync('dialogisShow', 'true')
                  this.setData({
                    dialogisShow:true
                  })
                }
                wx.setStorage({
                  key:"lastLoginDate",
                  data:cuurDate
                });
              }
            }

          },
          fail:res=>{
            this.haveaward();
            this.setData({
              isFirstIn:true,
            });
            if (app.globalData.allData.is_need_share/1===1){
              this.setData({
                istips:true,
              });
            } else {
              this.setData({
                istips:false,
              });
            }
            this.setCurrDate()
            // console.log(res,'没有获取')
            // if (res.errMsg==='getStorage:fail:data not found') {
            //
            // }
          }
        });
      }
    }
  },
  /*刷新页面*/
  renovatePage:function(){
    wx.showLoading({
      title: '加载中...'
    });
    console.log('点击刷新按钮');
    this.onShow();
    setTimeout(function () {
      wx.hideLoading()
    },1000)
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
      url: '/pages/index/index?inMap='+true,
    });
  },
  /*去答题*/
  gotoQuestion:function(){
    wx.setStorageSync('dialogisShow', 'false');
    const {isanswer,isArrive,answerIds,userLevel}=this.data;
    let answerID ='';
    if (isArrive){
      answerID = answerIds[userLevel>9?9:userLevel]
    }else {
      answerID = answerIds[userLevel+1>9?9:userLevel+1]
    }
    if (app.globalData.allData.site*1 + app.globalData.allData.dati_site*1 ===9){
      answerID = answerIds[8]
    }
    this.setData({
      isShowDialog:false,
      isUserAcc:false,
      isReturn:false,
      dialogisShow:false
    });
    console.log(answerID,'答题ID');
    if (isanswer===false){
      wx.navigateTo({
        url: '/pages/question/question?iid='+answerID,
      });
    }else {
      wx.showToast({
        title: '你已经答过题了',
        duration: 4000
      })
    }
    return false;
  },
  /*看资讯*/
  gotoSeeNews:function(){
    wx.setStorageSync('dialogisShow', 'false');
    const {currSite}=this.data;
    console.log(currSite);
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
        app.globalData.currSite=currSite;
        _this.setData({
          isNewsList:true,
          isShowDialog:false,
          isUserAcc:false,
          isReturn:false,
          dialogisShow:false
        })
      }

    })
  },
  /*去留言页面*/
  askForMinister:function(){
    wx.navigateTo({
      url: '/pages/suggest/suggest',
    });
  },
  /*打开游戏规则*/
  openRule:function(){
    this.setData({
      gamerule:true
    })
  },
  /*关闭游戏规则*/
  closeRule:function(){
    this.setData({
      gamerule:false
    })
  },
  /* 地图数据生成 */
  setMapData:function(level){
    const { mapType, mapOption ,mapStation} = this.data;//获取当前地图ID
    let newlevel = level*1<0?0:level;
    let addlevel= app.globalData.allData.dati_site?app.globalData.allData.dati_site*1:1;
    let newLevel = (level+addlevel)>9?9:(level+addlevel);
    if(mapType === 2){
       /* 西北区 */
      this.setData({
        mapHeight: mapOption.xibeiOption[newlevel].height,
        marskTop: mapOption.xibeiOption[newlevel].top,
        marskLeft: mapOption.xibeiOption[newlevel].left,
        currSite: mapStation.xibei[newlevel],
        arriveSoon:mapStation.xibei[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        /*需要判断是不是要显示*/
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
      })
    }else if(mapType === 3){
      /* 华北区 */
      this.setData({
        mapHeight: mapOption.huabeiOption[newlevel].height,
        marskTop: mapOption.huabeiOption[newlevel].top,
        marskLeft: mapOption.huabeiOption[newlevel].left,
        currSite: mapStation.huabei[newlevel],
        arriveSoon:mapStation.huabei[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
      })
    }else if(mapType === 1){
      /* 东北区 */
      this.setData({
        mapHeight: mapOption.dongbeiOption[newlevel].height,
        marskTop: mapOption.dongbeiOption[newlevel].top,
        marskLeft: mapOption.dongbeiOption[newlevel].left,
        currSite: mapStation.dongbei[newlevel],
        arriveSoon:mapStation.dongbei[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
      })
    }else if(mapType === 4){
      /* 华东区 */
      this.setData({
        mapHeight: mapOption.huadongOption[newlevel].height,
        marskTop: mapOption.huadongOption[newlevel].top,
        marskLeft: mapOption.huadongOption[newlevel].left,
        currSite: mapStation.huadong[newlevel],
        arriveSoon:mapStation.huadong[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
      })
    }else if(mapType === 6){
      /*华南区 */
      this.setData({
        mapHeight: mapOption.huananOption[newlevel].height,
        marskTop: mapOption.huananOption[newlevel].top,
        marskLeft: mapOption.huananOption[newlevel].left,
        currSite: mapStation.huanan[newlevel],
        arriveSoon:mapStation.huanan[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
      })
    }else if(mapType === 5){
      /* 西南区 */
      this.setData({
        mapHeight: mapOption.xinanOption[newlevel].height,
        marskTop: mapOption.xinanOption[newlevel].top,
        marskLeft: mapOption.xinanOption[newlevel].left,
        currSite: mapStation.xinan[newlevel],
        arriveSoon:mapStation.xinan[newLevel<0?0:newLevel]||'',
      },function () {
        this.setSpecialSite(newlevel);
        if (app.globalData.allData.site/1===9&&app.globalData.allData.dati_site/1>=1){
          this.setData({
            isShowDialog:false
          });
        }else {
          this.setData({
            isShowDialog:true
          });
        }
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
      } else {
        this.setData({
          isSpecialSite:false
        })
      }
    }else if(mapType === 1){
      /* 东北区 */
      if (level/1===8) {
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
      if (level/1===3) {
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
      if (level/1===1){
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
      }else if (level/1===7) {
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[2],
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
    wx.setStorageSync('dialogisShow', 'false');
    // app.globalData.allData.notice_card=0;
    wx.hideLoading()
    this.setData({
      isShowDialog:false,
      isReturn:false,
      isUserAcc:false,
      dialogisShow:false
    })
    // this.onShow();
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
      success:res=>{
        // app.globalData.allData.notice_card=0;
      }
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
        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, 520,910);
        ctx.drawImage(bg_url,10,10,500,890,0,0,bg_url.width,bg_url.height);
        ctx.save();
        ctx.drawImage(top_url,382,770,88,88,0,0,top_url.width,top_url.height);
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
        width: 520, //画布区域宽度
        height: 910, //画布区域高度
        fileType: 'jpg', //输出图片的格式
        quality: 1.0,//图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理
        destWidth: 520, //输出的图片的宽度,width*屏幕像素密度
        destHeight: 910
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
  /*弹出抽奖提示*/
  haveaward:function(){
    if (app.globalData.allData.today>=10&&app.globalData.allData.site<10){
      wx.showToast({
        title: '到达人民大会堂之后可以抽奖',
        icon:'none',
        duration: 2000
      })
    }
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
              content: '步数步数 申请获得保存图片到相册的权限',
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