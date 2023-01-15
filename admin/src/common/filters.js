/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:27
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2023-01-15 17:20:02
 * @Description: 
 */

import Vue from 'vue';
import { formatDate } from './utils';

Vue.mixin({
  methods: {
    filter_format (date, format) {
      return formatDate(date, format)
    },
    filter_sex (sex) {
      return {
        Male: '男', Female: '女', Unknown: '未知'
      }[sex];
    },
    filter_articleStatus (status) {
      return {
        Verifying: '审核中', VerifySuccess: '审核通过', VerifyFail: '审核未通过'
      } [status];
    },
    filter_KeywordsStatus (status) {
      return {
        BAD: '坏的', NORMAL: '正常', GOOD: '优秀'
      }[status];
    },
    filter_imageMogr2 (url = '', width = 68, height) {
      if(!url) return '';
      const query = url.split('?')[1];
      if (query) return url;
      // height  width
      return `${url}?imageMogr2/thumbnail/${width}x${height || ''}`
    }
  }
})
