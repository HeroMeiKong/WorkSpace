/**
 * Created by Mars on 17/6/22.
 */
var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
var runSequence = require('gulp-sequence');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    //sass()方法用于转换sass到css
    return gulp.src('./css/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('./css/'))
});
gulp.task('watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
    // Other watchers
})

gulp.task('usemin', function () {
    return gulp.src('./*.html')
        .pipe($.usemin({
            // css: [$.minifyCss()],
            // js: [$.uglify()],
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
    return gulp.src('./dist/*')
        .pipe($.clean());
});

gulp.task('minifyCss', function () {
    var option = {
        // advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        // compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        // keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
        // keepSpecialComments: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    };
    return gulp.src('./dist/css/**/*.css')
        .pipe($.minifyCss(option))
        .pipe(gulp.dest('./dist/css/'));
})

gulp.task('uglify', function () {
    // var option = {
    //     //// mangle: true,//类型：Boolean 默认：true 是否修改变量名
    //     // mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
    //     // mangle: true,//类型：Boolean 默认：true 是否修改变量名
    //     // compress: true,//类型：Boolean 默认：true 是否完全压缩
    //     // preserveComments: 'all' //保留所有注释
    // };
    return gulp.src('./dist/js/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('./dist/js/'));
})

gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        // removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        // removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src('./dist/*.html')
        .pipe($.htmlmin(options))
        .pipe(gulp.dest('./dist/'));
})

gulp.task('imagemin', function () {
    var options = {
        // optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        // progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        // interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        // multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        // progressive: true,
        // svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        // use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    };
    return gulp.src('./image/*')
    // .pipe($.imagemin(options))
        .pipe(gulp.dest('./dist/image/'));
})

gulp.task('font', function () {
    return gulp.src('./font/*')
        .pipe(gulp.dest('./dist/font/'));
})

gulp.task('font-lib', function () {
    return gulp.src('./css/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts/'));
})

gulp.task('rev', function () {
    return gulp.src('./*.html')
        .pipe($.rev())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('autoprefixer', function () {
    var option = {
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove: true //是否去掉不必要的前缀 默认：true
    };
    return gulp.src('./dist/css/**/*.css')
        .pipe($.autoprefixer(option))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default', function (cb) {
    runSequence(['sass'], ['clean'], ['usemin', 'imagemin', 'font', 'font-lib'], ['autoprefixer'], ['uglify', 'minifyCss', 'htmlmin'], cb);
    // runSequence(['clean'], ['usemin'], ['uglify'], cb);
    // runSequence('clean', ['usemin','imagemin','font'], cb);
    // runSequence('clean', ['usemin'], ['uglify', 'minifyCss'], cb);
})