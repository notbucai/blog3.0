/*
 * @Author: bucai
 * @Date: 2020-04-19 23:07:38
 * @LastEditors: bucai
 * @LastEditTime: 2020-04-19 23:13:52
 * @Description: dom操作库
 */
export function getElementToPageTop(el) {
  if (el.parentElement) {
    return this.getElementToPageTop(el.parentElement) + el.offsetTop
  }
  return el.offsetTop
}