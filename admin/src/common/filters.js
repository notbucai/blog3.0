/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:27
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-24 14:49:13
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

Vue.filter('articleStatus', (status = 1) => {
  return ['审核中', '审核通过', '审核未通过'][status - 1];
});
