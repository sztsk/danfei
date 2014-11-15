var gulp = require('gulp');
var code = require('gulp-code');
var htmlreplace = require('gulp-html-replace');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var ngmin = require('gulp-ngmin');


gulp.task('templates',function(){
    gulp.src('./www/templates/*.html')
        .pipe(minifyHTML({comments:true,spare:true}))
        .pipe(gulp.dest('build/templates/'))
});


gulp.task('css',function(){
  gulp.src('www/**/*.css')
  .pipe(code.lint())       //css代码检查
  .pipe(code.minify())     //css代码压缩
  .pipe(gulp.dest('build/'))
});

//注册js构建任务
gulp.task('js', function () {
    return gulp.src('www/**/*.js')
        //.pipe(code.lint())       //js代码检查
        .pipe(ngmin())
        .pipe(gulp.dest('build/'))
});

//注册js构建任务
gulp.task('appjs', function () {
    return gulp.src([
        'www/js/app.js',
        'www/js/constant.js',
        'www/js/controllers.js',
        'www/js/api.js'
    ])
        //.pipe(code.lint())       //js代码检查
        .pipe(ngmin({dynamic: true}))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/js'))
});

//注册js构建任务
gulp.task('libjs', function () {
    return gulp.src([
        'www/lib/ionic/js/ionic.bundle.min.js',
        'lib/ionic/js/angular/angular-resource.js',
        'lib/ionic/js/angular/ngStorage.js',
        'lib/ionic/js/angular/imageupload.js',
        'lib/datePicker/js/angular-pickadate.js'
    ])
        //.pipe(code.lint())       //js代码检查
        .pipe(ngmin())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/lib'))
});

gulp.task('copy',function(){
    return gulp.src('www/index.html')
        .pipe(htmlreplace({
            'appjs': './js/all.js',
            'libjs': './lib/all.js'
        }))
        .pipe(gulp.dest('build/'));
});

//注册一个默认任务
gulp.task('default', ['templates','css', 'js','appjs','libjs','copy']);