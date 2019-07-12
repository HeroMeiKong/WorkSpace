/**
 * Created by Mars on 17/10/25.
 */
;(function () {
    function Index() {
        this.transNum = 0;
        this.curSwiperIndex = 0;
        this.init();
    };
    Index.prototype = {
        init: function () {
            this.getTransNum()
            this.initSwiper()
            this.event();
        },
        event: function () {
            var _this = this;
            // 左上logo
            // $('#logo-img').click(function () {
            //     window.location.href = 'https://foundao.enjoycut.com/#/'
            // })
            // $('.cut-btn').click(function () {
            //     window.location.href = 'https://foundao.enjoycut.com/#/singleCut'
            // })
            // $('.trans-btn').click(function () {
            //     window.location.href = 'https://foundao.enjoycut.com/#/trans'
            // })
            //
            // $('#login-btn').click(function () {
            //     window.location.href = 'https://foundao.enjoycut.com/#/user/login'
            // })
            // $('#register-img').click(function () {
            //     window.location.href = 'https://foundao.enjoycut.com/#/user/register'
            // })


        },
        //获取处理业务次数
        getTransNum: function () {
            var _this = this;
            $.ajax({
                url: '//foundao.enjoycut.com/api/cgi/resource/trans_number',
                dataType: 'json',
                type: 'GET',
                async: false,
                data: {}
            }).done(function (res) {
                if (res.code / 1 === 0) {
                    _this.transNum = res.data;
                    _this.initNum(true)
                }
            })
            // this.transNum = 999;
            // this.initNum(true)
        },
        initSwiper: function () {
            var _this = this;
            this.homeMoerApp = new window.Swiper('#home-moerApp', {
                direction: 'horizontal',
                loop: true,
                initialSlide: 0,
                // touchMoveStopPropagation: true,
                // preventClicksPropagation: true,
                slidesPerView: 'auto',
                freeMode: false,
                autoplay: true,
                delay: 3000,

                // 如果需要前进后退按钮
                // navigation: {
                //     nextEl: '.swiper-button-next',
                //     prevEl: '.swiper-button-prev',
                // },

                on: {
                    slideChangeTransitionEnd: function () {
                        // _this.setState({
                        //     curSwiperIndex: this.realIndex//切换结束时，告诉我现在是第几个slide
                        // })
                        if (this.realIndex === 0) {
                            $('#swiper-btn-0').addClass('swiper-now')
                            $('#swiper-btn-1').removeClass('swiper-now')
                        } else {
                            $('#swiper-btn-0').removeClass('swiper-now')
                            $('#swiper-btn-1').addClass('swiper-now')
                        }
                    },
                },
            })
        },

        //初始化数字翻页
        initNum: function (isFirst) {
            const transNum = this.transNum
            var _this = this
            const time1 = (Math.random() * (7 - 2) + 2) * 1000
            this.showNum()
            this.initDataStatisc(transNum, isFirst, time1)
            this.timer = setTimeout(function () {
                clearTimeout(_this.timer)
                _this.transNum = _this.transNum + 1;
                _this.initNum(true)
            }, time1)
        },

        //初始化插件
        initDataStatisc: function (transNum, isFirst, time) {
            const len = transNum.toString().length;
            $('#dataStatistics').dataStatistics(
                {
                    min: transNum,
                    max: transNum,
                    time: time,
                    len: len,
                    isFirst: isFirst
                }
            )
        },

        showNum: function () {
            console.log(this.transNum)
            const len = this.transNum.toString().length
            var div = [];
            for (var i = 0; i < len; i++) {
                if (i === len - 1) {
                    div.push("<div class='digit_set set_last'></div>")
                } else {
                    div.push("<div class='digit_set'></div>")
                }
            }
            // $('#dataStatistics').empty()
            $('#dataStatistics').html(div)
        }

    };
    window.Index = Index;
})();