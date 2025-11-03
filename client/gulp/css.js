import { paths, plugins } from './config.js'
import dartSass from 'sass'; 
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import webpcss from 'gulp-webp-css';

const scss = gulpSass(dartSass);

export const css = () => {
    return plugins.gulp.src(paths.src.styles, { sourcemaps: paths.isDev })
    .pipe(scss())
    .pipe(plugins.if(paths.isBuild, webpcss()))
    .pipe(plugins.if(paths.isBuild, autoPrefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade: true
    })))
    .pipe(plugins.if(paths.isBuild, cleanCss()))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(plugins.gulp.dest(paths.dest.styles))
    .pipe(plugins.stream());
}