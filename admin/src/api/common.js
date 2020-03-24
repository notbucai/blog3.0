/*
 * @Author: bucai
 * @Date: 2020-03-23 09:31:46
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-24 13:53:50
 * @Description: 共用接口
 */

import { $ajax, $post, $get } from '../plugins/axios';

export const login = (data) => {
  return $post('/users/signin', data)
}

export const userInfo = () => {
  return $get('/users/info');
}

export const userlist = (params) => {
  return $get('/users/list', {
    params
  });
}

export const changeRole = (data) => {
  return $post('/users/change/role', data);
}