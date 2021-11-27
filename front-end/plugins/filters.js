/*
 * @Author: bucai
 * @Date: 2020-04-19 23:07:57
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-27 14:16:48
 * @Description: 过滤器
 */
import Vue from 'vue';
import utils from '../utils/common';
Vue.filter('format', (date, format = 'yyyy-MM-dd HH:mm:ss') => {
  return utils.formatDate(new Date(date), format);
});
Vue.filter('fromNowDate', (date) => {
  return utils.fromNowDate(new Date(date));
});

Vue.filter('imageMogr2', (url = '', width = 68, height) => {
  const query = url.split('?')[1];
  if (query) return url;
  // height  width
  return `${url}?imageMogr2/thumbnail/${width}x${height || ''}`
});
