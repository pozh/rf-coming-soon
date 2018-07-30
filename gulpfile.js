var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();


// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./dist/vendor/bootstrap'))

  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./dist/vendor/font-awesome'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./dist/vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./dist/vendor/jquery-easing'))

  // Vide.js
  gulp.src([
      './node_modules/vide/dist/*'
    ])
    .pipe(gulp.dest('./dist/vendor/vide'))

});


// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
});


// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './dist/css/*.css',
      '!./dist/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});


// CSS
gulp.task('css', ['css:compile', 'css:minify']);


// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './src/js/*.js'
    ])
    .pipe(uglify())
    .pipe(rename({ suffix:'.min'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});


// JS
gulp.task('js', ['js:minify']);


// HTML
gulp.task('html', function () {
  return gulp.src([
    './src/*.html'
  ])
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// images
gulp.task('img', function () {
  return gulp.src([
    './src/img/*.*'
  ])
    .pipe(gulp.dest('./dist/img'));
});


// video
gulp.task('video', function () {
  return gulp.src([
    './src/mp4/*.*'
  ])
    .pipe(gulp.dest('./dist/mp4'));
});

// Default task
gulp.task('default', ['css', 'js', 'img', 'video', 'vendor', 'html']);


// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});


// Dev task
gulp.task('dev', ['css', 'js', 'html', 'img', 'video', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
