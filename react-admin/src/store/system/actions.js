// import request from '@/plugins/request';
/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 15:03:14
 * @Description:
 */

import { SET_TOKEN } from "./types"

export const setToken = (token) => {

  return {
    type: SET_TOKEN,
    payload: token
  }
}