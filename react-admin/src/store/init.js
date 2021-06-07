/*
 * @Author: bucai
 * @Date: 2021-03-02 14:55:46
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-14 21:48:59
 * @Description: 初始化数据
 */

import { initPermissionRouters, initBasicRouters, updateBreadcrumbs, updateTabViews } from "./app/actions";
import { updateUserAction } from "./user/actions";
import store from '.';

const init = async () => {

  const state = store.getState()

  if (!state.system.token) {

    store.dispatch(initBasicRouters());
    // TODO: 这里需要独立配置一下的，出BUG再说
    // 1.判断页面url 是否为login 如果是 就不跳转
    const pathname = global.location.pathname;
    const search = global.location.search || '';
    // TODO: 弱判断，可能存在bug
    if (pathname.includes('/login')) {
      return;
    }
    // TODO: 跳转保存当前url
    global.location.href = "/login?redirect=" + encodeURIComponent(pathname + search);
    return;
  }

  // 判断token
  await store.dispatch(updateUserAction());

  await store.dispatch(initPermissionRouters());

  store.dispatch(updateTabViews());

  store.dispatch(updateBreadcrumbs());

}
export default init;

