(function () {
  'use strict';

  const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css');

  gulp.task('sass', () => {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css', './sources/css/**/*.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('./sources/css/styles.scss'))
      .pipe(minify())
      .pipe(gulp.dest('./sources/css'));
  });
})();

// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// });