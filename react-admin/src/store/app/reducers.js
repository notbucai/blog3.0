/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:54
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-05 11:01:57
 * @Description:
 */
import { cloneDeep, uniqBy } from 'lodash'
import { getListByChildrenRoutePath } from '../../router/utils';

import defaultState from "./state";
import { genOneTabViewByLocationAndRoute, getTabViewsByRoutes, updateTabViews } from './tabViewsUtils';
import { CHANGE_MENU_STATE, CHANGE_ROUTE, INIT_PERMISSION_ROUTERS, UPDATE_TAB_VIEWS, UPDATE_BREADCRUMB, UPDATE_BREADCRUMBS, CHANGE_LANGUAGE } from "./types";
/**
 *
 * @param {defaultState} state
 * @param {{type:string,payload?:any}} action
 */
const reducers = (state = defaultState, action) => {
  let newState;
  const payload = action.payload;
  switch (action.type) {
    case CHANGE_MENU_STATE:
      newState = { ...state };
      newState.menuState = !newState.menuState;
      return newState;
    case INIT_PERMISSION_ROUTERS + '_FULFILLED':
      // if (state.isInit) return state;
      newState = cloneDeep(state);
      const affixTabViews = payload.affixTabViews;
      newState.menus = payload.menus;
      newState.routes = payload.routes;
      newState.flatRoutes = payload.flatRoutes;
      newState.tabViews.push(...getTabViewsByRoutes(affixTabViews));
      newState.tabViews = uniqBy(newState.tabViews, 'path').sort((a, b) => {
        return a.affix ? -1 : 1
      });
      newState.isInit = true;
      return newState;
    case UPDATE_TAB_VIEWS:
      // if (state.isInit) return state;
      newState = cloneDeep(state);

      const flatRoutes = newState.flatRoutes;
      const tabViews = newState.tabViews;
      const currentRoute = newState.currentRoute;
      newState.tabViews = updateTabViews(tabViews, flatRoutes);

      if (currentRoute) {
        const route = flatRoutes.find(item => item.path === currentRoute.path) || {};
        const tabView = genOneTabViewByLocationAndRoute({ pathname: currentRoute.path }, route);
        newState.currentRoute = tabView;
      }

      return newState;
    case UPDATE_BREADCRUMBS: {
      // if (state.isInit) return state;
      newState = cloneDeep(state);
      const routes = newState.routes
      const pathname = newState.currentRoute ? newState.currentRoute.path : undefined;
      if (!pathname) return state;
      const list = getListByChildrenRoutePath(routes, pathname);
      const tabViews = getTabViewsByRoutes(list);
      newState.breadcrumbs = tabViews.filter((item, index) => !item.isMenu || index + 1 === tabViews.length);
      newState.breadcrumbs.unshift({
        path: '/',
        fullPath: '/',
        title: "首页",
      });
      newState.breadcrumbs = uniqBy(newState.breadcrumbs, 'path')
      return newState;
    }
    case UPDATE_BREADCRUMB: {
      newState = cloneDeep(state);
      const { pathname } = payload;
      const routes = newState.routes
      // 遍历树结构得到子集，从子往上得到完整调用链
      const list = getListByChildrenRoutePath(routes, pathname);
      const tabViews = getTabViewsByRoutes(list);
      newState.breadcrumbs = tabViews.filter((item, index) => !item.isMenu || index + 1 === tabViews.length);
      newState.breadcrumbs.unshift({
        path: '/',
        fullPath: '/',
        title: "首页",
      })
      newState.breadcrumbs = uniqBy(newState.breadcrumbs, 'path')
      return newState;
    }
    case CHANGE_ROUTE: {
      newState = cloneDeep(state);
      const flatRoutes = newState.flatRoutes;
      const tabViews = newState.tabViews;
      const currentRoute = newState.currentRoute;

      const route = flatRoutes.find(item => item.path === payload.pathname) || {};
      const tabView = genOneTabViewByLocationAndRoute(payload, route);
      const currentIndex = tabViews.findIndex(item => item.path === tabView.path);
      const currentTabView = tabViews[currentIndex] || {};
      if (!tabView) return state;
      if (currentRoute && currentRoute.path === tabView.path) {
        if (currentTabView.fullPath === tabView.fullPath) return state;
      }

      tabView.noInitRouter = !route.path;

      newState.currentRoute = tabView;

      if (currentIndex !== -1) {
        tabViews.splice(currentIndex, 1, tabView);
      } else {
        if (!tabView.hiddenTab) {
          tabViews.push(tabView);
        }
      }

      return newState;
    }
    case CHANGE_LANGUAGE: {
      newState = cloneDeep(state);
      newState.language = payload;
      return newState;
    }
    default:
      break;
  }

  return state;
}
export default reducers;