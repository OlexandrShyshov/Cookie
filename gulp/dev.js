import gulp, { src } from 'gulp';

//HTML
import fileInclude from 'gulp-file-include';
import typograf from 'gulp-typograf';
import htmlbeautify from 'gulp-html-beautify';

//SASS
import * as dartSass from 'sass';
import sassPackage from 'gulp-sass';
import sourceMaps from 'gulp-sourcemaps';

//JS
import webpackConfig from './../webpack.config.js';
import webpack from 'webpack-stream';

//IMAGES
import imagemin from 'gulp-imagemin';
import svgsprite from 'gulp-svg-sprite';

//FONTS
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';

//OTHER
import browserSync from 'browser-sync';
import clean from 'gulp-clean';
import fs from 'fs';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import replace from 'gulp-replace';
import { format } from 'path';

const sass = sassPackage(dartSass);
const bs = browserSync.create();


// Configuration for Notify
const plumberNotify = (title) => ({
    errorHandler: notify.onError({
        title: title,
        message: 'Error <%= error.message %>',
        sound: false,
    }),
})


// Task to clean the build folder
export function cleanDistDev(done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', { read: false }).pipe(clean())
    }
    done()
}


// Task for processing and optimizing HTML
const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file',
}

const typografSettings = {
    locale: ['ru', 'en-US'],
    htmlEntity: { type: 'digit' },
    safeTags: [
        ['<\\?php', '\\?>'],
        ['<no-typography>', '</no-typography>']
    ]
}

export function htmlDev() {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(replace(
            /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1'
        ))
        .pipe(typograf(typografSettings))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./build/'))
        .pipe(bs.stream())
}


// Task for compiling SCSS
export function stylesDev() {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1'
			)
		)
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(bs.stream())
}


// Task for processing JavaScript
export function jsDev() {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./build/js/'))
        .pipe(bs.stream())
}


// Task for copying and optimizing IMAGES
export function imagesDev() {
    return gulp.src('./src/img/**/*', {encoding: false})
        .pipe(changed('./build/img/'))
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img/'))
        .pipe(bs.stream());
}


// Task for SVG sprite
const svgStack = {
	mode: {
		stack: {
			example: true,
		},
	},
}

const svgSymbol = {
	mode: {
		symbol: {
			sprite: '../sprite.symbol.svg',
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					plugins: [
						{
							name: 'removeAttrs',
							params: {
								attrs: '(fill|stroke)',
							},
						},
					],
				},
			},
		],
	},
}

export function svgStackDev() {
    return gulp.src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG')))
    .pipe(svgsprite(svgStack))
    .pipe(gulp.dest('./build/img/svgsprite/'))
}

export function svgSymbolDev() {
    return gulp.src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG')))
	.pipe(svgsprite(svgSymbol))
	.pipe(gulp.dest('./build/img/svgsprite/'))
}


//Fonts
export function fontsDev() {
    return gulp.src('./src/fonts/*.ttf', {
        encoding: false,
        removeBOM: false,
    })
    .pipe(ttf2woff())
    .pipe(gulp.dest('./build/fonts/'))

    .pipe(gulp.src('./src/fonts/*.ttf', {
        encoding: false,
        removeBOM: false,
    })).pipe(ttf2woff2())
    .pipe(gulp.dest('./build/fonts/'))
}


// Task for copying downloadable files
export function filesDev() {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'));
}


// BrowserSync configuration
export function serverTaskDev() {
    bs.init({
        server: './build/',
        port: 8000,
        open: true,
        notify: false,
    });
}


// Watcher for file changes
export function watchFilesDev() {
    gulp.watch('./src/scss/**/*.scss', stylesDev);
    gulp.watch('./src/html/**/*.html', htmlDev);
    gulp.watch('./src/img/**/*', imagesDev);
    gulp.watch('./src/fonts/**/*', fontsDev);
    gulp.watch('./src/files/**/*', filesDev);
    gulp.watch('./src/js/**/*.js', jsDev);
}


// Main task for development
gulp.task('build:dev', gulp.series(cleanDistDev, gulp.parallel(htmlDev, stylesDev, jsDev, imagesDev, svgStackDev, svgSymbolDev, fontsDev, filesDev, serverTaskDev)));
