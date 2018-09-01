(function () {
  'use strict';

  const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    livereload = require('gulp-livereload');

  gulp.task('sass', () => {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css', './sources/css/**/*.scss'])
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(concat('./sources/css/styles.css'))
      .pipe(minify())
      .pipe(gulp.dest('./'))
      .pipe(livereload({ quiet: true }));
  });

  gulp.task('watch', () => {
    livereload.listen({ quiet: true });
    gulp.watch('./sources/css/**/*.scss', gulp.series('sass'));
  });
})();