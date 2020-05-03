/*
 * @Author: bucai
 * @Date: 2020-04-19 15:26:33
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 12:37:56
 * @Description: 
 */
// 引入vue 及 lodash
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'  // 首字线大写
import camelCase from 'lodash/camelCase'  // 驼峰命名大法

// 把 /component/base/ 下的所有 vue 组件 require 进来
// path: 要引入的组件所在相对路径（相对于当前文件）
// deep: 是否检索子文件夹
// matchFile: 匹配的文件名称
// require.context(path, deep, matchFile)
const requireComponent = require.context('../components/', false, /_base-[\w-]+\.vue$/)
// 遍历 require 进来的组件并注册
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\/_/, '').replace(/\.\w+$/, '')))
  // 全局注册组件
  Vue.component(componentName, componentConfig.default || componentConfig)
});

import Snackbar from '../components/snackbar';
Vue.$snackbar = Vue.prototype.$snackbar = Snackbar;