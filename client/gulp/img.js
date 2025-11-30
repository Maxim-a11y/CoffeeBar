import { paths, plugins } from './config.js';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

export const img = () => {
    return plugins.gulp.src(paths.src.img, { encoding: false })
    .pipe(newer(paths.dest.img))
    .pipe(plugins.if(paths.isBuild, webp()))
    .pipe(plugins.if(paths.isBuild, plugins.gulp.dest(paths.dest.img, { encoding: false })))
    .pipe(plugins.if(paths.isBuild, plugins.gulp.src(paths.src.img, { encoding: false })))
    .pipe(plugins.if(paths.isBuild, newer(paths.dest.img)))
    .pipe(plugins.if(paths.isBuild, imagemin()))
    .pipe(plugins.gulp.dest(paths.dest.img))
    .pipe(plugins.stream());
}

export const svg = () => {
    return plugins.gulp.src(paths.src.svg, { encoding: false })
        .pipe(newer(paths.dest.img))
        .pipe(plugins.gulp.dest(paths.dest.img))
        .pipe(plugins.stream());
}