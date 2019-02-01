// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mapHeight:'0rpx',//进度条高度
      marskTop:'0rpx',//marsk标记top值
      marskLeft: '0rpx',//marsk标记Left值
      mapType:1,//地图ID
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
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setMapData(2);//生成地图数据
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
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
      url: '/pages/index/index',
    });
  },
  /*更换路线 */
  changeRoad:function(){
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },
  /* 地图数据生成 */
  setMapData:function(level){
    const { mapType, mapOption} = this.data;//获取当前地图ID
    if(mapType === 1){
       /* 西北区 */
      this.setData({
        mapHeight: mapOption.xibeiOption[level].height,
        marskTop: mapOption.xibeiOption[level].top,
        marskLeft: mapOption.xibeiOption[level].left
      })
    }else if(mapType === 2){
      /* 华北区 */
      this.setData({
        mapHeight: mapOption.huabeiOption[level].height,
        marskTop: mapOption.huabeiOption[level].top,
        marskLeft: mapOption.huabeiOption[level].left
      })
    }else if(mapType === 3){
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
    }else if(mapType === 5){
      /*华南区 */
      this.setData({
        mapHeight: mapOption.huananOption[level].height,
        marskTop: mapOption.huananOption[level].top,
        marskLeft: mapOption.huananOption[level].left
      })
    }else if(mapType === 6){
      /* 西南区 */
      this.setData({
        mapHeight: mapOption.xinanOption[level].height,
        marskTop: mapOption.xinanOption[level].top,
        marskLeft: mapOption.xinanOption[level].left
      })
    }
  }
})