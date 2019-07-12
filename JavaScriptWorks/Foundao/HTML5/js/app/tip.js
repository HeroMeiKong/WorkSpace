/**
 * Created by Mars on 17/10/25.
 */
;(function () {
    function Tips() {
        this.UI = {
            down_layer: $('#down_layer'),
            loading: $('#loading'),
            tips: $('#tips'),
        }
        this.num_loading = 0;
        this.init();
    };
    Tips.prototype = {
        init: function () {


            this.event();
        },
        event: function () {
            var _this = this;

        },

        //显示加载
        showLoading: function () {
            this.num_loading++;
            this.UI.down_layer.fadeIn();
            this.UI.loading.fadeIn();
        },
        //隐藏加载
        hideLoading: function () {
            if (this.num_loading <= 0) {
                this.num_loading = 0;
                this.UI.down_layer.fadeOut();
                this.UI.loading.fadeOut();
                return;
            }
            this.num_loading--;
            this.UI.down_layer.fadeOut();
            this.UI.loading.fadeOut();
        },

        //显示提示
        showTips: function (text) {
            var _this = this;
            // this.UI.down_layer.fadeIn();
            this.UI.tips.text(text).fadeIn();
            setTimeout(function () {
                _this.hideTips()
            }, 3000);
        },
        //隐藏提示
        hideTips: function () {
            // this.UI.down_layer.fadeOut();
            this.UI.tips.fadeOut();
        },

    };
    window.Tips = Tips;
})();