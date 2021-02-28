/*
 * @Author: bucai
 * @Date: 2021-02-25 15:20:54
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-27 23:01:38
 * @Description:
 */
import { cloneDeep, uniqBy, orderBy } from 'loadsh'

import defaultState from "./state";
import { genOneTabViewByLocationAndRoute, getTabViewsByRoutes, updateTabViews } from './tabViewsUtils';
import { CHANGE_MENU_STATE, CHANGE_ROUTE, INIT_PERMISSION_ROUTERS, UPDATE_TAB_VIEWS } from "./types";
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
      newState = cloneDeep(state);
      const affixTabViews = payload.affixTabViews;
      newState.menus = payload.menus;
      newState.routes = payload.routes;
      newState.flatRoutes = payload.flatRoutes;
      newState.tabViews.push(...getTabViewsByRoutes(affixTabViews));
      newState.tabViews = uniqBy(newState.tabViews, 'path').sort((a, b) => {
        return a.affix ? -1 : 1
      });
      return newState;
    case UPDATE_TAB_VIEWS:
      newState = cloneDeep(state);

      const flatRoutes = newState.flatRoutes;
      const tabViews = newState.tabViews;
      newState.tabViews = updateTabViews(tabViews, flatRoutes);

      return newState;
    case CHANGE_ROUTE: {
      newState = cloneDeep(state);
      const flatRoutes = newState.flatRoutes;
      const tabViews = newState.tabViews;
      const currentRoute = newState.currentRoute;

      const route = flatRoutes.find(item => item.path === payload.pathname) || {};
      const tabView = genOneTabViewByLocationAndRoute(payload, route);
      const currentIndex = tabViews.findIndex(item => item.path === tabView.path);
      const currentTabView = tabViews[currentIndex] || {};

      if (currentRoute === tabView.path) {
        if (currentTabView.fullPath === tabView.fullPath) return state;
      }

      newState.currentRoute = tabView.path;

      if (currentIndex !== -1) {
        tabViews.splice(currentIndex, 1, tabView);
      } else {
        tabViews.push(tabView);
      }

      return newState;
    }
    default:
      break;
  }

  return state;
}
export default reducers;