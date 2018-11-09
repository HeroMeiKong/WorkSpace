/**
 * Created by DELL on 2018/11/05.
 */
;(function () {
  window.onload = function () {
     preview.init();
  };
  var preview = window.preview = {
    init: function () {
      this.getDetail();
      this.initEvent()
    },
    hideLoading: function () {
      $('.loading').hide();
    },
    getDetail: function () {
      var params = tools.getParams();
      var articleId = params['articleId'];
      var preview = params['preview'] || null;
      var api_url = _api.preview_detail;
      var options = {};
      this.articleId = articleId;
      var _this = this;
      // if (!articleId) {
      //   alert('分享参数错误');
      //   return false;
      // }
      this.articleId = articleId;
      // if(preview === '1') {
      //   api_url = _api.cmsArticleDetails;
      // }
      httpRequest({
        url: api_url,
        type: 'get',
        dataType: 'json',
        data: {
          articleUuid: articleId,
        }
      }).done(function (resp) {
        if (resp.code === 200) {
          _this.initPage(resp.data);
          _this.hideLoading();
          _this.initWX_config(options,resp.data);
        }
      }).fail(function (err) {
        alert('内部服务器错误: ' + err.status || '0');
      });
    },
    initWX_config: function(options,data){
      options = {
        title: data.title,
        desc: data.content,
        link: window.location.href,
        imgUrl: data.cover,
        debug: true,
        url: window.location.href
      }
      var wx_config = new WxConfig();
      wx_config.init(options);
    },
    initPage: function (data) {
      document.title = data.title;
      this.initMenu(data);
      this.initTop(data);
      this.initTextBox(data);
      this.initSwiper();
      // $('.video_box video').attr('src', data.mediaUrl);
    },
    initMenu: function(data){
      var menu = document.querySelector('#menu');
      var length = data.topChannelMenu.length;
      for(var i=0;i<length;i++){
        var slide = $('<div>').addClass('swiper-slide');
        $('<div>').addClass('type').text(data.topChannelMenu[i].name).appendTo(slide);
        slide.appendTo(menu);
      }
    },
    initTop: function(data){
      var length = data.leaderArticles.length;
      var top = document.querySelector('#top');
      for(var i=0;i<length;i++){
        var slide = $('<div>').addClass('swiper-slide');
        $('<div>').addClass('swiperinner').css("background","url(" + data.leaderArticles[i].bigCover + ") no-repeat").css('background-size','100%').appendTo(slide);
        $('<div>').addClass('cover').appendTo(slide);
        $('<div>').addClass('leaderTitle').text(data.leaderArticles[i].title).appendTo(slide);
        $('<div>').addClass('leaderSource').text(data.leaderArticles[i].sourceName).appendTo(slide);
        slide.appendTo(top);
      }
    },
    initSwiper: function(){
      new Swiper('.swiper-banner', {
        spaceBetween: 12,
        autoplay:true,
        pagination: {
          el: '#swiper-pagination1',
          dynamicBullets: true,
        },
      });
      new Swiper('.swiper-menu', {
        slidesPerView: 4,
        spaceBetween: 30,
        freeMode: true,
      });
      new Swiper('.swiper-xinhua', {
        spaceBetween: 12,
        autoplay:true,
      });
    },
    initVoiceBox: function(){},
    initOneTextBox: function(wrapper,data,n,sourceName){
      var textBox = $('<div>').addClass('text-box');
      var left = $('<div>').addClass('left');
      $('<div>').addClass('text').text(data[n].title).appendTo(left);
      var record = $('<div>').addClass('record');
      $('<div>').addClass('browseNum').text(data[n].pv + '浏览').appendTo(record);
      $('<div>').addClass('circle').appendTo(record);
      $('<div>').addClass('dataNum').text('来自' + sourceName).appendTo(record);
      record.appendTo(left);
      var right = $('<div>').addClass('right');
      $('<img>').attr('src',data[n].cover).attr('alt',data[n].title).appendTo(right);
      left.appendTo(textBox);
      right.appendTo(textBox);
      textBox.appendTo(wrapper);
    },
    initTextBox: function(data){
      var length = data.articles.length;
      var wrapper = document.querySelector('.wrapper');
      for(var i=0;i<length;i++) {
        if (data.articles[i].type === 7){
          this.initXinhua(data,wrapper);
        }
        this.initOneTextBox(wrapper,data.articles,i,data.articles[i].sourceName);
      }
    },
    initXinhua: function(data,textBox){
      var length = data.xinhua.length;
      var container = $('<div>').addClass('swiper-container').addClass('swiper-xinhua');
      var wrapper = $('<div>').addClass('swiper-wrapper');
      for(var j=0;j<length;j++) {
        var slide = $('<div>').addClass('swiper-slide');
        this.initOneTextBox(slide,data.xinhua,j,data.xinhua[j].channelName);
        slide.appendTo(wrapper)
      }
      wrapper.appendTo(container);
      container.appendTo(textBox);
    },
    initVideoBox: function(){},
    initEvent: function () {
    
    }
  }
})();