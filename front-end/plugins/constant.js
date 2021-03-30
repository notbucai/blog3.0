/*
 * @Author: bucai
 * @Date: 2020-05-02 22:03:18
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-29 19:41:53
 * @Description: 
 */
import Vue from 'vue';
import * as constant from '../constant/common';

Vue.$constant = Vue.prototype.$constant = constant;

export default ({ app }) => {
  app.$constant = constant;
}