/*
 * @Author: bucai
 * @Date: 2021-02-25 14:11:02
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-04 14:11:28
 * @Description: 
 */
const { adjustStyleLoaders, override, addWebpackAlias, addLessLoader, fixBabelImports } = require('customize-cra');
const fs = require('fs');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      modifyVars: {
        '@primary-color': '#02e686'
      },
      javascriptEnabled: true,
    },
  }),
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: './src/assets/css/theme.scss'
        }
      });
    }
  }),
  addWebpackAlias({
    "@": path.resolve(__dirname, './src'),
  })
);