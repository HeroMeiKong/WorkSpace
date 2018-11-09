/**
 * Created by DELL on 2018/10/26.
 */
;(function () {
  window.onload = function () {
    datacount.init();
  };
  var datacount = window.datacount = {
    swiper2: null,    // 导航轮播
    articleId: '', // 文章id
    init: function () {
      this.getDetail();
    },
    hideLoading: function () {
      $('.loading').hide();
    },
    initSweiper: function () {
      // 大图轮播


      var swiperBanner = new Swiper('.swiper-banner', {
        spaceBetween: 12
      });

      var swiper = new Swiper('.swiper-container1', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 12
      });

      this.swiper2 = new Swiper('.swiper-container2', {
        autoHeight: true,
        spaceBetween: 30,
        on: {
          slideChangeTransitionEnd: function () {
            var activeIndex = this.activeIndex;     //切换结束时，告诉我现在是第几个slide
            $('.nav .nav_item').removeClass('active').eq(activeIndex).addClass('active');
          }
        }
      });
      // this.swiper2.slideTo(1);

    },
    getDetail: function () {
      var _this = this;
      var params = tools.getParams();
      var articleId = params['articleId'];
      var preview = params['preview'] || null;
      var api_url = _api.dataFocus_detail;
      var options = {};
      if (!articleId) {
        alert('分享参数错误');
        return false;
      }
      this.articleId = articleId;
      if(preview === '1') {
        api_url = _api.cmsDataFocusArticle;
      }
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
          _this.initWX_config(options,resp.data);
        }
      });
      this.getComment();
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
    getComment: function () {
      var _this = this;
      httpRequest({
        url: _api.commentList,
        type: 'post',
        dataType: 'json',
        data: {
          uuid: this.articleId, // 必须,type为1传articleUuid，type为2传uuid
          page: 1,
          pageSize: 10,
          maxCommentId: 0,
          type: 1
        }
      }).done(function (resp) {
        if (resp.code === 200) {
          _this.initComment(resp.data.list)
        }

      }).fail(function (err) {
        // alert('内部服务器错误: ' + err.status || '0');
      });
    },
    initComment: function (list) {
      var nodeArr = [];
      if(list !== undefined) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var time = moment(item.addTime).fromNow();
          nodeArr.push('<div class="comment_item">' +
            '<div class="comment_avatar" style="background-image: url(' + item.avatar + ')"></div>' +
            '<div class="comment_info">' +
            '<div class="nickname">' + item.nickname + '</div>' +
            '<div class="comment_time">' + time + '</div>' +
            '<div class="comment_content">' + item.content + '</div>' +
            '</div>' +
            '</div>')
        }
        $('.comment_list').html(nodeArr.join(''));
      }
    },
    initEvent: function () {
      $('.page.article').show();
      this.hideLoading();
      var _this = this;
      $('.nav .nav_item').click(function () {
        var activeIndex = $(this).index();
        if (_this.swiper2) {
          _this.swiper2.slideTo(activeIndex);
        }
      })
    },
    // 初始haul页面
    initPage: function (data) {
      // 头部
      document.title = data.title;
      $('.article_title').text(data.title);
      $('.article_desc').text(data.desc);
      $('.head_filter').css('backgroundImage', 'url(' + data.cover + ')');

      // ---------------------- 大图轮播------------------

      if (data.banners && data.banners.length > 0) {
        var bannerArr = [];
        for (var i = 0; i < data.banners.length; i++) {
          var bannerItem = data.banners[i];
          var href = './article.html?articleId=' + bannerItem.uuid;
          bannerArr.push('<div class="swiper-slide">' +
            '<a href=' + href + '>' +
            '<div class="banner_image" style="background-image: url(' + bannerItem.cover + ')"></div>' +
            '</a>' +
            '<div class="banner_title">' + bannerItem.title + '</div>' +
            '</div>')
        }
        $('.swiper-banner .swiper-wrapper').html(bannerArr.join(''));

      } else {    // 隐藏大图轮播
        $('.banner').hide();
      }
      // ------------------------- 观点------------------

      if (data.opinions && data.opinions.length > 0) {
        var opinionsArr = [];
        for (var i = 0; i < data.opinions.length; i++) {
          var opinionItem = data.opinions[i];
          var href = './article.html?articleId=' + opinionItem.uuid;
          opinionsArr.push('<div class="swiper-slide">' +
            '<a href=' + href + '>' +
            '<div class="view_image" style="background-image: url(' + opinionItem.cover + ')"></div>' +
            '<div class="view_title limit-line3">' + opinionItem.title + '</div></a>' +
            '</div>')
        }
        $('.swiper-container1 .swiper-wrapper').html(opinionsArr.join(''));

      } else {    // 隐藏观点
        $('.swiper_box').hide();
      }

      // ----------------------- 数据统计------------------
      // 热词图
      if (data.headBarHotKeyImage) {
        $('.hot_word_inner img').attr('src', data.headBarHotKeyImage);
      } else {
        $('.hot_word_inner').hide();
      }
      // 数据量

      $('#message_num').text(data.headBarMessageTotal);
      $('#media_num').text(data.headBarMediaTotal);
      $('#netizen_num').text(data.headBarNetizenTotal);
      $('.address_img img').attr('src', data.headBarAreaImage);

      // -------------------------- 聊吧------------------
      // 情绪感知
      if (data.headBarEmotionImage) {
        $('.emoji_image').html('<img src=' + data.headBarEmotionImage + ' />')
      }
      // 评论
      // $('.comment_list')

      // ------------------------------- 精选------------------

      var chosenArr = [];
      if(data.chosen !== undefined) {
        for (var i = 0; i < data.chosen.length; i++) {
          var chosenItem = data.chosen[i];
          var time = moment(chosenItem.publishTime).fromNow();
          chosenArr.push('<div class="fine_item">' +
            '<div class="fine_icon" style="background-image: url(' + chosenItem.logo + ')"></div>' +
            '<div class="fine_info">' +
            '<div class="fine_nickname">' + chosenItem.sourceName + '</div>' +
            '<div class="fine_time">' + time + '</div>' +
            '<div class="fine_content">' + chosenItem.title +
            '<img src=' + chosenItem.cover + ' alt="">' +
            '</div>' +
            '</div>' +
            '<div class="fine_line"></div>' +
            '</div>')
        }
      }
      $('.fine_list').html(chosenArr.join(''));


      this.initSweiper();
      this.initEvent()
    }
  }
})();