var gulp = require('gulp');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var autoprefixer = require('gulp-autoprefixer');

var path = {
	'app': {
		'html': 'app/**/*.html',
		'sass': 'app/assets/sass/**/*.scss',
		'css': {
			'root': 'app/assets/css/',
			'all': 'app/assets/css/**/*.css'
		},
		'js': {
			'root': 'app/assets/js/',
			'all': 'app/assets/js/**/*.js',
			'main': 'app/assets/js/main.js',
			'bundle': 'app/assets/js/bundle.js'
		},
		'lib': 'app/assets/lib/**/*',
		'images': 'app/assets/images/**/*'
	},
	'dist': {
		'root': 'dist/',
		'js': 'dist/assets/js/',
		'css': 'dist/assets/css/',
		'lib': 'dist/assets/lib/',
		'images': 'dist/assets/images/'
	},
	'ext': ['node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/css/bootstrap.min.css',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'node_modules/popper.js/dist/umd/popper.min.js']
}

gulp.task('clean', ['removeDist', 'removeBundle', 'removeCSS']);

gulp.task('removeDist', function () {
	return gulp.src(path.dist.root, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('removeBundle', function () {
	return gulp.src(path.app.js.bundle, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('removeCSS', function () {
	return gulp.src(path.app.css.root, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('copyHTML', function () {
	return gulp.src(path.app.html)
		.pipe(gulp.dest(path.dist.root))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('copyLibrary', function () {
	return gulp.src(path.app.lib)
		.pipe(gulp.dest(path.dist.lib))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('loadLibrary', function () {
	return gulp.src(path.ext)
		.pipe(gulp.dest(path.dist.lib));
});

gulp.task('copyImages', function () {
	return gulp.src(path.app.images)
		.pipe(imagemin({ optimizationLevel: 5 }))
		.pipe(gulp.dest(path.dist.images))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('copyStyles', ['sass'], function () {
	return gulp.src(path.app.css.all)
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('sass', function () {
	return gulp.src(path.app.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.app.css.root));
});

gulp.task('copyScripts', ['bundle'], function () {
	return gulp.src(path.app.js.bundle)
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('bundle', function () {
	return browserify(path.app.js.main)
		.bundle()
		.on('error', function () {
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		.on('error', function () {
			this.emit('end');
		})
		.pipe(gulp.dest(path.app.js.root));
});


gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: path.dist.root
		},
	});
});

gulp.task('watch', ['browserSync'], function () {
	gulp.watch(path.app.html, ['copyHTML']);
	gulp.watch([path.app.js.all, '!' + path.app.js.bundle], ['copyScripts']);
	gulp.watch(path.app.sass, ['copyStyles']);
	gulp.watch(path.app.images, ['copyImages']);
	gulp.watch(path.app.lib, ['copyLibrary']);
});

gulp.task('default', ['loadLibrary', 'copyHTML', 'copyLibrary', 'copyScripts', 'copyStyles', 'copyImages', 'watch']);
