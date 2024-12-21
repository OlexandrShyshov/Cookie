import gulp from 'gulp';

//HTML
import fileInclude from 'gulp-file-include';
import htmlClean from 'gulp-htmlclean';
import webpHtml from 'gulp-webp-retina-html'
import typograf from 'gulp-typograf';

//SASS
import * as dartSass from 'sass';
import sassPackage from 'gulp-sass';
import postcss from 'gulp-postcss'; 
import autoPrefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import webpSass from 'gulp-webp-css';
import discardEmpty from 'postcss-discard-empty';

//JS
import webpackConfig from '../webpack.config.js';
import webpack from 'webpack-stream';

//IMAGES
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgsprite from 'gulp-svg-sprite';

//FONTS
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2'; 

//OTHER
import fs from 'fs';
import browserSync from 'browser-sync';
import clean from 'gulp-clean';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import replace from 'gulp-replace';
import changed from 'gulp-changed';

const sass = sassPackage(dartSass);
const bs = browserSync.create();


// Configuration for Notify
const plumberNotify = (title) => ({
    errorHandler: notify.onError({
        title: title,
        message: 'Error <%= error.message %>',
        sound: true,
    })
})


// Task to clean the build folder
export function cleanDistDocs(done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false }).pipe(clean())
    }
    done();
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

const webpHtmlSettings = {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    retina: {
        1: '',
        2: '@2x',
    }
}

export function htmlDocs() {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(replace(
            /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1'
        ))
        .pipe(typograf(typografSettings))
        .pipe(webpHtml(webpHtmlSettings))
        .pipe(htmlClean())
        .pipe(gulp.dest('./docs/'))
}


// Task for compiling SCSS
export function stylesDocs() {
    return gulp.src('./src/scss/*.scss')
        .pipe(plumber(plumberNotify('SASS'))) 
        //.pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoPrefixer())    
        .pipe(webpSass())
        .pipe(postcss([discardEmpty()]))
        .pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1'
			)
		)
        .pipe(csso({ restructure: false, comments: false }))
        //.pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css'))
        .pipe(bs.stream())
}


// Task for processing JavaScript
export function jsDocs() {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber())
        .pipe(babel())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./docs/js/'))
}


// Task for copying and optimizing IMAGES
export function imagesDocs() {
    return gulp.src('./src/img/**/*', {encoding: false})
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*', {encoding: false}))
        .pipe(imagemin())
        .pipe(gulp.dest('./docs/img/'))
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

export function svgStackDocs() {
    return gulp.src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG')))
    .pipe(svgsprite(svgStack))
    .pipe(gulp.dest('./docs/img/svgsprite/'))
}

export function svgSymbolDocs() {
    return gulp.src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG')))
	.pipe(svgsprite(svgSymbol))
	.pipe(gulp.dest('./docs/img/svgsprite/'))
}


//Task for copying FONTS
export function fontsDocs() {
    return gulp.src('./src/fonts/*.ttf', {
        encoding: false,
        removeBOM: false,
    })
    .pipe(ttf2woff())
    .pipe(gulp.dest('./docs/fonts/'))

    .pipe(gulp.src('./src/fonts/*.ttf', {
        encoding: false,
        removeBOM: false,
    })).pipe(ttf2woff2())
    .pipe(gulp.dest('./docs/fonts/'))
}


// Task for copying downloadable files
//export function filesDocs() {
    //return gulp.src('./src/files/**/*')
        //.pipe(changed('./docs/files/'))
        //.pipe(gulp.dest('./docs/files/'))
//}


// BrowserSync configuration
export function serverTaskDocs() {
    bs.init({
        server: './docs/',
        port: 8000,
        open: true,
        notify: false,
    })
}


// Main task for production mode (docs)
gulp.task('build:docs', gulp.series(cleanDistDocs, gulp.parallel(htmlDocs, stylesDocs, jsDocs, imagesDocs, svgStackDocs, svgSymbolDocs, fontsDocs, /* filesDocs, */ serverTaskDocs)));
