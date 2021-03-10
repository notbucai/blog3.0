/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-06 13:54:23
 * @Description:
 */
import { CHANGE_MENU_STATE, INIT_PERMISSION_ROUTERS, CHANGE_ROUTE, UPDATE_TAB_VIEWS, UPDATE_BREADCRUMBS, UPDATE_BREADCRUMB, CHANGE_LANGUAGE } from "./types"
import request from '@/plugins/request';

import routes, { noAuthRoutes } from '@/router';
import { getMenuRoutesByRoutes, getUserRoutesByPermissions, flatRoutesHandle, getAffixTabViews } from "../../router/utils";

export const changeMenuState = () => {
  return {
    type: CHANGE_MENU_STATE
  }
}

export const updateTabViews = () => {
  return {
    type: UPDATE_TAB_VIEWS
  }
}

export const updateBreadcrumbs = () => {
  return {
    type: UPDATE_BREADCRUMBS
  }
}

export const changeRoute = (location) => {
  return {
    type: CHANGE_ROUTE,
    payload: location
  }
}

export const changeBreadcrumb = (location) => {
  return {
    type: UPDATE_BREADCRUMB,
    payload: location
  }
}

export const initPermissionRouters = () => {

  return {
    type: INIT_PERMISSION_ROUTERS,
    // TODO: 1. 获取权限信息
    payload: request.get('/users/role').then((role) => {
      let pList = role ? role.acls : [];
      // 2. 通过权限信息过滤路由
      const filterRouters = getUserRoutesByPermissions(routes, pList || []);
      // 3. 从过滤后的路由中获取菜单
      const menuRoutes = getMenuRoutesByRoutes(filterRouters);
      // 4. 扁平化路由
      const flatRoutes = flatRoutesHandle(filterRouters)
      // 5. 获取固定的TAB
      const affixTabViews = getAffixTabViews(flatRoutes);
      // 6. 初始化 tabViews
      return {
        routes: filterRouters,
        menus: menuRoutes,
        flatRoutes: flatRoutes,
        affixTabViews: affixTabViews
      }
    })

  }
}


export const initBasicRouters = () => {

  const filterRouters = noAuthRoutes;
  // 3. 从过滤后的路由中获取菜单
  const menuRoutes = getMenuRoutesByRoutes(filterRouters);
  // 4. 扁平化路由
  const flatRoutes = flatRoutesHandle(filterRouters)
  // 5. 获取固定的TAB
  const affixTabViews = getAffixTabViews(flatRoutes);
  // 6. 初始化 tabViews
  return {
    type: INIT_PERMISSION_ROUTERS + '_FULFILLED',
    payload: {
      routes: filterRouters,
      menus: menuRoutes,
      flatRoutes: flatRoutes,
      affixTabViews: affixTabViews
    }
  }
}


export const changeLanguage = (language) => {
  localStorage.setItem('language', language)
  return {
    type: CHANGE_LANGUAGE,
    payload: language
  }
}