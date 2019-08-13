var gulp = require('gulp');
var browserSync = require('browser-sync');
var usemin = require('gulp-usemin');
var wrap = require('gulp-wrap');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');

var runSeq = require('run-sequence');

var paths = {
    styles: './css/*.*',
    images: './img/**/*.*',
    scripts: './scripts/**/*.js',
    templates: './views/**/*.html',
    // bower_components: './assets/bower_components/**/*.*',
    bower_fonts: './bower_components/**/*.{ttf,woff,woff2,eof,eot,svg}',
    index: 'index.html'
};


gulp.task('less', function() {
    return gulp.src('./styles/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('clean', function() {
    gulp.src('dist').pipe(clean({ force: true }));
});


gulp.task('copy', function() {
    gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({
                keepSpecialComments: 0
            }), 'concat'],
            js1: [minifyJs(), 'concat']
        }))
        .pipe(gulp.dest('dist'))
    gulp.src([
            './bower_components/font-awesome/fonts/fontawesome-webfont.*',
            './bower_components/Ionicons/fonts/ionicons.*',
            './bower_components/bootstrap/fonts/*.*'
        ])
        .pipe(gulp.dest('dist/fonts'))
    gulp.src(paths.templates)
        .pipe(gulp.dest('dist/modules'))
    gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'));
});

gulp.task('minify', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs().on('error', function(err) {
            }), 'concat'],
            css: [minifyCss({
                keepSpecialComments: 0
            }).on('error', function(err) {
                console.log('error: ', err)
            }), 'concat'],
            js1: [minifyJs(), 'concat']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copytemplates', function() {
    gulp.src(paths.templates)
        .pipe(gulp.dest('dist/views'));
});

gulp.task('copyfonts', function(callback) {
    return gulp.src([
            './font/*.*'
        ])
        .pipe(gulp.dest('dist/font'));
});

gulp.task('copyimages', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

gulp.task('serve', function() {
    browserSync.init({
        notify: false,
        port: 9002,
        server: "./",
        ui: {
            port: 12345
        }
    });

    gulp.watch(['index.html', 'css/*.*','scripts/**/*.*','views/*.*'])
        .on('change', browserSync.reload);
});



gulp.task('dist', function() {
    return runSeq('minify', 'copytemplates', 'copyfonts', 'copyimages');
});
