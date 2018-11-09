/**
 * Created by DELL on 2018/9/6.
 */
var gulp = require('gulp'), //本地安装gulp所用到的地方
  clean = require('gulp-clean'),
  runSequence = require('run-sequence'); // 同步执行任务

var browserSync = require('browser-sync');
var uglify = require("gulp-uglify"); //获取gulp-ublify组件
var minifyCSS = require('gulp-minify-css');
// var flatten = require('gulp-flatten');  // 多个文件夹合并到同一个文件
var gulpif = require('gulp-if');
var useref = require('gulp-useref');

var reload = browserSync.reload;


gulp.task('devServer', function () {
  browserSync({
    notify: false,  // 是否开启浏览器提示
    port: 9000,    // 端口
    server: {
      baseDir: ['src']
    }
  });
  gulp.watch('./src/*.html', reload);  //监听html目录下所有文件
  gulp.watch('./src/css/*.css', reload);  //监听css目录下所有文件
  gulp.watch('./src/js/*.js', reload);  //监听js目录下所有文件
});

//清楚dist目录下所有文件
gulp.task('clean', function () {
  return gulp.src('./dist/', {
    read: false
  })
    .pipe(clean());
});

//定义html任务
gulp.task('move-html', function () {
  gulp.src("./src/*.html") //找到src文件夹下的所有html
    .pipe(gulp.dest("./dist")) //压缩完成后的文件另存到dist/目录下
});

gulp.task("move-script", function () {
  gulp.src("./src/js/*.js") //找到js文件夹下的所有js
    .pipe(uglify()) //压缩文件
    .pipe(gulp.dest("dist/js")) //压缩完成后的文件另存到dist/js/目录下
});

gulp.task("move-style", function () {
  gulp.src("./src/css/*.css") //找到css文件夹下的所有css
    .pipe(minifyCSS()) //压缩文件
    .pipe(gulp.dest("dist/css")) //压缩完成后的文件另存到dist/css/目录下
});
gulp.task("move-images", function () {
  gulp.src("./src/images/*") //找到css文件夹下的所有css
    .pipe(gulp.dest("dist/images")) //压缩完成后的文件另存到dist/css/目录下
});

//定义看守任务
gulp.task('watch', function () {
  // gulp.watch('public/*.html').on('change', reload);
  gulp.watch('./src/*.html', reload);  //监听html目录下所有文件
});


gulp.task('move', ['move-style', 'move-script', 'move-images', 'copy-utils', 'move-media']);

// 合并文件
gulp.task('combined', function () {
  return gulp.src('./src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCSS()))
    .pipe(gulp.dest('dist'))
});

// 移动文件

// 移动文件到dist目录
gulp.task('copy-utils', function() {
  return gulp.src(['./src/utils/**/*'])
    .pipe(gulp.dest('./dist/utils/'));
});
// 移动文件到dist目录
gulp.task('move-media', function() {
  return gulp.src(['./src/media/**/*'])
    .pipe(gulp.dest('./dist/media/'));
});

// release
gulp.task('build', function (cb) {
  runSequence(
    'clean', // 第一步：清理目标目录
    'move', // 第二步：打包
    'combined',
    cb
  );
});

// dev
gulp.task('default', ['devServer']);