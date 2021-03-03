// import request from '@/plugins/request';
/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 14:13:46
 * @Description:
 */

import { UPDATE_USER } from "./types"

export const updateUserAction = () => {

  return {
    type: UPDATE_USER,
    // 这里可替换成ajax 请求的接口
    payload: new Promise((resolve, reject) => {
      resolve({
        id: "111",
        nickname: "超级管理员",
        avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      });
    })
  }
}