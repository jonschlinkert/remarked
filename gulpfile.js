var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('mocha', function () {
  gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('jshint', function() {
  gulp.src(['lib/*.js', '*.js'])
    .pipe(jshint());
});

gulp.task('default', ['jshint', 'mocha']);