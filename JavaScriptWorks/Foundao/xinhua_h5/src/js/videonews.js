/**
 * Created by DELL on 2018/10/26.
 */
;(function () {
  window.onload = function () {
    videonews.init();
  };
  var videonews = window.videonews = {
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
      var api_url = _api.articleDetails;
      var options = {};
      this.articleId = articleId;
      var _this = this;
      if (!articleId) {
        alert('分享参数错误');
        return false;
      }
      this.articleId = articleId;
      if(preview === '1') {
        api_url = _api.cmsArticleDetails;
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
      $('.article_title').text(data.title);
      $('.article_desc').text(data.desc);
      $('.video_box video').attr('src', data.mediaUrl);
    },
    initEvent: function () {

    }
  }
})();