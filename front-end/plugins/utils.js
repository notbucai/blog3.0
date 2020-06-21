/*
 * @Author: bucai
 * @Date: 2020-05-07 13:05:05
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-20 16:50:42
 * @Description: 
 */
import Vue from 'vue';
import * as utils from '../utils';

Vue.prototype.$utils = utils;


export default ({ app }) => {
  app.$utils = utils;
}