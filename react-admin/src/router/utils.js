/*
 * @Author: bucai
 * @Date: 2021-02-26 10:34:58
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 15:34:49
 * @Description: 
 */
import { cloneDeep } from 'loadsh'
/**
 * 通过权限获取用户路由
 * @param {[]} routes 
 * @param {[]} permissions 
 */
export const getUserRoutesByPermissions = (routes, permissions) => {
  const newRoutes = cloneDeep(routes);

  const filter = (routes) => {

    return routes.filter(item => {
      const auth = item.auth;

      if (Array.isArray(item.children) && item.children.length) {
        item.children = filter(item.children);
      }

      if (!auth) return true;
      if (!auth.permissions && !item.rules) return true;
      const authPermissions = auth.permissions;
      // const rules = auth.rules;

      const apList = authPermissions.filter(item => {
        return permissions.find(p => p.name === item);
      });

      if (apList.length !== authPermissions.length) return false;

      return true;
    })

  }

  return filter(newRoutes);
}

/**
 * 获取路由
 * @param {[]} routes 
 */
export const getMenuRoutesByRoutes = (routes) => {
  const newRoutes = cloneDeep(routes);

  const filter = (routes) => {

    return routes.filter(item => {
      const children = item.children;
      if (Array.isArray(children) && children.length) {
        item.children = filter(children);
      }

      return typeof item.menu !== 'undefined';
    });

  }

  return filter(newRoutes);
}

/**
 * 扁平化路由路由
 * @param {[]} routes 
 */
export const flatRoutesHandle = (routes) => {
  const newRoutes = cloneDeep(routes);

  const flat = (routes) => {
    const list = [];
    routes.forEach(item => {
      const children = item.children;
      if (Array.isArray(children) && children.length) {
        const _list = flat(children);
        list.push(..._list);
      }

      list.push(item);
    });
    return list;
  }

  return flat(newRoutes);
}

/**
 * 获取固定的tabView
 * @param {[]} routes 
 */
export const getAffixTabViews = (routes) => {
  const newRoutes = cloneDeep(routes);

  return newRoutes.filter(item => {
    if (!item.layout) {
      return false;
    }
    if (!item.layout.affix) {
      return false;
    }
    if (item.layout.hiddenTab) {
      console.warn("[getAffixTabViews] 配置出错，不能同时配置 【hiddenTab】和【affix】");
    }
    return true;
  })
}


/**
 * 获取路由title
 * @param {any} route
 */
export const getRouteTitle = (route = {}) => {
  return route.title || (route.menu ? route.menu.title : 'ERR: 标题为空')
}

/**
 * 获取路由icon
 * @param {any} route
 */
export const getRouteIcon = (route = {}) => {
  if (!route.menu) return;
  return route.menu.icon;
}

/**
 * 是否是固定
 * @param {any} route
 */
export const isAffix = (route = {}) => {
  if (!route.layout) return false;
  return route.layout.affix;
}

/**
 * 是否不在tab显示
 * @param {any} route
 */
export const isHiddenTab = (route = {}) => {
  if (!route.layout) return true;
  return route.layout.hiddenTab || route.layout.full;
}

/**
 * 获取路由调用链条
 * @param {any} route
 */
export const getListByChildrenRoutePath = (routes = [], routePath = '') => {

  const list = [];

  const find = (routes = []) => {
    const index = routes.findIndex(item => {

      if (Array.isArray(item.children) && item.children.length) {
        const _index = find(item.children);
        return _index !== -1;
      }

      if (item.path === routePath) {
        return true;
      }

      return false;
    });
    if (index !== -1) {
      console.log('routes', routes, index);
      list.unshift(routes[index]);
    }
    return index;

  }
  find(routes);

  return list
}
