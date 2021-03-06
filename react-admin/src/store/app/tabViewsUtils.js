/*
 * @Author: bucai
 * @Date: 2021-02-27 22:01:45
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-04 10:37:52
 * @Description:
 */
import { cloneDeep } from 'lodash'

import { getRouteTitle, isAffix, getRouteIcon, isHiddenTab } from '@/router/utils'

export const getTabViewsByRoutes = (routes) => {

  const newRoutes = cloneDeep(routes).map(item => {
    const { path } = item;
    if (isHiddenTab(item)) return null;
    return {
      title: getRouteTitle(item), // 标题
      path: path, // key or 基础路径
      // query: null, // query 参数
      // params: null, // params 参数
      fullPath: path, // 路径
      icon: getRouteIcon(item), // 图标 字符串 or 组件
      affix: isAffix(item), // 是否固定 固定将不允许关闭
      activeTime: Date.now(), // 激活时间
      location: {
        pathname: item.path
      },
      route: item,
      isMenu: typeof item.menu !== 'undefined'
    }
  }).filter(item => item);

  return newRoutes;
};

export const genOneTabViewByLocationAndRoute = (location, route) => {
  const { pathname, search } = location;
  const newRoute = {
    title: getRouteTitle(route), // 标题
    path: pathname, // key or 基础路径
    fullPath: pathname + (search || ''), // 路径
    icon: getRouteIcon(route), // 图标 字符串 or 组件
    affix: isAffix(route), // 是否固定 固定将不允许关闭
    activeTime: Date.now(), // 激活时间
    location,
    route,
    hiddenTab: isHiddenTab(route),
    full: route.layout ? route.layout.full : false,
    isMenu: typeof route.menu !== 'undefined'
  }

  return newRoute;
};


export const updateTabViews = (tabViews, routes) => {
  const newTableViews = cloneDeep(tabViews).map(item => {
    const route = routes.find(route => route.path === item.path) || {};
    const title = getRouteTitle(route);
    item.title = title;
    item.hiddenTab = isHiddenTab(route)
    return item;
  }).filter(item => !item.hiddenTab);

  return newTableViews;
};

