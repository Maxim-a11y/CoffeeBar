import { watch, series, parallel } from 'gulp';
import { paths } from './gulp/config.js';

import { browserSync } from './gulp/browsersync.js';
import { reset } from './gulp/reset.js';
import { html } from './gulp/html.js';
import { css } from './gulp/css.js';
import { js } from './gulp/js.js';
import { img, svg } from './gulp/img.js';
import { fontsConverter } from './gulp/fontsConverter.js';

const watcher = () => {
    watch(paths.watch.html, html)
    watch(paths.watch.styles, css);
    watch(paths.watch.scripts, js);
    watch(paths.watch.img, img);
    watch(paths.watch.svg, svg);
    watch(paths.watch.fonts, fontsConverter);
}

const dev = series(reset, parallel(html, css, js, img, svg, fontsConverter), parallel(watcher, browserSync)); 
const build = series(reset, parallel(html, css, js, img, svg, fontsConverter)); 

export { dev, build };