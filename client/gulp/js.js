import { paths, plugins } from './config.js';
import webpack from 'webpack-stream';

export const js = () => {
    const stream = plugins.gulp.src(paths.src.scripts, { sourcemaps: paths.isDev, allowEmpty: true })
    .pipe(webpack({
        mode: paths.isBuild ? 'production' : 'development',
        entry: { index: './src/js/main.js' },
        output: { filename: 'main.min.js' },
        module: { 
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ] 
        },
        // Продолжаем работу даже при ошибках webpack
        bail: false
    }).on('error', (err) => {
        console.error('Webpack error:', err.message);
    }))
    .pipe(plugins.gulp.dest(paths.dest.scripts))
    .pipe(plugins.stream());
    
    return stream;
}