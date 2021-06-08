/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:27
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-08 17:07:20
 * @Description: 
 */

import Vue from 'vue';
import { formatDate } from './utils';

Vue.mixin({
  methods: {
    filter_format (date, format) {
      return formatDate(date, format)
    },
    filter_sex (sex = 2) {
      return ['男', '女', '未知'][sex];
    },
    filter_role (role = 1) {
      return ['普通用户', '网站编辑', '管理员', '超级管理员'][role - 1];
    },
    filter_articleStatus (status = 1) {
      return ['审核中', '审核通过', '审核未通过'][status - 1];
    },
    filter_KeywordsStatus (status = 0) {
      return ['坏的', '正常', '优秀'][status + 1];
    },
    filter_imageMogr2 (url = '', width = 68, height) {
      const query = url.split('?')[1];
      if (query) return url;
      // height  width
      return `${url}?imageMogr2/thumbnail/${width}x${height || ''}`
    }
  }
})
