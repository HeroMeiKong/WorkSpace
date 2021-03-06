/**
 * Created by Mars on 17/10/25.
 */
;(function () {
    function Demo() {

        this.init();
    };
    Demo.prototype = {
        init: function () {

            this.event();
        },
        event: function () {

        },
        ajax: function () {
            var _this = this;
            _tips.showLoading();
            $.ajax({
                type: 'post',
                url: '',
                data: {},
                dataType: 'json'
            }).done(function (res) {
                _tips.hideLoading();
                if (res.code == 0 || res.errorCode == 0) {

                } else {
                    _tips.showTips(res.msg || res.error)
                }
            });
        }
    };
    window.Demo = Demo;
})();