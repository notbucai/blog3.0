/*
 * @Author: bucai
 * @Date: 2021-03-28 20:32:05
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-12 13:51:16
 * @Description: 
 */
export default ({ app, $axios, store }) => {
  app.router.beforeEach((to, from, next) => {
    next();
  })
}