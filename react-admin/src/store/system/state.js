/*
 * @Author: bucai
 * @Date: 2021-02-25 15:23:16
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-05 19:02:35
 * @Description:
 */

import store from "store2";

const defaultState = {
  token: store.get('token') || null // 用户信息
}
export default defaultState;