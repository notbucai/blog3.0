/*
 * @Author: bucai
 * @Date: 2020-03-22 21:18:13
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-22 21:45:10
 * @Description: 路由权限验证
 */
import { Notify } from 'element-ui';

export default (router, store) => {
  router.beforeEach((to, from, next) => {
    const roleRoute = to.meta.role;
    const user = store.state.user;
    // 判断路由是否需要鉴权
    if (roleRoute) {
      if (!user) return next({ path: '/login', query: { redirect: to.path } }); // 这里没有带参数，所以可能会出现问题
      const userRole = user.role;
      // 判断用户是否和当前权限匹配
      if (userRole >= roleRoute) {
        next();
      } else {
        // 错误提示，但不跳转
        Notify.error({
          title: '没有权限',
        });
      }
    } else {
      // 不需要的直接进入
      next();
    }
  });
}
