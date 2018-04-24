var gulp = require('gulp');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

var src = {
	html: ['app/**/*.html'],
	sass: 'app/assets/sass/**/*.scss',
	css: ['app/assets/css/**/*.css', '!app/assets/css/**/*.min.css'],
	js: ['app/assets/js/**/*.js', '!app/assets/js/**/*.min.js'],
	lib: ['app/assets/lib/**/*'],
	images: 'app/assets/images/**/*'
};

var dest = {
	html: 'dist/',
	css: 'dist/assets/css/',
	js: 'dist/assets/js/',
	lib: 'dist/assets/lib/',
	images: 'dist/assets/images/'
};

gulp.task('clean', function () {
	return gulp.src(dest.html, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('html', function () {
	return gulp.src(src.html)
		.pipe(gulp.dest(dest.html))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('lib', function () {
	return gulp.src(src.lib)
		.pipe(gulp.dest(dest.lib))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('sass', function () {
	return gulp.src(src.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/assets/css'));
});

gulp.task('styles', ['sass'], function () {
	return gulp.src(src.css)
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dest.css))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('scripts', function () {
	return gulp.src(src.js)
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(dest.js))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('images', function () {
	return gulp.src(src.images)
		.pipe(imagemin({ optimizationLevel: 5 }))
		.pipe(gulp.dest(dest.images))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'dist/'
		},
	});
});

gulp.task('watch', ['browserSync'], function () {
	gulp.watch(src.html, ['html']);
	gulp.watch(src.js, ['scripts']);
	gulp.watch(src.sass, ['styles']);
	gulp.watch(src.images, ['images']);
	gulp.watch(src.lib, ['lib']);
});

gulp.task('default', ['html', 'lib', 'scripts', 'styles', 'images', 'watch']);
