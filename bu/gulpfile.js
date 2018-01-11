var gulp         = require('gulp');

var del          = require('del');
var htmlLint     = require('gulp-html-linter');
var notify       = require('gulp-notify');
var rename       = require('gulp-rename');
// var cache        = require('gulp-cache');
// var plumber      = require('gulp-plumber');


// var jshint       = require('gulp-jshint');



var postcss      = require('gulp-postcss');
var cssnext      = require('postcss-cssnext');
var nested       = require('postcss-nested');
var sugarss      = require('sugarss');
var sourcemaps   = require('gulp-sourcemaps');
// var autoprefixer = require('gulp-autoprefixer');

var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;

var imagemin     = require('gulp-imagemin');
var img64        = require('gulp-inline-images');


var path = {
	from: './assets/',
	to: './dist/'
};

// UTILITIES
	gulp.task('clean', function(cb) {
		del(['dist/**/*'], cb);
	});

// IMAGES
	gulp.task('img', ['img:base64', 'img:optimize']);

	gulp.task('img:optimize', function() {
		gulp.src(path.from + 'img/**/*.{jpg,png,webp}')
		.pipe(imagemin())
		.pipe(gulp.dest(path.to + 'img/'));
	});

	gulp.task('img:base64', function() {
	 	return gulp.src(path.from + '**/*.html')
	 		.pipe(img64({}))
			.pipe(gulp.dest(path.to));
	});

// HTML
	gulp.task('html', function(){
		return gulp.src(path.from + '*.html')
			.pipe(gulp.dest(path.to));
	});	

// CSS
	gulp.task('css', function() {
		var plugins = [
      require("postcss-cssnext")()
    ];
	  
	  return gulp.src('index.pretty.html')
    	.pipe(postcss(plugins))
    	.pipe(gulp.dest('index.fixed.html'))
    	.pipe(browserSync.stream());
	});

	// JS
	gulp.task('js', function() {
		return gulp.src(path.from + 'js/*')
			.pipe(gulp.dest(path.to + 'js/'));
	});

	// Node Modules
	gulp.task('node', function() {
		return gulp.src('./node_modules/**/*.*')
			.pipe(gulp.dest(path.to + 'node_modules/'));
	});


	// Reload
	gulp.task('bs-reload', function() {
		browserSync.reload();
	});

	// Server
	gulp.task('browser-sync', function() {
		browserSync.init([path.to + 'css/*.css'], {
			server: path.to
		});
	});

	gulp.task('build', ['clean','img', 'node', 'js', 'css']);

	// Watch
	gulp.task('default', ['css', 'browser-sync'], function() {
		gulp.watch([path.from + 'css/*.css'], ['css']);
		gulp.watch([path.from + '*.html'], ['html', 'bs-reload']);
	});
