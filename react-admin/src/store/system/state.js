/*
 * @Author: bucai
 * @Date: 2021-02-25 15:23:16
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 15:03:46
 * @Description:
 */

const defaultState = {
  token: localStorage.getItem('token') || null // 用户信息
}
export default defaultState;