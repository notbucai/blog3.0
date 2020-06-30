/*
 * @Author: bucai
 * @Date: 2020-06-27 16:46:58
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-27 16:46:58
 * @Description: 
 */ 
export default ({app: {router}, store}) => {
  /* 每次路由变更时进行pv统计 */
  router.afterEach((to, from) => {
    /* 告诉增加一个PV */
    try {
      window._hmt = window._hmt || []
      window._hmt.push(['_trackPageview', to.fullPath])
    } catch (e) {
    }
  })
}