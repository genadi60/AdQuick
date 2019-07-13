'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var	browserSync = require('browser-sync').create();
var	cp = require('child_process');
var	autoprefixer = require('gulp-autoprefixer');
var	size = require('gulp-size');
var csso = require('gulp-csso');

let path = {
    SCSS_SRC: '_assets/src/scss/**/*.scss',
    SCSS_DST: './docs/css/',
    HTML_SRC: ['./*.html',
        './_includes/*.html',
        './_layouts/*.html',
        './_posts/**/*.*']
};

gulp.task('scss', function () {
    return gulp.src(path.SCSS_SRC)
        .pipe(size({ showFiles: true }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(path.SCSS_DST))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task("jekyll", function() {
    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("serve", function() {

    browserSync.init({
        server: {
            baseDir: "./docs/"
        }
    });

    gulp.watch(path.SCSS_SRC, gulp.series('scss') );

    gulp.watch(path.HTML_SRC).on('change', gulp.series('jekyll', 'scss') );

});

gulp.task("default", gulp.series('jekyll', 'scss', 'serve') );