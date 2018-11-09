/**
 * Created by DELL on 2018/10/25.
 */
;(function () {
  window.onload = function () {
    article.init();
  };
  var article = window.article = {
    articleId: '', // 文章id
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
          _this.getComment();
          _this.initPage(resp.data);
          _this.hideLoading();
          _this.initWX_config(options,resp.data);
        } else {
          alert(resp.msg)
        }
      }).fail(function (err) {
        alert('内部服务器错误: ' + err.status || '0');
      });
    },
    initPage: function (data) {
      document.title = data.title;

      var time = moment(data.publishTime).fromNow();
      $('.article_title').text(data.title);
      $('.article_from_name').text(data.sourceName);
      $('.article_from_view span').text(data.pv);
      $('.article_from_time').text(time.replace(' ', ''));
      $('.article_desc').text(data.desc);
      $('.article_word').html(data.content);
      $('.page.article').show();
      this.hideLoading();
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
    },
    initEvent: function () {
      $('.article_limit').click(function () {
        $('.article_content.limit').removeClass('limit');
      })
    }
  }
})();