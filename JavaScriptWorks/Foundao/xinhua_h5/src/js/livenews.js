;(function () {
  window.onload = function () {
    livenews.init();
  };
  var livenews = window.livenews = {
    init: function () {
      this.getDetail();
      this.initEvent();
    },
    hideLoading: function () {
      $('.loading').hide();
    },
    getDetail: function () {
      var params = tools.getParams();
      var articleId = params['articleId'];
      // var articleId = '6db5b8c3-0083-4320-baf8-a75f990927be';
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
          // uuid: '6db5b8c3-0083-4320-baf8-a75f990927be', // 必须,type为1传articleUuid，type为2传uuid
          page: 1,
          pageSize: 5,
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
    initComment:function(data){
      "use strict";
      var conmentList='';
      for (var i=0,j=data.length;i<j;i++){
        conmentList+='<li class="comment-item">'+
            '<div class="comment-img">'+
              '<img src="'+data[i].avatar+'" alt="'+data[i].nickname+'">'+
            '</div>'+
            '<div class="comment-content">'+
            '<h3>'+data[i].nickname+'</h3>'+
            '<p>'+data[i].content+'</p>'+
            '</div>'+
            '</li>'
      }
      $('.comment-box').html(conmentList);
    },
    initPage: function (data) {
      $(".live-video video").attr('src',data.mediaUrl);
      $(".live-title").html(data.title)
    },
    initEvent: function () {

    }
  }
})();