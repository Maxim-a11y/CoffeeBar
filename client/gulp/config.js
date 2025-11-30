import * as nodePath from 'path';
import { stream } from 'browser-sync';
import ifPlugin from 'gulp-if';
import gulp from 'gulp';

const rootFolder = nodePath.basename(nodePath.resolve());
const srcFolder = './src';
const buildFolder = './dist';

const isDev = !process.argv.includes('--build');
const isBuild = process.argv.includes('--build');

export const paths = {
  rootFolder: rootFolder,
  srcFolder: srcFolder,
  buildFolder: buildFolder,
  isDev: isDev,
  isBuild: isBuild,
  src: {
    html: `${srcFolder}/**/*.html`,
    styles: `${srcFolder}/scss/main.scss`,
    scripts: `${srcFolder}/js/**/*.js`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    fonts: `${srcFolder}/fonts/**/*.ttf`
  },
  dest: {
    html: `${buildFolder}`,
    styles: `${buildFolder}/css/`,
    scripts: `${buildFolder}/js/`,
    img: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    styles: `${srcFolder}/scss/**/*.scss`,
    scripts: `${srcFolder}/js/**/*.js`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    fonts: `${srcFolder}/fonts/**/*.ttf`
  }
};

export const plugins = {
    gulp: gulp,
    stream: stream,
    if: ifPlugin
}