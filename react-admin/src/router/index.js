/*
 * @Author: bucai
 * @Date: 2021-02-25 16:36:47
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-27 11:45:36
 * @Description:
 */

import {
  HomeOutlined,
  SmileOutlined
} from '@ant-design/icons';

// 无需鉴权路由列表
export const noAuthRoutes = [
  {
    path: '/login', // 路径
    title: '登录',
    component: import('../pages/auth/login'), // 路由
    noCache: true, // 是否不缓存  默认 false
    // -- 布局 不存在就是普通页面  默认不配置
    layout: {
      hiddenTab: true, // 不在tabView中展示
      full: true, // 全屏 开启将忽略其他配置
    },
  },
  {
    path: '*', // 路径
    component: import('../pages/error/not-found'), // 路由
    layout: {
      hiddenTab: true, // 不在tabView中展示
    }
  }
];

// 鉴权路由列表
export const authRoutes = [

  {
    path: '/', // 路径
    component: import('../pages/comment'), // 路由
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
    path: '/article', // 路径
    title: '文章管理',
    component: import('../layout/Empty'), // 路由
    // -- 布局 不存在就是普通页面  默认不配置
    menu: {
      icon: <HomeOutlined />, // 图标
    },
    auth: {
      permissions: ['user_page', 'article_page']
    },
    children: [
      {
        title: '文章详情',
        path: '/article/detail', // 路径
        component: import('../pages/article/detail'), // 路由
        // -- 布局 不存在就是普通页面  默认不配置
        auth: {
          permissions: ['user_page']
        },
      },
      {
        title: '文章测试',
        path: '/article/test4', // 路径
        component: import('../pages/article/edit'),
        menu: {
          icon: <HomeOutlined />, // 图标
        },
        auth: {
          permissions: ['article_page']
        },
      },
      {
        title: '文章测试2',
        path: '/article/tes22t', // 路径
        component: import('../layout/Empty'), // 路由
        menu: {
          icon: <HomeOutlined />, // 图标
        },
        auth: {
          permissions: ['article_page']
        },
        children: [
          {
            title: '文章测试222',
            path: '/article/tes22t/tes1t', // 路径
            component: import('../pages/article/edit'),
            menu: {
              icon: <HomeOutlined />, // 图标
            },
            auth: {
              permissions: ['article_page']
            },
          },
          {
            title: '文章测333试2',
            path: '/article/test2', // 路径
            component: import('../pages/article/index'),
            menu: {
              icon: <HomeOutlined />, // 图标
            },
            auth: {
              permissions: ['xxx']
            },
          }
        ]
      }
    ]
  },
  {
    path: '/comment', // 路径
    component: import('../pages/comment'), // 路由
    // -- 布局 不存在就是普通页面  默认不配置
    menu: {
      title: '评论管理',  // 标题
      icon: <HomeOutlined />, // 图标
    },
    auth: {
      permissions: ['aaa']
    }
  },
  {
    path: '/role', // 路径
    component: import('../pages/role'), // 路由
    // -- 布局 不存在就是普通页面  默认不配置
    menu: {
      title: '角色管理',  // 标题
      icon: <SmileOutlined />, // 图标
    },
    auth: {
      permissions: ['article_page']
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