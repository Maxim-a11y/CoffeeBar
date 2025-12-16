import { paths, plugins } from './config.js'
import * as dartSass from 'sass'; 
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import webpcss from 'gulp-webp-css';

const scss = gulpSass(dartSass);

export const css = () => {
    const stream = plugins.gulp.src(paths.src.styles, { sourcemaps: paths.isDev, allowEmpty: true })
    .pipe(scss().on('error', (err) => {
        console.error('SCSS compilation error:', err.message);
    }))
    .pipe(plugins.if(paths.isBuild, webpcss().on('error', (err) => {
        console.error('WebP CSS error:', err.message);
    })))
    .pipe(plugins.if(paths.isBuild, autoPrefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade: true
    }).on('error', (err) => {
        console.error('Autoprefixer error:', err.message);
    })))
    .pipe(plugins.if(paths.isBuild, cleanCss().on('error', (err) => {
        console.error('CleanCSS error:', err.message);
    })))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(plugins.gulp.dest(paths.dest.styles))
    .pipe(plugins.stream());
    
    return stream;
}