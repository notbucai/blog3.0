// import request from '@/plugins/request';
/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-05 21:06:24
 * @Description:
 */

import { UPDATE_USER } from "./types"
import request from "@/plugins/request"

export const updateUserAction = () => {

  return {
    type: UPDATE_USER,
    // 这里可替换成ajax 请求的接口
    payload: request.get('/users/info')
  }
}