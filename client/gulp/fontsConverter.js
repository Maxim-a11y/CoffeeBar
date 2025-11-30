import { paths, plugins } from './config.js'
import ttf2woff2Gulp from 'gulp-ttf2woff2'

export const fontsConverter = () => {
    return plugins.gulp.src(paths.src.fonts, { 
        encoding: false, 
        removeBOM: false 
    })
    .pipe(ttf2woff2Gulp())
    .pipe(plugins.gulp.dest(paths.dest.fonts))
}