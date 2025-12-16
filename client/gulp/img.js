import { paths, plugins } from './config.js';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

export const img = () => {
    const stream = plugins.gulp.src(paths.src.img, { encoding: false, allowEmpty: true })
    .pipe(newer(paths.dest.img))
    .pipe(plugins.if(paths.isBuild, webp().on('error', (err) => {
        console.error('WebP conversion error:', err.message);
    })))
    .pipe(plugins.if(paths.isBuild, plugins.gulp.dest(paths.dest.img, { encoding: false })))
    .pipe(plugins.if(paths.isBuild, plugins.gulp.src(paths.src.img, { encoding: false, allowEmpty: true })))
    .pipe(plugins.if(paths.isBuild, newer(paths.dest.img)))
    .pipe(plugins.if(paths.isBuild, imagemin().on('error', (err) => {
        console.error('Image minification error:', err.message);
    })))
    .pipe(plugins.gulp.dest(paths.dest.img))
    .pipe(plugins.stream());
    
    return stream;
}

export const svg = () => {
    return plugins.gulp.src(paths.src.svg, { encoding: false })
        .pipe(newer(paths.dest.img))
        .pipe(plugins.gulp.dest(paths.dest.img))
        .pipe(plugins.stream());
}