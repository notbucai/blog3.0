/*
 * @Author: bucai
 * @Date: 2020-05-02 22:03:18
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-03 11:50:19
 * @Description: 
 */
export const valid = {
  REQUIRED: [v => !!v || '不能为空'],
  PHONE: [v => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || '手机号不正确'],
}