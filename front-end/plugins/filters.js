/*
 * @Author: bucai
 * @Date: 2020-04-19 23:07:57
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 21:02:05
 * @Description: 过滤器
 */
import Vue from 'vue';
import utils from '../utils/common';
Vue.filter('format', (date, format = 'yyyy-MM-dd hh:mm:ss') => {
  return utils.formatDate(date, format);
})