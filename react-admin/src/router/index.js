/*
 * @Author: bucai
 * @Date: 2021-02-25 16:36:47
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-09 19:01:56
 * @Description:
 */

import {
  HomeOutlined,
  SmileOutlined,
  MessageOutlined,
  TagsOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons';

// 无需鉴权路由列表
export const noAuthRoutes = [
  {
    path: '/login', // 路径
    title: '登录',
    component: () => import('../pages/auth/login'), // 路由
    noCache: true, // 是否不缓存  默认 false
    // -- 布局 不存在就是普通页面  默认不配置
    layout: {
      hiddenTab: true, // 不在tabView中展示
      full: true, // 全屏 开启将忽略其他配置
    },
  },
  {
    path: '*', // 路径
    component: () => import('../pages/error/not-found'), // 路由
    layout: {
      hiddenTab: true, // 不在tabView中展示
    }
  }
];

// 鉴权路由列表
export const authRoutes = [

  {
    path: '/', // 路径
    component: () => import('../pages/home'), // 路由
    // -- 布局 不存在就是普通页面  默认不配置
    menu: {
      title: '首页',  // 标题
      icon: <HomeOutlined />, // 图标
    },
    layout: {
      affix: true
    },
    auth: null // 只需要登录即可
  },
  {
    title: '文章管理',
    path: '/article', // 路径
    component: () => import('../pages/article'), // 路由
    menu: {
      icon: <ProfileOutlined />, // 图标
    },
    // noCache: true, // 是否不缓存  默认 false
    auth: {
      permissions: ['article_page']
    },
  },
  {
    title: '评论管理',
    path: '/comment', // 路径
    component: () => import('../pages/comment'), // 路由
    menu: {
      icon: <MessageOutlined />, // 图标
    },
    // -- 布局 不存在就是普通页面  默认不配置
    auth: {
      permissions: ['comment_page']
    },
  },
  {
    title: '标签管理',
    path: '/tag', // 路径
    component: () => import('../pages/tag'), // 路由
    menu: {
      icon: <TagsOutlined />, // 图标
    },
    // -- 布局 不存在就是普通页面  默认不配置
    auth: {
      permissions: ['tag_page']
    },
  },
  {
    title: '用户管理',
    path: '/user', // 路径
    component: () => import('../pages/user'), // 路由
    menu: {
      icon: <UserOutlined />, // 图标
    },
    // -- 布局 不存在就是普通页面  默认不配置
    auth: {
      permissions: ['user_page']
    },
  },
  {
    path: '/role', // 路径
    component: () => import('../pages/role'), // 路由
    // -- 布局 不存在就是普通页面  默认不配置
    layout: {
      hiddenTab: true
    },
    menu: {
      title: '角色管理',  // 标题
      icon: <SmileOutlined />, // 图标
    },
    auth: {
      permissions: ['role_page']
    }
  },
];

// 路由缓存结构表
const routes = [
  // 需要一定的顺序
  ...authRoutes,
  ...noAuthRoutes,
];

export default routes;