/*
 * @Author: bucai
 * @Date: 2020-03-22 21:18:13
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-20 14:39:28
 * @Description: 路由权限验证
 */
import { Notification } from 'element-ui';

/**
 * 权限点判断
 * @param {Vuex.Stroe}} store 
 * @param {String} point 权限点 空表示 无权限
 */
export const permission = (store, point) => {
  if (!point) return true;
  const user = store.state.user;
  if (!user) return false;
  const userRole = user.role;
  if (user.isAdmin) {
    return true;
  }
  if (userRole) {
    const acls = userRole.acls;
    if (acls && acls.length) {
      // 判断用户是否和当前权限匹配
      const status = userRole.acls.find((item) => {
        return item.name === point;
      });
      return status;
    }
  }
  return false;
}

export const router = (router, store) => {
  router.beforeEach((to, from, next) => {
    const roleRoute = to.meta.role;

    // 判断路由是否需要鉴权
    if (permission(store, roleRoute)) {
      next();
    } else {
      next('/login?redirect=' + to.fullPath);
      // 错误提示，但不跳转
      Notification.error({
        title: '没有权限',
      });
    }
  });
}

export default (store) => {
  return (point) => {
    return permission(store, point)
  };
}