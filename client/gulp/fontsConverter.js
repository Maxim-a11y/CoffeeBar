import { paths, plugins } from './config.js'
import ttf2woff2Gulp from 'gulp-ttf2woff2'

export const fontsConverter = () => {
    const stream = plugins.gulp.src(paths.src.fonts, { 
        encoding: false, 
        removeBOM: false,
        allowEmpty: true
    })
    .pipe(ttf2woff2Gulp().on('error', (err) => {
        console.error('Font conversion error:', err.message);
    }))
    .pipe(plugins.gulp.dest(paths.dest.fonts));
    
    return stream;
}