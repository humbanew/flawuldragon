var gulp = require('gulp');
var jsmin = require('gulp-jsmin');

gulp.task('compress', async function () {
  gulp.src(['dist/**/*.js', 'dist/**/*.ac.js'])
      .pipe(jsmin())
      .pipe(gulp.dest('dist'));
});
