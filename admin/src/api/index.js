/*
 * @Author: bucai
 * @Date: 2020-03-23 09:22:50
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-23 09:37:56
 * @Description: 接口
 */

import { $ajax, $post, $get } from '../plugins/axios';
import Vue from 'vue';
import * as common from './common';

Vue.prototype.$http = {
  $ajax,
  $get,
  $post,
  ...common
}