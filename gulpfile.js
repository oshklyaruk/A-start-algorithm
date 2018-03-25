var gulp         = require('gulp'), 
    sass         = require('gulp-sass'), 
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    cssmin = require('gulp-cssmin'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify');
    rimraf = require('rimraf');

var path = {
    build: {
        html: 'build/',
        js: 'build/',
        css: 'build/'
        
    },
    src: {
        html: 'src/index.html',
        js: 'src/main.js',
        css: 'src/styles.scss'
    },
    watch: {
        html: 'src/index.html',
        js: 'src/main.js',
        css: 'src/styles.scss'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 9000
};

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('sass:build', function(){ 
    return gulp.src(path.src.css) 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(cssmin()) 
        .pipe(gulp.dest(path.build.css)) 
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('js:build', function () {
    return browserify({entries: path.src.js, debug: true})
        .transform('babelify', {presets: ['es2015']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html:build']); 
    gulp.watch(path.watch.js, ['js:build']); 
    gulp.watch(path.watch.css, ['sass:build']); 
    
});

gulp.task('build', [
    'html:build',
    'js:build',
    'sass:build'
]);

gulp.task('default', ['build', 'webserver', 'watch']);   