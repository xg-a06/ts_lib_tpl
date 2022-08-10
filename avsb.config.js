/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const glob = require('glob');

const indexs = glob('example/**/index.ts', { sync: true });
const htmlPlugins = [];
const entries = indexs.reduce((ret, file) => {
  const [root, dir] = file.split('/');
  ret[`${dir}`] = file;
  htmlPlugins.push({
    template: `${root}/${dir}/index.html`,
    filename: `${root}/${dir}/index.html`,
    inject: 'body',
    minify: true,
    chunks: [`${dir}`],
  });
  return ret;
}, {});

let entry = entries;
let tplPath = htmlPlugins;

if (process.env.NODE_ENV === 'production') {
  entry = './src/index.ts';
  tplPath = false;
}

const config = {
  entry,
  devServer: {
    port: 2333,
    proxy: {
      '/api': {
        target: 'http://10.0.70.49:8000',
        changeOrigin: true,
      },
    },
  },
  path: {
    tplPath,
  },
};
console.log();
module.exports = config;
