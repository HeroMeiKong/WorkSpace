// pages/map/map.js
const promisify = require('../../utils/promisify');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      onlinePerson:41987,//在线人数
      wd:1,//屏幕比例
      userName:"",//用户名
      avatarUrl:"",//用户头像
      totalCalorie:0,//总卡路里
      mapHeight:'0rpx',//进度条高度
      marskTop:'0rpx',//marsk标记top值
      marskLeft: '0rpx',//marsk标记Left值
      currSpecail:'https://s-js.sports.cctv.com/host/resource/map/hb-taiyuan.jpg',//特殊站点海报
      qucord:'https://s-js.sports.cctv.com/host/resource/map/hb-taiyuan.jpg',//小程序码
      userLevel:0,//用户当前等级
      isSpecialSite:false,//是否是特殊站点
      isArrive:true,//是否到达
      isShowDialog:false,//是否显示弹窗
      mapType:1,//地图ID
      activityLevel:5,//当前活动进行的天数
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
    const {userLevel} = this.data;
    this.setData({
      userName:app.globalData.userInfo?app.globalData.userInfo.nickName:"",
      avatarUrl:app.globalData.userInfo.avatarUrl||app.globalData.default_avatarUrl,
      mapType:app.globalData.map_id*1,
    });
    this.setMapData(userLevel);//生成地图数据
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData)
    const wd = app.globalData.systemInfo.screenWidth/375;
    this.setData({
      wd:wd
    });
    this.createSpecialSite();
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
  onShareAppMessage: function () {},
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

  /* 地图数据生成 */
  setMapData:function(level){
    this.setSpecialSite(level);
    this.setData({
      isShowDialog:true
    });
    const { mapType, mapOption} = this.data;//获取当前地图ID
    if(mapType === 2){
       /* 西北区 */
      this.setData({
        mapHeight: mapOption.xibeiOption[level].height,
        marskTop: mapOption.xibeiOption[level].top,
        marskLeft: mapOption.xibeiOption[level].left
      })
    }else if(mapType === 3){
      /* 华北区 */
      this.setData({
        mapHeight: mapOption.huabeiOption[level].height,
        marskTop: mapOption.huabeiOption[level].top,
        marskLeft: mapOption.huabeiOption[level].left
      })
    }else if(mapType === 1){
      /* 东北区 */
      this.setData({
        mapHeight: mapOption.dongbeiOption[level].height,
        marskTop: mapOption.dongbeiOption[level].top,
        marskLeft: mapOption.dongbeiOption[level].left
      })
    }else if(mapType === 4){
      /* 华东区 */
      this.setData({
        mapHeight: mapOption.huadongOption[level].height,
        marskTop: mapOption.huadongOption[level].top,
        marskLeft: mapOption.huadongOption[level].left
      })
    }else if(mapType === 6){
      /*华南区 */
      this.setData({
        mapHeight: mapOption.huananOption[level].height,
        marskTop: mapOption.huananOption[level].top,
        marskLeft: mapOption.huananOption[level].left
      })
    }else if(mapType === 5){
      /* 西南区 */
      this.setData({
        mapHeight: mapOption.xinanOption[level].height,
        marskTop: mapOption.xinanOption[level].top,
        marskLeft: mapOption.xinanOption[level].left
      })
    }
  },

  /*特殊站点海报*/
  setSpecialSite:function(level){
    const { mapType, mapSpecial ,isSpecialSite} = this.data;//获取当前地图ID
    if(mapType === 2){
      /* 西北区 */
      if (level/1===0){
        this.setData({
          currSpecail:mapSpecial.xibeiSpecial[0],
          isSpecialSite:true
        })
      } else if (level/1===4) {
        this.setData({
          currSpecail:mapSpecial.xibeiSpecial[1],
          isSpecialSite:true
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
        })
      } else if (level/1===7) {
        this.setData({
          currSpecail:mapSpecial.huabeiSpecial[1],
          isSpecialSite:true
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
        })
      } else if (level/1===6) {
        this.setData({
          currSpecail:mapSpecial.dongbeiSpecial[1],
          isSpecialSite:true
        })
      }else if (level/1===8) {
        this.setData({
          currSpecail:mapSpecial.dongbeiSpecial[2],
          isSpecialSite:true
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
        })
      } else if (level/1===4) {
        this.setData({
          currSpecail:mapSpecial.huadongSpecial[1],
          isSpecialSite:true
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
        })
      } else if (level/1===6) {
        this.setData({
          currSpecail:mapSpecial.huananSpecial[1],
          isSpecialSite:true
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
        })
      } else if (level/1===2) {
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[1],
          isSpecialSite:true
        })
      } else if (level/1===7) {
        this.setData({
          currSpecail:mapSpecial.xinanSpecial[1],
          isSpecialSite:true
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
    this.setData({
      isShowDialog:false
    })
  },
  /*生成特殊站点海报*/
  createSpecialSite:function () {
    const {wd,currSpecail,qucord} = this.data
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
    var _this = this;
    const canvasToTempFilePath = promisify(wx.canvasToTempFilePath);
    canvasToTempFilePath({
      canvasId: 'specialCanvas',
      x: 0, //画布区域左上角的横坐标
      y: 0, // 画布区域左上角的纵坐
      width: 520, //画布区域宽度
      height: 910, //画布区域高度
      fileType: 'png', //输出图片的格式
      quality: 1.0,//图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理
      destWidth: 500*2, //输出的图片的宽度,width*屏幕像素密度
      destHeight: 890*2
    }).then(res => {
      _this.setData({
        poster_url: res.tempFilePath  //生成文件的临时路径
      })
    }).catch(err => {
      console.log('err:', err)
    })
  }
});