/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-03 11:12:41
 * @Description:
 */
import { CHANGE_MENU_STATE, INIT_PERMISSION_ROUTERS, CHANGE_ROUTE, UPDATE_TAB_VIEWS, UPDATE_BREADCRUMBS, UPDATE_BREADCRUMB, CHANGE_LANGUAGE } from "./types"
// import request from '@/plugins/request';

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
    payload: new Promise((resolve, reject) => {
      // await request.get('')
      // TODO: 1. 获取权限信息
      const type = localStorage.getItem('token');
      let pList;
      if (type === 'admin') {
        pList = [{ "createdAt": 1585728951291, "updatedAt": 1585728951292, "parent": null, "_id": "5e844f4bd0abca3ea592edbb", "name": "user_page", "title": "用户管理", "__v": 0 }, { "createdAt": 1585728951291, "updatedAt": 1585728951292, "parent": null, "_id": "5e844f63d0abca3ea592edbc", "name": "article_page", "title": "文章管理", "__v": 0 }, { "createdAt": 1585728951291, "updatedAt": 1585728951292, "parent": null, "_id": "5e844f6dd0abca3ea592edbd", "name": "comment_page", "title": "评论管理", "__v": 0 }, { "createdAt": 1585728951291, "updatedAt": 1585728951292, "parent": null, "_id": "5e844f80d0abca3ea592edbe", "name": "tag_page", "title": "标签管理", "__v": 0 }, { "createdAt": 1585730936332, "updatedAt": 1585730936335, "parent": "5e844f4bd0abca3ea592edbb", "_id": "5e8458b6f869cb44116afab9", "name": "UserList", "title": "用户列表", "__v": 0 }, { "createdAt": 1585730936332, "updatedAt": 1585730936335, "parent": "5e844f4bd0abca3ea592edbb", "_id": "5e8458e7f869cb44116afaba", "name": "BindRole", "title": "绑定角色", "__v": 0 }, { "createdAt": 1585730936332, "updatedAt": 1585730936335, "parent": "5e844f4bd0abca3ea592edbb", "_id": "5e845920f869cb44116afabb", "name": "ChangeStatus", "title": "用户状态修改", "__v": 0 }, { "createdAt": 1585732406886, "updatedAt": 1585732406886, "parent": null, "_id": "5e845be5c16b34480943e3af", "name": "home_page", "title": "后台主页", "__v": 0 }, { "createdAt": 1585746535993, "updatedAt": 1585746535993, "parent": "5e844f63d0abca3ea592edbc", "_id": "5e849e36ef860b5268bbab6c", "name": "ChangeArticleStatus", "title": "文章状态", "__v": 0 }, { "createdAt": 1585746535993, "updatedAt": 1585746535993, "parent": "5e844f6dd0abca3ea592edbd", "_id": "5e849e5fef860b5268bbab6d", "name": "CommentAllList", "title": "评论所有列表", "__v": 0 }];
      } else {
        pList = [{ "createdAt": 1585728951291, "updatedAt": 1585728951292, "parent": null, "_id": "5e844f4bd0abca3ea592edbb", "name": "user_page", "title": "用户管理", "__v": 0 }];
      }
      // 2. 通过权限信息过滤路由
      const filterRouters = getUserRoutesByPermissions(routes, pList);
      console.log('filterRouters', filterRouters);
      // 3. 从过滤后的路由中获取菜单
      const menuRoutes = getMenuRoutesByRoutes(filterRouters);
      // 4. 扁平化路由
      const flatRoutes = flatRoutesHandle(filterRouters)
      // 5. 获取固定的TAB
      const affixTabViews = getAffixTabViews(flatRoutes);
      // 6. 初始化 tabViews
      resolve({
        routes: filterRouters,
        menus: menuRoutes,
        flatRoutes: flatRoutes,
        affixTabViews: affixTabViews
      });
    })
  }
}


export const initBasicRouters = () => {

  const filterRouters = noAuthRoutes;
  console.log('filterRouters', filterRouters);
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