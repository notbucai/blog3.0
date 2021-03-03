/*
 * @Author: bucai
 * @Date: 2021-02-25 15:23:16
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 11:02:30
 * @Description: 
 */

const defaultState = {
  // 状态
  isInit: false,
  menuState: false,
  menus: [],
  routes: [],
  flatRoutes: [],
  // tab
  tabViews: [],
  currentRoute: null,
  // breadcrumbs
  breadcrumbs: [],
  // lange
  language: localStorage.getItem('language') || 'zh_CN'
}
export default defaultState;