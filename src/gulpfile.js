var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');

var fs = require('fs');

var uglify = require('gulp-uglify');
var cssMinify = require('gulp-mini-css');
var lessCss = require('gulp-less');
var jsValidate = require('gulp-jsvalidate');
var cssValidate = require('gulp-css-validator');
var insert = require('gulp-insert');
var shell = require('gulp-shell');

var package = require('./package.json');

var paths = {
	build: '../dist/',
	jsSrc: 'js/*.js',
	cssSrc: 'css/*.less',
};
//paths.albums = path.join(paths.build, 'albums');
paths.js = path.join(paths.build, 'js');
paths.css = path.join(paths.build, 'css');

gulp.task('validateJs', [], function() {
			return gulp.src(paths.jsSrc)
					.pipe(jsValidate());
		});

gulp.task('js', ['validateJs'], function() {
	return gulp.src(paths.jsSrc)
			.pipe(gulp.dest(paths.js))
			.pipe(uglify({
				preserveComments: 'some'
			}))
			.pipe(rename(function (path) {
						path.extname = '.min.js'
					}))
			.pipe(gulp.dest(paths.js));
});

/** Can't use as running on less files
gulp.task('validateCss', [], function() {
			return gulp.src(paths.cssFiles)
					.pipe(cssValidate());
		});
*/

gulp.task('css', [], function() {
			return gulp.src(paths.cssSrc)
					.pipe(lessCss())
					.pipe(rename(function (path) {
								path.extname = '.css'
							}))
					.pipe(gulp.dest(paths.css))
					.pipe(cssMinify())
					.pipe(rename(function (path) {
								path.extname = '.min.css'
							}))
					.pipe(gulp.dest(paths.css));
		});

gulp.task('watch', function() {
			gulp.watch(paths.jsSrc, ['js']);
			gulp.watch(paths.cssSrc, ['css']);
		});

gulp.task('default', ['css', 'js', 'watch']);
