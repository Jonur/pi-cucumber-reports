(() => {
  'use strict';

  const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

  // CSS
  const cssFiles = ['./node_modules/bootstrap/dist/css/bootstrap.min.css', './sources/css/**/*.scss'];
  gulp.task('sass', () => {
    return gulp.src(cssFiles)
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(concat('./sources/css/styles.css'))
      .pipe(minify())
      .pipe(gulp.dest('./'))
      .pipe(livereload({ quiet: true }));
  });

  // JS
  const jsFiles = [
    './node_modules/prefixfree/prefixfree.min.js',
    './node_modules/conic-gradient/conic-gradient.js'];

  gulp.task('js-modules', () => {
    return gulp.src(jsFiles)
      .pipe(concat('modules.js'))
      .pipe(gulp.dest('./sources/js/'))
      .pipe(rename('modules.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./sources/js/'));
  });

  // Defaults and Watchers
  gulp.task('watch', () => {
    livereload.listen({ quiet: true });
    gulp.watch('./sources/css/**/*.scss', gulp.series('sass'));
  });

  gulp.task('default', gulp.series(gulp.parallel('sass', 'js-modules')));
})();