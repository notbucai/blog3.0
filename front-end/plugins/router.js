/*
 * @Author: bucai
 * @Date: 2021-03-28 20:32:05
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-28 20:45:16
 * @Description: 
 */
export default ({ app, $axios, store }) => {
  app.router.beforeEach((to, from, next) => {
    next()
  })
}