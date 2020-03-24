/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:27
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-23 21:23:15
 * @Description: 
 */

import Vue from 'vue';
import { formatDate } from './utils';

Vue.filter('format', formatDate);
Vue.filter('sex', (sex = 2) => {
  return ['男', '女', '未知'][sex];
});

Vue.filter('role', (role = 1) => {
  return ['普通用户', '网站编辑', '管理员', '超级管理员'][role - 1];
});
